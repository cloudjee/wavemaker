/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.project;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

import org.apache.log4j.Logger;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.BuildListener;
import org.apache.tools.ant.DefaultLogger;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.ProjectHelper;
import org.springframework.core.io.Resource;

import com.sun.xml.bind.marshaller.NamespacePrefixMapper;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.RuntimeAccess;

/**
 * Main deployment class.
 * 
 * @author Joel Hare
 * @author Jeremy Grelle
 */

public class LocalDeploymentManager extends AbstractDeploymentManager {

    static Logger logger = Logger.getLogger(LocalDeploymentManager.class);

    private LocalStudioConfiguration studioConfiguration;

    // ant properties
    public static final String PROJECT_DIR_PROPERTY = "project.dir";

    public static final String PROJECT_NAME_PROPERTY = "project.name";

    public static final String PROJECT_NEW_NAME_PROPERTY = "project.new.name";

    public static final String PROJECT_ENCODING_PROPERTY = "project.encoding";

    public static final String TOMCAT_HOST_PROPERTY = "tomcat.host";

    public static final String TOMCAT_PORT_PROPERTY = "tomcat.port";

    public static final String DEPLOY_NAME_PROPERTY = "deploy.name";

    public static final String STUDIO_WEBAPPROOT_PROPERTY = "studio.webapproot.dir";

    public static final String WAR_FILE_NAME_PROPERTY = "war.file.name";

    public static final String EAR_FILE_NAME_PROPERTY = "ear.file.name";

    public static final String PROJ_DIRECTORY_PROPERTY = "orig.proj.dir";

    public static final String CUSTOM_WM_DIR_NAME_PROPERTY = "custom.wm.dir";

    public static final String ZIP_FILE_NAME_PROPERTY = "zip.file.name";

    public static final String ZIP_FOLDER_NAME_PROPERTY = "zip.folder.name";

    public static final String BUILD_WEBAPPROOT_PROPERTY = "build.app.webapproot.dir";

    public static final String WAVEMAKER_HOME = "wavemaker.home";

    public static final String USER_NAME_PROPERTY = "wavemaker.user.name";

    public static final String TMP_FOLDER_PROPERTY = "wavemaker.user.tmp";

    public static final String BUILD_RESOURCE_NAME = "app-deploy.xml";

    // targets
    public static final String TEST_RUN_START_OPERATION = "testrunstart";

    public static final String TEST_RUN_RELOAD_OPERATION = "testrunreload";

    public static final String TEST_RUN_CLEAN_OPERATION = "testrunclean";

    public static final String UNDEPLOY_OPERATION = "undeploy";

    public static final String BUILD_OPERATION = "build";

    public static final String CLEAN_BUILD_OPERATION = "clean-build";

    public static final String COMPILE_OPERATION = "compile";

    public static final String CLEAN_COMPILE_OPERATION = "clean-compile";

    public static final String BUILD_WAR_OPERATION = "build-war";

    public static final String BUILD_EAR_OPERATION = "build-ear";

    public static final String DEPLOY_WAR_OPERATION = "deploy-war";

    public static final String EXPORT_PROJECT_OPERATION = "export-project";

    public static final String IMPORT_RENAME_UTILS_OPERATION = "import-rename-utils";

    public static final String GEN_RTFILES_OPERATION = "generate-runtime-files";

    public static final String COPY_JARS_OPERATION = "copy-jars";

    public static final String CLEAN_OPERATION = "clean";

    public static final String BUILD_TEMP_OPERATION = "build-temp";

    public static final String BUILD_WAR_TEMP_OPERATION = "build-war-temp";

    public static final String TEST_RUN_START_PREP_OPERATION = "testrunstart-prep";

    public static final String TEST_RUN_START_TEMP_OPERATION = "testrunstart-temp";

    public static final String DIST_DIR_DEFAULT = "dist/";

    public static final String WAR_EXTENSION = ".war";

    public static final String EAR_EXTENSION = ".ear";

    public static final String PACKAGES_JS_FILE = "packages.js";

    public class Undeployer implements HttpSessionBindingListener {

        private Resource projectDir;

        private String projectName;

        @Override
        public void valueBound(HttpSessionBindingEvent event) {
            this.projectDir = getProjectDir();
            this.projectName = getDeployName(this.projectDir);
            LocalDeploymentManager.logger.info("SESSION BOUND " + this.projectName + "!!!!!!!!!!!!!!!");
        }

        @Override
        public void valueUnbound(HttpSessionBindingEvent event) {
            // Lines are commented out because an attempt to undeploy the
            // current project will cause the Studio
            // to hang. Now, undeploy is done in Launcher.
            // logger.info("SESSION UNBOUND!!!!!!!!!!!!!!!" + projectName);
            // mAnt.executeTarget(UNDEPLOY_OPERATION);
            // logger.info("Undeployed executed it seems");
        }
    }

    private String testRunStart(String projectDir, String deployName) {

        // this method for some reason is how we add the listener
        javax.servlet.http.HttpSession H = RuntimeAccess.getInstance().getSession();
        if (H != null && H.getAttribute("Unloader") == null) {
            H.setAttribute("Unloader", new Undeployer());
        }

        antExecute(projectDir, deployName, TEST_RUN_START_PREP_OPERATION);
        antExecute(projectDir, deployName, BUILD_TEMP_OPERATION);
        compile();
        return antExecute(projectDir, deployName, TEST_RUN_START_TEMP_OPERATION);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String testRunStart() {
        try {
            return testRunStart(getProjectDir().getFile().getCanonicalPath(), getDeployName());
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String compile() {
        try {
            antExecute(getProjectDir().getFile().getCanonicalPath(), getDeployName(), COPY_JARS_OPERATION);
            this.projectCompiler.compileProject(this.projectManager.getCurrentProject().getProjectName());
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
        return null;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String cleanCompile() {
        try {
            antExecute(getProjectDir().getURI().toString(), getDeployName(), CLEAN_OPERATION);
            return compile();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String build() {
        try {
            antExecute(getProjectDir().getURI().toString(), getDeployName(), BUILD_TEMP_OPERATION);
            return compile();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String generateRuntime() {
        try {
            return antExecute(getProjectDir().getURI().toString(), getDeployName(), GEN_RTFILES_OPERATION);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String cleanBuild() {
        try {
            antExecute(getProjectDir().getURI().toString(), getDeployName(), CLEAN_OPERATION);
            return build();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    private void buildWar(String projectDir, String buildDir, String warFile, boolean includeEar) {

        int len = warFile.length();
        String earFileName = warFile.substring(0, len - 4) + EAR_EXTENSION;
        Map<String, String> properties = new HashMap<String, String>();
        properties.put(BUILD_WEBAPPROOT_PROPERTY, buildDir);
        properties.put(WAR_FILE_NAME_PROPERTY, warFile);
        properties.put(EAR_FILE_NAME_PROPERTY, earFileName);
        properties.put(CUSTOM_WM_DIR_NAME_PROPERTY, AbstractStudioFileSystem.COMMON_DIR);

        try {
            properties.put(WAVEMAKER_HOME, getFileSystem().getWaveMakerHome().getURI().toString());
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        properties.put(PROJ_DIRECTORY_PROPERTY, projectDir);
        properties.put(DEPLOY_NAME_PROPERTY, getFileSystem().getResourceForURI(projectDir).getFilename());

        build();

        antExecute(projectDir, BUILD_WAR_TEMP_OPERATION, properties);

        if (includeEar) {
            antExecute(projectDir, BUILD_EAR_OPERATION, properties);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String buildWar(Resource warFile, boolean includeEar) throws IOException {
        String warFileLocation = warFile.getURI().toString();
        buildWar(warFileLocation, includeEar);
        return warFileLocation;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void buildWar(String warFileLocation, boolean includeEar) throws IOException {
        Resource buildDir = getFileSystem().createTempDir();
        try {
            buildWar(getProjectDir().getURI().toString(), buildDir.getURI().toString(), warFileLocation, includeEar);
        } finally {
            getFileSystem().deleteFile(buildDir);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String deployWar(String warFileName, String deployName) {
        Map<String, String> properties = new HashMap<String, String>();
        properties.put(WAR_FILE_NAME_PROPERTY, warFileName);

        try {
            return antExecute(getProjectDir().getURI().toString(), deployName, DEPLOY_WAR_OPERATION, properties);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String testRunClean(String projectDir, String deployName) {
        return antExecute(projectDir, deployName, TEST_RUN_CLEAN_OPERATION);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String testRunClean() {
        try {
            return testRunClean(getProjectDir().getURI().toString(), getDeployName());
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String undeploy() {
        try {
            return undeploy(getProjectDir().getURI().toString(), getDeployName());
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    private String undeploy(String projectDir, String deployName) {
        return antExecute(projectDir, deployName, UNDEPLOY_OPERATION);
    }

    private String exportProject(String projectDirPath, String zipFilePath) {
        Resource projectDir = getFileSystem().getResourceForURI(projectDirPath);
        Resource zipFile = getFileSystem().getResourceForURI(zipFilePath);
        getFileSystem().prepareForWriting(zipFile);

        String projectName = projectDir.getFilename();

        Map<String, String> properties = new HashMap<String, String>();
        properties.put(ZIP_FILE_NAME_PROPERTY, zipFilePath);
        properties.put(ZIP_FOLDER_NAME_PROPERTY, zipFile.getFilename().substring(0, zipFile.getFilename().lastIndexOf('.')));
        properties.put(TMP_FOLDER_PROPERTY, this.projectManager.getTmpDir().toString());
        properties.put(PROJECT_NEW_NAME_PROPERTY, projectName);

        return antExecute(projectDirPath, EXPORT_PROJECT_OPERATION, properties);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void exportProject(String zipFileName) {
        try {
            exportProject(getProjectDir().getURI().toString(), zipFileName);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String exportProject() {
        String zipFileName = getExportPath();
        exportProject(zipFileName);
        return zipFileName;
    }

    public String antExecute(String projectDir, String targetName, Map<String, String> properties) {
        return antExecute(projectDir, null, targetName, properties);
    }

    private String antExecute(String projectDir, String deployName, String targetName) {

        Map<String, String> props = Collections.emptyMap();
        return antExecute(projectDir, deployName, targetName, props);
    }

    private String antExecute(String projectDir, String deployName, String targetName, Map<String, String> properties) {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintStream ps = new PrintStream(baos);
        DefaultLogger dl = new DefaultLogger();
        dl.setErrorPrintStream(ps);
        dl.setOutputPrintStream(ps);
        dl.setMessageOutputLevel(Project.MSG_INFO);

        Project antProject = parseAntFile(projectDir, deployName, properties);

        // remove all existing build listeners, and add in just mine
        for (Object bl : antProject.getBuildListeners()) {
            antProject.removeBuildListener((BuildListener) bl);
        }
        antProject.addBuildListener(dl);

        try {
            try {
                LocalDeploymentManager.logger.info("RUN ANT");
                antProject.executeTarget(targetName);
                LocalDeploymentManager.logger.info("END ANT");
            } finally {
                ps.close();
            }
        } catch (BuildException e) {
            LocalDeploymentManager.logger.error("build failed with compiler output:\n" + baos.toString() + "\nmessage: " + e.getMessage(), e);
            throw new BuildExceptionWithOutput(e.getMessage(), baos.toString() + "\nmessage: " + e.getMessage(), e);
        }

        String compilerOutput = baos.toString();
        LocalDeploymentManager.logger.warn("build succeeded with compiler output:\n" + compilerOutput);
        return compilerOutput;
    }

    private Project parseAntFile(String projectDir, String deployName, Map<String, String> properties) {

        Project ant = new Project();
        StudioFileSystem fileSystem = this.projectManager.getFileSystem();
        Map<String, Object> newProperties = new HashMap<String, Object>();

        if (null != getProjectManager() && null != getProjectManager().getCurrentProject()) {
            newProperties.put(PROJECT_ENCODING_PROPERTY, getProjectManager().getCurrentProject().getEncoding());
        }

        newProperties.put(TOMCAT_HOST_PROPERTY, getStudioConfiguration().getTomcatHost());
        System.setProperty("wm.proj." + TOMCAT_HOST_PROPERTY, getStudioConfiguration().getTomcatHost());

        newProperties.put(TOMCAT_PORT_PROPERTY, getStudioConfiguration().getTomcatPort());
        System.setProperty("wm.proj." + TOMCAT_PORT_PROPERTY, getStudioConfiguration().getTomcatPort() + "");

        newProperties.put("tomcat.manager.username", getStudioConfiguration().getTomcatManagerUsername());
        System.setProperty("wm.proj.tomcat.manager.username", getStudioConfiguration().getTomcatManagerUsername());

        newProperties.put("tomcat.manager.password", getStudioConfiguration().getTomcatManagerPassword());
        System.setProperty("wm.proj.tomcat.manager.password", getStudioConfiguration().getTomcatManagerPassword());

        newProperties.putAll(properties);

        try {
            newProperties.put(STUDIO_WEBAPPROOT_PROPERTY, fileSystem.getStudioWebAppRoot().getFile().getCanonicalPath());
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        newProperties.put(PROJECT_DIR_PROPERTY, projectDir);

        LocalDeploymentManager.logger.info("PUT DIR: " + projectDir.toString());
        Resource projectDirFile = fileSystem.getResourceForURI(projectDir);
        String projectName = projectDirFile.getFilename();
        newProperties.put(PROJECT_NAME_PROPERTY, projectName);

        LocalDeploymentManager.logger.info("PUT NAME: " + projectName);

        if (null != deployName) {
            newProperties.put(DEPLOY_NAME_PROPERTY, this.projectManager.getUserProjectPrefix() + deployName);
            System.setProperty("wm.proj." + DEPLOY_NAME_PROPERTY, this.projectManager.getUserProjectPrefix() + deployName);
        }

        for (Map.Entry<String, Object> mapEntry : newProperties.entrySet()) {
            ant.setProperty(mapEntry.getKey(), String.valueOf(mapEntry.getValue()));
        }
        ProjectHelper helper = ProjectHelper.getProjectHelper();
        DefaultLogger log = new DefaultLogger();
        log.setErrorPrintStream(System.err);
        log.setOutputPrintStream(System.out);
        log.setMessageOutputLevel(Project.MSG_INFO);
        ant.addBuildListener(log);
        ant.init();
        helper.parse(ant, this.getClass().getResource(BUILD_RESOURCE_NAME));
        return ant;
    }

    private LocalStudioConfiguration getStudioConfiguration() {
        return this.studioConfiguration;
    }

    public void setStudioConfiguration(LocalStudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    public static class DeploymentNamespaceMapper extends NamespacePrefixMapper {

        @Override
        public String getPreferredPrefix(String namespaceUri, String suggestion, boolean requirePrefix) {
            if ("http://www.wavemaker.com/namespaces/DeploymentPlan/1.0".equals(namespaceUri)) {
                return "";
            } else if ("http://www.w3.org/2001/XMLSchema-instance".equals(namespaceUri)) {
                return "xsi";
            } else {
                return null;
            }
        }
    }
}
