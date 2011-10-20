
package com.wavemaker.tools.deployment.cloudfoundry;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.IOException;
import java.util.Collections;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.cloudfoundry.client.lib.CloudApplication;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.annotation.IfProfileValue;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.StringUtils;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.deployment.cloudfoundry.LoggingStatusCallback.Timer;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ResourceManager;

@RunWith(SpringJUnit4ClassRunner.class)
@IfProfileValue(name = "spring.profiles", value = "cloud-test")
@TestExecutionListeners({})
public class TestStudioCloudFoundryClient {

    private static final Log log = LogFactory.getLog(TestStudioCloudFoundryClient.class);

    private static final String TEST_USER_EMAIL = System.getProperty("vcap.email");

    private static final String TEST_USER_PASS = System.getProperty("vcap.passwd");

    private final MockServletContext servletContext = new MockServletContext("classpath:com/wavemaker/tools/deployment/cloudfoundry/studioroot");

    private final LocalStudioConfiguration studioConfiguration = new LocalStudioConfiguration();

    private Project project;

    @BeforeClass
    public static void init() throws Exception {
        if (!StringUtils.hasText(TEST_USER_EMAIL)) {
            fail("System property vcap.email must be specified, supply -Dvcap.email=<email>");
        }
        if (!StringUtils.hasText(TEST_USER_PASS)) {
            fail("System property vcap.passwd must be specified, supply -Dvcap.passwd=<password>");
        }
        RuntimeAccess.setRuntimeBean(new RuntimeAccess());
    }

    @Before
    public void setUp() throws IOException {
        Resource wmHome = this.studioConfiguration.createTempDir();
        this.studioConfiguration.setTestWaveMakerHome(wmHome.getFile());
        this.studioConfiguration.setServletContext(this.servletContext);
        Resource projectsDir = wmHome.createRelative("projects/");
        Resource zipProject = this.studioConfiguration.copyFile(projectsDir, new ClassPathResource(
            "com/wavemaker/tools/deployment/cloudfoundry/javaservicesproject.zip").getInputStream(), "javaservicesproject.zip");
        ResourceManager.unzipFile(this.studioConfiguration, zipProject);
        this.project = new Project(projectsDir.createRelative("javaservicesproject/"), this.studioConfiguration);
        assertTrue(this.project.getProjectRoot().exists());

    }

    @After
    public void tearDown() throws IOException {
        this.project.deleteFile(this.project.getProjectRoot());
    }

    @Test
    public void testUploadProject() throws IOException {
        StudioCloudFoundryClient client = new StudioCloudFoundryClient(TEST_USER_EMAIL, TEST_USER_PASS, "http://api.wmtest.cloudfoundry.me");
        client.login();
        client.createApplication(this.project.getProjectName(), CloudApplication.SPRING, client.getDefaultApplicationMemory(CloudApplication.SPRING),
            Collections.singletonList("http://" + this.project.getProjectName() + ".wmtest.cloudfoundry.me"), null, true);
        Timer timer = new Timer();
        client.uploadProject(this.project.getProjectName(), this.project, new LoggingStatusCallback(timer));
        log.info("Upload took " + timer.stop() + "ms");
        client.startApplication(this.project.getProjectName());

        String classFile = client.getFile(this.project.getProjectName(), 0, "tomcat/webapps/ROOT/WEB-INF/classes/com/foo/FooService.class");
        assertTrue(classFile.length() > 0);

        String jarFile = client.getFile(this.project.getProjectName(), 0, "tomcat/webapps/ROOT/WEB-INF/lib/testlib.jar");
        assertTrue(jarFile.length() > 0);

        String jsFile = client.getFile(this.project.getProjectName(), 0, "tomcat/webapps/ROOT/lib/testjsfile.js");
        assertTrue(jsFile.length() > 0);

        client.stopApplication(this.project.getProjectName());

        client.deleteApplication(this.project.getProjectName());
    }

}
