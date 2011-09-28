/*
 * Copyright (C) 2007-2008 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.wavemaker.studio.infra;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletContextEvent;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.util.StringUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.test.SpringTestCase;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.LocalStudioConfiguration;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
@ContextConfiguration(locations={"webapp:/WEB-INF/studio-services.xml","webapp:/WEB-INF/studio-managers.xml","webapp:/WEB-INF/studio-security.xml",
        "webapp:/WEB-INF/studio-controllers.xml"}, loader=StudioTestCaseContextSupport.class)
public abstract class StudioTestCase extends SpringTestCase {
    
    public static final String INDEX_HTML_TEXT = "<html>\n<body>\nHello, world!\n</body>\n<a href=\"/wavemaker/lib/wm/base/boot/lib_wm.js\">foo</a></html>\n";
    public static final String INDEX_HTML_TEXT_EXPECTED = "<html>\n<body>\nHello, world!\n</body>\n<a href=\"lib/wm/base/boot/lib_wm.js\">foo</a></html>\n";

    public static final String FOO_PROPS_CONTENTS = "a=b";

    private File wmHome;

    private HttpSession httpSession;

    public File getTestWaveMakerHome() {
        return wmHome;
    }

    @Override
    protected HttpSession getHttpSession() {
        return this.httpSession;
    }

    @Before
    public void setUp() throws Exception {

        try {
            this.wmHome = IOUtils.createTempDirectory("testDirFor_"
                    + getClass().getName(), ".tmp/");
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }

        LocalStudioConfiguration config = (LocalStudioConfiguration) getBean("studioConfiguration");
        config.setTestWaveMakerHome(wmHome);
        assertTrue(config.getWaveMakerHome().exists());
        Assert.assertEquals(wmHome.getPath(), config.getWaveMakerHome().getFile().getPath());
        assertTrue(config.getProjectsDir().exists());
        
        MockServletContext mockContext = new MockServletContext(){

			@Override
			public String getMimeType(String filePath) {
				if (StringUtils.getFilenameExtension(filePath).equals(".smd")) {
					return "application/json";
				}
				return super.getMimeType(filePath);
			}
        	
        };
        mockContext.setServletContextName("wavemaker");
        WMAppContext.getInstance(new ServletContextEvent(mockContext));

        this.httpSession = new MockHttpSession();
    }

    @After
    public void tearDown() throws Exception {
        if (null != wmHome && wmHome.exists()) {
            IOUtils.deleteRecursive(wmHome);
        }
    }
    
    protected void populateProject(File projectRoot) {
        populateProject(projectRoot, false);
    }

    protected void populateProject(File projectRoot, boolean addWebXml) {
        
        try {
            File webapproot = new File(projectRoot, "webapproot");
            FileUtils.forceMkdir(webapproot);
            File indexHtml = new File(webapproot, "index.html");
            FileUtils.writeStringToFile(indexHtml, INDEX_HTML_TEXT);
            FileUtils.writeStringToFile(new File(webapproot, "login.html"),
                    INDEX_HTML_TEXT);
            
            if (addWebXml) {
                File webinf = new File(webapproot, "WEB-INF");
                FileUtils.forceMkdir(webinf);
                File webxml = new File(webinf, ProjectConstants.WEB_XML);
                
                // The code path executed by TestDataModelDeploymentConfiguration
                // depends on a standalone closing web-app element
                FileUtils.writeStringToFile(webxml, "<web-app>\n</web-app>");
            }

            File serviceFile = new File(projectRoot,
                    "services/aservice/src/foo.properties");
            FileUtils.forceMkdir(serviceFile.getParentFile());
            FileUtils.writeStringToFile(serviceFile, FOO_PROPS_CONTENTS);

            File wmDir = new File(getTestWaveMakerHome(),
                    LocalStudioConfiguration.COMMON_DIR);
            File wmFile = new File(wmDir, "foo.txt");
            wmDir.mkdir();
            FileUtils.writeStringToFile(wmFile, "some data");

        } catch (IOException ex) {
            throw new AssertionError(ex);
        }
    }

    /**
     * Make a project, return the project's root directory.
     */
    protected File makeProject(String projectName) throws Exception {

        return makeProject(projectName, true);
    }

    protected File makeProject(String projectName, boolean noTemplate)
            throws Exception {

        File expectedPath = new File(new File(getTestWaveMakerHome(),
                LocalStudioConfiguration.PROJECTS_DIR), projectName);
        assertFalse(expectedPath.exists());

        String op = noTemplate ? "newProjectNoTemplate" : "newProject";

        Object o = invokeService_toObject("studioService", op,
                new Object[] { projectName });

        assertTrue("failed to create project: " + expectedPath, expectedPath
                .exists());

        Object getWebPathRet = invokeService_toObject("studioService",
                "getWebPath", null);

        Assert.assertEquals(getWebPathRet, o);

        // make a dummy request, set our port to 8080 -
        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setServerPort(LocalStudioConfiguration.TOMCAT_PORT_DEFAULT);
        RuntimeAccess.getInstance().setRequest(req);

        return expectedPath;
    }
    
    private static final class TestResourceLoader implements ResourceLoader {

        private final ApplicationContext context;
        
        private final FileSystemResource webapproot = new FileSystemResource("webapproot/");
        
        public TestResourceLoader(GenericApplicationContext ctx) {
            this.context = ctx;
        }

        public ClassLoader getClassLoader() {
            return this.context.getClassLoader();
        }

        public Resource getResource(String resource) {
            //Try to load from webapproot first, otherwise fall back to ApplicationContext
            FileSystemResource resourceToLoad = (FileSystemResource) webapproot.createRelative(resource.replaceFirst("/", ""));
            if (resourceToLoad.exists()) {
                return resourceToLoad;
            } else {
                return context.getResource(resource);
            }
        }

    }
}