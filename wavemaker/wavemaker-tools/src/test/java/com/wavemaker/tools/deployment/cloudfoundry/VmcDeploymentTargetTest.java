
package com.wavemaker.tools.deployment.cloudfoundry;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.when;

import java.io.File;
import java.net.MalformedURLException;
import java.util.Properties;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.client.lib.CloudFoundryException;
import org.cloudfoundry.client.lib.CloudService;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.IfProfileValue;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;

import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.data.DataModelConfiguration;
import com.wavemaker.tools.data.DataModelManager;
import com.wavemaker.tools.deployment.DeploymentDB;
import com.wavemaker.tools.deployment.DeploymentInfo;

@RunWith(SpringJUnit4ClassRunner.class)
@IfProfileValue(name = "spring.profiles", value = "cloud-test")
@TestExecutionListeners({})
public class VmcDeploymentTargetTest {

    private static File testapp;

    private static CloudFoundryClient testClient;

    private static String token;

    private static final String TEST_USER_EMAIL = System.getProperty("vcap.email");

    private static final String TEST_USER_PASS = System.getProperty("vcap.passwd");

    @Mock
    DataModelManager dmMgr;

    @Mock
    DataModelConfiguration config;

    @BeforeClass
    public static void init() throws Exception {
        if (!StringUtils.hasText(TEST_USER_EMAIL)) {
            fail("System property vcap.email must be specified, supply -Dvcap.email=<email>");
        }
        if (!StringUtils.hasText(TEST_USER_PASS)) {
            fail("System property vcap.passwd must be specified, supply -Dvcap.passwd=<password>");
        }

        testClient = new CloudFoundryClient(TEST_USER_EMAIL, TEST_USER_PASS, "https://api.cloudfoundry.com");
        testapp = new ClassPathResource("com/wavemaker/tools/deployment/cloudfoundry/wmcftest.war").getFile();

        token = testClient.login();
    }

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        when(this.dmMgr.getDataModel("wmcftestdb")).thenReturn(this.config);
    }

    @Test
    public void testDeployWithDisallowedAppName() {
        DeploymentInfo deployment1 = new DeploymentInfo();
        deployment1.setToken(token);
        deployment1.setTarget("https://api.cloudfoundry.com");
        deployment1.setApplicationName("inflickr");
        DeploymentDB db1 = new DeploymentDB();
        db1.setDbName("wmcftestdb");
        deployment1.getDatabases().add(db1);

        String result;
        VmcDeploymentTarget target = new VmcDeploymentTarget();
        target.setDataModelManager(this.dmMgr);

        result = target.deploy(testapp, deployment1);
        assertEquals("ERROR: The URI: \"inflickr.cloudfoundry.com\" has already been taken or reserved", result);
    }

    @Test
    public void testValidateWithDisallowedAppName() {
        DeploymentInfo deployment1 = new DeploymentInfo();
        deployment1.setToken(token);
        deployment1.setTarget("https://api.cloudfoundry.com");
        deployment1.setApplicationName("inflickr");
        DeploymentDB db1 = new DeploymentDB();
        db1.setDbName("wmcftestdb");
        deployment1.getDatabases().add(db1);

        String result;
        VmcDeploymentTarget target = new VmcDeploymentTarget();
        target.setDataModelManager(this.dmMgr);

        result = target.validateDeployment(deployment1);
        assertEquals("ERROR: The URI: \"inflickr.cloudfoundry.com\" has already been taken or reserved", result);
    }

    @Test
    public void testUnknownServiceLookup() {
        try {
            testClient.getService("foo");
        } catch (CloudFoundryException ex) {
            if (ex.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
                // success
            } else {
                fail("Unexpected result when querying for unknown service.");
            }
        }
    }

    @Test
    public void testServiceCreation() {
        CloudService service = new CloudService();
        service.setType("database");
        service.setVendor("mysql");
        service.setTier("free");
        service.setVersion("5.1");
        service.setName("test-service");

        try {
            testClient.createService(service);
        } catch (CloudFoundryException ex) {
            ex.printStackTrace();
        }

        CloudService result = testClient.getService("test-service");
        assertNotNull(result);

        testClient.deleteService("test-service");
    }

    @Test
    public void testDeployWithExpiredToken() throws MalformedURLException {
        DeploymentInfo deployment1 = new DeploymentInfo();
        deployment1.setToken("invalid");
        deployment1.setTarget("https://api.cloudfoundry.com");
        deployment1.setApplicationName("wmcftest");
        DeploymentDB db1 = new DeploymentDB();
        db1.setDbName("wmcftestdb");
        deployment1.getDatabases().add(db1);

        String result;
        VmcDeploymentTarget target = new VmcDeploymentTarget();
        target.setDataModelManager(this.dmMgr);

        result = target.deploy(testapp, deployment1);
        assertEquals(VmcDeploymentTarget.TOKEN_EXPIRED_RESULT, result);
    }

    @Test
    public void testValidateWithExpiredToken() throws MalformedURLException {
        DeploymentInfo deployment1 = new DeploymentInfo();
        deployment1.setToken("invalid");
        deployment1.setTarget("https://api.cloudfoundry.com");
        deployment1.setApplicationName("wmcftest");
        DeploymentDB db1 = new DeploymentDB();
        db1.setDbName("wmcftestdb");
        deployment1.getDatabases().add(db1);

        String result;
        VmcDeploymentTarget target = new VmcDeploymentTarget();
        target.setDataModelManager(this.dmMgr);

        result = target.validateDeployment(deployment1);
        assertEquals(VmcDeploymentTarget.TOKEN_EXPIRED_RESULT, result);
    }

    @Test
    public void testValidateValidDeployment() {
        DeploymentInfo deployment1 = new DeploymentInfo();
        deployment1.setToken(token);
        deployment1.setTarget("https://api.cloudfoundry.com");
        deployment1.setApplicationName("wmcftest");
        DeploymentDB db1 = new DeploymentDB();
        db1.setDbName("wmcftestdb");
        deployment1.getDatabases().add(db1);

        String result;
        VmcDeploymentTarget target = new VmcDeploymentTarget();
        target.setDataModelManager(this.dmMgr);

        result = target.validateDeployment(deployment1);
        assertEquals(VmcDeploymentTarget.SUCCESS_RESULT, result);
    }

    @Test
    public void testFullAppLifecycle() {
        Properties dbProps = new Properties();
        dbProps.setProperty(DataServiceConstants.DB_URL_KEY, "jdbc:mysql://localhost:3306/wmcftestdb");
        when(this.config.readConnectionProperties()).thenReturn(dbProps);

        DeploymentInfo deployment1 = new DeploymentInfo();
        deployment1.setToken(token);
        deployment1.setTarget("https://api.cloudfoundry.com");
        deployment1.setApplicationName("wmcftest");
        DeploymentDB db1 = new DeploymentDB();
        db1.setDataModelId("wmcftestdb");
        db1.setDbName("wmcftestdb");
        deployment1.getDatabases().add(db1);

        DeploymentInfo deployment2 = new DeploymentInfo();
        deployment2.setToken(token);
        deployment2.setTarget("https://api.cloudfoundry.com");
        deployment2.setApplicationName("wmcftest2");
        DeploymentDB db2 = new DeploymentDB();
        db2.setDataModelId("wmcftestdb");
        db2.setDbName("wmcftestdb");
        deployment2.getDatabases().add(db2);

        String result;
        CloudApplication app;
        VmcDeploymentTarget target = new VmcDeploymentTarget();
        target.setDataModelManager(this.dmMgr);

        result = target.deploy(testapp, deployment1);
        assertEquals(VmcDeploymentTarget.SUCCESS_RESULT, result);
        app = testClient.getApplication("wmcftest");
        assertNotNull(app);
        assertEquals(CloudApplication.AppState.STARTED, app.getState());

        result = target.deploy(testapp, deployment1);
        assertEquals(VmcDeploymentTarget.SUCCESS_RESULT, result);
        app = testClient.getApplication("wmcftest");
        assertNotNull(app);
        assertEquals(CloudApplication.AppState.STARTED, app.getState());

        result = target.deploy(testapp, deployment2);
        assertEquals(VmcDeploymentTarget.SUCCESS_RESULT, result);
        app = testClient.getApplication("wmcftest2");
        assertNotNull(app);
        assertEquals(CloudApplication.AppState.STARTED, app.getState());

        result = target.undeploy(deployment1, false);
        assertEquals(VmcDeploymentTarget.SUCCESS_RESULT, result);
        assertNotNull(testClient.getService("wmcftestdb"));

        result = target.undeploy(deployment2, true);
        assertEquals(VmcDeploymentTarget.SUCCESS_RESULT, result);
        try {
            app = testClient.getApplication("wmcftest2");
            fail("Application still available after undeploy.");
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() != HttpStatus.NOT_FOUND) {
                throw e;
            }
        }

        try {
            testClient.getService("wmcftestdb");
            fail("Service should no longer exist");
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() != HttpStatus.NOT_FOUND) {
                throw e;
            }
        }
    }

}
