
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

    @Override
    public ApplicationContext loadContext(MergedContextConfiguration mergedConfig) throws Exception {
        WrapperContextMockMvcBuilder builder = createBuilder(mergedConfig.getLocations());
        builder.activateProfiles(mergedConfig.getActiveProfiles());
        this.mockMvc = builder.build();
        return builder.context;
    }

    @Override
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

        private final ConfigurableWebApplicationContext context;

        private WrapperContextMockMvcBuilder(ConfigurableWebApplicationContext applicationContext) {
            super(applicationContext);
            configureWebAppRootDir("../../studio/src/main/webapp", false);
            this.context = applicationContext;
        }

        @Override
        protected ServletContext initServletContext() {

            return new MockServletContextWrapper((MockServletContext) super.initServletContext()) {

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

    @Override
    public void prepareTestInstance(TestContext testContext) throws Exception {
        Object test = testContext.getTestInstance();
        if (test instanceof MockMvcAware) {
            ((MockMvcAware) test).setMockMvc(this.mockMvc);
        }
    }

    @Override
    public void beforeTestClass(TestContext testContext) throws Exception {
        // no-op
    }

    @Override
    public void beforeTestMethod(TestContext testContext) throws Exception {
        // no-op
    }

    @Override
    public void afterTestMethod(TestContext testContext) throws Exception {
        // no-op
    }

    @Override
    public void afterTestClass(TestContext testContext) throws Exception {
        // no-op
    }

    private static class MockServletContextWrapper extends MockServletContext {

        private final MockServletContext delegate;

        private MockServletContextWrapper(MockServletContext delegate) {
            this.delegate = delegate;
        }

        @Override
        public void setContextPath(String contextPath) {
            this.delegate.setContextPath(contextPath);
        }

        @Override
        public String getContextPath() {
            return this.delegate.getContextPath();
        }

        @Override
        public void registerContext(String contextPath, ServletContext context) {
            this.delegate.registerContext(contextPath, context);
        }

        @Override
        public ServletContext getContext(String contextPath) {
            return this.delegate.getContext(contextPath);
        }

        @Override
        public int getMajorVersion() {
            return this.delegate.getMajorVersion();
        }

        @Override
        public void setMinorVersion(int minorVersion) {
            this.delegate.setMinorVersion(minorVersion);
        }

        @Override
        public int getMinorVersion() {
            return this.delegate.getMinorVersion();
        }

        @Override
        public String getMimeType(String filePath) {
            return this.delegate.getMimeType(filePath);
        }

        @Override
        public Set<String> getResourcePaths(String path) {
            return this.delegate.getResourcePaths(path);
        }

        @Override
        public URL getResource(String path) throws MalformedURLException {
            return this.delegate.getResource(path);
        }

        @Override
        public InputStream getResourceAsStream(String path) {
            return this.delegate.getResourceAsStream(path);
        }

        @Override
        public RequestDispatcher getRequestDispatcher(String path) {
            return this.delegate.getRequestDispatcher(path);
        }

        @Override
        public RequestDispatcher getNamedDispatcher(String path) {
            return this.delegate.getNamedDispatcher(path);
        }

        @Override
        public Servlet getServlet(String name) {
            return this.delegate.getServlet(name);
        }

        @Override
        public Enumeration<Servlet> getServlets() {
            return this.delegate.getServlets();
        }

        @Override
        public Enumeration<String> getServletNames() {
            return this.delegate.getServletNames();
        }

        @Override
        public String getRealPath(String path) {
            return this.delegate.getRealPath(path);
        }

        @Override
        public String getServerInfo() {
            return this.delegate.getServerInfo();
        }

        @Override
        public String getInitParameter(String name) {
            return this.delegate.getInitParameter(name);
        }

        @Override
        public Enumeration<String> getInitParameterNames() {
            return this.delegate.getInitParameterNames();
        }

        @Override
        public void addInitParameter(String name, String value) {
            this.delegate.addInitParameter(name, value);
        }

        @Override
        public void setAttribute(String name, Object value) {
            this.delegate.setAttribute(name, value);
        }

        @Override
        public void removeAttribute(String name) {
            this.delegate.removeAttribute(name);
        }

        @Override
        public void setServletContextName(String servletContextName) {
            this.delegate.setServletContextName(servletContextName);
        }

        @Override
        public String getServletContextName() {
            return this.delegate.getServletContextName();
        }

        @Override
        public boolean equals(Object arg0) {
            return this.delegate.equals(arg0);
        }

        @Override
        public Object getAttribute(String name) {
            return this.delegate.getAttribute(name);
        }

        @Override
        public Enumeration<String> getAttributeNames() {
            return this.delegate.getAttributeNames();
        }

        @Override
        public int hashCode() {
            return this.delegate.hashCode();
        }

        @Override
        public void log(String message) {
            this.delegate.log(message);
        }

        @Override
        public void log(Exception ex, String message) {
            this.delegate.log(ex, message);
        }

        @Override
        public void log(String message, Throwable ex) {
            this.delegate.log(message, ex);
        }

        @Override
        public String toString() {
            return this.delegate.toString();
        }
    }
}
