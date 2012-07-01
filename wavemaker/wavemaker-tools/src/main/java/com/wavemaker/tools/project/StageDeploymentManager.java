
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

    private static final String PROJECT_DIR_PROPERTY = "project.dir";

    private static final String ORIG_PROJ_DIR_PROPERTY = "orig.proj.dir";

    private static final String PROJECT_NAME_PROPERTY = "project.name";

    private static final String PROJECT_ENCODING_PROPERTY = "project.encoding";

    private static final String TOMCAT_HOST_PROPERTY = "tomcat.host";

    private static final String TOMCAT_PORT_PROPERTY = "tomcat.port";

    private static final String DEPLOY_NAME_PROPERTY = "deploy.name";

    private static final String STUDIO_WEBAPPROOT_PROPERTY = "studio.webapproot.dir";

    private static final String WAR_FILE_NAME_PROPERTY = "war.file.name";

    private static final String EAR_FILE_NAME_PROPERTY = "ear.file.name";

    public static final String CUSTOM_WM_DIR_NAME_PROPERTY = "custom.wm.dir";

    private static final String BUILD_WEBAPPROOT_PROPERTY = "build.app.webapproot.dir";

    private static final String WAVEMAKER_HOME = "wavemaker.home";

    private boolean appXmlExists = false;

    public void buildWar(LocalFolder projectDir, LocalFolder buildDir, LocalFile warFile, boolean includeEar,
                         StudioFileSystem fileSystem) throws WMRuntimeException {  //projectDir: dplstaging  //buildDir: fileutils
        String warFileName = warFile.getName();
        LocalFolder archiveFolder = (LocalFolder)warFile.getParent();
        int len = warFileName.length();
        String earFileName = warFileName.substring(0, len - 4) + ".ear";
        LocalFile earFile = (LocalFile)archiveFolder.getFile(earFileName);
        Map<String, Object> properties = new HashMap<String, Object>();
        properties.put(BUILD_WEBAPPROOT_PROPERTY, buildDir);
        properties.put(WAR_FILE_NAME_PROPERTY, warFile);
        properties.put(EAR_FILE_NAME_PROPERTY, earFile);
        properties.put(CUSTOM_WM_DIR_NAME_PROPERTY, AbstractStudioFileSystem.COMMON_DIR);

        java.io.File projDir = warFile.getLocalFile().getParentFile().getParentFile();
        Folder projFolder = new LocalFolder(projDir);
        properties.put(ORIG_PROJ_DIR_PROPERTY, projDir);
        File appXml = projFolder.getFile("webapproot/WEB-INF/application.xml");
        this.appXmlExists = appXml.exists();

        LocalFolder wavemakerHome;
        try {
            wavemakerHome = new LocalFolder(fileSystem.getWaveMakerHome().getFile());
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
        properties.put(WAVEMAKER_HOME, wavemakerHome);

        properties.put(PROJECT_DIR_PROPERTY, projectDir);
        properties.put(DEPLOY_NAME_PROPERTY, projectDir.getName());

        properties = addMoreProperties(projectDir, null, properties);

        buildWar(properties);

        if (includeEar) {
            buildEar(properties);
        }
    }

    public void buildWar(Map<String, Object> properties) {

        build(properties);
        
        //copy js files
        LocalFolder buildAppWebAppRoot = (LocalFolder)properties.get(BUILD_WEBAPPROOT_PROPERTY);
        LocalFolder studioWebAppRoot = (LocalFolder)properties.get(STUDIO_WEBAPPROOT_PROPERTY);
        String customWmDir = (String)properties.get(CUSTOM_WM_DIR_NAME_PROPERTY);
        com.wavemaker.tools.io.ResourceFilter excluded = FilterOn.antPattern("/dojo/util/**", "/dojo/**/tests/**", "/wm/" + customWmDir + "/**");
        studioWebAppRoot.getFolder("lib").find().exclude(excluded).files().copyTo(buildAppWebAppRoot.getFolder("lib"));

        //copy custom widgets
        LocalFolder wavemakerHome = (LocalFolder)properties.get(WAVEMAKER_HOME);
        excluded = FilterOn.antPattern(customWmDir + "/**");
        com.wavemaker.tools.io.ResourceFilter included = FilterOn.antPattern(customWmDir + "/**/deployments.js");
        studioWebAppRoot.getFolder("lib").find().include(included).exclude(excluded).files().copyTo(buildAppWebAppRoot.getFolder("lib"));
        
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

        War warTask = new War();
        warTask.setBasedir(buildAppWebAppRoot.getLocalFile());
        warTask.setDestFile(((LocalFile)properties.get(WAR_FILE_NAME_PROPERTY)).getLocalFile());
        warTask.setExcludes("**/application.xml, **/*.documentation.json");
        org.apache.tools.ant.Project ant = new Project();
        warTask.setProject(ant);
        warTask.execute();
    }

    public void buildEar(Map<String, Object> properties) {
        Ear ear = new Ear();
        FileSet fs = new FileSet();
        LocalFile warFile = (LocalFile)properties.get(WAR_FILE_NAME_PROPERTY);
        fs.setFile(warFile.getLocalFile());
        LocalFile earFile = (LocalFile)properties.get(EAR_FILE_NAME_PROPERTY);
        ear.setDestFile(earFile.getLocalFile());
        LocalFolder webInf = (LocalFolder)((Folder)properties.get(BUILD_WEBAPPROOT_PROPERTY)).getFolder("WEB-INF");
        LocalFile appXml = (LocalFile)webInf.getFile("application.xml");
        ear.setAppxml(appXml.getLocalFile());
        ear.execute();
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

    private Map<String, Object> addMoreProperties(LocalFolder projectDir, String deployName, Map<String, Object> properties) {

        StudioFileSystem fileSystem = this.projectManager.getFileSystem();
        Map<String, Object> newProperties = new HashMap<String, Object>();

        if (getProjectManager() != null && getProjectManager().getCurrentProject() != null) {
            newProperties.put(PROJECT_ENCODING_PROPERTY, getProjectManager().getCurrentProject().getEncoding());
        }

        newProperties.put(TOMCAT_HOST_PROPERTY, getStudioConfiguration().getTomcatHost());
        System.setProperty("wm.proj." + TOMCAT_HOST_PROPERTY, getStudioConfiguration().getTomcatHost());

        newProperties.put(TOMCAT_PORT_PROPERTY, getStudioConfiguration().getTomcatPort() + "");
        System.setProperty("wm.proj." + TOMCAT_PORT_PROPERTY, getStudioConfiguration().getTomcatPort() + "");

        newProperties.put("tomcat.manager.username", getStudioConfiguration().getTomcatManagerUsername());
        System.setProperty("wm.proj.tomcat.manager.username", getStudioConfiguration().getTomcatManagerUsername());

        newProperties.put("tomcat.manager.password", getStudioConfiguration().getTomcatManagerPassword());
        System.setProperty("wm.proj.tomcat.manager.password", getStudioConfiguration().getTomcatManagerPassword());

        newProperties.putAll(properties);

        try {
            newProperties.put(STUDIO_WEBAPPROOT_PROPERTY, new LocalFolder(fileSystem.getStudioWebAppRoot().getFile()));
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        newProperties.put(PROJECT_DIR_PROPERTY, projectDir);

        Resource projectDirFile = fileSystem.getResourceForURI(projectDir.getLocalFile().getAbsolutePath());
        String projectName = projectDirFile.getFilename();
        newProperties.put(PROJECT_NAME_PROPERTY, projectName);

        if (deployName != null) {
            newProperties.put(DEPLOY_NAME_PROPERTY, deployName);
            System.setProperty("wm.proj." + DEPLOY_NAME_PROPERTY, deployName);
        }

        return newProperties;
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
