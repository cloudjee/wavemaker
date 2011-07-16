package com.wavemaker.tools.deployment.cloudfoundry;

import static org.springframework.util.StringUtils.hasText;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.client.lib.UploadStatusCallback;
import org.springframework.util.Assert;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.deployment.AppInfo;
import com.wavemaker.tools.deployment.DeploymentTarget;

public class VmcDeploymentTarget implements DeploymentTarget {

	public static final String VMC_USERNAME_PROPERTY = "username";
	
	public static final String VMC_PASSWORD_PROPERTY = "password";
	
	public static final String VMC_URL_PROPERTY = "url";
	
	public static final Map<String, String> CONFIGURABLE_PROPERTIES;
	
	private static final String TOKEN_ATTR = "wm_cf_token";

	private static final String DEFAULT_URL = "https://api.cloudfoundry.com";
	
	private static final String HREF_TEMPLATE = "<a href=\"url\" target=\"_blank\">url</a>";
	
	private static final Log log = LogFactory.getLog(VmcDeploymentTarget.class);
	
	static {
		Map<String, String> props = new LinkedHashMap<String, String>();
		props.put(VMC_USERNAME_PROPERTY, "username@mydomain.com");
		props.put(VMC_PASSWORD_PROPERTY, "password");
		props.put(VMC_URL_PROPERTY, DEFAULT_URL);
		CONFIGURABLE_PROPERTIES = Collections.unmodifiableMap(props);
	}

	
	public String deploy(File webapp, String contextRoot,
			Map<String, String> configuredProperties) {
		
		CloudFoundryClient client = getClient(configuredProperties);
		
		validateWar(webapp);
		String appName = contextRoot == null ? StringUtils.fromFirstOccurrence(webapp.getName(), ".", -1) : contextRoot; 
		appName = prepareAppName(appName);
		
		List<String> uris = new ArrayList<String>();
		String url = configuredProperties.get(VMC_URL_PROPERTY);
		if (!hasText(url)){
			url = DEFAULT_URL;
		}
		uris.add(url.replace("api", appName));
		
		client.createApplication(appName, CloudApplication.SPRING, client.getDefaultApplicationMemory(CloudApplication.SPRING), uris, null, true);
		Timer timer = new Timer();
		try {
			client.uploadApplication(appName, webapp, new LoggingStatusCallback(timer));
		} catch (IOException ex) {
			throw new WMRuntimeException("Error ocurred while trying to upload WAR file.", ex);
		}
		
		log.info("Application upload completed in " + timer.stop() + "ms");
		
		CloudApplication application = client.getApplication(appName);
		if(application.getState().equals(CloudApplication.AppState.STARTED)) {
			doRestart(appName, client);
		} else {
			doStart(appName, client);
		}
		return "SUCCESS";
	}

	public String undeploy(String contextRoot, Map<String, String> configuredProperties) {
		CloudFoundryClient client = getClient(configuredProperties);
		String appName = prepareAppName(contextRoot);
		log.info("Deleting application "+appName);
		Timer timer = new Timer();
		timer.start();
		client.deleteApplication(appName);
		log.info("Application "+appName+" deleted successfully in "+timer.stop()+"ms");
		return "SUCCESS";
	}

	public String redeploy(String contextRoot, Map<String, String> configuredProperties) {
		CloudFoundryClient client = getClient(configuredProperties);
		doRestart(prepareAppName(contextRoot), client);
		return "SUCCESS";
	}

	public String start(String contextRoot, Map<String, String> configuredProperties) {
		CloudFoundryClient client = getClient(configuredProperties);
		doStart(prepareAppName(contextRoot), client);
		return "SUCCESS";
	}

	public String stop(String contextRoot, Map<String, String> configuredProperties) {
		CloudFoundryClient client = getClient(configuredProperties);
		String appName = prepareAppName(contextRoot);
		log.info("Stopping application "+appName);
		Timer timer = new Timer();
		timer.start();
		client.stopApplication(appName);
		log.info("Application "+appName+" stopped successfully in "+timer.stop()+"ms");
		return "SUCCESS";
	}

	public List<AppInfo> listDeploymentNames(Map<String, String> configuredProperties) {
		CloudFoundryClient client = getClient(configuredProperties);
		List<AppInfo> infoList = new ArrayList<AppInfo>();
		List<CloudApplication> cloudApps = client.getApplications();
		for(CloudApplication app : cloudApps) {
			String href = HREF_TEMPLATE.replaceAll("url", "http://"+app.getUris().get(0));
			infoList.add(new AppInfo(app.getName(), href, app.getState().toString()));
		}
		return infoList;
	}

	public Map<String, String> getConfigurableProperties() {
		return CONFIGURABLE_PROPERTIES;
	}
	
	private void doRestart(String appName, CloudFoundryClient client) {
		log.info("Restarting application "+appName);
		Timer timer = new Timer();
		timer.start();
		client.restartApplication(appName);
		log.info("Application "+appName+" restarted successfully in "+timer.stop()+"ms");
	}
	
	private void doStart(String appName, CloudFoundryClient client) {
		log.info("Starting application "+appName);
		Timer timer = new Timer();
		timer.start();
		client.startApplication(appName);
		log.info("Application "+appName+" started successfully in "+timer.stop()+"ms");
	}
	
	private CloudFoundryClient getClient(Map<String, String> configuredProperties) {
		Assert.hasText(configuredProperties.get(VMC_USERNAME_PROPERTY));
		Assert.hasText(configuredProperties.get(VMC_PASSWORD_PROPERTY));
		
		String userName = configuredProperties.get(VMC_USERNAME_PROPERTY);
		String password = configuredProperties.get(VMC_PASSWORD_PROPERTY);
		String url = configuredProperties.get(VMC_URL_PROPERTY);
		
		if (!hasText(url)){
			url = DEFAULT_URL;
		}
		
		try {
			if (RuntimeAccess.getInstance().getSession().getAttribute(TOKEN_ATTR) != null) {
				String token = RuntimeAccess.getInstance().getSession().getAttribute(TOKEN_ATTR).toString();
				return new CloudFoundryClient(token, url);
			} else {
				CloudFoundryClient client = new CloudFoundryClient(userName, password, url);
				String token = client.login();
				RuntimeAccess.getInstance().getSession().setAttribute(TOKEN_ATTR, token);
				return client;
			}
		} catch (MalformedURLException ex) {
			throw new WMRuntimeException("CloudFoundry target URL is invalid", ex);
		}
	}
	
	private String prepareAppName(String contextRoot) {
		return contextRoot.replaceFirst("/", "");
	}
	
	private void validateWar(File war) {
		Assert.notNull(war, "war cannot be null");
		Assert.isTrue(war.exists(), "war does not exist");
		Assert.isTrue(!war.isDirectory(), "war cannot be a directory");
	}
	
	private static final class LoggingStatusCallback implements UploadStatusCallback {

		private Timer timer;
		
		public LoggingStatusCallback(Timer timer) {
			this.timer = timer;
		}
		
		public void onCheckResources() {
			log.info("Preparing to upload to CloudFoundry - comparing resources...");
		}

		public void onMatchedFileNames(Set<String> fileNames) {
			log.info(fileNames.size()+ " files already cached...");
		}

		public void onProcessMatchedResources(int length) {
			log.info("Uploading "+length+" bytes...");
			timer.start();
		}	
	}
	
	private static final class Timer {
		
		private long startTime;
		
		public void start() {
			startTime = System.currentTimeMillis();
		}
		
		public long stop() {
			return System.currentTimeMillis() - startTime;
		}
	}

}
