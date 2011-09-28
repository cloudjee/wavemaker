/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.BuildListener;
import org.apache.tools.ant.DefaultLogger;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.ProjectHelper;
import org.springframework.core.io.Resource;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.sun.xml.bind.marshaller.NamespacePrefixMapper;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.runtime.server.ServerConstants;

/**
 * Main deployment class.
 * 
 * @author Joel Hare
 * @author Jeremy Grelle
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

	public static final String EXPORT_DIR_DEFAULT = "export/";
	public static final String DIST_DIR_DEFAULT = "dist/";

	public static final String WAR_EXTENSION = ".war";
	public static final String EAR_EXTENSION = ".ear";

	public static final String PACKAGES_DIR = "packages/";
	public static final String THEMES_DIR = "themes/";
	public static final String LIB_JS_FILE = "lib.js";
	public static final String PACKAGES_JS_FILE = "packages.js";
	public static final String COMMON_MODULE_PREFIX = "common.packages.";

	private static boolean isCloud;
	private static boolean isCloudInitialized = false;

	public static boolean isCloud() {
		if (!isCloudInitialized) {
			try {
				// can a user create cloud.src.resource java service class and
				// pass our isCloud test and modify our project folder settings?
				// Answer: even if they can, they can't remove our existing
				// com.wavemaker.cloud; all they could accomplish is to
				// block the ability to SET those settings on their local
				// computer.
				org.springframework.core.io.ClassPathResource cpr = new org.springframework.core.io.ClassPathResource(
						"cloud.src.resource");
				isCloud = cpr.exists();
				isCloudInitialized = true;
			} catch (Exception e) {
				return false;
			}
		}

		return isCloud;
	}

	public class Undeployer implements HttpSessionBindingListener {
		private Resource projectDir;
		private String projectName;

		public void valueBound(HttpSessionBindingEvent event) {
			projectDir = getProjectDir();
			projectName = getDeployName(projectDir);
			logger.info("SESSION BOUND " + projectName + "!!!!!!!!!!!!!!!");
		}

		public void valueUnbound(HttpSessionBindingEvent event) {
			// Lines are commented out because an attempt to undeploy the
			// current project will cause the Studio
			// to hang. Now, undeploy is done in Launcher.
			// logger.info("SESSION UNBOUND!!!!!!!!!!!!!!!" + projectName);
			// mAnt.executeTarget(UNDEPLOY_OPERATION);
			// logger.info("Undeployed executed it seems");
		}
	}

	/**
	 * Test run an application.
	 * 
	 * @param projectDir
	 *            The name of the project.
	 * @param deployName
	 *            The deployment target.
	 */
	public String testRunStart(String projectDir, String deployName) {

		// this method for some reason is how we add the listener
		javax.servlet.http.HttpSession H = RuntimeAccess.getInstance()
				.getSession();
		if (H != null && H.getAttribute("Unloader") == null)
			H.setAttribute("Unloader", new Undeployer());

		return antExecute(projectDir, deployName, TEST_RUN_START_OPERATION);
	}

	public String testRunStart() {
		try {
			return testRunStart(getProjectDir().getURI().toString(),
					getDeployName());
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	/**
	 * Compile java src.
	 */
	public String compile() {
		try {
			return antExecute(getProjectDir().getURI().toString(),
					getDeployName(), COMPILE_OPERATION);
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	/**
	 * Clean, then compile java src.
	 */
	public String cleanCompile() {
		try {
			return antExecute(getProjectDir().getURI().toString(),
					getDeployName(), CLEAN_COMPILE_OPERATION);
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	/**
	 * Build the application (run the build target).
	 */
	public String build() {
		try {
			return antExecute(getProjectDir().getURI().toString(),
					getDeployName(), BUILD_OPERATION);
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	/**
	 * Only generate the runtime files
	 */
	public String generateRuntime() {
		try {
			return antExecute(getProjectDir().getURI().toString(),
					getDeployName(), GEN_RTFILES_OPERATION);
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	/**
	 * Clean, then build the application (run the build target).
	 */
	public String cleanBuild() {
		try {
			return antExecute(getProjectDir().getURI().toString(),
					getDeployName(), CLEAN_BUILD_OPERATION);
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	public void buildWar(String projectDir, String buildDir, String warFile,
			boolean includeEar) {

		int len = warFile.length();
		String earFileName = warFile.substring(0, len - 4) + EAR_EXTENSION;
		Map<String, String> properties = new HashMap<String, String>();
		properties.put(BUILD_WEBAPPROOT_PROPERTY, buildDir);
		properties.put(WAR_FILE_NAME_PROPERTY, warFile);
		properties.put(EAR_FILE_NAME_PROPERTY, earFileName);
		properties.put(CUSTOM_WM_DIR_NAME_PROPERTY,
				LocalStudioConfiguration.COMMON_DIR);

		try {
			properties.put(WAVEMAKER_HOME, getStudioConfiguration()
					.getWaveMakerHome().getURI().toString());
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}

		properties.put(PROJ_DIRECTORY_PROPERTY, projectDir);
		properties.put(DEPLOY_NAME_PROPERTY, studioConfiguration
				.getResourceForURI(projectDir).getFilename());

		antExecute(projectDir, BUILD_WAR_OPERATION, properties);

		if (includeEar) {
			antExecute(projectDir, BUILD_EAR_OPERATION, properties);
		}
	}

	public String buildWar() throws IOException {
		Resource dist = studioConfiguration.createPath(getProjectDir(),
				DIST_DIR_DEFAULT);
		Resource warFile = dist.createRelative(getDeployName() + WAR_EXTENSION);
		return buildWar(warFile, false);
	}

	public String buildWar(Resource warFile, boolean includeEar)
			throws IOException {
		String warFileLocation = warFile.getURI().toString();
		buildWar(warFileLocation, includeEar);
		return warFileLocation;
	}

	public void buildWar(String warFileLocation, boolean includeEar)
			throws IOException {
		Resource buildDir = studioConfiguration.createTempDir();
		try {
			buildWar(getProjectDir().getURI().toString(), buildDir.getURI()
					.toString(), warFileLocation, includeEar);
		} finally {
			studioConfiguration.deleteFile(buildDir);
		}
	}

	public String deployWar(String warFileName, String deployName) {
		Map<String, String> properties = new HashMap<String, String>();
		properties.put(WAR_FILE_NAME_PROPERTY, warFileName);

		try {
			return antExecute(getProjectDir().getURI().toString(), deployName,
					DEPLOY_WAR_OPERATION, properties);
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	/**
	 * Clean build artifacts
	 * 
	 * @param projectDir
	 *            The name of the project.
	 * @param deployName
	 *            The deployment target.
	 */
	public String testRunClean(String projectDir, String deployName) {
		return antExecute(projectDir, deployName, TEST_RUN_CLEAN_OPERATION);
	}

	public String testRunClean() {
		try {
			return testRunClean(getProjectDir().getURI().toString(),
					getDeployName());
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	public String undeploy() {
		try {
			return undeploy(getProjectDir().getURI().toString(),
					getDeployName());
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	public String undeploy(String projectDir, String deployName) {
		return antExecute(projectDir, deployName, UNDEPLOY_OPERATION);
	}

	public String exportProject(String projectDirPath, String zipFilePath) {
		Resource projectDir = studioConfiguration
				.getResourceForURI(projectDirPath);
		Resource zipFile = studioConfiguration.getResourceForURI(zipFilePath);
		studioConfiguration.prepareForWriting(zipFile);

		String projectName = projectDir.getFilename();

		Map<String, String> properties = new HashMap<String, String>();
		properties.put(ZIP_FILE_NAME_PROPERTY, zipFilePath);
		properties.put(ZIP_FOLDER_NAME_PROPERTY, zipFile.getFilename()
				.substring(0, zipFile.getFilename().lastIndexOf('.')));
		properties.put(TMP_FOLDER_PROPERTY, projectManager.getTmpDir()
				.toString());
		properties.put(PROJECT_NEW_NAME_PROPERTY, projectName);

		return antExecute(projectDirPath, EXPORT_PROJECT_OPERATION, properties);
	}

	public void exportProject(String zipFileName) {
		try {
			exportProject(getProjectDir().getURI().toString(), zipFileName);
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	public String getExportPath() {
		try {
			Resource exportDir;
			if (projectManager.getUserProjectPrefix().length() > 0)
				exportDir = projectManager.getTmpDir();
			else
				exportDir = getProjectDir().createRelative(EXPORT_DIR_DEFAULT);
			return exportDir.createRelative(getDeployName() + ".zip").getURI()
					.toString();
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	public String exportProject() {
		String zipFileName = getExportPath();
		exportProject(zipFileName);
		return zipFileName;
	}

	/*
	 * This function takes a zip file as input, unzips it and moves it into the
	 * project folder
	 */
	public FileUploadResponse importFromZip(MultipartFile file)
			throws IOException {
		FileUploadResponse response = new FileUploadResponse();
		Resource tmpDir = projectManager.getTmpDir();

		// Write the zip file to outputFile
		String originalName = file.getOriginalFilename();

		int upgradeIndex = originalName.indexOf("-upgrade-");
		if (upgradeIndex > 0) {
			originalName = originalName.substring(0, upgradeIndex) + ".zip";
		}

		Resource outputFile = tmpDir.createRelative(originalName);

		OutputStream fos = studioConfiguration.getOutputStream(outputFile);
		FileCopyUtils.copy(file.getInputStream(), fos);

		Resource finalProjectFolder;
		try {

			// returns null if fails to unzip; need a handler for this...
			Resource projectFolder = com.wavemaker.tools.project.ResourceManager
					.unzipFile(studioConfiguration, outputFile);

			// If there is only one folder in what we think is the
			// projectFolder, open that one folder because that must be the real
			// project folder
			// Filter out private folders generated by OS or svn, etc...
			// (__MACOS, .svn, etc...)
			List<Resource> listings = studioConfiguration
					.listChildren(projectFolder);
			if (listings.size() == 1) {
				Resource listing = listings.get(0);
				if (StringUtils.getFilenameExtension(listing.getFilename()) == null
						&& !listing.getFilename().startsWith(".")
						&& !listing.getFilename().startsWith("_")) {
					projectFolder = listing;
				}
			}

			// Verify that this looks like a project folder we unzipped
			com.wavemaker.tools.project.Project project = new com.wavemaker.tools.project.Project(
					projectFolder, studioConfiguration);
			Resource testExistenceFile = project.getWebAppRoot()
					.createRelative("pages/");
			if (!testExistenceFile.exists())
				throw new WMRuntimeException(
						"That didn't look like a project folder; if it was, files were missing");

			Resource indexhtml = project.getWebAppRoot().createRelative(
					"index.html");
			String indexstring = project.readFile(indexhtml);
			int endIndex = indexstring
					.lastIndexOf("({domNode: \"wavemakerNode\"");
			int startIndex = indexstring.lastIndexOf(" ", endIndex);
			String newProjectName = indexstring.substring(startIndex + 1,
					endIndex);

			// Get a File to point to where we're going to place this imported
			// project
			finalProjectFolder = projectManager.getBaseProjectDir()
					.createRelative(
							projectManager.getUserProjectPrefix()
									+ newProjectName + "/");
			String finalname = finalProjectFolder.getFilename();
			String originalFinalname = finalname;
			// If there is already a project at that location, rename the
			// project
			int i = -1;
			do {
				i++;
				finalProjectFolder = projectManager.getBaseProjectDir()
						.createRelative(
								finalname + ((i > 0) ? "" + i : "") + "/");
			} while (finalProjectFolder.exists());
			finalname = finalProjectFolder.getFilename();

			// OK, now finalname has the name of the new project,
			// finalProjectFolder has the full path to the new project

			// Move the project into the project folder
			studioConfiguration.rename(projectFolder, finalProjectFolder);

			// If we renamed the project (i.e. if i got incremented) then we
			// need to make some corrections
			if (i > 0) {

				// Correction 1: Rename the js file
				com.wavemaker.tools.project.Project finalProject = new com.wavemaker.tools.project.Project(
						finalProjectFolder, studioConfiguration);
				Resource jsFile = finalProject.getWebAppRoot().createRelative(
						originalFinalname + ".js");
				Resource newJsFile = finalProject.getWebAppRoot()
						.createRelative(finalname + ".js");
				studioConfiguration.rename(jsFile, newJsFile);

				// Correction 2: Change the class name in the js file
				com.wavemaker.tools.project.ResourceManager
						.ReplaceTextInProjectFile(finalProject, newJsFile,
								originalFinalname, finalname);

				// Corection3: Change the constructor in index.html
				Resource index_html = finalProject.getWebAppRoot()
						.createRelative("index.html");
				com.wavemaker.tools.project.ResourceManager
						.ReplaceTextInProjectFile(finalProject, index_html,
								"new " + originalFinalname + "\\(\\{domNode",
								"new " + finalname + "({domNode");

				// Correction 4: Change the pointer to the js script read in by
				// index.html
				com.wavemaker.tools.project.ResourceManager
						.ReplaceTextInProjectFile(finalProject, index_html,
								"\\\"" + originalFinalname + "\\.js\\\"", '"'
										+ finalname + ".js\"");

				// Correction 5: Change the title
				com.wavemaker.tools.project.ResourceManager
						.ReplaceTextInProjectFile(finalProject, index_html,
								"\\<title\\>" + originalFinalname
										+ "\\<\\/title\\>", "<title>"
										+ finalname + "</title>");

			}
		} finally {
			// If the user uploaded a zipfile that had many high level folders,
			// they could make a real mess of things,
			// so just purge the tmp folder after we're done
			studioConfiguration.deleteFile(tmpDir);
		}

		response.setPath(finalProjectFolder.getFilename().substring(
				projectManager.getUserProjectPrefix().length()));
		response.setError("");
		response.setWidth("");
		response.setHeight("");
		return response;
	}

	public String antExecute(String projectDir, String targetName,
			Map<String, String> properties) {
		return antExecute(projectDir, null, targetName, properties);
	}

	protected Resource getProjectDir() {
		com.wavemaker.tools.project.Project currentProject = projectManager
				.getCurrentProject();
		if (null == currentProject) {
			throw new WMRuntimeException("Current project must be set");
		}
		return currentProject.getProjectRoot();
	}

	protected String getDeployName() {
		return getDeployName(getProjectDir());
	}

	protected String getDeployName(Resource projectDir) {
		String projectName = projectDir.getFilename();
		if (projectManager.getUserProjectPrefix().length() > 0)
			projectName = projectName.replace(
					projectManager.getUserProjectPrefix(), "");
		return projectName;
	}

	private String antExecute(String projectDir, String deployName,
			String targetName) {

		Map<String, String> props = Collections.emptyMap();
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
			logger.error(
					"build failed with compiler output:\n" + baos.toString()
							+ "\nmessage: " + e.getMessage(), e);
			throw new BuildExceptionWithOutput(e.getMessage(), baos.toString()
					+ "\nmessage: " + e.getMessage(), e);
		}

		String compilerOutput = baos.toString();
		logger.warn("build succeeded with compiler output:\n" + compilerOutput);
		return compilerOutput;
	}

	private Project parseAntFile(String projectDir, String deployName,
			Map<String, String> properties) {

		Project ant = new Project();
		StudioConfiguration studioConfiguration = projectManager
				.getStudioConfiguration();
		Map<String, Object> newProperties = new HashMap<String, Object>();

		if (null != getProjectManager()
				&& null != getProjectManager().getCurrentProject()) {
			newProperties.put(PROJECT_ENCODING_PROPERTY, getProjectManager()
					.getCurrentProject().getEncoding());
		}

		newProperties.put(TOMCAT_HOST_PROPERTY, getStudioConfiguration()
				.getTomcatHost());
		System.setProperty("wm.proj." + TOMCAT_HOST_PROPERTY,
				getStudioConfiguration().getTomcatHost());

		newProperties.put(TOMCAT_PORT_PROPERTY, getStudioConfiguration()
				.getTomcatPort());
		System.setProperty("wm.proj." + TOMCAT_PORT_PROPERTY,
				getStudioConfiguration().getTomcatPort() + "");

		newProperties.put("tomcat.manager.username", getStudioConfiguration()
				.getTomcatManagerUsername());
		System.setProperty("wm.proj.tomcat.manager.username",
				getStudioConfiguration().getTomcatManagerUsername());

		newProperties.put("tomcat.manager.password", getStudioConfiguration()
				.getTomcatManagerPassword());
		System.setProperty("wm.proj.tomcat.manager.password",
				getStudioConfiguration().getTomcatManagerPassword());

		newProperties.putAll(properties);

		try {
			newProperties.put(STUDIO_WEBAPPROOT_PROPERTY, studioConfiguration
					.getStudioWebAppRoot().getURI().toString());
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}

		newProperties.put(PROJECT_DIR_PROPERTY, projectDir);

		logger.info("PUT DIR: " + projectDir.toString());
		Resource projectDirFile = studioConfiguration
				.getResourceForURI(projectDir);
		String projectName = projectDirFile.getFilename();
		newProperties.put(PROJECT_NAME_PROPERTY, projectName);

		logger.info("PUT NAME: " + projectName);

		if (null != deployName) {
			newProperties.put(DEPLOY_NAME_PROPERTY,
					projectManager.getUserProjectPrefix() + deployName);
			System.setProperty("wm.proj." + DEPLOY_NAME_PROPERTY,
					projectManager.getUserProjectPrefix() + deployName);
		}

		for (Map.Entry<String, Object> mapEntry : newProperties.entrySet()) {
			ant.setProperty(mapEntry.getKey(),
					String.valueOf(mapEntry.getValue()));
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
			if ("http://www.wavemaker.com/namespaces/DeploymentPlan/1.0"
					.equals(namespaceUri)) {
				return "";
			} else if ("http://www.w3.org/2001/XMLSchema-instance"
					.equals(namespaceUri)) {
				return "xsi";
			} else {
				return null;
			}
		}
	}

	public void deployClientComponent(String name, String namespace, String data)
			throws IOException {

		if (isCloud())
			return;
		Resource packagesDir = studioConfiguration.createPath(
				studioConfiguration.getCommonDir(), PACKAGES_DIR);

		Resource moduleDir = packagesDir;
		if (namespace != null && namespace.length() > 0) {

			String[] folderList = namespace.split("\\.");
			for (String folder : folderList) {
				moduleDir = studioConfiguration.createPath(moduleDir, folder
						+ "/");
			}
		}

		data = modifyJS(data);

		Resource jsFile = moduleDir.createRelative(name + ".js");
		FileCopyUtils.copy(
				data,
				new OutputStreamWriter(studioConfiguration
						.getOutputStream(jsFile),
						ServerConstants.DEFAULT_ENCODING));

		String klass = null;
		if (namespace != null && namespace.length() > 0) {
			klass = namespace + "." + name;
		} else {
			klass = name;
		}
		String moduleString = "\"" + COMMON_MODULE_PREFIX + klass + "\"";
		boolean found = false;
		Resource libJsFile = packagesDir.createRelative(LIB_JS_FILE);
		StringBuffer libJsData = new StringBuffer();
		if (libJsFile.exists()) {
			String libJsOriginal = FileCopyUtils
					.copyToString(new InputStreamReader(libJsFile
							.getInputStream(), ServerConstants.DEFAULT_ENCODING));
			if (libJsOriginal.indexOf(moduleString) > -1) {
				found = true;
			}
			libJsData.append(libJsOriginal);
		}
		if (!found) {
			libJsData.append("dojo.require(");
			libJsData.append(moduleString);
			libJsData.append(");\n");
		}
		FileCopyUtils.copy(libJsData.toString(), new OutputStreamWriter(
				studioConfiguration.getOutputStream(libJsFile),
				ServerConstants.DEFAULT_ENCODING));
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

		if (!foundDojo)
			return val;

		startIndx = dojoEndIndx;

		while (!foundWidget) {
			widgetIndx = val.indexOf(".components", startIndx);
			if (widgetIndx > startIndx) {
				startIndx = widgetIndx + 11;
				widgetEndIndx = val.indexOf("wm.publish", startIndx);
				if (widgetEndIndx == -1) {
					widgetEndIndx = val
							.indexOf("wm.registerPackage", startIndx);
				}
				if (widgetEndIndx > widgetIndx) {
					foundWidget = true;
					break;
				}
			} else {
				break;
			}
		}

		if (!foundWidget)
			return val;

		boolean done = false;
		startIndx = dojoIndx;
		int indx1;
		String rtn = val.substring(0, dojoIndx);
		while (!done) {
			indx1 = val.indexOf("this.", startIndx);
			if (indx1 > 0) {
				rtn += val.substring(startIndx, indx1);
				if (!validJavaVarPart(val.substring(indx1 - 1, indx1))) {
					int len = elemLen(val, indx1 + 5, widgetIndx, widgetEndIndx);
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

	public void deployTheme(String themename, String filename, String data)
			throws IOException {

		if (isCloud())
			return;

		Resource themesDir = studioConfiguration.createPath(
				studioConfiguration.getCommonDir(), THEMES_DIR);

		Resource moduleDir = themesDir;
		if (themename != null && themename.length() > 0) {
			String[] folderList = themename.split("\\.");
			for (String folder : folderList) {
				moduleDir = studioConfiguration.createPath(moduleDir, folder
						+ "/");
			}
		}
		Resource outputFile = moduleDir.createRelative(filename);
		FileCopyUtils.copy(
				data,
				new OutputStreamWriter(studioConfiguration
						.getOutputStream(outputFile),
						ServerConstants.DEFAULT_ENCODING));
	}

	public boolean undeployTheme(String themename) throws IOException {

		if (isCloud())
			return false;

		Resource packagesDir = studioConfiguration.getCommonDir()
				.createRelative(THEMES_DIR + themename + "/");
		if (!packagesDir.exists()) {
			return false;
		}
		return studioConfiguration.deleteFile(packagesDir);
	}

	public String[] listThemes() throws IOException {

		Resource themesDir = studioConfiguration.getCommonDir().createRelative(
				THEMES_DIR);

		List<Resource> themesDirFiles = studioConfiguration
				.listChildren(themesDir);

		Resource themesFolder = studioConfiguration.getStudioWebAppRoot()
				.createRelative("lib/wm/base/widget/themes");

		List<Resource> widgetThemeFiles = studioConfiguration.listChildren(
				themesFolder, new ResourceFilter() {
					public boolean accept(Resource resource) {
						return resource.getFilename().indexOf("wm_") == 0;
					}
				});

		themesDirFiles.addAll(widgetThemeFiles);

		List<String> themeNames = new ArrayList<String>();
		for (Resource theme : themesDirFiles) {
			themeNames.add(theme.getFilename());
		}

		return themeNames.toArray(new String[themeNames.size()]);
	}

	@SuppressWarnings("unchecked")
	public void copyTheme(String oldName, String newName) throws IOException {
		Resource oldFile;
		if (oldName.indexOf("wm_") == 0) {
			oldFile = studioConfiguration.getStudioWebAppRoot().createRelative(
					"lib/wm/base/widget/themes/" + oldName + "/");
		} else {
			oldFile = studioConfiguration.getCommonDir().createRelative(
					THEMES_DIR + oldName + "/");
		}
		Resource newFile = studioConfiguration.getCommonDir().createRelative(
				THEMES_DIR + newName);
		studioConfiguration.copyRecursive(oldFile, newFile,
				Collections.EMPTY_LIST);

		Resource cssFile = newFile.createRelative("theme.css");
		com.wavemaker.tools.project.ResourceManager.ReplaceTextInFile(
				studioConfiguration.getOutputStream(cssFile), cssFile, "\\."
						+ oldName, "." + newName);

	}

	public void deleteTheme(String name) throws IOException {
		studioConfiguration.deleteFile(studioConfiguration.getCommonDir()
				.createRelative(THEMES_DIR + name + "/"));
	}

	public String[] listThemeImages(String themename) throws IOException {
		Resource themesDir;
		if (themename.indexOf("wm_") == 0) {
			themesDir = studioConfiguration.getStudioWebAppRoot()
					.createRelative(
							"lib/wm/base/widget/themes/" + themename
									+ "/images/");
		} else {
			themesDir = studioConfiguration.getCommonDir().createRelative(
					THEMES_DIR + themename + "/images/");
		}

		String files0[] = getImageFiles(themesDir, null, "repeat,top left,");
		String files1[] = getImageFiles(themesDir, "repeat", "repeat,top left,");
		String files2[] = getImageFiles(themesDir, "repeatx",
				"repeat-x,top left,");
		String files3[] = getImageFiles(themesDir, "repeaty",
				"repeat-y,top left,");
		String files4[] = getImageFiles(themesDir, "repeatx_bottom",
				"repeat-x,bottom left,");
		String files5[] = getImageFiles(themesDir, "repeaty_right",
				"repeat-y,top right,");

		String[] s = new String[files0.length + files1.length + files2.length
				+ files3.length + files4.length + files5.length];
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

	private String[] getImageFiles(Resource themeDir, String folderName,
			String prepend) {
		Resource folder;
		try {
			folder = (folderName == null) ? themeDir : themeDir
					.createRelative(folderName + "/");
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
		List<Resource> files = studioConfiguration.listChildren(folder,
				new ResourceFilter() {
					public boolean accept(Resource file) {
						String name = file.getFilename().toLowerCase();
						return name.endsWith(".gif") || name.endsWith(".png")
								|| name.endsWith(".jpg")
								|| name.endsWith(".jpeg");
					}
				});

		if (files.size() > 0) {
			String[] imageFiles = new String[files.size()];
			for (int i = 0; i < files.size(); i++)
				imageFiles[i] = prepend + "url(images/"
						+ ((folderName == null) ? "" : folderName + "/")
						+ files.get(i).getFilename() + ")";
			return imageFiles;
		} else {
			return new String[0];
		}
	}

	private boolean validJavaVarPart(String val) {
		int v = val.charAt(0);

		if ((v >= 48 && v <= 57) || (v >= 64 && v <= 90)
				|| (v >= 97 && v <= 122) || v == 95)
			return true;
		else
			return false;
	}

	private int elemLen(String val, int indx, int windx, int windx1) {
		int i;
		for (i = 0; i < windx; i++) {
			if (!validJavaVarPart(val.substring(indx + i, indx + i + 1)))
				break;
		}

		String item = val.substring(indx, indx + i);
		int j = val.substring(windx, windx1).indexOf(item);
		if (j < 0)
			return -1;

		int k = val.substring(windx + j + item.length(), windx1).indexOf(":");
		if (k < 0)
			return -1;

		String s = val.substring(windx + j + item.length(),
				windx + j + item.length() + k);
		if (s.trim().length() > 0)
			return -1;

		return i;
	}

	@SuppressWarnings("unchecked")
	public boolean undeployClientComponent(String name, String namespace,
			boolean removeSource) throws IOException {

		if (isCloud())
			return false;

		Resource packagesDir = studioConfiguration.getCommonDir()
				.createRelative(PACKAGES_DIR);
		if (!packagesDir.exists()) {
			return false;
		}

		if (removeSource) {
			Resource moduleDir = packagesDir;
			List<Resource> rmDirs = new ArrayList<Resource>();
			if (namespace != null && namespace.length() > 0) {
				String[] folderList = namespace.split("\\.");
				for (String folder : folderList) {
					moduleDir = moduleDir.createRelative(folder + "/");
					rmDirs.add(moduleDir);
				}
			}
			Resource sourceJsFile = moduleDir.createRelative(name + ".js");
			if (sourceJsFile.exists()) {
				studioConfiguration.deleteFile(sourceJsFile);
				for (int i = rmDirs.size() - 1; i > -1; i--) {
					Resource rmDir = rmDirs.get(i);
					if (studioConfiguration.listChildren(rmDir).size() == 0) {
						studioConfiguration.deleteFile(rmDir);
					} else {
						break;
					}
				}
			}
		}

		Resource libJsFile = packagesDir.createRelative(LIB_JS_FILE);
		StringBuffer libJsData = new StringBuffer();
		if (libJsFile.exists()) {
			boolean found = false;
			String klass = null;
			if (namespace != null && namespace.length() > 0) {
				klass = namespace + "." + name;
			} else {
				klass = name;
			}
			List<String> libJsStringList = FileUtils.readLines(
					libJsFile.getFile(), ServerConstants.DEFAULT_ENCODING);
			for (int i = 0; i < libJsStringList.size(); i++) {
				String s = (String) libJsStringList.get(i);
				if (s.indexOf("\"" + COMMON_MODULE_PREFIX + klass + "\"") > -1) {
					found = true;
				} else {
					libJsData.append(s);
					libJsData.append("\n");
				}
			}
			FileCopyUtils.copy(libJsData.toString(), new OutputStreamWriter(
					studioConfiguration.getOutputStream(libJsFile),
					ServerConstants.DEFAULT_ENCODING));
			return found;
		}
		return false;
	}

	// bean properties
	private LocalStudioConfiguration studioConfiguration;
	private ProjectManager projectManager;

	public LocalStudioConfiguration getStudioConfiguration() {
		return studioConfiguration;
	}

	public void setStudioConfiguration(
			LocalStudioConfiguration studioConfiguration) {
		this.studioConfiguration = studioConfiguration;
	}

	public void setProjectManager(ProjectManager projectManager) {
		this.projectManager = projectManager;
	}

	public ProjectManager getProjectManager() {
		return this.projectManager;
	}
}
