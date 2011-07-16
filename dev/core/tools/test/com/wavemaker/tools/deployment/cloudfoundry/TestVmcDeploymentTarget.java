package com.wavemaker.tools.deployment.cloudfoundry;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.when;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.annotation.IfProfileValue;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.deployment.AppInfo;
import com.wavemaker.tools.deployment.cloudfoundry.VmcDeploymentTarget;

@RunWith(SpringJUnit4ClassRunner.class)
@IfProfileValue(name="spring.profiles", value="cloud-test")
@TestExecutionListeners({})
public class TestVmcDeploymentTarget {
	
	@Mock
	RuntimeAccess runtimeAccessBean;
	
	private File testapp;
	
	private CloudFoundryClient testClient;
	
	private MockHttpServletRequest request = new MockHttpServletRequest();
	
	private static final Map<String, String> defaultProps = new HashMap<String, String>();
	private static final String TEST_USER_EMAIL = System.getProperty("vcap.email");
	private static final String TEST_USER_PASS = System.getProperty("vcap.passwd");
	
	static {
		defaultProps.put(VmcDeploymentTarget.VMC_USERNAME_PROPERTY, TEST_USER_EMAIL);
		defaultProps.put(VmcDeploymentTarget.VMC_PASSWORD_PROPERTY, TEST_USER_PASS);
	}
	
	@Before
	public void setUp() throws Exception {
		if (!StringUtils.hasText(TEST_USER_EMAIL)) {
			fail("System property vcap.email must be specified, supply -Dvcap.email=<email>");
		}
		if (!StringUtils.hasText(TEST_USER_PASS)) {
			fail("System property vcap.passwd must be specified, supply -Dvcap.passwd=<password>");
		}
		
		testClient = new CloudFoundryClient(TEST_USER_EMAIL, TEST_USER_PASS, "https://api.cloudfoundry.com");
		testapp = new ClassPathResource("com/wavemaker/tools/deployment/cloudfoundry/wmcftest.war").getFile();
		
		MockitoAnnotations.initMocks(this);
		when(runtimeAccessBean.getSession()).thenReturn(request.getSession(true));
		RuntimeAccess.setRuntimeBean(runtimeAccessBean);
	}
	
	@Test
	public void testDeployWarNullContextRoot() {
		String result;
		CloudApplication app;
		VmcDeploymentTarget target = new VmcDeploymentTarget();
		
		result = target.deploy(testapp, null, defaultProps);
		assertEquals("SUCCESS", result);
		app = testClient.getApplication("wmcftest");
		assertNotNull(app);
		assertEquals(CloudApplication.AppState.STARTED, app.getState());
		
		result = target.redeploy("wmcftest", defaultProps);
		assertEquals("SUCCESS", result);
		app = testClient.getApplication("wmcftest");
		assertNotNull(app);
		assertEquals(CloudApplication.AppState.STARTED, app.getState());
		
		result = target.deploy(testapp, "wmcftest2", defaultProps);
		assertEquals("SUCCESS", result);
		app = testClient.getApplication("wmcftest2");
		assertNotNull(app);
		assertEquals(CloudApplication.AppState.STARTED, app.getState());
		
		result = target.stop("wmcftest2", defaultProps);
		assertEquals("SUCCESS", result);
		app = testClient.getApplication("wmcftest2");
		assertNotNull(app);
		assertEquals(CloudApplication.AppState.STOPPED, app.getState());
		
		result = target.start("wmcftest2", defaultProps);
		assertEquals("SUCCESS", result);
		app = testClient.getApplication("wmcftest2");
		assertNotNull(app);
		assertEquals(CloudApplication.AppState.STARTED, app.getState());
		
		List<AppInfo> apps = target.listDeploymentNames(defaultProps);
		List<String> appNames = new ArrayList<String>();
		for (AppInfo appInfo : apps) {
			assertTrue(appInfo.getHref().contains("http://"+appInfo.getName()+".cloudfoundry.com"));
			appNames.add(appInfo.getName());
		}
		assertTrue(appNames.contains("wmcftest"));
		assertTrue(appNames.contains("wmcftest2"));
		
		result = target.undeploy("wmcftest2", defaultProps);
		assertEquals("SUCCESS", result);
		try {
			app = testClient.getApplication("wmcftest2");
			fail("Application still available after undeploy.");
		} catch (HttpClientErrorException e) {
			if (e.getStatusCode() != HttpStatus.NOT_FOUND) {
				throw e;
			}
		}
		
		testClient.deleteApplication("wmcftest");
	}

}
