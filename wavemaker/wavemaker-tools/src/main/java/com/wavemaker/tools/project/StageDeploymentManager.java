
package com.wavemaker.tools.project;

import com.wavemaker.tools.io.*;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.zip.ZipArchive;
import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.io.local.LocalFile;
import com.wavemaker.tools.deployment.cloudfoundry.WebAppAssembler;
import com.wavemaker.tools.ant.*;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.ClassLoaderUtils;

import java.util.Map;
import java.util.HashMap;
import java.io.*;

import org.apache.tools.ant.taskdefs.Ear;
import org.apache.tools.ant.taskdefs.War;
import org.apache.tools.ant.types.FileSet;
import org.apache.tools.ant.*;
import org.apache.tools.ant.Project;
import org.apache.catalina.ant.UndeployTask;
import org.springframework.core.io.Resource;

/**
 * Execute various deployment tasks.
 * 
 * @author Seung Lee
 */

public abstract class StageDeploymentManager extends AbstractDeploymentManager {

    protected static final String PROJECT_DIR_PROPERTY = "project.dir";

    protected static final String ORIG_PROJ_DIR_PROPERTY = "orig.proj.dir";

    protected static final String PROJECT_NAME_PROPERTY = "project.name";

    protected static final String PROJECT_ENCODING_PROPERTY = "project.encoding";

    protected static final String TOMCAT_HOST_PROPERTY = "tomcat.host";

    protected static final String TOMCAT_PORT_PROPERTY = "tomcat.port";

    protected static final String DEPLOY_NAME_PROPERTY = "deploy.name";

    protected static final String STUDIO_WEBAPPROOT_PROPERTY = "studio.webapproot.dir";

    protected static final String WAR_FILE_NAME_PROPERTY = "war.file.name";

    protected static final String EAR_FILE_NAME_PROPERTY = "ear.file.name";

    public static final String CUSTOM_WM_DIR_NAME_PROPERTY = "custom.wm.dir";

    protected static final String BUILD_WEBAPPROOT_PROPERTY = "build.app.webapproot.dir";

    protected static final String WAVEMAKER_HOME = "wavemaker.home";

    protected boolean appXmlExists = false;

    protected void buildWar(LocalFolder projectDir, LocalFolder buildDir, File warFile, boolean includeEar,
                            ProjectManager origProjMgr,
                         StudioFileSystem fileSystem) throws WMRuntimeException {  //projectDir: dplstaging  //buildDir: fileutils
        String warFileName = warFile.getName();
        Folder archiveFolder = warFile.getParent();
        int len = warFileName.length();
        String earFileName = warFileName.substring(0, len - 4) + ".ear";
        File earFile = archiveFolder.getFile(earFileName);
        Map<String, Object> properties = new HashMap<String, Object>();
        properties.put(BUILD_WEBAPPROOT_PROPERTY, buildDir);
        properties.put(WAR_FILE_NAME_PROPERTY, warFile);
        properties.put(EAR_FILE_NAME_PROPERTY, earFile);
        properties.put(CUSTOM_WM_DIR_NAME_PROPERTY, AbstractStudioFileSystem.COMMON_DIR);

        Folder projFolder = origProjMgr.getCurrentProject().getRootFolder();
        properties.put(ORIG_PROJ_DIR_PROPERTY, projFolder);
        File appXml = projFolder.getFile("webapproot/WEB-INF/application.xml");
        this.appXmlExists = appXml.exists();

        Folder wavemakerHome;
        wavemakerHome = this.fileSystem.getWaveMakerHomeFolder();

        properties.put(WAVEMAKER_HOME, wavemakerHome);

        properties.put(PROJECT_DIR_PROPERTY, projectDir);
        properties.put(DEPLOY_NAME_PROPERTY, projectDir.getName());

        properties = addMoreProperties(projectDir, null, properties);

        LocalFile warF = buildWar(properties);

        if (includeEar) {
            assembleEar(properties, warF);
        }
    }

    public LocalFile buildWar(Map<String, Object> properties) {

        build(properties);
        
        //copy js files
        LocalFolder buildAppWebAppRoot = (LocalFolder)properties.get(BUILD_WEBAPPROOT_PROPERTY);
        Folder studioWebAppRoot = (Folder)properties.get(STUDIO_WEBAPPROOT_PROPERTY);
        String customWmDir = (String)properties.get(CUSTOM_WM_DIR_NAME_PROPERTY);
        //TODO:ant - following excluded filter does not seem to work.  maybe a bug in FilterOn for ant style?
        com.wavemaker.tools.io.ResourceFilter excluded = FilterOn.antPattern("/dojo/util/**", "/dojo/**/tests/**", "/wm/" + customWmDir + "/**");
        studioWebAppRoot.getFolder("lib").find().exclude(excluded).files().copyTo(buildAppWebAppRoot.getFolder("lib"));

        //copy custom widgets
        Folder wavemakerHome = (Folder)properties.get(WAVEMAKER_HOME);
        com.wavemaker.tools.io.ResourceFilter included = FilterOn.antPattern(customWmDir + "/**");
        excluded = FilterOn.antPattern(customWmDir + "/**/deployments.js");
        wavemakerHome.find().include(included).exclude(excluded).files().copyTo(buildAppWebAppRoot.getFolder("lib/wm"));
        
        //modify wavemaker token in .html and config.js
        WebAppAssembler.modifyApplicationBaseFolder(buildAppWebAppRoot);
        buildAppWebAppRoot.find().include(FilterOn.antPattern("*.html")).files().performOperation(new Replace("\"/wavemaker/app/", "\""));
        buildAppWebAppRoot.find().include(FilterOn.antPattern("*.html")).files().performOperation(new Replace("\"/wavemaker", "\""));
        buildAppWebAppRoot.getFile("config.js").performOperation(new Replace("\"../wavemaker/", "\""));
        buildAppWebAppRoot.getFile("config.js").performOperation(new Replace("\"/wavemaker/", "\""));

        //assemble WAR
        //InputStream is = ZipArchive.compress(buildAppWebAppRoot);
        //com.wavemaker.tools.io.File warFile = (com.wavemaker.tools.io.File)properties.get(WAR_FILE_NAME_PROPERTY);
        //OutputStream os = warFile.getContent().asOutputStream();
        /*try {
            IOUtils.copy(is, os);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        } finally {
            try {
                is.close();
                os.close();
            } catch (IOException ignore) {
            }
        }*/

        return assembleWar(properties);
    }

    protected LocalFile assembleWar(Map<String, Object> properties) {
        return null;
    }

    protected void assembleEar(Map<String, Object> properties, LocalFile warFile) {

    }

    public void build(Map<String, Object> properties) {
        copyJars(properties);
        copyResources(properties);
        generateRuntimeFiles(properties);
        compile1();
    }

    public void copyJars(Map<String, Object> properties) {
        prepareWebAppRoot(properties);
        undeploy(properties);

        //CopyRuntimeJarsTask
        NewCopyRuntimeJarsTask task = new NewCopyRuntimeJarsTask();
        LocalFolder buildWebAppLibDir = (LocalFolder)((Folder)properties.get(BUILD_WEBAPPROOT_PROPERTY)).getFolder("WEB-INF/lib");
        task.setTodir(buildWebAppLibDir);
        LocalFolder studioWebAppLibDir = (LocalFolder)((Folder)properties.get(STUDIO_WEBAPPROOT_PROPERTY)).getFolder("WEB-INF/lib");
        task.setFrom(studioWebAppLibDir);
        task.setPreserveLastModified(true);
        task.setOverwrite(false);
        task.setVerbose(false);
        //TODO: research needed
        //task.setClasspathRef();

        LocalFolder projectRoot = (LocalFolder)properties.get(PROJECT_DIR_PROPERTY);
        task.setProjectRoot(projectRoot.getLocalFile());
        task.execute();
    }

    public void copyResources(Map<String, Object> properties) { //done
        LocalFolder projectRoot = (LocalFolder)properties.get(PROJECT_DIR_PROPERTY);
        LocalFolder projClassFolder =
                (LocalFolder)((Folder)properties.get(BUILD_WEBAPPROOT_PROPERTY)).getFolder("WEB-INF").getFolder("classes");
        projectRoot.getFolder("src").find().exclude(FilterOn.names().ending(".java")).files().copyTo(projClassFolder);

        for (Folder serviceFolder : projectRoot.getFolder("services").list().folders()) {
            serviceFolder.getFolder("src").find().exclude(FilterOn.names().ending(".java")).files().copyTo(projClassFolder);
        }
    }

    public void generateRuntimeFiles(Map<String, Object> properties) {
        generateWebxml(properties);

        //ConfigurationCompilerTask
        ConfigurationCompilerTask task = new ConfigurationCompilerTask();
        LocalFolder buildAppWebAppRoot = (LocalFolder)properties.get(BUILD_WEBAPPROOT_PROPERTY);

        LocalFolder projectRoot = (LocalFolder)properties.get(PROJECT_DIR_PROPERTY);
        com.wavemaker.tools.io.ResourceFilter included = FilterOn.antPattern("services/*/designtime/servicedef.xml");
        Resources<File> files = projectRoot.find().include(included).files();
        for (File file : files) {
            task.addWmResource(file);
        }

        task.setDestWebAppRoot(buildAppWebAppRoot.getLocalFile());
        task.setVerbose(true);

        task.execute();        
        
        //ServiceCompilerTask
        ServiceCompilerTask task1 = new ServiceCompilerTask();
        task1.setProjectRoot(projectRoot.getLocalFile());

        task1.execute();
    }

    public void generateWebxml(Map<String, Object> properties) {
        if (this.appXmlExists) {
            modifyApplicationXml(properties);
        }
        InputStream is = ClassLoaderUtils.getResourceAsStream("com/wavemaker/tools/project/web.xml");
        LocalFolder webInf = (LocalFolder)((Folder)properties.get(BUILD_WEBAPPROOT_PROPERTY)).getFolder("WEB-INF");
        File webXml = webInf.getFile("web.xml");
        OutputStream os = webXml.getContent().asOutputStream();
        try {
            IOUtils.copy(is, os);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        } finally {
            try {
                is.close();
                os.close();
            } catch (IOException e) {}
        }

        MergeUserWebXmlTask task = new MergeUserWebXmlTask();
        task.setWorkdir(webInf.toString());
    }

    private void modifyApplicationXml(Map<String, Object> properties) {
        File appXml = ((Folder)properties.get(BUILD_WEBAPPROOT_PROPERTY)).getFile("WEB-INF/application.xml");
        String deployName = (String)properties.get(DEPLOY_NAME_PROPERTY);
        String content = appXml.getContent().asString();
        content = content.replace("{applicationName}", deployName);
        appXml.getContent().write(content);
    }

    public void prepareWebAppRoot(Map<String, Object> properties) { //done
        LocalFolder buildAppWebAppRoot = (LocalFolder)properties.get(BUILD_WEBAPPROOT_PROPERTY);
        LocalFolder appWebAppRoot = (LocalFolder)((Folder)properties.get(PROJECT_DIR_PROPERTY)).getFolder("webapproot");
        com.wavemaker.tools.io.ResourceFilter excluded = FilterOn.antPattern("**/.svn/**/*.*", "WEB-INF/classes/**", "WEB-INF/lib/**", "WEB-INF/web.xml");
        appWebAppRoot.find().exclude(excluded).files().copyTo(buildAppWebAppRoot);

        buildAppWebAppRoot.getFolder("WEB-INF/classes").createIfMissing();
        buildAppWebAppRoot.getFolder("WEB-INF/lib").createIfMissing();
        buildAppWebAppRoot.getFolder("services").createIfMissing();

        com.wavemaker.tools.io.ResourceFilter included = FilterOn.antPattern("WEB-INF/classes/*.spring.xml");
        appWebAppRoot.find().include(included).files().copyTo(buildAppWebAppRoot);
    }

    public void undeploy(Map<String, Object> properties) {
        UndeployTask task = new UndeployTask();
        String host = (String)properties.get(TOMCAT_HOST_PROPERTY);
        String port = (String)properties.get(TOMCAT_PORT_PROPERTY);
        String userName = (String)properties.get("tomcat.manager.username");
        String password = (String)properties.get("tomcat.manager.password");
        String tomcatManagerUrl =  "http://" + host + ":" + port + "/manager";
        String deployName = (String)properties.get(DEPLOY_NAME_PROPERTY);
        task.setUrl(tomcatManagerUrl);
        task.setUsername(userName);
        task.setPassword(password);
        task.setPath("/" + deployName);
        try {
            task.execute();
        } catch (Exception ex) {
        } 
        File tomcatConfigXml = ((Folder)properties.get(PROJECT_DIR_PROPERTY)).getFile(deployName + ".xml");
        tomcatConfigXml.delete();
    }

    public String compile1() {
        return this.projectCompiler.compile();
    }

    protected Map<String, Object> addMoreProperties(LocalFolder projectDir, String deployName, Map<String, Object> properties) {
        return properties;
    }

    private static class Replace implements ResourceOperation<com.wavemaker.tools.io.File> {
        private String fromExpression;
        private String toExpression;
        public Replace(String fromExpression, String toExpression) {
            this.fromExpression = fromExpression;
            this.toExpression = toExpression;
        }

        @Override
        public void perform(com.wavemaker.tools.io.File file) {
            String content = file.getContent().asString();
            content = content.replace(this.fromExpression, this.toExpression);
            file.getContent().write(content);
        }        
    }
}
