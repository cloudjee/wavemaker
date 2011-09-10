package com.wavemaker.runtime.test;

import org.springframework.context.ApplicationContext;
import org.springframework.test.context.MergedContextConfiguration;
import org.springframework.test.context.TestContext;
import org.springframework.test.context.TestExecutionListener;
import org.springframework.test.context.support.AbstractContextLoader;
import org.springframework.test.web.server.MockMvc;
import org.springframework.test.web.server.setup.ContextMockMvcBuilder;
import org.springframework.util.Assert;
import org.springframework.web.context.ConfigurableWebApplicationContext;
import org.springframework.web.context.support.XmlWebApplicationContext;

public class SpringTestCaseContextSupport extends AbstractContextLoader implements TestExecutionListener {

	private MockMvc mockMvc;
	
	public ApplicationContext loadContext(MergedContextConfiguration mergedConfig) throws Exception {
		WrapperContextMockMvcBuilder builder = createBuilder(mergedConfig.getLocations());
		builder.activateProfiles(mergedConfig.getActiveProfiles());
		this.mockMvc = builder.build();
		return builder.context;
	}

	public ApplicationContext loadContext(String... locations) throws Exception {
		WrapperContextMockMvcBuilder builder = createBuilder(locations);
		builder.activateProfiles(builder.context.getEnvironment().getActiveProfiles());
		this.mockMvc = builder.build();
		return builder.context;
	}

	@Override
	protected String getResourceSuffix() {
		return "-context.xml";
	}
	
	private WrapperContextMockMvcBuilder createBuilder(String... configLocations) {
		Assert.notEmpty(configLocations, "At least one XML config location is required");
		XmlWebApplicationContext context = new XmlWebApplicationContext();
		context.setConfigLocations(configLocations);
		return new WrapperContextMockMvcBuilder(context);
	}
	
	private class WrapperContextMockMvcBuilder extends ContextMockMvcBuilder {

		private ConfigurableWebApplicationContext context;
		
		private WrapperContextMockMvcBuilder(
				ConfigurableWebApplicationContext applicationContext) {
			super(applicationContext);
			configureWarRootDir("../../studio/src/main/webapp", false);
			this.context = applicationContext;
		}
	}

	public void prepareTestInstance(TestContext testContext) throws Exception {
		Object test = testContext.getTestInstance();
		if (test instanceof MockMvcAware) {
			((MockMvcAware)test).setMockMvc(this.mockMvc);
		}
	}
	
	public void beforeTestClass(TestContext testContext) throws Exception {
		//no-op
	}

	public void beforeTestMethod(TestContext testContext) throws Exception {
		//no-op
	}

	public void afterTestMethod(TestContext testContext) throws Exception {
		//no-op
	}

	public void afterTestClass(TestContext testContext) throws Exception {
		//no-op
	}
}
