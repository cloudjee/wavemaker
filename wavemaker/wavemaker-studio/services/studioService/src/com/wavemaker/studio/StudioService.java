/*
 * Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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
import java.io.FileOutputStream;
import java.io.IOException;
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

import org.apache.tools.ant.BuildException;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.io.File;
import com.wavemaker.io.Folder;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
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
public class StudioService extends ClassLoader {

    private RuntimeAccess runtimeAccess;

    private ProjectManager projectManager;

    private DeploymentManager deploymentManager;

    private StudioFileSystem fileSystem;

    private UpgradeManager upgradeManager;

    private StudioConfiguration studioConfiguration;

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
        com.wavemaker.io.File file = this.projectManager.getCurrentProject().getRoot().getFile(getWebDirPath(path));
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
        File file = this.projectManager.getCurrentProject().getRoot().getFile(getWebDirPath(path));
        if (!file.exists() || canClobber) {
            file.getContent().write(data);
        }
        writePhoneGapFile(path, data);
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
        File logFile = this.fileSystem.getWavemMakerHomeFolder().getFile("logs/wm.log");
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
            PEmpty.put("logs", "");
            PEmpty.put("lastStamp", 0);
            return PEmpty;
        }
        String s = IOUtils.read(logFile);

        if (lastStamp.length() > 0) {
            // remove everything up to START_WM_LOG_LINE lastStamp
            Pattern newStuffPattern = Pattern.compile("^.*START_WM_LOG_LINE\\s+" + lastStamp + "\\s+", java.util.regex.Pattern.DOTALL);
            Matcher newStuffMatcher = newStuffPattern.matcher(s);
            s = newStuffMatcher.replaceFirst("");
            s = s.replaceFirst("^.*?END_WM_LOG_LINE", ""); // replace everything
                                                           // from the start of
                                                           // whats left of
                                                           // this
                                                           // line to
                                                           // END_WM_LOG_LINE
        }

        java.util.regex.Pattern htmlTagPattern = java.util.regex.Pattern.compile("(START_WM_LOG_LINE\\s+\\d+\\:\\d+\\:\\d+,\\d+\\s+)(\\S+) (\\(.*\\))");
        java.util.regex.Matcher htmlTagMatcher = htmlTagPattern.matcher(s);
        s = htmlTagMatcher.replaceAll("$1<span class='LogType$2'>$2</span> <span class='LogLocation'>$3</span>");
        java.util.regex.Pattern p = java.util.regex.Pattern.compile("START_WM_LOG_LINE\\s+\\d+\\:\\d+\\:\\d+,\\d+");
        java.util.regex.Matcher m = p.matcher(s);
        String timestamp = "";
        while (m.find()) {
            timestamp = m.group();
            timestamp = timestamp.replaceFirst("START_WM_LOG_LINE\\s+.*?", "");
        }
        Hashtable<String, Object> P = new Hashtable<String, Object>();
        s = m.replaceAll(""); // remove all START_WM_LOG_LINE xxx:xxx:xxx,xxx
        s = s.replaceAll(" END_WM_LOG_LINE", "");
        if (s.matches("^\\s+$")) {
            s = "";
        }
        s = s.replaceAll("(\\S+)(\\n\\r|\\r\\n|\\n|\\r)", "$1<br/>");
        Pattern trimPattern = Pattern.compile("^\\s*", Pattern.MULTILINE);
        Matcher trimMatcher = trimPattern.matcher(s);
        s = trimMatcher.replaceAll("");
        P.put("logs", s);
        P.put("lastStamp", timestamp);
        return P;
    }

    // FIXME getPropertyHelp, getContent and getLatestPatches all look very similar, can we refactor common aspects?

    @ExposeToClient
    public String getPropertyHelp(String url) throws IOException {
        URL help_url;
        String s = "";
        try {
            help_url = new URL(url);

            // Read all the text returned by the server
            BufferedReader in = new BufferedReader(new InputStreamReader(help_url.openStream()));
            String str;
            StringBuffer sbuf = new StringBuffer();
            while ((str = in.readLine()) != null) {
                sbuf.append(str + "\n");
            }
            str = sbuf.toString();

            in.close();

            String startDivStr = "</h2><p/>";
            int startDiv = str.indexOf(startDivStr);
            if (startDiv == -1) {
                return "";
            }
            startDiv += startDivStr.length();

            int endDivID = str.indexOf("\"xwikidata\"");
            int endDiv = str.lastIndexOf("<div", endDivID);

            s = str.substring(startDiv, endDiv);
            s = s.replaceAll("<a ", "<a target='wiki' ");
        } catch (Exception e) {
            s += "No documentation found for this topic";
        }

        return s;
    }

    @ExposeToClient
    public String getContent(String inUrl) throws IOException {
        URL url = new URL(inUrl);
        String str = "";
        try {
            // Read all the text returned by the server
            BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));

            StringBuffer sbuf = new StringBuffer();
            while ((str = in.readLine()) != null) {
                sbuf.append(str + "\n");
            }
            str = sbuf.toString();

            in.close();
            str = str.replace("<head>", "<head><base href='" + inUrl
                + "' /><base target='_blank' /><script>top.studio.startPageIFrameLoaded();</script>");
        } catch (Exception e) {
            str = "";
        }

        return str;
    }

    @ExposeToClient
    public String getLatestPatches(String url) {
        URL patch_url;
        String s = "";
        try {
            patch_url = new URL(url);

            // Read all the text returned by the server
            BufferedReader in = new BufferedReader(new InputStreamReader(patch_url.openStream()));
            String str;
            StringBuffer sbuf = new StringBuffer();
            while ((str = in.readLine()) != null) {
                sbuf.append(str + "\n");
            }
            str = sbuf.toString();
            in.close();

            String startDivStr = "PATCHCODE'>";
            int startDiv = str.indexOf(startDivStr);
            if (startDiv == -1) {
                return "";
            }
            startDiv += startDivStr.length();

            int endDiv = str.indexOf("</textarea>");
            s = str.substring(startDiv, endDiv);
        } catch (Exception e) {
            System.out.println("ERROR:" + e.toString());
            s += "Could not find patches";
        }

        return s;
    }

    /*
     * Note this should probably be moved to javaServices.java, but I didn't want to spend the time to figure out how to
     * access studioConfiguration from that file
     */
    @ExposeToClient
    public String getJavaServiceTemplate(String templateName) throws IOException {
        return getProjectManager().getCurrentProject().readFile(
            this.fileSystem.getStudioWebAppRoot().createRelative("/app/templates/javaservices" + templateName));
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
            IOUtils.makeDirectories(tmpDir, webapproot);

            java.io.File outputFile = new java.io.File(tmpDir, originalName);
            String newName = originalName.replaceAll("[ 0-9()]*.zip$", "");
            System.out.println("OLD NAME:" + originalName + "; NEW NAME:" + newName);
            FileOutputStream fos = new FileOutputStream(outputFile);
            IOUtils.copy(file.getInputStream(), fos);
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
                IOUtils.copy(pages[i], new java.io.File(webapprootPages, pages[i].getName()));
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
                        IOUtils.copy(languages2[j], new java.io.File(dictionaryDest, languages[i].getName()));
                    }
                } else {
                    IOUtils.copy(languages[i], dictionaryDest);
                }
            }

            /*
             * Import the designtime jars STATUS: DONE
             */
            java.io.File studioLib = new java.io.File(webapproot, "WEB-INF/lib");
            java.io.File designtimeFolder = new java.io.File(extFolder, "designtime");
            java.io.File[] designJars = designtimeFolder.listFiles();
            for (int i = 0; i < designJars.length; i++) {
                IOUtils.copy(designJars[i], studioLib);
            }

            /*
             * Import the runtime jars STATUS: DONE
             */
            java.io.File templatesPwsFolder = new java.io.File(webapproot, "app/templates/pws/" + newName);
            java.io.File templatesPwsWEBINFFolder = new java.io.File(templatesPwsFolder, "WEB-INF");
            java.io.File templatesPwsWEBINFLibFolder = new java.io.File(templatesPwsWEBINFFolder, "lib");
            /* Delete any old jars from prior imports */
            if (templatesPwsFolder.exists()) {
                IOUtils.deleteRecursive(templatesPwsFolder);
            }

            IOUtils.makeDirectories(templatesPwsWEBINFLibFolder, webapproot);

            java.io.File runtimeFolder = new java.io.File(extFolder, "runtime");
            java.io.File[] runJars = runtimeFolder.listFiles();
            for (int i = 0; i < runJars.length; i++) {
                IOUtils.copy(runJars[i], studioLib);
                IOUtils.copy(runJars[i], templatesPwsWEBINFLibFolder);
            }

            /*
             * Import packages.js
             */
            java.io.File packagesFile = new java.io.File(webapproot, "app/packages.js");
            String packagesExt = "";
            try {
                // Get the packages.js file from our extensions.zip file */
                packagesExt = IOUtils.read(new java.io.File(extFolder, "packages.js"));
            } catch (Exception e) {
                packagesExt = "";
            }
            /* If there is a packages file provided... */
            if (packagesExt.length() > 0) {
                /* Build the string we're appending to packages.js */
                String startPackagesExt = "/* START PARTNER " + newName + " */\n";
                String endPackagesExt = "/* END PARTNER " + newName + " */\n";
                packagesExt = ",\n" + startPackagesExt + packagesExt + "\n" + endPackagesExt;

                String packages = IOUtils.read(packagesFile);

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
                IOUtils.write(packagesFile, packages);
            }

            /*
             * Import spring config files STATUS: DONE
             */
            java.io.File webinf = new java.io.File(webapproot, "WEB-INF");
            java.io.File designxml = new java.io.File(extFolder, newName + "-tools-beans.xml");
            java.io.File runtimexml = new java.io.File(extFolder, newName + "-runtime-beans.xml");
            IOUtils.copy(designxml, webinf);
            IOUtils.copy(runtimexml, webinf);
            IOUtils.copy(runtimexml, templatesPwsWEBINFFolder);

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
            IOUtils.deleteRecursive(tmpDir);
        } catch (Exception e) {
            return ret;
        }
        return ret;
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
            int dotindex = filename.lastIndexOf(".");
            String ext = dotindex == -1 ? "" : filename.substring(dotindex + 1);
            if (dotindex == -1) {
                throw new IOException("Please upload a jar file");
            } else if (!ext.equals("jar")) {
                throw new IOException("Please upload a jar file, not a " + ext + " file");
            }

            java.io.File destDir = new java.io.File(WMAppContext.getInstance().getAppContextRoot());
            destDir = new java.io.File(destDir, "WEB-INF/lib");

            // Write the zip file to outputFile
            String originalName = file.getOriginalFilename();
            java.io.File outputFile = new java.io.File(destDir, originalName);

            FileOutputStream fos = new FileOutputStream(outputFile);
            IOUtils.copy(file.getInputStream(), fos);
            file.getInputStream().close();
            fos.close();
            ret.setPath(outputFile.getName());
            ret.setError("");
            ret.setWidth("");
            ret.setHeight("");
        } catch (IOException e) {
            ret.setError(e.getMessage());
        }
        return ret;
    }

    private Folder getCurrentProjectRoot() {
        return this.getProjectManager().getCurrentProject().getRoot();
    }

    // FIXME PW discuss and possibly remove phone gap
    private void writePhoneGapFile(String path, String data) throws IOException {
        path = path.trim();
        String projectName = this.projectManager.getCurrentProject().getProjectName();
        String pathPrefix = "phonegap/" + projectName + "/www/";
        Resource phonegap = this.projectManager.getCurrentProject().getProjectRoot().createRelative(pathPrefix);

        if (phonegap.exists()) {
            Resource lib = phonegap.createRelative("lib");
            this.projectManager.getCurrentProject().writeFile(pathPrefix + (path.startsWith("/") ? path.substring(1) : path), data, false);
        }
    }

    @ExposeToClient
    public void setupPhonegapFiles(int portNumb, boolean isDebug) throws IOException {
        String projectName = this.projectManager.getCurrentProject().getProjectName();
        String pathPrefix = "phonegap/" + projectName + "/www/";
        Resource phonegap = this.projectManager.getCurrentProject().getProjectRoot().createRelative(pathPrefix);
        if (phonegap.exists()) {
            Resource lib = phonegap.createRelative("lib");
            if (!lib.exists()) {
                // Copy studio's lib folder into phonegap's folder
                IOUtils.copy(new java.io.File(this.fileSystem.getStudioWebAppRoot().getFile(), "lib"), lib.getFile());

                // Copy the project's pages folder into phonegap's folder
                IOUtils.copy(this.projectManager.getCurrentProject().getWebAppRoot().createRelative("pages").getFile(),
                    phonegap.createRelative("pages").getFile());

                // Copy the common folder into phonegap's folder
                IOUtils.copy(this.fileSystem.getCommonDir().getFile(), phonegap.createRelative("common").getFile());

                Resource MainViewerLib = this.projectManager.getCurrentProject().getProjectRoot().createRelative(
                    "phonegap/" + projectName + "/" + projectName + "/Classes/MainViewController.m");
                System.out.println("MAINVIEWER: " + MainViewerLib.getFile().getAbsolutePath());
                String MainViewerStr = IOUtils.read(MainViewerLib.getFile());
                String MainViewerSearchStr = "(BOOL)shouldAutorotateToInterfaceOrientation";
                int MainViewerStart = MainViewerStr.indexOf(MainViewerSearchStr);
                int MainViewerEnd = MainViewerStr.indexOf("}", MainViewerStart) + 1;
                MainViewerStr = MainViewerStr.substring(0, MainViewerStart)
                    + "(BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation\n{\nreturn YES;\n}\n"
                    + MainViewerStr.substring(MainViewerEnd);
                System.out.println("MainViewer:" + MainViewerStart + " | " + MainViewerEnd + " | " + MainViewerStr);
                IOUtils.write(MainViewerLib.getFile(), MainViewerStr);
            }
        }
    }

    @ExposeToClient
    public void updatePhonegapFiles(int portNumb, boolean isDebug) throws IOException {
        String projectName = this.projectManager.getCurrentProject().getProjectName();
        String pathPrefix = "phonegap/" + projectName + "/www/";
        Resource phonegap = this.projectManager.getCurrentProject().getProjectRoot().createRelative(pathPrefix);
        if (phonegap.exists()) {
            Resource lib = phonegap.createRelative("lib");
            Resource indexhtml = phonegap.createRelative("index.html");
            String indexhtml_text = IOUtils.read(indexhtml.getFile());
            // Update paths in index.html
            indexhtml_text = indexhtml_text.replaceAll("/wavemaker/", "");

            // Add phonegap library
            java.io.File[] listing = phonegap.getFile().listFiles(new java.io.FilenameFilter() {

                @Override
                public boolean accept(java.io.File dir, String name) {
                    return name.indexOf("phonegap-") == 0 && name.indexOf(".js") != -1;
                }
            });
            if (indexhtml_text.indexOf("<script type=\"text/javascript\" src=\"" + listing[0].getName() + "\"></script>") == -1) {
                indexhtml_text = indexhtml_text.replace("runtimeLoader.js\"></script>",
                    "runtimeLoader.js\"></script>\n<script type=\"text/javascript\" src=\"" + listing[0].getName() + "\"></script>");
            }
            IOUtils.write(indexhtml.getFile(), indexhtml_text);

            // Concatenate boot.js and config.js together and save as config.js
            Resource configjs = phonegap.createRelative("config.js");
            String configjs_text = readWebFile("config.js"); // get the project config.js rather than the phonegap
                                                             // version which has already been modified; TODO: This is
                                                             // bad to constantly clobber changes to config.js; future
                                                             // versions of config.js maybe need to build in boot.js or
                                                             // else add back in loading of boot.js
            String boottext = IOUtils.read(lib.createRelative("boot").createRelative("boot.js").getFile());

            int startDebug = configjs_text.indexOf("djConfig.debugBoot");
            int endDebug = configjs_text.indexOf(";", startDebug);
            configjs_text = configjs_text.substring(0, startDebug) + "djConfig.debugBoot = " + isDebug + configjs_text.substring(endDebug);
            System.out.println("START: " + startDebug + "; END: " + endDebug);
            configjs_text = configjs_text.replaceAll("/wavemaker/", "/").replace("wm.relativeLibPath = \"../lib/\";",
                "wm.relativeLibPath = \"lib/\";")
                + "\nwm.xhrPath = 'http://" + SystemUtils.getIP() + ":" + portNumb + "/" + projectName + "/';\n" + boottext;
            IOUtils.write(configjs.getFile(), configjs_text);

            // Update phonegap.plist
            java.io.File phonegap_plist_file = new java.io.File(phonegap.getFile().getParent(), projectName + "/PhoneGap.plist");
            String phonegap_plist = IOUtils.read(phonegap_plist_file);
            String startExpression = "<key>ExternalHosts</key>";
            int startindex = phonegap_plist.indexOf(startExpression);
            int startindex1 = startindex + startExpression.length();
            int endindex1 = phonegap_plist.indexOf("</array>", startindex1);
            if (endindex1 != -1) {
                endindex1 += "</array>".length();
            }
            int endindex2 = phonegap_plist.indexOf("<array/>", startindex1);
            if (endindex2 != -1) {
                endindex2 += "<array/>".length();
            }
            int endindex;
            if (endindex1 == -1) {
                endindex = endindex2;
            } else if (endindex2 == -1) {
                endindex = endindex1;
            } else if (endindex1 > endindex2) {
                endindex = endindex2;
            } else {
                endindex = endindex1;
            }
            phonegap_plist = phonegap_plist.substring(0, startindex1) + "<array><string>" + SystemUtils.getIP() + "</string></array>"
                + phonegap_plist.substring(endindex);
            IOUtils.write(phonegap_plist_file, phonegap_plist);

            // Recopy common; TODO: Update registering of modules for this new path
            if (phonegap.createRelative("common").getFile().exists()) {
                IOUtils.deleteRecursive(phonegap.createRelative("common").getFile());
            }
            IOUtils.copy(this.fileSystem.getCommonDir().getFile(), phonegap.createRelative("common").getFile());

            // Recopy resources
            if (phonegap.createRelative("resources").getFile().exists()) {
                IOUtils.deleteRecursive(phonegap.createRelative("resources").getFile());
            }
            IOUtils.copy(this.projectManager.getCurrentProject().getWebAppRoot().createRelative("resources").getFile(),
                phonegap.createRelative("resources").getFile());
        }
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
