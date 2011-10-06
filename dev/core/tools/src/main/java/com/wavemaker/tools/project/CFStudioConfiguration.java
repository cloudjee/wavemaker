/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.project;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletContext;

import org.apache.commons.lang.SystemUtils;
import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.context.support.ServletContextResource;
import org.springframework.data.mongodb.MongoDbFactory;

import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSInputFile;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.io.GFSResource;
import com.wavemaker.common.io.GFSUtils;
import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.config.ConfigurationStore;

/**
 * StudioConfiguration holds configuration data associated with this studio.
 * 
 * @author Matt Small
 * @author Joel Hare
 * @author Jeremy Grelle
 * @author Ed Callahan
 * 
 */
public class CFStudioConfiguration implements EmbeddedServerConfiguration,
		ServletContextAware {

	public static final String MARKER_RESOURCE_NAME = "marker.resource.txt";

	public static final String WAVEMAKER_HOME = "WaveMaker/";
	public static final String PROJECTS_DIR = "projects/";
	public static final String COMMON_DIR = "common/";

	public static final String PROJECTHOME_KEY = "projectsDir";
	public static final String DEMOHOME_KEY = "demoHome";
	public static final String WMHOME_KEY = "wavemakerHome";
	public static final String PROJECTHOME_PROP_KEY = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX
			+ PROJECTHOME_KEY;
	public static final String WMHOME_PROP_KEY = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX
			+ WMHOME_KEY;

	protected static final String TOMCAT_MANAGER_USER_KEY = "managerUser";
	protected static final String TOMCAT_MANAGER_PW_KEY = "managerPassword";
	protected static final String TOMCAT_PORT_KEY = "tomcatPort";
	protected static final String TOMCAT_HOST_KEY = "tomcatHost";

	protected static final String TOMCAT_MANAGER_USER_ENV = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX
			+ TOMCAT_MANAGER_USER_KEY;
	protected static final String TOMCAT_MANAGER_PASSWORD_ENV = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX
			+ TOMCAT_MANAGER_PW_KEY;
	protected static final String TOMCAT_PORT_ENV = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX
			+ TOMCAT_PORT_KEY;
	protected static final String TOMCAT_HOST_ENV = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX
			+ TOMCAT_HOST_KEY;

	public static final int TOMCAT_PORT_DEFAULT = 8080;
	protected static final String TOMCAT_HOST_DEFAULT = "localhost";
	protected static final String TOMCAT_MANAGER_PW_DEFAULT = "manager";
	protected static final String TOMCAT_MANAGER_USER_DEFAULT = "manager";

	protected static final String VERSION_KEY = "studioVersion";
	protected static final String VERSION_DEFAULT = "4.0.0";

	public static final String CMD_GET = "get";
	public static final String CMD_SET = "set";
	protected static final String CMD_DEL = "del";
	protected static final String CMD_NOTSET = "NOTSET";

	protected static final String VERSION_FILE = "version";

	private ServletContext servletContext;
	private static GridFS gfs;

	CFStudioConfiguration(MongoDbFactory mongoFactory) {
		gfs = new GridFS(mongoFactory.getDb());
	}

	/**
	 * WaveMaker home override, used for testing. NEVER set this in production.
	 */
	private File testWMHome = null;

	/**
	 * WaveMaker demo directory override, used for testing. NEVER set this in
	 * production.
	 */
	private File testDemoDir = null;

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.tools.project.StudioConfiguration#getProjectsDir()
	 */
	public Resource getProjectsDir() {
		String projectsProp = null;
		if (isRuntime()) {
			projectsProp = (String) RuntimeAccess.getInstance().getSession()
					.getAttribute(PROJECTHOME_PROP_KEY);
		} else {
			projectsProp = System.getProperty(PROJECTHOME_PROP_KEY, null);
		}

		if (null != projectsProp && 0 != projectsProp.length()) {
			projectsProp = projectsProp.endsWith("/") ? projectsProp
					: projectsProp + "/";
			return new GFSResource(gfs, projectsProp);
		}

		try {
			Resource projectsDir = ((GFSResource) getWaveMakerHome())
					.createRelative(gfs, PROJECTS_DIR);

			if (!projectsDir.exists()) {
				new GFSResource(gfs, ((GFSResource) projectsDir).getPath());
			}
			return projectsDir;
		} catch (IOException ex) {
			ex.printStackTrace();
			throw new WMRuntimeException(ex);
		}
	}

	private boolean isRuntime() {
		try {
			if (RuntimeAccess.getInstance() != null
					&& RuntimeAccess.getInstance().getRequest() != null)
				return true;
		} catch (Exception e) {
		}
		return false;
	}

	private static boolean isCloud;
	private static boolean isCloudInitialized = false;

	public static boolean isCloud() {
		if (!isCloudInitialized) {
			try {

				org.springframework.core.io.ClassPathResource cpr = new org.springframework.core.io.ClassPathResource(
						"cloud.src.resource");
				isCloud = cpr.exists();
				isCloudInitialized = true;
			} catch (Exception e) {
				return false;
			}
		}

		return isCloud;
	}

	public static GridFS getGFS() {
		return gfs;
	}

	public static void setWaveMakerHome(Resource wmHome)
			throws FileAccessException, IOException {
		if (isCloud())
			return;

		Assert.isInstanceOf(Resource.class, wmHome, "GFS: Expected a Resource");

		ConfigurationStore.setVersionedPreference(CFStudioConfiguration.class,
				WMHOME_KEY, ((GFSResource) wmHome).getPath());
		if (!((GFSResource) wmHome).exists()) {
			throw new IOException("Failed to create WaveMakerHome");
		}
	}

	public void setTestWaveMakerHome(File file) {
		this.testWMHome = file;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.tools.project.StudioConfiguration#getWaveMakerHome()
	 */
	public Resource getWaveMakerHome() {

		if (null != this.testWMHome) {
			return new GFSResource(gfs, this.testWMHome.toString() + "/");
		}

		return staticGetWaveMakerHome();
	}

	public static Resource staticGetWaveMakerHome() {

		GFSResource ret = null;

		String env = System.getProperty(WMHOME_PROP_KEY, null);
		if (null != env && 0 != env.length()) {
			ret = new GFSResource(gfs, env);
		}

		if (null == ret) {
			String pref = ConfigurationStore.getPreference(
					CFStudioConfiguration.class, WMHOME_KEY, null);
			if (null != pref && 0 != pref.length()) {
				pref = pref.endsWith("/") ? pref : pref + "/";
				ret = new GFSResource(gfs, pref);
			}
		}

		// we couldn't find a test value, a property, or a preference, so use
		// a default
		if (null == ret) {
			ret = (GFSResource) getDefaultWaveMakerHome();
		}

		return ret;
	}

	protected static Resource getDefaultWaveMakerHome() {

		GFSResource userHome = null;
		if (SystemUtils.IS_OS_WINDOWS) {
			String userProfileEnvVar = System.getenv("USERPROFILE");
			if (StringUtils.hasText(userProfileEnvVar)) {
				userProfileEnvVar = userProfileEnvVar.endsWith("/") ? userProfileEnvVar
						: userProfileEnvVar + "/";
				userHome = new GFSResource(gfs, System.getenv("USERPROFILE"));
			}
		}
		if (null == userHome) {
			String userHomeProp = System.getProperty("user.home");
			userHomeProp = userHomeProp.endsWith("/") ? userHomeProp
					: userHomeProp + "/";
			userHome = new GFSResource(gfs, userHomeProp);
		}

		String osVersionStr = System.getProperty("os.version");
		if (osVersionStr.contains(".")) {
			String sub = osVersionStr.substring(osVersionStr.indexOf(".") + 1);
			if (sub.contains(".")) {
				osVersionStr = osVersionStr.substring(0, osVersionStr.indexOf(
						'.', osVersionStr.indexOf('.') + 1));
			}
		}

		try {
			if (SystemUtils.IS_OS_WINDOWS) {
				String defaultDir = javax.swing.filechooser.FileSystemView
						.getFileSystemView().getDefaultDirectory().getPath();
				defaultDir = defaultDir.endsWith("/") ? defaultDir : defaultDir
						+ "/";
				userHome = new GFSResource(gfs, defaultDir);
			} else if (SystemUtils.IS_OS_MAC) {
				userHome = userHome.createRelative(gfs, "Documents/");
			}

			if (!userHome.exists()) {
				throw new WMRuntimeException(
						MessageResource.PROJECT_USERHOMEDNE, userHome);
			}

			Resource wmHome = userHome.createRelative(gfs, WAVEMAKER_HOME);
			if (!wmHome.exists()) {
				wmHome.getFile().mkdir();
			}
			return (Resource) wmHome;
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.tools.project.StudioConfiguration#getDemoDir()
	 */
	public Resource getDemoDir() {
		if (isCloud())
			return null;

		if (null != testDemoDir) {
			return new GFSResource(gfs, this.testDemoDir.toString() + "/");
		}

		String location = ConfigurationStore.getPreference(getClass(),
				DEMOHOME_KEY, null);
		Resource demo;
		try {
			if (null != location) {
				demo = new GFSResource(gfs, location);
			} else {
				demo = ((GFSResource) getStudioWebAppRoot()).createRelative(
						gfs, "../Samples");
			}
			return demo;
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	public void setDemoDir(File file) {
		if (isCloud())
			return;

		ConfigurationStore.setPreference(getClass(), DEMOHOME_KEY,
				file.getAbsolutePath());
	}

	public void setTestDemoDir(File file) {
		if (isCloud())
			return;

		this.testDemoDir = file;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.tools.project.StudioConfiguration#getCommonDir()
	 */
	public Resource getCommonDir() throws IOException {
		Resource common = ((GFSResource) getWaveMakerHome()).createRelative(
				gfs, COMMON_DIR);

		if (!common.exists() && getWaveMakerHome().exists()) {
			createCommonDir(common);
		}

		return common;
	}

	private synchronized void createCommonDir(Resource common)
			throws IOException {

		if (!common.exists()) {
			GFSResource templateFile = ((GFSResource) getStudioWebAppRoot())
					.createRelative(gfs, "lib/wm/" + COMMON_DIR);
			if (templateFile.exists()) {
				GFSUtils.copy(gfs, templateFile, (GFSResource)common, 
						GFSUtils.DEFAULT_EXCLUSION);
			}
		}
	}

	public int getTomcatPort() {

		String propVal = System.getProperty(TOMCAT_PORT_ENV, null);
		if (null != propVal) {
			return Integer.parseInt(propVal);
		}

		int defaultValue;
		if (null != getRuntimeAccess()
				&& null != getRuntimeAccess().getRequest()) {
			defaultValue = getRuntimeAccess().getRequest().getServerPort();
		} else {
			defaultValue = TOMCAT_PORT_DEFAULT;
		}

		return ConfigurationStore.getPreferenceInt(getClass(), TOMCAT_PORT_KEY,
				defaultValue);
	}

	public String getTomcatHost() {
		String propVal = System.getProperty(TOMCAT_HOST_ENV, null);
		if (null != propVal) {
			return propVal;
		}

		String defaultValue;
		if (null != getRuntimeAccess()
				&& null != getRuntimeAccess().getRequest()) {
			defaultValue = getRuntimeAccess().getRequest().getServerName();
		} else {
			defaultValue = TOMCAT_HOST_DEFAULT;
		}

		return ConfigurationStore.getPreference(getClass(), TOMCAT_HOST_KEY,
				defaultValue);
	}

	public String getTomcatManagerUsername() {

		String propVal = System.getProperty(TOMCAT_MANAGER_USER_ENV, null);
		if (null != propVal) {
			return propVal;
		}

		return ConfigurationStore.getPreference(getClass(),
				TOMCAT_MANAGER_USER_KEY, TOMCAT_MANAGER_USER_DEFAULT);
	}

	public String getTomcatManagerPassword() {

		String propVal = System.getProperty(TOMCAT_MANAGER_PASSWORD_ENV, null);
		if (null != propVal) {
			return propVal;
		}

		return ConfigurationStore.getPreference(getClass(),
				TOMCAT_MANAGER_PW_KEY, TOMCAT_MANAGER_PW_DEFAULT);
	}

	// other studio information
	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.wavemaker.tools.project.StudioConfiguration#getStudioWebAppRootFile()
	 */
	public Resource getStudioWebAppRoot() {
		return new ServletContextResource(servletContext, "/");
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.tools.project.StudioConfiguration#getPreferencesMap()
	 */
	public Map<String, String> getPreferencesMap() {

		Map<String, String> prefs = new HashMap<String, String>();

		try {
			prefs.put(WMHOME_KEY, ((GFSResource)getWaveMakerHome()).getPath());
		} catch (Exception ex) {
			throw new WMRuntimeException(ex);
		}

		try {
			prefs.put(DEMOHOME_KEY, (isCloud()) ? null : ((GFSResource)getDemoDir()).getPath());
			return prefs;
		} catch (Exception ex) {
			throw new WMRuntimeException(ex);
		}
	}

	/**
	 * Change the preferences defined in the map; this will use the accessors.
	 * 
	 * @param prefs
	 * @throws FileAccessException
	 */
	public void setPreferencesMap(Map<String, String> prefs) {

		if (isCloud())
			return;

		if (prefs.containsKey(WMHOME_KEY) && null != prefs.get(WMHOME_KEY)) {
			try {
				setWaveMakerHome(new GFSResource(gfs, prefs.get(WMHOME_KEY)));
			} catch (Exception e) {
				throw new WMRuntimeException(e);
			}
		}
		if (prefs.containsKey(DEMOHOME_KEY) && null != prefs.get(DEMOHOME_KEY)) {
			setDemoDir(new File(prefs.get(DEMOHOME_KEY)));
		}
	}

	/**
	 * Gets the current VersionInfo from the VERSION file.
	 */
	public static VersionInfo getCurrentVersionInfo() throws IOException {

		String versionFileString = getCurrentVersionInfoString();

		final Pattern p = Pattern.compile("^Version: (.*)$", Pattern.MULTILINE);
		Matcher m = p.matcher(versionFileString);
		if (!m.find()) {
			throw new WMRuntimeException("bad version string: "
					+ versionFileString);
		}

		return new VersionInfo(m.group(1));
	}

	public static String getCurrentVersionInfoString() throws IOException {

		String versionFile = CFStudioConfiguration.class.getPackage().getName()
				.replace(".", "/")
				+ "/" + VERSION_FILE;
		InputStream is = CFStudioConfiguration.class.getClassLoader()
				.getResourceAsStream(versionFile);
		String versionFileString = org.apache.commons.io.IOUtils.toString(is);

		return versionFileString;
	}

	/**
	 * Set the registry version.
	 */
	public static void setRegisteredVersionInfo(VersionInfo vi) {
		ConfigurationStore.setPreference(CFStudioConfiguration.class,
				VERSION_KEY, vi.toString());
	}

	/**
	 * Gets the last registered version (i.e., the version stored in the
	 * registry).
	 */
	public static VersionInfo getRegisteredVersionInfo() {
		String versionString = ConfigurationStore.getPreference(
				CFStudioConfiguration.class, VERSION_KEY, VERSION_DEFAULT);
		return new VersionInfo(versionString);
	}

	// bean properties
	private RuntimeAccess runtimeAccess;

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.tools.project.StudioConfiguration#getRuntimeAccess()
	 */
	public RuntimeAccess getRuntimeAccess() {
		return runtimeAccess;
	}

	public void setRuntimeAccess(RuntimeAccess runtimeAccess) {
		this.runtimeAccess = runtimeAccess;
	}

	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}

	public Resource createPath(Resource root, String path) {
		Assert.isInstanceOf(Resource.class, root,
				"GFS: Expected a Resource");
		try {
			GFSResource relativeResource = (GFSResource) root
					.createRelative(path);
			return relativeResource;
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	public Resource copyFile(Resource root, InputStream source, String filePath) {
		Assert.isInstanceOf(Resource.class, root, "GFS: Expected a Resource");
		try {
			Resource targetFile = new GFSResource(gfs,source,root.getFilename(),filePath);
			return targetFile;
		} catch (Exception ex) {
			throw new WMRuntimeException(ex);
		}
	}

	public boolean deleteFile(Resource file) {
		Assert.isInstanceOf(Resource.class, file, "GFS: Expected a Resource");
		GFSResource fileResource = (GFSResource) file;
		if (fileResource.isDirectory()) {
			try { 
				GFSUtils.forceDelete(gfs, fileResource);
				return true;
			} catch (Exception ex) {
				throw new WMRuntimeException(ex);
			}
		} else {
			gfs.remove(file.getFilename());
			return true;
		}
	}

	public OutputStream getOutputStream(Resource file) {
		try {
			Assert.isTrue(!((GFSResource)file).isDirectory(),
					"Cannot get an output stream for a directory.");
			prepareForWriting(file);
			return ((GFSResource)file).getGridFSInputFile().getOutputStream();
		} catch (Exception ex) {
			throw new WMRuntimeException(ex);
		}
	}

	public Resource copyRecursive(Resource root, Resource target,
			List<String> exclusions) {
		GFSResource source  = (GFSResource) root;
		GFSResource destination = (GFSResource) target;
		try {
			GFSUtils.copy(gfs, source, destination, exclusions);
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
		return destination;
	}
	
	public Resource getTomcatHome() {
		String tomcatHome = System.getProperty("catalina.home");
		tomcatHome = tomcatHome.endsWith("/") ? tomcatHome : tomcatHome + "/";
		return new GFSResource(gfs, tomcatHome);
	}

	public Resource getProjectLogsFolder() {
		try {
			return getTomcatHome().createRelative("logs/ProjectLogs/");
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	public List<Resource> listChildren(Resource root) {
		List<Resource> children = new ArrayList<Resource>();
		GridFSInputFile[] files;
		try {
			files = ((GFSResource)root).listFiles();
		} catch (Exception e) {
			throw new WMRuntimeException(e);
		}
		if (files == null) {
			return children;
		}
		for (GridFSInputFile file : files) {
			children.add((Resource)file);
		}
		return children;
	}

	public List<Resource> listChildren(Resource root, ResourceFilter filter) {
		List<Resource> children = new ArrayList<Resource>();
		GridFSInputFile[] files;
		try {
			files = ((GFSResource)root).listFiles();
		} catch (Exception e) {
			throw new WMRuntimeException(e);
		}
		if (files == null) {
			return children;
		}
		for (GridFSInputFile file : files) {
			if (filter.accept((Resource)file)) {
				children.add((Resource)file);
			}
		}
		return children;
	}

	public Resource createTempDir() {
		try {
			return new GFSResource(gfs, "/tmp");
		} catch (Exception ex) {
			throw new WMRuntimeException(ex);
		}
	}

	public Resource getResourceForURI(String resourceURI) {
		return new GFSResource(gfs, resourceURI);
	}

	public void prepareForWriting(Resource file) {
		//no need to pre-create directories here
	}

	public void rename(Resource oldResource, Resource newResource) {
		Assert.isInstanceOf(Resource.class, oldResource,
				"GFS: Expected a Resource");
		Assert.isInstanceOf(Resource.class, newResource,
				"GFS: Expected a Resource");
		try {
			((GFSResource)oldResource).getGridFSInputFile().setFilename(((GFSResource)newResource).getGridFSInputFile().getFilename());
		} catch (Exception ex) {
			throw new WMRuntimeException(ex);
		}
	}

	@Override
	public String getPath(Resource file) {
		return ((GFSResource)file).getPath();
	}
}
