
package com.wavemaker.studio;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.client.lib.CloudService;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.util.StringUtils;

import com.wavemaker.tools.deployment.DeploymentDB;

/**
 * @author slee
 * 
 */

public class TestCloudFoundryService {

    private static CloudFoundryService cloudService;

    private static DeploymentDB depDb;

    private static CloudFoundryClient testClient;

    private static String token;

    private static final String TEST_USER_EMAIL = System.getProperty("vcap.email");

    private static final String TEST_USER_PASS = System.getProperty("vcap.passwd");

    private static final String TEST_TARGET = System.getProperty("vcap.target"); // https://api.cloudfoundry.com

    private static final String TEST_DB_NAME = System.getProperty("vcap.db");

    @BeforeClass
    public static void init() throws Exception {
        if (!StringUtils.hasText(TEST_USER_EMAIL)) {
            fail("System property vcap.email must be specified, supply -Dvcap.email=<email>");
        }
        if (!StringUtils.hasText(TEST_USER_PASS)) {
            fail("System property vcap.passwd must be specified, supply -Dvcap.passwd=<password>");
        }
        if (!StringUtils.hasText(TEST_TARGET)) {
            fail("System property vcap.target must be specified, supply -Dvcap.target=<url>");
        }
        if (!StringUtils.hasText(TEST_DB_NAME)) {
            fail("System property vcap.db must be specified, supply -Dvcap.db=<dbName>");
        }

        testClient = new CloudFoundryClient(TEST_USER_EMAIL, TEST_USER_PASS, TEST_TARGET);

        cloudService = new CloudFoundryService();

        token = testClient.login();

        depDb = new DeploymentDB();
        depDb.setDbName(TEST_DB_NAME);
    }

    @Test
    public void testListApps() {
        cloudService.listApps(token, TEST_TARGET);
        assertTrue(true);
    }

    @Test
    public void testListServices() {
        cloudService.listServices(token, TEST_TARGET);
        assertTrue(true);
    }

    @Test
    public void testCreateService() {
        cloudService.createService(token, TEST_TARGET, depDb, "wavemaker");
        CloudService service = cloudService.getService(token, TEST_TARGET, TEST_DB_NAME);
        assertNotNull(service);
        cloudService.deleteService(token, TEST_TARGET, TEST_DB_NAME);
        service = cloudService.getService(token, TEST_TARGET, TEST_DB_NAME);
        assertNull(service);
    }

}
