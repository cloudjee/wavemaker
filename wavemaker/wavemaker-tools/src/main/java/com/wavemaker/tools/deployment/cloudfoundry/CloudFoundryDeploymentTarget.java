
package com.wavemaker.tools.deployment.cloudfoundry;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.zip.ZipFile;

import javax.servlet.http.Cookie;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.client.lib.CloudFoundryException;
import org.cloudfoundry.client.lib.CloudService;
import org.cloudfoundry.client.lib.archive.ApplicationArchive;
import org.cloudfoundry.client.lib.archive.ZipApplicationArchive;
import org.springframework.http.HttpStatus;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.util.WebUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.cloudfoundry.CloudFoundryUtils;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.AuthenticationToken;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecret;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecretPropagation;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;
import com.wavemaker.tools.data.BaseDataModelSetup;
import com.wavemaker.tools.data.DataModelConfiguration;
import com.wavemaker.tools.data.DataModelManager;
import com.wavemaker.tools.deployment.DeploymentDB;
import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.deployment.DeploymentStatusException;
import com.wavemaker.tools.deployment.DeploymentTarget;
import com.wavemaker.tools.deployment.cloudfoundry.LoggingStatusCallback.Timer;
import com.wavemaker.tools.deployment.cloudfoundry.archive.ContentModifier;
import com.wavemaker.tools.deployment.cloudfoundry.archive.ModifiedContentApplicationArchive;
import com.wavemaker.tools.deployment.cloudfoundry.archive.StringReplaceContentModifier;
import com.wavemaker.tools.project.CloudFoundryDeploymentManager;
import com.wavemaker.tools.project.Project;

public class CloudFoundryDeploymentTarget implements DeploymentTarget {

    private static final String CLOUD_CONTROLLER_VARIABLE_NAME = "cloudcontroller";

    public static final String SUCCESS_RESULT = "SUCCESS";

    public static final String TOKEN_EXPIRED_RESULT = "ERROR: CloudFoundry login token expired";

    public static final String VMC_USERNAME_PROPERTY = "username";

    public static final String VMC_PASSWORD_PROPERTY = "password";

    public static final String VMC_URL_PROPERTY = "url";

    public static final Map<String, String> CONFIGURABLE_PROPERTIES;

    private static final String DEFAULT_URL = "https://api.cloudfoundry.com";

    private static final String SERVICE_TYPE = "database";

    private static final String MYSQL_SERVICE_VENDOR = "mysql";

    private static final String MYSQL_SERVICE_VERSION = "5.1";

    private static final String POSTGRES_SERVICE_VENDOR = "postgresql";

    private static final String POSTGRES_SERVICE_VERSION = "9.0";

    private static final String SERVICE_TIER = "free";

    private static final Log log = LogFactory.getLog(CloudFoundryDeploymentTarget.class);

    private DataModelManager dataModelManager;

    private WebAppAssembler webAppAssembler;

    private final SharedSecretPropagation propagation = new SharedSecretPropagation();

    static {
        Map<String, String> props = new LinkedHashMap<String, String>();
        props.put(VMC_USERNAME_PROPERTY, "username@mydomain.com");
        props.put(VMC_PASSWORD_PROPERTY, "password");
        props.put(VMC_URL_PROPERTY, DEFAULT_URL);
        CONFIGURABLE_PROPERTIES = Collections.unmodifiableMap(props);
    }

    public void setDataModelManager(DataModelManager dataModelManager) {
        this.dataModelManager = dataModelManager;
    }

    public void setWebAppAssembler(WebAppAssembler webAppAssembler) {
        this.webAppAssembler = webAppAssembler;
    }

    @Override
    public void validateDeployment(DeploymentInfo deploymentInfo) throws DeploymentStatusException {
        CloudFoundryClient client = getClient(deploymentInfo);
        uploadProject(client, deploymentInfo);
    }

    @Deprecated
    void deploy(File webapp, DeploymentInfo deploymentInfo) throws DeploymentStatusException {
        try {
            validateWar(webapp);
            ZipFile zipFile = new ZipFile(webapp);
            ApplicationArchive applicationArchive = new ZipApplicationArchive(zipFile);
            doDeploy(applicationArchive, deploymentInfo);
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    @Override
    public void deploy(Project project, DeploymentInfo deploymentInfo) throws DeploymentStatusException {
        ApplicationArchive applicationArchive = this.webAppAssembler.assemble(project);
        applicationArchive = modifyApplicationArchive(applicationArchive);
        doDeploy(applicationArchive, deploymentInfo);
    }

    /**
     * Initiate the test/run operation for the given project on the cloud foundry instance that is running studio. This
     * method is not part of the {@link DeploymentTarget} interface but is called directly from
     * {@link CloudFoundryDeploymentManager#testRunStart()} in order to reuse CloudFoundry deployment code.
     * 
     * @param project
     * @return
     */
    public String testRunStart(Project project) {
        try {
            ApplicationArchive applicationArchive = this.webAppAssembler.assemble(project);
            applicationArchive = modifyApplicationArchive(applicationArchive);
            return doDeploy(applicationArchive, getSelfDeploymentInfo(project));
        } catch (DeploymentStatusException e) {
            throw new WMRuntimeException(e.getMessage(), e);
        }
    }

    /**
     * undeploy the given project from the cloud foundry instance that is running studio. This method is not part of the
     * {@link DeploymentTarget} interface but is called directly from {@link CloudFoundryDeploymentManager} in order to
     * reuse CloudFoundry deployment code.
     * 
     * @param project
     */
    public void undeploy(Project project) {
        try {
            undeploy(getSelfDeploymentInfo(project), false);
        } catch (DeploymentStatusException e) {
            throw new WMRuntimeException(e.getMessage(), e);
        }
    }

    private DeploymentInfo getSelfDeploymentInfo(Project project) {
        try {
            String cloudControllerUrl = getControllerUrl();
            AuthenticationToken token = getAuthenticationToken();
            if (token == null) {
                // FIXME remove hard coded details
                String email = "wavemaker@vmware.com";
                String password = "password";
                CloudFoundryClient cloudFoundryClient = new CloudFoundryClient(email, password, cloudControllerUrl);
                token = new AuthenticationToken(cloudFoundryClient.login());
            }
            DeploymentInfo deploymentInfo = new DeploymentInfo();
            deploymentInfo.setToken(token.toString());
            deploymentInfo.setApplicationName("deployedproject");
            deploymentInfo.setTarget(cloudControllerUrl);
            return deploymentInfo;
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
    }

    private AuthenticationToken getAuthenticationToken() {
        RuntimeAccess runtimeAccess = RuntimeAccess.getInstance();
        if (runtimeAccess == null) {
            return null;
        }
        Cookie cookie = WebUtils.getCookie(runtimeAccess.getRequest(), "wavemaker_authentication_token");
        if (cookie == null || !StringUtils.hasLength(cookie.getValue())) {
            return null;
        }
        SharedSecret sharedSecret = this.propagation.getForSelf(false);
        if (sharedSecret == null) {
            return null;
        }
        AuthenticationToken authenticationToken = sharedSecret.decrypt(TransportToken.decode(cookie.getValue()));
        return authenticationToken;
    }

    /**
     * @return The actual controller URL to use.
     */
    private String getControllerUrl() {
        String systemEnv = System.getenv(CLOUD_CONTROLLER_VARIABLE_NAME);
        if (StringUtils.hasLength(systemEnv)) {
            return systemEnv;
        }
        systemEnv = System.getProperty(CLOUD_CONTROLLER_VARIABLE_NAME);
        if (StringUtils.hasLength(systemEnv)) {
            return systemEnv;
        }
        return "http://api.cloudfoundry.com";
    }

    private ApplicationArchive modifyApplicationArchive(ApplicationArchive applicationArchive) {
        ContentModifier modifier = new StringReplaceContentModifier().forEntryName("index.html", "config.js").replaceAll("\\/wavemaker\\/", "/");
        return new ModifiedContentApplicationArchive(applicationArchive, modifier);
    }

    private String doDeploy(ApplicationArchive applicationArchive, DeploymentInfo deploymentInfo) throws DeploymentStatusException {
        CloudFoundryClient client = getClient(deploymentInfo);
        String url = uploadProject(client, deploymentInfo);
        setupServices(client, deploymentInfo);
        Timer timer = new Timer();
        try {
            client.uploadApplication(deploymentInfo.getApplicationName(), applicationArchive, new LoggingStatusCallback(timer));
        } catch (IOException ex) {
            throw new WMRuntimeException("Error ocurred while trying to upload WAR file.", ex);
        }

        log.info("Application upload completed in " + timer.stop() + "ms");

        try {
            CloudApplication application = client.getApplication(deploymentInfo.getApplicationName());
            if (application.getState().equals(CloudApplication.AppState.STARTED)) {
                doRestart(deploymentInfo, client);
            } else {
                doStart(deploymentInfo, client);
            }
        } catch (CloudFoundryException ex) {
            throw new DeploymentStatusException("ERROR: Could not start application. " + ex.getDescription(), ex);
        }
        return url;
    }

    private String uploadProject(CloudFoundryClient client, DeploymentInfo deploymentInfo) throws DeploymentStatusException {
        String url = getUrl(deploymentInfo);
        try {
            client.createApplication(deploymentInfo.getApplicationName(), CloudApplication.SPRING,
                client.getDefaultApplicationMemory(CloudApplication.SPRING), Collections.singletonList(url), null, true);
        } catch (CloudFoundryException e) {
            if (HttpStatus.FORBIDDEN == e.getStatusCode()) {
                throw new DeploymentStatusException(TOKEN_EXPIRED_RESULT, e);
            } else if (HttpStatus.BAD_REQUEST == e.getStatusCode()) {
                throw new DeploymentStatusException("ERROR: " + e.getDescription(), e);
            } else {
                throw e;
            }
        }
        return url;
    }

    private String getUrl(DeploymentInfo deploymentInfo) {
        String url = deploymentInfo.getTarget();
        if (!StringUtils.hasText(url)) {
            url = DEFAULT_URL;
        }
        return url.replace("api", deploymentInfo.getApplicationName());
    }

    /**
     * @param deploymentInfo
     */
    private void setupServices(CloudFoundryClient client, DeploymentInfo deploymentInfo) {
        if (CollectionUtils.isEmpty(deploymentInfo.getDatabases())) {
            return;
        }

        CloudApplication app = client.getApplication(deploymentInfo.getApplicationName());

        for (DeploymentDB db : deploymentInfo.getDatabases()) {
            if (app.getServices().contains(db.getDbName())) {
                // service binding already exists
                continue;
            }

            String dbType = "NONE";
            DataModelConfiguration config = this.dataModelManager.getDataModel(db.getDataModelId());
            String url = config.readConnectionProperties().getProperty(DataServiceConstants.DB_URL_KEY, "");
            if (StringUtils.hasText(url)) {
                dbType = BaseDataModelSetup.getDBTypeFromURL(url);
            }
            boolean serviceToBind = false;
            try {
                CloudService service = client.getService(db.getDbName());
                if (dbType.equals(MYSQL_SERVICE_VENDOR)) {
                    Assert.state(MYSQL_SERVICE_VENDOR.equals(service.getVendor()),
                        "There is already a service provisioned with the name '" + db.getDbName() + "' but it is not a MySQL service.");
                } else if (dbType.equals(POSTGRES_SERVICE_VENDOR)) {
                    Assert.state(POSTGRES_SERVICE_VENDOR.equals(service.getVendor()),
                        "There is already a service provisioned with the name '" + db.getDbName() + "' but it is not a PostgreSQL service.");
                }
                serviceToBind = true;
            } catch (CloudFoundryException ex) {
                if (ex.getStatusCode() != HttpStatus.NOT_FOUND) {
                    throw ex;
                }

                if (dbType.equals(MYSQL_SERVICE_VENDOR)) {
                    client.createService(createMySqlService(db));
                    serviceToBind = true;
                } else if (dbType.equals(POSTGRES_SERVICE_VENDOR)) {
                    client.createService(createPostgresqlService(db));
                    serviceToBind = true;
                }
            }
            if (serviceToBind) {
                client.bindService(deploymentInfo.getApplicationName(), db.getDbName());
            }
        }
    }

    /**
     * @param db
     * @return
     */
    private CloudService createMySqlService(DeploymentDB db) {
        CloudService mysql = new CloudService();
        mysql.setType(SERVICE_TYPE);
        mysql.setVendor(MYSQL_SERVICE_VENDOR);
        mysql.setTier(SERVICE_TIER);
        mysql.setVersion(MYSQL_SERVICE_VERSION);
        mysql.setName(db.getDbName());
        return mysql;
    }

    /**
     * @param db
     * @return
     */
    public static CloudService createPostgresqlService(DeploymentDB db) {
        CloudService postgresql = new CloudService();
        postgresql.setType(SERVICE_TYPE);
        postgresql.setVendor(POSTGRES_SERVICE_VENDOR);
        postgresql.setTier(SERVICE_TIER);
        postgresql.setVersion(POSTGRES_SERVICE_VERSION);
        postgresql.setName(db.getDbName());
        return postgresql;
    }

    @Override
    public void undeploy(DeploymentInfo deploymentInfo, boolean deleteServices) throws DeploymentStatusException {
        CloudFoundryClient client = getClient(deploymentInfo);
        log.info("Deleting application " + deploymentInfo.getApplicationName());
        Timer timer = new Timer();
        timer.start();
        try {
            if (deleteServices) {
                CloudApplication app = client.getApplication(deploymentInfo.getApplicationName());
                for (String service : app.getServices()) {
                    client.deleteService(service);
                }
            }
            client.deleteApplication(deploymentInfo.getApplicationName());
            log.info("Application " + deploymentInfo.getApplicationName() + " deleted successfully in " + timer.stop() + "ms");
        } catch (CloudFoundryException ex) {
            if (HttpStatus.FORBIDDEN == ex.getStatusCode()) {
                throw new DeploymentStatusException(TOKEN_EXPIRED_RESULT, ex);
            } else {
                throw ex;
            }
        }
    }

    private void doRestart(DeploymentInfo deploymentInfo, CloudFoundryClient client) {
        log.info("Restarting application " + deploymentInfo.getApplicationName());
        Timer timer = new Timer();
        timer.start();
        CloudFoundryUtils.restartApplicationAndWaitUntilRunning(client, deploymentInfo.getApplicationName());
        log.info("Application " + deploymentInfo.getApplicationName() + " restarted successfully in " + timer.stop() + "ms");
    }

    private void doStart(DeploymentInfo deploymentInfo, CloudFoundryClient client) {
        log.info("Starting application " + deploymentInfo.getApplicationName());
        Timer timer = new Timer();
        timer.start();
        CloudFoundryUtils.startApplicationAndWaitUntilRunning(client, deploymentInfo.getApplicationName());
        log.info("Application " + deploymentInfo.getApplicationName() + " started successfully in " + timer.stop() + "ms");
    }

    private CloudFoundryClient getClient(DeploymentInfo deploymentInfo) {
        Assert.hasText(deploymentInfo.getToken(), "CloudFoundry login token not supplied.");
        String url = deploymentInfo.getTarget();
        if (!StringUtils.hasText(url)) {
            url = DEFAULT_URL;
        }
        try {
            CloudFoundryClient client = new CloudFoundryClient(deploymentInfo.getToken(), url);
            return client;
        } catch (MalformedURLException e) {
            throw new WMRuntimeException("CloudFoundry target URL is invalid", e);
        }
    }

    private void validateWar(File war) {
        Assert.notNull(war, "war cannot be null");
        Assert.isTrue(war.exists(), "war does not exist");
        Assert.isTrue(!war.isDirectory(), "war cannot be a directory");
    }
}
