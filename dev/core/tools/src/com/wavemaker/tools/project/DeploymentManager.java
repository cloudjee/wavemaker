/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.project;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSessionBindingListener;
import javax.servlet.http.HttpSessionBindingEvent;
import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.BuildListener;
import org.apache.tools.ant.DefaultLogger;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.ProjectHelper;
import org.springframework.web.multipart.MultipartFile;

import com.sun.xml.bind.marshaller.NamespacePrefixMapper;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.runtime.RuntimeAccess;

import com.wavemaker.runtime.server.FileUploadResponse;

/**
 * Main deployment class.
 *
 * @author Joel Hare
 * @version $Rev$ - $Date$
 *
 */

public class DeploymentManager {
    Project mAnt;
    Logger logger = Logger.getLogger(getClass());
    
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
    
    public static final String EXPORT_DIR_DEFAULT = "export";
    public static final String DIST_DIR_DEFAULT = "dist";
    
    public static final String WAR_EXTENSION = ".war";
    public static final String EAR_EXTENSION = ".ear";
    
    public static final String PACKAGES_DIR = "packages";
    public static final String THEMES_DIR = "themes";
    public static final String LIB_JS_FILE = "lib.js";
    public static final String PACKAGES_JS_FILE = "packages.js";
    public static final String COMMON_MODULE_PREFIX = "common.packages.";


    private static boolean isCloud;
    private static boolean isCloudInitialized = false;
    public static boolean isCloud() {
	if (!isCloudInitialized) {
	    try {
		// can a user create cloud.src.resource java service class and pass our isCloud test and modify our project folder settings?
		// Answer: even if they can, they can't remove our existing com.wavemaker.cloud; all they could accomplish is to 
		// block the ability to SET those settings on their local computer.
		org.springframework.core.io.ClassPathResource cpr = new org.springframework.core.io.ClassPathResource("cloud.src.resource");
		isCloud = cpr.exists();
		isCloudInitialized = true;
	    } catch(Exception e) {
		return false;
	    }
	}

	return isCloud;
    }

    public class Undeployer implements HttpSessionBindingListener {
        private File projectDir;
        private String projectName;
        public void valueBound(HttpSessionBindingEvent event) {
            projectDir = getProjectDir();
            projectName = getDeployName(projectDir);
            logger.info("SESSION BOUND " + projectName + "!!!!!!!!!!!!!!!");
        }
        public void valueUnbound(HttpSessionBindingEvent event) {
        //Lines are commented out because an attempt to undeploy the current project will cause the Studio
        //to hang.  Now, undeploy is done in Launcher.
            //logger.info("SESSION UNBOUND!!!!!!!!!!!!!!!" + projectName);
            //mAnt.executeTarget(UNDEPLOY_OPERATION);
            //logger.info("Undeployed executed it seems");
        }
    }

    /**
     * Test run an application.
     *
     * @param projectDir The name of the project.
     * @param deployName The deployment target.
     */
    public String testRunStart(String projectDir, String deployName) {

	// this method for some reason is how we add the listener
	javax.servlet.http.HttpSession H = RuntimeAccess.getInstance().getSession();
	if (H != null && H.getAttribute("Unloader") == null)
	    H.setAttribute("Unloader", new Undeployer());

        return antExecute(projectDir, deployName, TEST_RUN_START_OPERATION);
    }

    public String testRunStart() {
        return testRunStart(getProjectDir().getAbsolutePath(), getDeployName());
    }

    /**
     * Compile java src.
     */
    public String compile() {
        return antExecute(getProjectDir().getAbsolutePath(), getDeployName(),
                   COMPILE_OPERATION);
    }
    
    /**
     * Clean, then compile java src.
     */
    public String cleanCompile() {
        return antExecute(getProjectDir().getAbsolutePath(), getDeployName(),
                   CLEAN_COMPILE_OPERATION);
    }

    /**
     * Build the application (run the build target).
     */
    public String build() {
        return antExecute(getProjectDir().getAbsolutePath(), getDeployName(),
                   BUILD_OPERATION);
    }
    

    /**
     * Only generate the runtime files 
     */
    public String generateRuntime() {
        return antExecute(getProjectDir().getAbsolutePath(), getDeployName(),
                   GEN_RTFILES_OPERATION);
    }
    
    
    /**
     * Clean, then build the application (run the build target).
     */
    public String cleanBuild() {
        return antExecute(getProjectDir().getAbsolutePath(), getDeployName(),
                   CLEAN_BUILD_OPERATION);
    }
    
    public void buildWar(String projectDir, String buildDir,
            String warFileName) {
        
        int len = warFileName.length();
        String earFileName = warFileName.substring(0, len-4) + EAR_EXTENSION;
        Map<String, String> properties = new HashMap<String, String>();
        properties.put(BUILD_WEBAPPROOT_PROPERTY, buildDir);
        properties.put(WAR_FILE_NAME_PROPERTY, warFileName);
        properties.put(EAR_FILE_NAME_PROPERTY, earFileName);
        properties.put(CUSTOM_WM_DIR_NAME_PROPERTY,
                StudioConfiguration.COMMON_DIR);
        properties.put(WAVEMAKER_HOME,
                getStudioConfiguration().getWaveMakerHome().getAbsolutePath());

        File f = new File(warFileName);
        String projDir = f.getParentFile().getParentFile().getAbsolutePath();
        properties.put(PROJ_DIRECTORY_PROPERTY, projDir);
        properties.put(DEPLOY_NAME_PROPERTY, getDeployName(f.getParentFile().getParentFile()));

        antExecute(projectDir, BUILD_WAR_OPERATION, properties);
        antExecute(projectDir, BUILD_EAR_OPERATION, properties);
    }
    
    public String buildWar() throws IOException {
        File dist = new File(getProjectDir(), DIST_DIR_DEFAULT);
        File warFile = new File(dist, getDeployName() + WAR_EXTENSION);
        return buildWar(warFile);
    }
    
    public String buildWar(File warFile) throws IOException {      
        File f = warFile.getParentFile();
        if (!f.exists()) {
            f.mkdirs();
        }
        String warFileName = warFile.getAbsolutePath();
        buildWar(warFileName);
        return warFileName;
    }

    public void buildWar(String warFileName) 
        throws IOException 
    {
        File tempDir = IOUtils.createTempDirectory();
        try {
            buildWar(getProjectDir().getAbsolutePath(),
                    tempDir.getAbsolutePath(), warFileName);
        } finally {
            IOUtils.deleteRecursive(tempDir);
        }
    }

    public String deployWar(String warFileName, String deployName) {
        Map<String, String> properties = new HashMap<String, String>();
        properties.put(WAR_FILE_NAME_PROPERTY, warFileName);
        
        return antExecute(getProjectDir().getAbsolutePath(), deployName,
                DEPLOY_WAR_OPERATION, properties);
    }

    /**
     * Clean build artifacts
     *
     * @param projectDir The name of the project.
     * @param deployName The deployment target.
     */
    public String testRunClean(String projectDir, String deployName) {
        return antExecute(projectDir, deployName, TEST_RUN_CLEAN_OPERATION);
    }

    public String testRunClean() {
        return testRunClean(getProjectDir().getAbsolutePath(), getDeployName());
    }

    public String undeploy() {
        return undeploy(getProjectDir().getAbsolutePath(), getDeployName());
    }

    public String undeploy(String projectDir, String deployName) {
        return antExecute(projectDir, deployName, UNDEPLOY_OPERATION);
    }

    public String exportProject(String projectDir, String zipFileName) {
        
        File zipFile = new File(zipFileName);
        if (!zipFile.getParentFile().exists()) {
            zipFile.getParentFile().mkdir();
        }

        String projectName = zipFile.getName();
        projectName = projectName.substring(0,projectName.indexOf("."));
        
        Map<String, String> properties = new HashMap<String, String>();
        properties.put(ZIP_FILE_NAME_PROPERTY, zipFileName);
        properties.put(ZIP_FOLDER_NAME_PROPERTY, zipFile.toString().substring(0,zipFile.toString().length()-4));
        //System.out.println("SET " + TMP_FOLDER_PROPERTY + " to " + projectManager.getTmpDir().toString());
        properties.put(TMP_FOLDER_PROPERTY, projectManager.getTmpDir().toString());
        properties.put(PROJECT_NEW_NAME_PROPERTY, projectName);

        return antExecute(projectDir, EXPORT_PROJECT_OPERATION, properties);
    }

    public void exportProject(String zipFileName) {
        exportProject(getProjectDir().getAbsolutePath(), zipFileName);
    }
	

    public String getExportPath() {
    	try {
    		File exportDir;
    		if (projectManager.getUserProjectPrefix().length() > 0)
    			exportDir = projectManager.getTmpDir();
    		else
    			exportDir = new File(getProjectDir(), EXPORT_DIR_DEFAULT);
    		return exportDir.getAbsolutePath() + "/" + getDeployName() + ".zip";
    	} catch(Exception e) {return "";}
    }


    public String exportProject() {
        String zipFileName = getExportPath();
        exportProject(zipFileName);
        return zipFileName;
    }

    /*  This function takes a zip file as input, unzips it and moves it into the project folder */
    public FileUploadResponse importFromZip(MultipartFile file) throws IOException {
        FileUploadResponse ret = new FileUploadResponse();
    	File tmpDir = projectManager.getTmpDir();


    	// Write the zip file to outputFile
    	File outputFile = new File(tmpDir, file.getOriginalFilename());                                                                         
    	FileOutputStream fos = new FileOutputStream(outputFile);
    	IOUtils.copy(file.getInputStream(), fos);
    	file.getInputStream().close();
    	fos.close();

    	File finalProjectFolder;
    	try {
    		
    		// returns null if fails to unzip; need a handler for this...
    		File projectFolder = com.wavemaker.tools.project.ResourceManager.unzipFile(outputFile);

    		// Verify that we receive a valid zip file (no folder if not)
    		if (projectFolder == null) throw new WMRuntimeException("That didn't look like a zip file");

		// If there is only one folder in what we think is the projectFolder, open that one folder because that must be the real project folder
		// Filter out private folders generated by OS or svn, etc... (__MACOS, .svn, etc...)
		int folderCount = IOUtils.countFoldersInDir(projectFolder);
		if (folderCount == 1) {
		    File[] listing = projectFolder.listFiles();
		    for (int i = 0; i < listing.length; i++) {
			if (listing[i].isDirectory() && !listing[i].getName().startsWith(".") && !listing[i].getName().startsWith("_")) {
			    projectFolder = listing[i];
			    break;
			}
		    }
		}

    		//  Verify that this looks like a project folder we unzipped
    		File testExistenceFile = new File(projectFolder, "webapproot/pages");
    		if (!testExistenceFile.exists()) throw new WMRuntimeException("That didn't look like a project folder; if it was, files were missing");

    		// Get a File to point to where we're going to place this imported project
    		finalProjectFolder = new File(projectManager.getBaseProjectDir(), 
    				projectManager.getUserProjectPrefix() + projectFolder.getName());
    		String finalname = finalProjectFolder.getName();

    		// If there is already a project at that location, rename the project
    		int i = -1;
    		do {    	 
    			i++;
    			finalProjectFolder= new File(finalProjectFolder.getParentFile(), finalname + ((i > 0) ? "" + i : ""));
    		} while(finalProjectFolder.exists());
    		finalname = finalname + i;

    		// OK, now filename has the name of the new project, finalProjectFolder has the full path to the new project
    		
    		
    		// Move the project into the project folder
    		projectFolder.renameTo(finalProjectFolder);              
    		
    		// If we renamed the project (i.e. if i got incremented) then we need to make some corrections
    		if (i > 0) {
    			
    			// Correction 1: Rename the js file
    			File jsFile = 
    				new File(finalProjectFolder, "webapproot/" + projectFolder.getName() + ".js");
    			File newJsFile = 
    				new File(finalProjectFolder, "webapproot/" + projectFolder.getName() + i + ".js");
    			jsFile.renameTo(newJsFile);
    			
    			// Correction 2: Change the class name in the js file
    			com.wavemaker.tools.project.ResourceManager.ReplaceTextInFile(newJsFile, projectFolder.getName(), projectFolder.getName() + i);
    			File index_html = new File(finalProjectFolder, "webapproot/index.html");
    			
    			// Corection3: Change the constructor in index.html
    			com.wavemaker.tools.project.ResourceManager.ReplaceTextInFile(index_html, "new " + projectFolder.getName() + "\\(\\{domNode", "new " + projectFolder.getName() + i + "({domNode");
    			
    			// Correction 4: Change the pointer to the js script read in by index.html
    			com.wavemaker.tools.project.ResourceManager.ReplaceTextInFile(index_html, "\\\"" + projectFolder.getName() + "\\.js\\\"", '"' + projectFolder.getName() + i + ".js\"");
    			
    			// Correction 5: Change the title
    			com.wavemaker.tools.project.ResourceManager.ReplaceTextInFile(index_html, "\\<title\\>" + projectFolder.getName() + "\\<\\/title\\>", "<title>" + projectFolder.getName() + i + "</title>");
    			
    		}
    	} finally {
    		// If the user uploaded a zipfile that had many high level folders, they could make a real mess of things, 
    		// so just purge the tmp folder after we're done
            IOUtils.deleteRecursive(tmpDir);
    	}

    	// TODO: Make sure we didn't break anyting for resource uploading of zips (into project resources)

	ret.setPath(finalProjectFolder.getName().substring(projectManager.getUserProjectPrefix().length()));
	ret.setError("");
	ret.setWidth("");
	ret.setHeight("");
    	return ret;
    }

    
    public String antExecute(String projectDir, String targetName, Map<String, String> properties) {
        return antExecute(projectDir, null, targetName, properties);
    }

    protected File getProjectDir() {
        com.wavemaker.tools.project.Project currentProject =
            projectManager.getCurrentProject();
        if (null == currentProject) {
            throw new WMRuntimeException("Current project must be set");
        }
        File projectDir = currentProject.getProjectRoot();
        return projectDir;
    }

    protected String getDeployName() {
	return getDeployName(getProjectDir());
    }

    protected String getDeployName(File projectDir) {
        String projectName = projectDir.getName();
	if (projectManager.getUserProjectPrefix().length() > 0)
	    projectName = projectName.replace(projectManager.getUserProjectPrefix(), "");
        return projectName;
    }


    private String antExecute(String projectDir, String deployName, String targetName) {
        
        Map<String,String> props = Collections.emptyMap();
        return antExecute(projectDir, deployName, targetName, props);
    }

    private String antExecute(String projectDir, String deployName,
            String targetName, Map<String, String> properties) {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintStream ps = new PrintStream(baos);
        DefaultLogger dl = new DefaultLogger();
        dl.setErrorPrintStream(ps);
        dl.setOutputPrintStream(ps);
        dl.setMessageOutputLevel(Project.MSG_INFO);
        
        mAnt = parseAntFile(projectDir, deployName, properties);
        
        // remove all existing build listeners, and add in just mine
        for (Object bl : mAnt.getBuildListeners()) {
            mAnt.removeBuildListener((BuildListener) bl);
        }
        mAnt.addBuildListener(dl);

        try {
            try {
		logger.info("RUN ANT");
                mAnt.executeTarget(targetName);
		logger.info("END ANT");
            } finally {
                ps.close();
            }
        } catch (BuildException e) {
            logger.error("build failed with compiler output:\n"
                    + baos.toString() + "\nmessage: " + e.getMessage(), e);
            throw new BuildExceptionWithOutput(e.getMessage(), baos.toString()+
                    "\nmessage: "+e.getMessage(),
                    e);
        }

        String compilerOutput = baos.toString();
        logger.warn("build succeeded with compiler output:\n"+compilerOutput);
        return compilerOutput;
    }

    private Project parseAntFile(String projectDir, String deployName,
            Map<String, String> properties) {

        Project ant = new Project();
        StudioConfiguration studioConfiguration = projectManager.getStudioConfiguration();
            Map<String, Object> newProperties = new HashMap<String, Object>();
        
        if (null!=getProjectManager() && null!=getProjectManager().getCurrentProject()) {
            newProperties.put(PROJECT_ENCODING_PROPERTY,
                    getProjectManager().getCurrentProject().getEncoding());
        }

        newProperties.put(TOMCAT_HOST_PROPERTY,
                getStudioConfiguration().getTomcatHost());
        System.setProperty("wm.proj."+TOMCAT_HOST_PROPERTY, getStudioConfiguration().getTomcatHost());

        newProperties.put(TOMCAT_PORT_PROPERTY,
                getStudioConfiguration().getTomcatPort());
        System.setProperty("wm.proj."+TOMCAT_PORT_PROPERTY, getStudioConfiguration().getTomcatPort()+"");

        newProperties.put("tomcat.manager.username",
                getStudioConfiguration().getTomcatManagerUsername());
        System.setProperty("wm.proj.tomcat.manager.username", getStudioConfiguration().getTomcatManagerUsername());

        newProperties.put("tomcat.manager.password",
                getStudioConfiguration().getTomcatManagerPassword());
        System.setProperty("wm.proj.tomcat.manager.password", getStudioConfiguration().getTomcatManagerPassword());

        newProperties.putAll(properties);

        newProperties.put(STUDIO_WEBAPPROOT_PROPERTY,
                studioConfiguration.getStudioWebAppRootFile().getAbsolutePath());

        newProperties.put(PROJECT_DIR_PROPERTY, projectDir);

    logger.info("PUT DIR: " + projectDir.toString());
        File projectDirFile = new File(projectDir);
        String projectName = projectDirFile.getName();
        newProperties.put(PROJECT_NAME_PROPERTY, projectName);

    logger.info("PUT NAME: " + projectName);

        if (null != deployName) {
            newProperties.put(DEPLOY_NAME_PROPERTY, projectManager.getUserProjectPrefix() + deployName);
            System.setProperty("wm.proj."+DEPLOY_NAME_PROPERTY, projectManager.getUserProjectPrefix() + deployName);
        }

        for (Map.Entry<String, Object> mapEntry: newProperties.entrySet()) {
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
    
    public static class DeploymentNamespaceMapper extends NamespacePrefixMapper {

        @Override
        public String getPreferredPrefix(String namespaceUri,
                String suggestion, boolean requirePrefix) {
            if ("http://www.wavemaker.com/namespaces/DeploymentPlan/1.0".equals(namespaceUri)) {
                return "";
            } else if ("http://www.w3.org/2001/XMLSchema-instance".equals(namespaceUri)) {
                return "xsi";
            } else {
                return null;
            }
        }
    }

    @SuppressWarnings("unchecked")
    public void deployClientComponent(String name, String namespace,
            String data) throws IOException {

	if (isCloud()) return;
        File packagesDir = new File(studioConfiguration.getCommonDir(),
                PACKAGES_DIR);
        if (!packagesDir.exists()) {
            packagesDir.mkdir();
        }
        
        File moduleDir = packagesDir;
        if (namespace != null && namespace.length() > 0) {
            String[] folderList = namespace.split("\\.");
            for (String folder : folderList) {
                moduleDir = new File(moduleDir, folder);
            }
            moduleDir.mkdirs();
        }

        data = modifyJS(data);
        
        FileUtils.writeStringToFile(new File(moduleDir, name + ".js"),
                data, ServerConstants.DEFAULT_ENCODING);
        
        String klass = null;
        if (namespace != null && namespace.length() > 0) {
            klass = namespace + "." + name;
        } else {
            klass = name;
        }
        String moduleString = "\"" + COMMON_MODULE_PREFIX + klass + "\"";
        boolean found = false;
        File libJsFile = new File(packagesDir, LIB_JS_FILE);
        StringBuffer libJsData = new StringBuffer();
        if (libJsFile.exists()) {
            List libJsStringList = FileUtils.readLines(libJsFile,
                    ServerConstants.DEFAULT_ENCODING);
            for (int i = 0; i < libJsStringList.size(); i++) {
                String s = (String) libJsStringList.get(i);
                if (s.indexOf(moduleString) > -1) {
                    found = true;
                }
                libJsData.append(s);
                libJsData.append("\n");
            }
        }
        if (!found) {
            libJsData.append("dojo.require(");
            libJsData.append(moduleString);
            libJsData.append(");\n");
        }
        FileUtils.writeStringToFile(libJsFile, libJsData.toString(),
                ServerConstants.DEFAULT_ENCODING);
    }

    private String modifyJS(String val) {
        boolean foundDojo = false;
        boolean foundWidget = false;
        int startIndx = 0;
        int dojoIndx = -1;
        int compositeIndx = -1;
        int dojoEndIndx = -1;
        int widgetIndx = -1;
        int widgetEndIndx = -1;

        while (!foundDojo) {
            dojoIndx = val.indexOf("dojo.declare", startIndx);
            if (dojoIndx > startIndx) {
                startIndx = dojoIndx + 12;
                compositeIndx = val.indexOf("wm.Composite", startIndx);
                if (compositeIndx >= startIndx) {
                    startIndx = compositeIndx + 12;
                    dojoEndIndx = val.indexOf("});", startIndx);
                    if (dojoEndIndx >= compositeIndx) {
                        foundDojo = true;
                        break;
                    }
                }
            } else {
                break;
            }
        }

        if (!foundDojo) return val;

        startIndx = dojoEndIndx;

        while (!foundWidget) {
            widgetIndx = val.indexOf(".components", startIndx);
            if (widgetIndx > startIndx) {
                startIndx = widgetIndx + 11;
                widgetEndIndx = val.indexOf("wm.publish", startIndx);
                if (widgetEndIndx == -1) {
                    widgetEndIndx = val.indexOf("wm.registerPackage", startIndx);
                }
                if (widgetEndIndx > widgetIndx) {
                    foundWidget = true;
                    break;
                }
            } else {
                break;
            }
        }

        if (!foundWidget) return val;

        boolean done = false;
        startIndx = dojoIndx;
        int indx1;
        String rtn = val.substring(0, dojoIndx);
        while (!done) {
            indx1 = val.indexOf("this.", startIndx);
            if (indx1 > 0) {
                rtn += val.substring(startIndx, indx1);
                if (!validJavaVarPart(val.substring(indx1-1, indx1))) {
                    int len = elemLen(val, indx1+5, widgetIndx, widgetEndIndx);
                    if (len > 0)
                        rtn += "this.components.";
                    else
                        rtn += "this.";
                } else {
                    rtn += "this.";
                }
                startIndx = indx1 + 5;
            } else {
                rtn += val.substring(startIndx);
                break;
            }
        }

        return rtn;
    }

    @SuppressWarnings("unchecked")
        public void deployTheme(String themename, String filename,
            String data) throws IOException {

	if (isCloud()) return;
        File themesDir = new File(studioConfiguration.getCommonDir(),
                THEMES_DIR);
        if (!themesDir.exists()) {
            themesDir.mkdir();
        }
        
        File moduleDir = themesDir;
        if (themename != null && themename.length() > 0) {
            String[] folderList = themename.split("\\.");
            for (String folder : folderList) {
                moduleDir = new File(moduleDir, folder);
            }
            moduleDir.mkdirs();
        }
        FileUtils.writeStringToFile(new File(moduleDir, filename),
                data, ServerConstants.DEFAULT_ENCODING);
    }

    public boolean undeployTheme(String themename) throws IOException {

	if (isCloud()) return false;
        File packagesDir = new File(studioConfiguration.getCommonDir() + "/" + THEMES_DIR, themename);
        if (!packagesDir.exists()) {
            return false;
        }
        IOUtils.deleteRecursive(packagesDir);
        return true;
    }
    public String[] listThemes() throws IOException {

        File themesDir = new File(studioConfiguration.getCommonDir(),THEMES_DIR);        
        if (!themesDir.exists()) {
            themesDir.mkdir();
        }
        

        File files[] = themesDir.listFiles();
        File themesFolder = new File(studioConfiguration.getStudioWebAppRootFile() + "/lib/wm/base/widget", "themes");

	File files2[] = themesFolder.listFiles(new java.io.FileFilter() {
		public boolean accept(File pathname) {
			return pathname.getName().indexOf("wm_") == 0;
		}
	    });
	String[] s = new String[((files != null) ? files.length : 0) + ((files2 != null) ? files2.length : 0)];


        int i = 0;
	if (files != null)
	    for (i = 0; i < files.length; i++) s[i] = files[i].getName();
	if (files2 != null)
	    for (int j = 0; j < files2.length; j++) s[i+j] = files2[j].getName();
        return s;
    }

    public void copyTheme(String oldName, String newName) throws IOException {
        File oldFile = new File((oldName.indexOf("wm_") == 0) ? new File(studioConfiguration.getStudioWebAppRootFile() + "/lib/wm/base/widget", "themes") : new File(studioConfiguration.getCommonDir(), THEMES_DIR), oldName);
        File newFile = new File(studioConfiguration.getCommonDir() + "/" + THEMES_DIR, newName);
        IOUtils.copy(oldFile, newFile);
        
        File f = new File(newFile, "theme.css");
        com.wavemaker.tools.project.ResourceManager.ReplaceTextInFile(f, "\\." + oldName, "." + newName);

    }

    public void deleteTheme(String name) throws IOException {
        IOUtils.deleteRecursive(new File(studioConfiguration.getCommonDir() + "/" + THEMES_DIR, name));
    }

    public String[] listThemeImages(String themename) throws IOException {
        File themesDir;
        if (themename.indexOf("wm_") == 0)
             themesDir = new File(studioConfiguration.getStudioWebAppRootFile() + "/lib/wm/base/widget/themes/" + themename, "images");      
        else
             themesDir = new File(studioConfiguration.getCommonDir() + "/" + THEMES_DIR + "/" + themename, "images");      

        String files0[] = getImageFiles(themesDir, null, "repeat,top left,");
        String files1[] = getImageFiles(themesDir, "repeat", "repeat,top left,");
        String files2[] = getImageFiles(themesDir, "repeatx", "repeat-x,top left,");
        String files3[] = getImageFiles(themesDir, "repeaty", "repeat-y,top left,");
        String files4[] = getImageFiles(themesDir, "repeatx_bottom", "repeat-x,bottom left,");
        String files5[] = getImageFiles(themesDir, "repeaty_right", "repeat-y,top right,");


        String[] s = new String[files0.length + files1.length + files2.length + files3.length + files4.length + files5.length];
        int i;
        int index = 0;
        for (i = 0; i < files0.length; i++) 
            s[index++] = files0[i];

        for (i = 0; i < files1.length; i++) 
            s[index++] = files1[i];

        for (i = 0; i < files2.length; i++) 
            s[index++] = files2[i];

        for (i = 0; i < files3.length; i++) 
            s[index++] = files3[i];

        for (i = 0; i < files4.length; i++) 
            s[index++] = files4[i];

        for (i = 0; i < files5.length; i++) 
            s[index++] = files5[i];

        return s;
    }

    private String[] getImageFiles(File themeDir, String folderName, String prepend) {
        File folder = (folderName == null) ? themeDir : new File(themeDir, folderName);
        File files[] = folder.listFiles(new java.io.FileFilter() {
                public boolean accept(File pathname) {
                    String name = pathname.getName().toLowerCase();
                    return name.endsWith(".gif") || name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg");
                }
            });

        if (files != null) {
            String[] s = new String[files.length];
            for (int i = 0; i < files.length; i++) 
                s[i] = prepend + "url(images/" + ((folderName == null) ? "" : folderName + "/") + files[i].getName() + ")";
            return s;
        } else {
            String[] s = new String[0];
            return s;
        }
    }

    private boolean validJavaVarPart(String val) {
        int v = val.charAt(0);

        if ((v >= 48 && v <= 57 ) || (v >= 64 && v <= 90) || (v >= 97 && v <= 122) || v == 95)
            return true;
        else
            return false;
    }

    private int elemLen(String val, int indx, int windx, int windx1) {
        int i;
        for (i=0; i<windx; i++) {
            if (!validJavaVarPart(val.substring(indx+i, indx+i+1)))
                break;
        }

        String item = val.substring(indx, indx+i);
        int j = val.substring(windx, windx1).indexOf(item);
        if (j < 0) return -1;

        int k = val.substring(windx+j+item.length(), windx1).indexOf(":");
        if (k < 0) return -1;

        String s = val.substring(windx+j+item.length(), windx+j+item.length()+k);
        if (s.trim().length() > 0) return -1;

        return i;
    }

    @SuppressWarnings("unchecked")
    public boolean undeployClientComponent(String name, String namespace,
            boolean removeSource) throws IOException {

	if (isCloud()) return false;
        File packagesDir = new File(studioConfiguration.getCommonDir(),
                PACKAGES_DIR);
        if (!packagesDir.exists()) {
            return false;
        }
        
        if (removeSource) {
            File moduleDir = packagesDir;
            List<File> rmDirs = new ArrayList<File>();
            if (namespace != null && namespace.length() > 0) {
                String[] folderList = namespace.split("\\.");
                for (String folder : folderList) {
                    moduleDir = new File(moduleDir, folder);
                    rmDirs.add(moduleDir);
                }
            }
            File sourceJsFile = new File(moduleDir, name + ".js");
            if (sourceJsFile.exists()) {
                IOUtils.deleteRecursive(sourceJsFile);
                for (int i = rmDirs.size()-1; i > -1; i--) {
                    File rmDir = rmDirs.get(i);
                    if (rmDir.listFiles().length == 0) {
                        IOUtils.deleteRecursive(rmDir);
                    } else {
                        break;
                    }
                }
            }
        }
        
        File libJsFile = new File(packagesDir, LIB_JS_FILE);
        StringBuffer libJsData = new StringBuffer();
        if (libJsFile.exists()) {
            boolean found = false;
            String klass = null;
            if (namespace != null && namespace.length() > 0) {
                klass = namespace + "." + name;
            } else {
                klass = name;
            }
            List libJsStringList = FileUtils.readLines(libJsFile,
                    ServerConstants.DEFAULT_ENCODING);
            for (int i = 0; i < libJsStringList.size(); i++) {
                String s = (String) libJsStringList.get(i);
                if (s.indexOf("\"" + COMMON_MODULE_PREFIX + klass + "\"") > -1) {
                    found = true;
                } else {
                    libJsData.append(s);
                    libJsData.append("\n");
                }
            }
            FileUtils.writeStringToFile(libJsFile, libJsData.toString(),
                    ServerConstants.DEFAULT_ENCODING);
            return found;
        }
        return false;
    }

    // bean properties
    private StudioConfiguration studioConfiguration;
    private ProjectManager projectManager;

    public StudioConfiguration getStudioConfiguration() {
        return studioConfiguration;
    }
    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }
    public ProjectManager getProjectManager() {
        return this.projectManager;
    }
}
