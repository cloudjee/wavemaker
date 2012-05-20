/*
 * Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.studio;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.SortedSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.IOUtils;
import org.apache.tools.ant.BuildException;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.core.io.FileSystemResource;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.pws.install.PwsInstall;

/**
 * Main Studio service interface. This service will manage the other studio services, their inclusion into the
 * HTTPSession, the current project, etc.
 * 
 * @author Matt Small
 */
@HideFromClient
public class StudioService extends ClassLoader implements ApplicationEventPublisherAware {

    private static final String LOG_UPDATE_LOGS = "logs";

    private static final String LOG_UPDATE_LAST_STAMP = "lastStamp";

    private RuntimeAccess runtimeAccess;

    private ProjectManager projectManager;

    private DeploymentManager deploymentManager;

    private StudioFileSystem fileSystem;

    private UpgradeManager upgradeManager;

    private StudioConfiguration studioConfiguration;

    private ApplicationEventPublisher applicationEventPublisher;

    /**
     * Undeploy and close the project.
     * 
     * @see ProjectManager#closeProject()
     * @see DeploymentManager#undeploy()
     * @throws IOException
     */
    @ExposeToClient
    public void closeProject() throws IOException {
        try {
            this.deploymentManager.undeploy();
        } catch (RuntimeException ignore) {
            // Ignore failures and continue to close the project
        }
        this.projectManager.closeProject();
    }

    @ExposeToClient
    public boolean projectUpgradeRequired(String projectName) throws IOException {
        this.projectManager.openProject(projectName, true);
        return getUpgradeManager().upgradeRequired(this.projectManager.getCurrentProject());
    }

    /**
     * @see ProjectManager#openProject(String)
     * @return An OpenProjectReturn object containing the current web path, as well as any upgrades that were performed.
     */
    @ExposeToClient
    public OpenProjectReturn openProject(String projectName) throws IOException {
        this.projectManager.openProject(projectName);
        OpenProjectReturn rtn = new OpenProjectReturn();
        rtn.setUpgradeMessages(getUpgradeManager().doUpgrades(this.projectManager.getCurrentProject()));
        rtn.setWebPath(getWebPath());
        return rtn;
    }

    /*
     * Currently used to tell us that the CloudFoundry version of studio has restarted (due to binding a service to it)
     * and is now back online. Before it reboots, this will return the currently open project. After it reboots, this
     * throws an error as there is no open project.
     */
    @ExposeToClient
    public String getOpenProject() throws IOException {
        return this.projectManager.getCurrentProject().getProjectName();
    }

    /**
     * @see ProjectManager#newProject(String)
     * @return getWebPath()
     */
    @ExposeToClient
    public String newProject(String projectName) throws IOException {
        this.projectManager.newProject(projectName);
        return getWebPath();
    }

    private String getWebPath() {
        return this.projectManager.getCurrentProject().getProjectName() + "/" + ProjectConstants.WEB_DIR;
    }

    /**
     * In addition to deleting the project, this will undeploy it from Tomcat.
     * 
     * @see ProjectManager#deleteProject(String)
     */
    @ExposeToClient
    public void deleteProject(String projectName) throws IOException {
        try {
            this.deploymentManager.testRunClean(this.projectManager.getProjectDir(projectName, true).getURI().toString(), projectName);
        } catch (WMRuntimeException e) {
            // Swallow and continue to delete project
        } catch (BuildException e) {
            // Swallow and continue to delete project
        }
        this.projectManager.deleteProject(projectName);
    }

    /**
     * @see ProjectManager#copyProject(String, String)
     */
    @ExposeToClient
    public void copyProject(String sourceProjectName, String destinationProjectName) throws IOException {
        this.projectManager.copyProject(sourceProjectName, destinationProjectName);
    }

    /**
     * @throws FileAccessException
     * @see ProjectManager#listProjects()
     */
    @ExposeToClient
    public String[] listProjects() throws FileAccessException {
        SortedSet<String> projects = this.projectManager.listProjects();
        return new ArrayList<String>(projects).toArray(new String[projects.size()]);
    }

    /**
     * Returns true if the file exists.
     * 
     * @param path The path to check (relative to the project root).
     * @return <tt>true</tt> if the path points to an existing file or directory.
     */
    @ExposeToClient
    public boolean fileExists(String path) {
        return getCurrentProjectRoot().hasExisting(path);
    }

    /**
     * Read arbitrary data from a file in this project's web directory.
     * 
     * @param path
     * @param data
     */
    @ExposeToClient
    public String readWebFile(String path) throws IOException {
        com.wavemaker.tools.io.File file = this.projectManager.getCurrentProject().getRootFolder().getFile(getWebDirPath(path));
        return file.getContent().asString();
    }

    /**
     * Write arbitrary data to a file in this project's web directory.
     * 
     * @param path
     * @param data
     */
    @ExposeToClient
    public void writeWebFile(String path, String data) throws IOException {
        writeWebFile(path, data, false);
    }

    /**
     * Write arbitrary data to a file in this project's web directory.
     * 
     * @param path
     * @param data
     */
    @ExposeToClient
    public void writeWebFile(String path, String data, boolean noClobber) throws IOException {
        boolean canClobber = !noClobber;
        File file = this.projectManager.getCurrentProject().getRootFolder().getFile(getWebDirPath(path));
        if (!file.exists() || canClobber) {
            file.getContent().write(data);
        }
        this.applicationEventPublisher.publishEvent(new StudioServiceWriteWebFileEvent(this, path, data, canClobber));
    }

    private String getWebDirPath(String path) {
        path = path.trim();
        return ProjectConstants.WEB_DIR + (path.startsWith("/") ? path.substring(1) : path);
    }

    /**
     * Get a map of the current studio preferences.
     */
    @ExposeToClient
    public Map<String, String> getPreferences() {
        return this.studioConfiguration.getPreferencesMap();
    }

    /**
     * Update the preferences with new values.
     * 
     * @param prefs
     * @throws FileAccessException
     */
    @ExposeToClient
    public void setPreferences(Map<String, String> prefs) throws FileAccessException {
        this.studioConfiguration.setPreferencesMap(prefs);
    }

    /**
     * Get Project properties for given prefix.
     */
    @ExposeToClient
    public Properties getProperties(String prefix) {
        return this.projectManager.getCurrentProject().getProperties(prefix);
    }

    /**
     * Get the studio configuration env
     */
    @ExposeToClient
    public String getStudioEnv() {
        return this.fileSystem.getStudioEnv();
    }

    @ExposeToClient
    public String getMainLog(int lines) throws IOException {
        File logFile = this.fileSystem.getWaveMakerHomeFolder().getFile("logs/wm.log");
        if (!logFile.exists()) {
            return "";
        }
        return tail(logFile, lines);
    }

    private String tail(File file, int maxSize) throws IOException {
        List<String> lines = new ArrayList<String>();
        BufferedReader reader = new BufferedReader(file.getContent().asReader());
        try {
            String line = reader.readLine();
            while (line != null) {
                lines.add(line);
                if (lines.size() > maxSize) {
                    lines.remove(0);
                }
                line = reader.readLine();
            }
            return StringUtils.collectionToDelimitedString(lines, "\n");
        } finally {
            reader.close();
        }
    }

    @ExposeToClient
    public Hashtable<String, Object> getLogUpdate(String filename, String lastStamp) throws IOException {
        java.io.File logFolder = new java.io.File(System.getProperty("catalina.home") + "/logs/ProjectLogs",
            this.projectManager.getCurrentProject().getProjectName());
        java.io.File logFile = new java.io.File(logFolder, filename);
        if (!logFile.exists()) {
            Hashtable<String, Object> PEmpty = new Hashtable<String, Object>();
            PEmpty.put(LOG_UPDATE_LOGS, "");
            PEmpty.put(LOG_UPDATE_LAST_STAMP, 0);
            return PEmpty;
        }
        InputStream inputStream = new FileInputStream(logFile);
        try {
            String logFileContent = IOUtils.toString(inputStream);
            if (lastStamp.length() > 0) {
                // remove everything up to START_WM_LOG_LINE lastStamp
                Pattern pattern = Pattern.compile("^.*START_WM_LOG_LINE\\s+" + lastStamp + "\\s+", Pattern.DOTALL);
                Matcher matcher = pattern.matcher(logFileContent);
                logFileContent = matcher.replaceFirst("");
                // Replace everything from the start of whats left of this line to END_WM_LOG_LINE
                logFileContent = logFileContent.replaceFirst("^.*?END_WM_LOG_LINE", "");
            }

            Pattern htmlTagPattern = Pattern.compile("(START_WM_LOG_LINE\\s+\\d+\\:\\d+\\:\\d+,\\d+\\s+)(\\S+) (\\(.*\\))");
            Matcher htmlTagMatcher = htmlTagPattern.matcher(logFileContent);
            logFileContent = htmlTagMatcher.replaceAll("$1<span class='LogType$2'>$2</span> <span class='LogLocation'>$3</span>");

            Pattern p = Pattern.compile("START_WM_LOG_LINE\\s+\\d+\\:\\d+\\:\\d+,\\d+");
            Matcher m = p.matcher(logFileContent);
            String timestamp = "";
            while (m.find()) {
                timestamp = m.group();
                timestamp = timestamp.replaceFirst("START_WM_LOG_LINE\\s+.*?", "");
            }
            Hashtable<String, Object> logUpdate = new Hashtable<String, Object>();
            logFileContent = m.replaceAll(""); // remove all START_WM_LOG_LINE xxx:xxx:xxx,xxx
            logFileContent = logFileContent.replaceAll(" END_WM_LOG_LINE", "");
            if (logFileContent.matches("^\\s+$")) {
                logFileContent = "";
            }
            logFileContent = logFileContent.replaceAll("(\\S+)(\\n\\r|\\r\\n|\\n|\\r)", "$1<br/>");
            Pattern trimPattern = Pattern.compile("^\\s*", Pattern.MULTILINE);
            Matcher trimMatcher = trimPattern.matcher(logFileContent);
            logFileContent = trimMatcher.replaceAll("");
            logUpdate.put(LOG_UPDATE_LOGS, logFileContent);
            logUpdate.put(LOG_UPDATE_LAST_STAMP, timestamp);
            return logUpdate;
        } finally {
            inputStream.close();
        }
    }

    @ExposeToClient
    public String getPropertyHelp(String url) throws IOException {
        try {
            String str = getRemoteContent(url);
            String startDivStr = "</h2><p/>";
            int startDiv = str.indexOf(startDivStr);
            if (startDiv == -1) {
                return "";
            }
            startDiv += startDivStr.length();

            int endDivID = str.indexOf("\"xwikidata\"");
            int endDiv = str.lastIndexOf("<div", endDivID);

            str = str.substring(startDiv, endDiv);
            str = str.replaceAll("<a ", "<a target='wiki' ");
            return str;
        } catch (Exception e) {
            return "No documentation found for this topic";
        }
    }

    @ExposeToClient
    public String getContent(String inUrl) throws IOException {
        try {
            String str = getRemoteContent(inUrl);
            str = str.replace("<head>", "<head><base href='" + inUrl
                + "' /><base target='_blank' /><script>top.studio.startPageIFrameLoaded();</script>");
            return str;
        } catch (Exception e) {
            return "";
        }
    }

    @ExposeToClient
    public String getLatestPatches(String url) {
        try {
            String str = getRemoteContent(url);
            String startDivStr = "PATCHCODE'>";
            int startDiv = str.indexOf(startDivStr);
            if (startDiv == -1) {
                return "";
            }
            startDiv += startDivStr.length();
            int endDiv = str.indexOf("</textarea>");
            str = str.substring(startDiv, endDiv);
            return str;
        } catch (Exception e) {
            return "Could not find patches";
        }
    }

    private String getRemoteContent(String url) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(new URL(url).openStream()));
        return FileCopyUtils.copyToString(in);
    }

    /*
     * Note this should probably be moved to javaServices.java, but I didn't want to spend the time to figure out how to
     * access studioConfiguration from that file
     */
    @ExposeToClient
    public String getJavaServiceTemplate(String templateName) throws IOException {
        Folder webAppRoot = this.fileSystem.getStudioWebAppRootFolder();
        File templateFile = webAppRoot.getFile("/app/templates/javaservices/" + templateName);
        return templateFile.getContent().asString();
    }

    @ExposeToClient
    public List<String> getMissingJars() {
        Map<String, String> jarHash = new HashMap<String, String>();
        jarHash.put("db2jcc.jar", "COM.ibm.db2.app.DB2StructOutput");
        jarHash.put("ojdbc.jar", "oracle.jdbc.driver.OracleDatabaseMetaData");
        jarHash.put("wsdl4j.jar", "javax.wsdl.factory.WSDLFactory");
        jarHash.put("hibernate3.jar", "org.hibernate.cfg.Environment");

        List<String> missingJars = new ArrayList<String>();

        Set<Map.Entry<String, String>> entries = jarHash.entrySet();
        for (Map.Entry<String, String> entry : entries) {
            try {
                Class.forName(entry.getValue());
            } catch (ClassNotFoundException ex) {
                missingJars.add(entry.getKey());
            }
        }

        return missingJars;
    }

    @ExposeToClient
    public FileUploadResponse uploadJar(MultipartFile file) {
        FileUploadResponse ret = new FileUploadResponse();
        try {
            String filename = file.getOriginalFilename();
            String filenameExtension = StringUtils.getFilenameExtension(filename);
            if (!StringUtils.hasLength(filenameExtension)) {
                throw new IOException("Please upload a jar file");
            }
            if (!"jar".equals(filenameExtension)) {
                throw new IOException("Please upload a jar file, not a " + filenameExtension + " file");
            }
            Folder destinationFolder = this.fileSystem.getStudioWebAppRootFolder().getFolder("WEB-INF/lib");
            File destinationFile = destinationFolder.getFile(filename);
            destinationFile.getContent().write(file.getInputStream());
            ret.setPath(destinationFile.getName());
        } catch (IOException e) {
            ret.setError(e.getMessage());
        }
        return ret;
    }

    @ExposeToClient
    public FileUploadResponse uploadExtensionZip(MultipartFile file) {
        FileUploadResponse ret = new FileUploadResponse();
        java.io.File tmpDir;
        try {
            java.io.File webapproot = new java.io.File(WMAppContext.getInstance().getAppContextRoot());

            String filename = file.getOriginalFilename();
            int dotindex = filename.lastIndexOf(".");
            String ext = dotindex == -1 ? "" : filename.substring(dotindex + 1);
            if (dotindex == -1) {
                throw new IOException("Please upload a zip file");
            } else if (!ext.equals("zip")) {
                throw new IOException("Please upload a zip file, not a " + ext + " file");
            }

            String originalName = file.getOriginalFilename();
            tmpDir = new java.io.File(webapproot, "tmp");
            com.wavemaker.common.util.IOUtils.makeDirectories(tmpDir, webapproot);

            java.io.File outputFile = new java.io.File(tmpDir, originalName);
            String newName = originalName.replaceAll("[ 0-9()]*.zip$", "");
            System.out.println("OLD NAME:" + originalName + "; NEW NAME:" + newName);
            FileOutputStream fos = new FileOutputStream(outputFile);
            com.wavemaker.common.util.IOUtils.copy(file.getInputStream(), fos);
            file.getInputStream().close();
            fos.close();
            java.io.File extFolder = com.wavemaker.tools.project.ResourceManager.unzipFile(this.fileSystem, new FileSystemResource(outputFile)).getFile();

            /*
             * Import the pages from the pages folder STATUS: DONE
             */
            java.io.File webapprootPages = new java.io.File(webapproot, "pages");
            java.io.File pagesFolder = new java.io.File(extFolder, "pages");
            java.io.File[] pages = pagesFolder.listFiles();
            for (int i = 0; i < pages.length; i++) {
                com.wavemaker.common.util.IOUtils.copy(pages[i], new java.io.File(webapprootPages, pages[i].getName()));
            }

            /*
             * Import the language files from the dictionaries folder and subfolder STATUS: DONE
             */
            java.io.File dictionaryDest = new java.io.File(webapproot, "language/nls");
            java.io.File dictionarySrc = new java.io.File(extFolder, "language/nls");
            java.io.File[] languages = dictionarySrc.listFiles();
            for (int i = 0; i < languages.length; i++) {
                if (languages[i].isDirectory()) {
                    System.out.println("GET LISTING OF " + languages[i].getName());
                    java.io.File[] languages2 = languages[i].listFiles();
                    for (int j = 0; j < languages2.length; j++) {
                        System.out.println("COPY " + languages2[j].getName() + " TO "
                            + new java.io.File(dictionaryDest, languages[i].getName()).getAbsolutePath());
                        com.wavemaker.common.util.IOUtils.copy(languages2[j], new java.io.File(dictionaryDest, languages[i].getName()));
                    }
                } else {
                    com.wavemaker.common.util.IOUtils.copy(languages[i], dictionaryDest);
                }
            }

            /*
             * Import the designtime jars STATUS: DONE
             */
            java.io.File studioLib = new java.io.File(webapproot, "WEB-INF/lib");
            java.io.File designtimeFolder = new java.io.File(extFolder, "designtime");
            java.io.File[] designJars = designtimeFolder.listFiles();
            for (int i = 0; i < designJars.length; i++) {
                com.wavemaker.common.util.IOUtils.copy(designJars[i], studioLib);
            }

            /*
             * Import the runtime jars STATUS: DONE
             */
            java.io.File templatesPwsFolder = new java.io.File(webapproot, "app/templates/pws/" + newName);
            java.io.File templatesPwsWEBINFFolder = new java.io.File(templatesPwsFolder, "WEB-INF");
            java.io.File templatesPwsWEBINFLibFolder = new java.io.File(templatesPwsWEBINFFolder, "lib");
            /* Delete any old jars from prior imports */
            if (templatesPwsFolder.exists()) {
                com.wavemaker.common.util.IOUtils.deleteRecursive(templatesPwsFolder);
            }

            com.wavemaker.common.util.IOUtils.makeDirectories(templatesPwsWEBINFLibFolder, webapproot);

            java.io.File runtimeFolder = new java.io.File(extFolder, "runtime");
            java.io.File[] runJars = runtimeFolder.listFiles();
            for (int i = 0; i < runJars.length; i++) {
                com.wavemaker.common.util.IOUtils.copy(runJars[i], studioLib);
                com.wavemaker.common.util.IOUtils.copy(runJars[i], templatesPwsWEBINFLibFolder);
            }

            /*
             * Import packages.js
             */
            java.io.File packagesFile = new java.io.File(webapproot, "app/packages.js");
            String packagesExt = "";
            try {
                // Get the packages.js file from our extensions.zip file */
                packagesExt = com.wavemaker.common.util.IOUtils.read(new java.io.File(extFolder, "packages.js"));
            } catch (Exception e) {
                packagesExt = "";
            }
            /* If there is a packages file provided... */
            if (packagesExt.length() > 0) {
                /* Build the string we're appending to packages.js */
                String startPackagesExt = "/* START PARTNER " + newName + " */\n";
                String endPackagesExt = "/* END PARTNER " + newName + " */\n";
                packagesExt = ",\n" + startPackagesExt + packagesExt + "\n" + endPackagesExt;

                String packages = com.wavemaker.common.util.IOUtils.read(packagesFile);

                /* Remove previous packages entries for this partner */
                int packagesStartIndex = packages.indexOf(startPackagesExt);
                if (packagesStartIndex != -1) {
                    packagesStartIndex = packages.lastIndexOf(",", packagesStartIndex);
                    int packagesEndIndex = packages.indexOf(endPackagesExt);
                    if (packagesEndIndex != -1) {
                        packagesEndIndex += endPackagesExt.length();
                        packages = packages.substring(0, packagesStartIndex) + packages.substring(packagesEndIndex);
                    }
                }

                /* Append the string to packages.js and write it */
                packages += packagesExt;
                com.wavemaker.common.util.IOUtils.write(packagesFile, packages);
            }

            /*
             * Import spring config files STATUS: DONE
             */
            java.io.File webinf = new java.io.File(webapproot, "WEB-INF");
            java.io.File designxml = new java.io.File(extFolder, newName + "-tools-beans.xml");
            java.io.File runtimexml = new java.io.File(extFolder, newName + "-runtime-beans.xml");
            com.wavemaker.common.util.IOUtils.copy(designxml, webinf);
            com.wavemaker.common.util.IOUtils.copy(runtimexml, webinf);
            com.wavemaker.common.util.IOUtils.copy(runtimexml, templatesPwsWEBINFFolder);

            /*
             * Modify Spring files to include beans in the partner package.
             */
            java.io.File studioSpringApp = new java.io.File(webinf, "studio-springapp.xml");
            PwsInstall.insertImport(studioSpringApp, newName + "-tools-beans.xml");
            PwsInstall.insertImport(studioSpringApp, newName + "-runtime-beans.xml");

            java.io.File studioPartnerBeans = new java.io.File(webinf, "studio-partner-beans.xml");
            PwsInstall.insertEntryKey(studioPartnerBeans, runJars, designJars, newName);

            java.io.File templatesPwsRootFolder = new java.io.File(webapproot, "app/templates/pws/");
            java.io.File templatesPwsRootWEBINFFolder = new java.io.File(templatesPwsRootFolder, "WEB-INF");
            java.io.File projectSpringApp = new java.io.File(templatesPwsRootWEBINFFolder, "project-springapp.xml");
            PwsInstall.insertImport(projectSpringApp, newName + "-runtime-beans.xml");

            java.io.File projectPartnerBeans = new java.io.File(templatesPwsRootWEBINFFolder, "project-partner-beans.xml");
            PwsInstall.insertEntryKey(projectPartnerBeans, runJars, designJars, newName);

            ret.setPath("/tmp");
            ret.setError("");
            ret.setWidth("");
            ret.setHeight("");

        } catch (Exception e) {
            ret.setError(e.getMessage());
            return ret;
        }

        try {
            com.wavemaker.common.util.IOUtils.deleteRecursive(tmpDir);
        } catch (Exception e) {
            return ret;
        }
        return ret;
    }

    private Folder getCurrentProjectRoot() {
        return this.getProjectManager().getCurrentProject().getRootFolder();
    }

    public RuntimeAccess getRuntimeAccess() {
        return this.runtimeAccess;
    }

    public void setRuntimeAccess(RuntimeAccess runtimeAccess) {
        this.runtimeAccess = runtimeAccess;
    }

    public ProjectManager getProjectManager() {
        return this.projectManager;
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public DeploymentManager getDeploymentManager() {
        return this.deploymentManager;
    }

    public void setDeploymentManager(DeploymentManager deploymentManager) {
        this.deploymentManager = deploymentManager;
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    public UpgradeManager getUpgradeManager() {
        return this.upgradeManager;
    }

    public void setUpgradeManager(UpgradeManager upgradeManager) {
        this.upgradeManager = upgradeManager;
    }

    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.applicationEventPublisher = applicationEventPublisher;
    }

    /**
     * An inner class containing the return from an openProject operation. This includes the web path to the project,
     * and any messages to display to the user about the project.
     */
    public static class OpenProjectReturn {

        private String webPath;

        private UpgradeInfo upgradeMessages;

        public String getWebPath() {
            return this.webPath;
        }

        public void setWebPath(String webPath) {
            this.webPath = webPath;
        }

        public UpgradeInfo getUpgradeMessages() {
            return this.upgradeMessages;
        }

        public void setUpgradeMessages(UpgradeInfo upgradeMessages) {
            this.upgradeMessages = upgradeMessages;
        }
    }

}
