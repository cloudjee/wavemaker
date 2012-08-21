//

package com.wavemaker.tools.project;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.catalina.ant.DeployTask;
import org.apache.catalina.ant.UndeployTask;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.tools.ant.ConfigurationCompilerTask;
import com.wavemaker.tools.ant.MergeUserWebXmlTask;
import com.wavemaker.tools.ant.NewCopyRuntimeJarsTask;
import com.wavemaker.tools.ant.ServiceCompilerTask;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.FilterOn;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.ResourceFilter;
import com.wavemaker.tools.io.ResourceOperation;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.io.local.LocalFile;
import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.io.zip.ZipArchive;

/**
 * Replaces ant script tasks that generate war and ear file
 * 
 * @author Seung Lee
 */
public abstract class StageDeploymentManager extends AbstractDeploymentManager {

    protected static final String PROJECT_DIR_PROPERTY = "project.dir";

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

    private static final ResourceFilter DEFAULT_EXCLUDES = FilterOn.antPattern("**/.svn/**");

    protected void buildWar(LocalFolder projectDir, Folder buildDir, File warFile, boolean includeEar, StudioFileSystem fileSystem)
        throws WMRuntimeException { // projectDir: dplstaging //buildDir: fileutils

        Map<String, Object> properties = setProperties(projectDir, buildDir, warFile);

        File warF;
        try {
            warF = buildWar(properties);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        if (includeEar) {
            assembleEar(properties, warF);
        }
    }

    protected Map<String, Object> setProperties(LocalFolder projectDir) {
        Folder buildDir = getProjectDir().getFolder("webapproot");
        File warFile = getProjectDir().getFolder("dist").getFile(getDeployName() + ".war");
        return setProperties(projectDir, buildDir, warFile);
    }

    private Map<String, Object> setProperties(LocalFolder projectDir, Folder buildDir, File warFile) {
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
        properties.put(DEPLOY_NAME_PROPERTY, this.origProjMgr == null ? getDeployName() : this.origProjMgr.getCurrentProject().getProjectName());
        properties.put(WAVEMAKER_HOME, this.fileSystem.getWaveMakerHomeFolder());
        properties.put(PROJECT_DIR_PROPERTY, projectDir);
        properties = addMoreProperties(projectDir, null, properties);
        this.buildInLine = buildDir.equals(projectDir.getFolder("webapproot"));
        return properties;
    }

    public File buildWar(Map<String, Object> properties) throws IOException {

        build(properties);

        String customWmDir = (String) properties.get(CUSTOM_WM_DIR_NAME_PROPERTY);
        LocalFolder buildAppWebAppRoot = (LocalFolder) properties.get(BUILD_WEBAPPROOT_PROPERTY);
        copyCustomFiles(buildAppWebAppRoot, getFileSystem(), customWmDir);

        // modify wavemaker token in .html and config.js
        modifyApplicationBaseFolder(buildAppWebAppRoot);

        return assembleWar(properties);
    }

    private static void modifyApplicationBaseFolder(Folder webAppRoot) {
        webAppRoot.list().include(FilterOn.antPattern("*.html")).files().performOperation(new Replace("\"/wavemaker/app/", "\""));
        webAppRoot.list().include(FilterOn.antPattern("*.html")).files().performOperation(new Replace("\"/wavemaker/", "\""));
        webAppRoot.getFile("config.js").performOperation(new Replace("\"../wavemaker/", "\""));
        webAppRoot.getFile("config.js").performOperation(new Replace("\"/wavemaker/", "\""));
    }

    public static void copyCustomFiles(Folder webAppRoot, StudioFileSystem fileSystem, String customDir) throws IOException {

        Folder studioWebAppRoot = fileSystem.getStudioWebAppRootFolder();
        com.wavemaker.tools.io.ResourceFilter excluded = FilterOn.antPattern("wm/" + customDir + "/**", "dojo/util/**", "dojo/**/tests/**");
        studioWebAppRoot.getFolder("lib").find().exclude(excluded).exclude(DEFAULT_EXCLUDES).files().copyTo(webAppRoot.getFolder("lib"));

        Folder wavemakerHome = fileSystem.getWaveMakerHomeFolder();
        com.wavemaker.tools.io.ResourceFilter included = FilterOn.antPattern(customDir + "/**");
        excluded = FilterOn.antPattern(customDir + "/**/deployments.js");
        wavemakerHome.find().include(included).exclude(excluded).exclude(DEFAULT_EXCLUDES).files().copyTo(webAppRoot.getFolder("lib/wm"));
    }

    protected com.wavemaker.tools.io.File assembleWar(Map<String, Object> properties) {
        Folder buildAppWebAppRoot = (Folder) properties.get(BUILD_WEBAPPROOT_PROPERTY);
        com.wavemaker.tools.io.ResourceFilter excluded = FilterOn.antPattern("**/application.xml", "**/*.documentation.json");
        Resources<com.wavemaker.tools.io.File> files = buildAppWebAppRoot.find().exclude(excluded).exclude(DEFAULT_EXCLUDES).files();
        InputStream is = ZipArchive.compress(files);
        com.wavemaker.tools.io.File warFile = (com.wavemaker.tools.io.File) properties.get(WAR_FILE_NAME_PROPERTY);
        OutputStream os = warFile.getContent().asOutputStream();
        try {
            com.wavemaker.common.util.IOUtils.copy(is, os);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        } finally {
            try {
                is.close();
                os.close();
            } catch (IOException ignore) {
            }
        }

        return warFile;
    }

    protected void assembleEar(Map<String, Object> properties, com.wavemaker.tools.io.File warFile) {
        ZipOutputStream out;
        InputStream is;
        try {
            com.wavemaker.tools.io.File earFile = (com.wavemaker.tools.io.File) properties.get(EAR_FILE_NAME_PROPERTY);
            out = new ZipOutputStream(earFile.getContent().asOutputStream());
            out.putNextEntry(new ZipEntry(warFile.getName()));
            is = warFile.getContent().asInputStream();
            org.apache.commons.io.IOUtils.copy(is, out);
            out.closeEntry();
            is.close();

            Folder webInf = ((Folder) properties.get(BUILD_WEBAPPROOT_PROPERTY)).getFolder("WEB-INF");
            com.wavemaker.tools.io.File appXml = webInf.getFile("application.xml");
            out.putNextEntry(new ZipEntry("META-INF/" + appXml.getName()));
            is = appXml.getContent().asInputStream();
            org.apache.commons.io.IOUtils.copy(is, out);
            out.closeEntry();
            is.close();

            String maniFest = "Manifest-Version: 1.0\n" + "Created-By: WaveMaker Studio (VMware Inc.)";
            out.putNextEntry(new ZipEntry("META-INF/MANIFEST.MF"));
            org.apache.commons.io.IOUtils.write(maniFest, out);
            out.closeEntry();
            is.close();
            out.close();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public String build(Map<String, Object> properties) {
        copyJars(properties);
        copyResources(properties);
        generateRuntimeFiles(properties);
        LocalFolder buildAppWebAppRoot = (LocalFolder) properties.get(BUILD_WEBAPPROOT_PROPERTY);
        LocalFolder projectRoot = (LocalFolder) properties.get(PROJECT_DIR_PROPERTY);

        Folder destDir = buildAppWebAppRoot.getFolder("WEB-INF/classes");
        return this.projectCompiler.compile(projectRoot.getFolder(ProjectConstants.WEB_DIR), Project.getSourceFolders(projectRoot, false), destDir,
            this.projectCompiler.getClasspath(projectRoot));
    }

    public void copyJars(Map<String, Object> properties) {
        prepareWebAppRoot(properties);
        undeploy(properties);

        LocalFolder buildWebAppRoot = (LocalFolder) properties.get(BUILD_WEBAPPROOT_PROPERTY);
        LocalFolder buildWebAppLibDir = (LocalFolder) buildWebAppRoot.getFolder("WEB-INF/lib");
        LocalFolder buildWebAppClassesDir = (LocalFolder) buildWebAppRoot.getFolder("WEB-INF/lib");
        buildWebAppLibDir.createIfMissing();
        buildWebAppClassesDir.createIfMissing();

        // CopyRuntimeJarsTask
        NewCopyRuntimeJarsTask task = new NewCopyRuntimeJarsTask();
        task.setTodir(buildWebAppLibDir);
        LocalFolder studioWebAppLibDir = (LocalFolder) ((Folder) properties.get(STUDIO_WEBAPPROOT_PROPERTY)).getFolder("WEB-INF/lib");
        task.setFrom(studioWebAppLibDir);
        task.setPreserveLastModified(true);
        task.setOverwrite(false);
        task.setVerbose(false);
        // TODO:ant - research needed
        // task.setClasspathRef();

        LocalFolder projectRoot = (LocalFolder) properties.get(PROJECT_DIR_PROPERTY);
        task.setProjectRoot(projectRoot.getLocalFile());
        task.execute();
    }

    public void copyResources(Map<String, Object> properties) {
        LocalFolder projectRoot = (LocalFolder) properties.get(PROJECT_DIR_PROPERTY);
        LocalFolder projClassFolder = (LocalFolder) ((Folder) properties.get(BUILD_WEBAPPROOT_PROPERTY)).getFolder("WEB-INF").getFolder("classes");
        projectRoot.getFolder("src").find().exclude(FilterOn.names().ending(".java")).exclude(DEFAULT_EXCLUDES).files().copyTo(projClassFolder);

        for (Folder serviceFolder : projectRoot.getFolder("services").list().folders()) {
            serviceFolder.getFolder("src").find().exclude(FilterOn.names().ending(".java")).exclude(DEFAULT_EXCLUDES).files().copyTo(projClassFolder);
        }
    }

    public void generateRuntimeFiles(Map<String, Object> properties) {
        generateWebxml(properties);

        // ConfigurationCompilerTask
        ConfigurationCompilerTask task = new ConfigurationCompilerTask();
        LocalFolder buildAppWebAppRoot = (LocalFolder) properties.get(BUILD_WEBAPPROOT_PROPERTY);

        LocalFolder projectRoot = (LocalFolder) properties.get(PROJECT_DIR_PROPERTY);
        com.wavemaker.tools.io.ResourceFilter included = FilterOn.antPattern("services/*/designtime/servicedef.xml");
        Resources<File> files = projectRoot.find().include(included).exclude(DEFAULT_EXCLUDES).files();
        for (File file : files) {
            task.addWmResource(file);
        }

        task.setDestWebAppRoot(buildAppWebAppRoot.getLocalFile());
        task.setVerbose(true);

        task.execute();

        // ServiceCompilerTask
        ServiceCompilerTask task1 = new ServiceCompilerTask();
        task1.setProjectRoot(projectRoot.getLocalFile());

        task1.execute();
    }

    public void generateWebxml(Map<String, Object> properties) {
        InputStream is = ClassLoaderUtils.getResourceAsStream("com/wavemaker/tools/project/web.xml");
        LocalFolder webInf = (LocalFolder) ((Folder) properties.get(BUILD_WEBAPPROOT_PROPERTY)).getFolder("WEB-INF");
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
            } catch (IOException e) {
            }
        }

        MergeUserWebXmlTask task = new MergeUserWebXmlTask();
        task.setWorkFolder(webInf);
        task.execute();

        is = ClassLoaderUtils.getResourceAsStream("com/wavemaker/tools/project/application.xml");
        File appXml = webInf.getFile("application.xml");
        os = appXml.getContent().asOutputStream();
        try {
            IOUtils.copy(is, os);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        } finally {
            try {
                is.close();
                os.close();
            } catch (IOException e) {
            }
        }

        setAppNameInAppXml(properties);
    }

    private void setAppNameInAppXml(Map<String, Object> properties) {
        File appXml = ((Folder) properties.get(BUILD_WEBAPPROOT_PROPERTY)).getFile("WEB-INF/application.xml");
        String deployName = (String) properties.get(DEPLOY_NAME_PROPERTY);
        String content = appXml.getContent().asString();
        content = content.replace("{applicationName}", deployName);
        appXml.getContent().write(content);
    }

    public void prepareWebAppRoot(Map<String, Object> properties) {
        if (this.buildInLine) {
            return;
        }

        LocalFolder buildAppWebAppRoot = (LocalFolder) properties.get(BUILD_WEBAPPROOT_PROPERTY);
        LocalFolder appWebAppRoot = (LocalFolder) ((Folder) properties.get(PROJECT_DIR_PROPERTY)).getFolder("webapproot");
        com.wavemaker.tools.io.ResourceFilter excluded = FilterOn.antPattern("**/.svn/**/*.*", "WEB-INF/classes/**", "WEB-INF/lib/**",
            "WEB-INF/web.xml");
        appWebAppRoot.find().exclude(excluded).exclude(DEFAULT_EXCLUDES).files().copyTo(buildAppWebAppRoot);

        buildAppWebAppRoot.getFolder("WEB-INF/classes").createIfMissing();
        buildAppWebAppRoot.getFolder("WEB-INF/lib").createIfMissing();
        buildAppWebAppRoot.getFolder("services").createIfMissing();

        com.wavemaker.tools.io.ResourceFilter included = FilterOn.antPattern("WEB-INF/classes/*.spring.xml");
        appWebAppRoot.find().include(included).exclude(DEFAULT_EXCLUDES).files().copyTo(buildAppWebAppRoot);
    }

    public void undeploy(Map<String, Object> properties) {
        UndeployTask task = new UndeployTask();
        String host = (String) properties.get(TOMCAT_HOST_PROPERTY);
        String port = (String) properties.get(TOMCAT_PORT_PROPERTY);
        String userName = (String) properties.get("tomcat.manager.username");
        String password = (String) properties.get("tomcat.manager.password");
        String tomcatManagerUrl = "http://" + host + ":" + port + "/manager";
        String deployName = (String) properties.get(DEPLOY_NAME_PROPERTY);
        task.setUrl(tomcatManagerUrl);
        task.setUsername(userName);
        task.setPassword(password);
        task.setPath("/" + deployName);
        task.setFailonerror(false);
        try {
            task.execute();
        } catch (Exception ex) {
        }

        File tomcatConfigXml = ((Folder) properties.get(PROJECT_DIR_PROPERTY)).getFile(deployName + ".xml");
        tomcatConfigXml.delete();
    }

    public void deploy(Map<String, Object> properties) {
        DeployTask task = new DeployTask();
        String host = (String) properties.get(TOMCAT_HOST_PROPERTY);
        String port = (String) properties.get(TOMCAT_PORT_PROPERTY);
        String userName = (String) properties.get("tomcat.manager.username");
        String password = (String) properties.get("tomcat.manager.password");
        String tomcatManagerUrl = "http://" + host + ":" + port + "/manager";
        String deployName = (String) properties.get(DEPLOY_NAME_PROPERTY);
        LocalFolder projectDir = (LocalFolder) properties.get(PROJECT_DIR_PROPERTY);
        String tomcatConfigXmlPath = ((LocalFile) projectDir.getFile(deployName + ".xml")).getLocalFile().getAbsolutePath();
        task.setUrl(tomcatManagerUrl);
        task.setUsername(userName);
        task.setPassword(password);
        task.setPath("/" + deployName);
        task.setConfig(tomcatConfigXmlPath);
        task.setFailonerror(true);
        try {
            task.execute();
        } catch (Exception ex) {
        }
    }

    protected Map<String, Object> addMoreProperties(LocalFolder projectDir, String deployName, Map<String, Object> properties) {
        return properties;
    }

    private static class Replace implements ResourceOperation<com.wavemaker.tools.io.File> {

        private final String fromExpression;

        private final String toExpression;

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
