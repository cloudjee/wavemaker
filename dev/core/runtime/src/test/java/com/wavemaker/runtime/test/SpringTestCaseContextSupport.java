package com.wavemaker.runtime.test;

import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Enumeration;
import java.util.Set;

import javax.servlet.RequestDispatcher;
import javax.servlet.Servlet;
import javax.servlet.ServletContext;

import org.springframework.context.ApplicationContext;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.context.MergedContextConfiguration;
import org.springframework.test.context.TestContext;
import org.springframework.test.context.TestExecutionListener;
import org.springframework.test.context.support.AbstractContextLoader;
import org.springframework.test.web.server.MockMvc;
import org.springframework.test.web.server.setup.ContextMockMvcBuilder;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
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
			configureWebAppRootDir("../../studio/src/main/webapp", false);
			this.context = applicationContext;
		}

		@Override
		protected ServletContext initServletContext() {

			return new MockServletContextWrapper((MockServletContext)super.initServletContext()){

				@Override
				public String getMimeType(String filePath) {
					String extension = StringUtils.getFilenameExtension(filePath);
					if (extension.equals("smd")) {
						return "application/json";
					} else if (extension.equals("css")) {
						return "text/css";
					} else if (extension.equals("js")) {
						return "text/javascript";
					}
					return super.getMimeType(filePath);
				}
	        	
	        };
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
	
	private static class MockServletContextWrapper extends MockServletContext {
		
		private MockServletContext delegate;
		
		private MockServletContextWrapper(MockServletContext delegate) {
			this.delegate = delegate;
		}

		public void setContextPath(String contextPath) {
			delegate.setContextPath(contextPath);
		}

		public String getContextPath() {
			return delegate.getContextPath();
		}

		public void registerContext(String contextPath, ServletContext context) {
			delegate.registerContext(contextPath, context);
		}

		public ServletContext getContext(String contextPath) {
			return delegate.getContext(contextPath);
		}

		public void setMajorVersion(int majorVersion) {
			delegate.setMajorVersion(majorVersion);
		}

		public int getMajorVersion() {
			return delegate.getMajorVersion();
		}

		public void setMinorVersion(int minorVersion) {
			delegate.setMinorVersion(minorVersion);
		}

		public int getMinorVersion() {
			return delegate.getMinorVersion();
		}

		public void setEffectiveMajorVersion(int effectiveMajorVersion) {
			delegate.setEffectiveMajorVersion(effectiveMajorVersion);
		}

		public int getEffectiveMajorVersion() {
			return delegate.getEffectiveMajorVersion();
		}

		public void setEffectiveMinorVersion(int effectiveMinorVersion) {
			delegate.setEffectiveMinorVersion(effectiveMinorVersion);
		}

		public int getEffectiveMinorVersion() {
			return delegate.getEffectiveMinorVersion();
		}

		public String getMimeType(String filePath) {
			return delegate.getMimeType(filePath);
		}

		public Set<String> getResourcePaths(String path) {
			return delegate.getResourcePaths(path);
		}

		public URL getResource(String path) throws MalformedURLException {
			return delegate.getResource(path);
		}

		public InputStream getResourceAsStream(String path) {
			return delegate.getResourceAsStream(path);
		}

		public RequestDispatcher getRequestDispatcher(String path) {
			return delegate.getRequestDispatcher(path);
		}

		public RequestDispatcher getNamedDispatcher(String path) {
			return delegate.getNamedDispatcher(path);
		}

		public Servlet getServlet(String name) {
			return delegate.getServlet(name);
		}

		public Enumeration<Servlet> getServlets() {
			return delegate.getServlets();
		}

		public Enumeration<String> getServletNames() {
			return delegate.getServletNames();
		}

		public String getRealPath(String path) {
			return delegate.getRealPath(path);
		}

		public String getServerInfo() {
			return delegate.getServerInfo();
		}

		public String getInitParameter(String name) {
			return delegate.getInitParameter(name);
		}

		public Enumeration<String> getInitParameterNames() {
			return delegate.getInitParameterNames();
		}

		public boolean setInitParameter(String name, String value) {
			return delegate.setInitParameter(name, value);
		}

		public void addInitParameter(String name, String value) {
			delegate.addInitParameter(name, value);
		}

		public void setAttribute(String name, Object value) {
			delegate.setAttribute(name, value);
		}

		public void removeAttribute(String name) {
			delegate.removeAttribute(name);
		}

		public void setServletContextName(String servletContextName) {
			delegate.setServletContextName(servletContextName);
		}

		public String getServletContextName() {
			return delegate.getServletContextName();
		}

		public ClassLoader getClassLoader() {
			return delegate.getClassLoader();
		}

		public void declareRoles(String... roleNames) {
			delegate.declareRoles(roleNames);
		}

		public boolean equals(Object arg0) {
			return delegate.equals(arg0);
		}

		public Object getAttribute(String name) {
			return delegate.getAttribute(name);
		}

		public Enumeration<String> getAttributeNames() {
			return delegate.getAttributeNames();
		}

		public Set<String> getDeclaredRoles() {
			return delegate.getDeclaredRoles();
		}

		public int hashCode() {
			return delegate.hashCode();
		}

		public void log(String message) {
			delegate.log(message);
		}

		public void log(Exception ex, String message) {
			delegate.log(ex, message);
		}

		public void log(String message, Throwable ex) {
			delegate.log(message, ex);
		}

		public String toString() {
			return delegate.toString();
		}
	}
}
