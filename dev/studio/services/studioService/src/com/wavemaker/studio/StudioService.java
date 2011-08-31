/*
 * Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
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
import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.pws.install.PwsInstall;
import com.wavemaker.tools.serializer.FileSerializerException;

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

    @ExposeToClient
    public String closurecompile(String s) {
        String result = null;
        URL url = null;
        try {
            System.out.println("A");
            url = new URL("http://closure-compiler.appspot.com/compile");
        } catch (MalformedURLException e) {
            System.out.println(e.toString());
            return "";
        }
        System.out.println("B");
        try {
            URLConnection conn = url.openConnection();
            conn.setDoOutput(true);
            OutputStreamWriter writer = new OutputStreamWriter(conn.getOutputStream());
            System.out.println("C");
            String data = "output_format=json&output_info=errors&js_code=" + java.net.URLEncoder.encode(s, ServerConstants.DEFAULT_ENCODING);

            // write parameters
            writer.write(data);
            writer.flush();
            System.out.println("D");
            StringBuffer answer = new StringBuffer();
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            System.out.println("E");
            String line;
            while ((line = reader.readLine()) != null) {
                answer.append(line);
            }
            System.out.println("F");
            writer.close();
            reader.close();
            result = answer.toString();
        } catch (Exception e) {
            System.out.println(e.toString());
        }
        System.out.println("F: " + result);
        return result;
    }

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
            // if Tomcat isn't running, or we can't do it for some other reason,
            // just close the project
        }

        this.projectManager.closeProject();
    }

    /**
     * @see ProjectManager#openProject(String)
     * @return An OpenProjectReturn object containing the current web path, as well as any upgrades that were performed.
     */
    @ExposeToClient
    public OpenProjectReturn openProject(String projectName) throws IOException {
        this.projectManager.openProject(this.projectManager.getUserProjectPrefix() + projectName);

        OpenProjectReturn ret = new OpenProjectReturn();
        ret.setUpgradeMessages(getUpgradeManager().doUpgrades(this.projectManager.getCurrentProject()));
        ret.setWebPath(getWebPath());
        return ret;
    }

    /**
     * @see ProjectManager#newProject(String)
     * @return getWebPath()
     */
    @ExposeToClient
    public String newProject(String projectName) throws IOException {

        this.projectManager.newProject(this.projectManager.getUserProjectPrefix() + projectName);
        return getWebPath();
    }

    /**
     * @see ProjectManager#newProject(String, boolean)
     * @return getWebPath()
     */
    @ExposeToClient
    public String newProjectNoTemplate(String projectName) throws IOException {

        this.projectManager.newProject(this.projectManager.getUserProjectPrefix() + projectName, true);
        return getWebPath();
    }

    /**
     * In addition to deleting the project, this will undeploy it from Tomcat.
     * 
     * @see ProjectManager#deleteProject(String)
     */
    @ExposeToClient
    public void deleteProject(String projectName) throws IOException {
        String pName = this.projectManager.getUserProjectPrefix() + projectName;
        try {
            this.deploymentManager.testRunClean(this.projectManager.getProjectDir(pName, true).getURI().toString(), pName);
        } catch (WMRuntimeException e) {
            // if Tomcat isn't running, or we can't do it for some other reason,
            // just delete the project
        } catch (BuildException e) {
            // if Tomcat isn't running, or we can't do it for some other reason,
            // just delete the project
        }

        this.projectManager.deleteProject(pName);
    }

    /**
     * @see ProjectManager#copyProject(String, String)
     */
    @ExposeToClient
    public void copyProject(String sourceProjectName, String destinationProjectName) throws IOException {
        this.projectManager.copyProject(this.projectManager.getUserProjectPrefix() + sourceProjectName, this.projectManager.getUserProjectPrefix()
            + destinationProjectName);
    }

    /**
     * @throws FileAccessException
     * @see ProjectManager#listProjects()
     */
    @ExposeToClient
    public String[] listProjects() throws FileAccessException {
        String prefix = this.projectManager.getUserProjectPrefix();
        SortedSet<String> projects = this.projectManager.listProjects(prefix);
        Object[] projectListO = projects.toArray();
        String[] projectList = new String[projectListO.length];
        for (int i = 0; i < projectListO.length; i++) {
            String s = projectListO[i].toString();
            if (s.startsWith(prefix)) {
                projectList[i] = s.substring(prefix.length());
            } else {
                projectList[i] = s;
            }
        }
        return projectList;
    }

    /**
     * Write a file to the project, with specified relativePath and contents of a serialization of obj.
     * 
     * @param relativePath The path to the object (relative to the project's root).
     * @param obj The Object representing the contents of the file.
     * @throws FileSerializerException
     */
    @ExposeToClient
    public void writeObject(String relativePath, Object obj) throws FileSerializerException {

        this.projectManager.getCurrentProject().writeObject(relativePath, obj);
    }

    /**
     * Read a file from the project, with specified relativePath. Returns the Object representing the contents of the
     * file.
     * 
     * @param relativePath The path to the object (relative to the project's root).
     * @return The Object representing the contents of the file, or null if the file doesn't exist.
     * @throws ProjectFileSerializerException
     */
    @ExposeToClient
    public Object readObject(String relativePath) throws FileSerializerException {
        return this.projectManager.getCurrentProject().readObject(relativePath);
    }

    /**
     * Write arbitrary data to a file. The file can be relative to the activeGridHome, or eventually absolute. This will
     * clobber existing files.
     * 
     * @param path The path to write to (relative to the project root).
     * @param data The data to write (as a String).
     * @throws IOException
     */
    @ExposeToClient
    public void writeFile(String path, String data) throws IOException {

        writeFile(path, data, false);
    }

    @ExposeToClient
    public void writeFile(String path, String data, boolean noClobber) throws IOException {

        this.projectManager.getCurrentProject().writeFile(path, data, noClobber);
    }

    /**
     * Read arbitrary data from a file.
     * 
     * @param path The path to read from (relative to the project root).
     * @return The data read
     * @throws IOException
     */
    @ExposeToClient
    public String readFile(String path) throws IOException {
        return this.projectManager.getCurrentProject().readFile(path);
    }

    /**
     * Returns true if the file exists.
     * 
     * @param path The path to check (relative to the project root).
     * @return True iff the path points to an existant file or directory.
     */
    @ExposeToClient
    public boolean fileExists(String path) {
        try {
            return this.projectManager.getCurrentProject().fileExists(this.projectManager.getUserProjectPrefix() + path);
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    @ExposeToClient
    public void writeCommonFile(String path, String data) throws IOException {
        Resource commonDir = this.fileSystem.getCommonDir();
        Resource writeFile = commonDir.createRelative(path);
        if (writeFile.exists()) {
            String original = this.projectManager.getCurrentProject().readFile(writeFile);

            if (original.equals(data)) {
                return;
            }
        }
        this.projectManager.getCurrentProject().writeFile(writeFile, data);
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
                // str is one line of text; readLine() strips the newline
                // character(s)
            }
            str = sbuf.toString();
            in.close();
            /*
             * int startDiv = str.indexOf("<div class=\"main layoutsubsection\">");
             */

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

        String newPath = ProjectConstants.WEB_DIR + (path.startsWith("/") ? path.substring(1) : path);
        this.projectManager.getCurrentProject().writeFile(newPath, data, noClobber);
    }

    /**
     * Read arbitrary data from a file in this project's web directory.
     * 
     * @param path
     * @param data
     */
    @ExposeToClient
    public String readWebFile(String path) throws IOException {

        String newPath = ProjectConstants.WEB_DIR + "/" + this.projectManager.getUserProjectPrefix() + path;
        return this.projectManager.getCurrentProject().readFile(newPath);
    }

    /**
     * Return the web path of the current project (including the project name). For instance, if your project is named
     * "foo", this will return "foo/webapproot".
     * 
     * @return
     */
    @ExposeToClient
    public String getWebPath() {
        return this.projectManager.getCurrentProject().getProjectName() + "/" + ProjectConstants.WEB_DIR;
    }

    /**
     * Get a map of the current studio preferences.
     */
    @ExposeToClient
    public Map<String, String> getPreferences() {
        return getStudioConfiguration().getPreferencesMap();
    }

    /**
     * Update the preferences with new values.
     * 
     * @param prefs
     * @throws FileAccessException
     */
    @ExposeToClient
    public void setPreferences(Map<String, String> prefs) throws FileAccessException {
        getStudioConfiguration().setPreferencesMap(prefs);
    }

    /**
     * Get Project properties for given prefix.
     */
    @ExposeToClient
    public Properties getProperties(String prefix) {
        return this.projectManager.getCurrentProject().getProperties(prefix);
    }

    /**
     * Get the projec type for the current build of studio (right now, one of enterprise, community, or cloud).
     * 
     * @throws IOException
     */
    @ExposeToClient
    public String getStudioProjectType() throws IOException {

        String versionFileContents = LocalStudioConfiguration.getCurrentVersionInfoString();
        final Pattern p = Pattern.compile("^Build type: (.*)$", Pattern.MULTILINE);

        Matcher m = p.matcher(versionFileContents);
        if (!m.find()) {
            throw new WMRuntimeException("bad version string: " + versionFileContents);
        }
        return m.group(1);

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
        Resource logDir = this.fileSystem.createPath(this.fileSystem.getWaveMakerHome(), "logs/");
        Resource logFile = logDir.createRelative("wm.log");
        return IOUtils.tail(logFile.getFile(), lines);
    }

    @ExposeToClient
    public Hashtable<String, Object> getLogUpdate(String filename, String lastStamp) throws IOException {
        File logFolder = new File(System.getProperty("catalina.home") + "/logs/ProjectLogs", this.projectManager.getCurrentProject().getProjectName());
        // File logFolder = projectManager.getCurrentProject().getLogFolder();
        File logFile = new File(logFolder, filename);
        // System.out.println("READING LOG FILE : " + logFile.toString());
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
                // str is one line of text; readLine() strips the newline
                // character(s)
            }
            str = sbuf.toString();

            in.close();
            /*
             * int startDiv = str.indexOf("<div class=\"main layoutsubsection\">");
             */

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
            // s = s.replaceAll("/wiki/bin/",
            // "http://dev.wavemaker.com/wiki/bin/");
        } catch (Exception e) {
            s += "No documentation found for this topic";
        }

        return s;
    }

    @ExposeToClient
    public String getContent(String inUrl) throws IOException {
        // System.out.println("URL:"+inUrl);
        URL url = new URL(inUrl);
        String str = "";
        try {
            // Read all the text returned by the server
            BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));

            StringBuffer sbuf = new StringBuffer();
            while ((str = in.readLine()) != null) {
                sbuf.append(str + "\n");
                // str is one line of text; readLine() strips the newline
                // character(s)
            }
            str = sbuf.toString();

            in.close();
            str = str.replace("<head>", "<head><base href='" + inUrl
                + "' /><base target='_blank' /><script>top.studio.startPageIFrameLoaded();</script>");

            // str = str.replaceAll("<a ", "<a target='newspage' ");
            // str = str.replaceAll("/wiki/bin/",
            // "http://dev.wavemaker.com/wiki/bin/");
        } catch (Exception e) {
            str = "";
        }

        return str;
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
        File tmpDir;
        try {
            File webapproot = new File(WMAppContext.getInstance().getAppContextRoot());

            String filename = file.getOriginalFilename();
            int dotindex = filename.lastIndexOf(".");
            String ext = dotindex == -1 ? "" : filename.substring(dotindex + 1);
            if (dotindex == -1) {
                throw new IOException("Please upload a zip file");
            } else if (!ext.equals("zip")) {
                throw new IOException("Please upload a zip file, not a " + ext + " file");
            }

            String originalName = file.getOriginalFilename();
            tmpDir = new File(webapproot, "tmp");
            IOUtils.makeDirectories(tmpDir, webapproot);

            File outputFile = new File(tmpDir, originalName);
            String newName = originalName.replaceAll("[ 0-9()]*.zip$", "");
            System.out.println("OLD NAME:" + originalName + "; NEW NAME:" + newName);
            FileOutputStream fos = new FileOutputStream(outputFile);
            IOUtils.copy(file.getInputStream(), fos);
            file.getInputStream().close();
            fos.close();
            File extFolder = com.wavemaker.tools.project.ResourceManager.unzipFile(this.fileSystem, new FileSystemResource(outputFile)).getFile();

            /*
             * Import the pages from the pages folder STATUS: DONE
             */
            File webapprootPages = new File(webapproot, "pages");
            File pagesFolder = new File(extFolder, "pages");
            File[] pages = pagesFolder.listFiles();
            for (int i = 0; i < pages.length; i++) {
                IOUtils.copy(pages[i], new File(webapprootPages, pages[i].getName()));
            }

            /*
             * Import the language files from the dictionaries folder and subfolder STATUS: DONE
             */
            File dictionaryDest = new File(webapproot, "language/nls");
            File dictionarySrc = new File(extFolder, "language/nls");
            File[] languages = dictionarySrc.listFiles();
            for (int i = 0; i < languages.length; i++) {
                if (languages[i].isDirectory()) {
                    System.out.println("GET LISTING OF " + languages[i].getName());
                    File[] languages2 = languages[i].listFiles();
                    for (int j = 0; j < languages2.length; j++) {
                        System.out.println("COPY " + languages2[j].getName() + " TO "
                            + new File(dictionaryDest, languages[i].getName()).getAbsolutePath());
                        IOUtils.copy(languages2[j], new File(dictionaryDest, languages[i].getName()));
                    }
                } else {
                    IOUtils.copy(languages[i], dictionaryDest);
                }
            }

            /*
             * Import the designtime jars STATUS: DONE
             */
            File studioLib = new File(webapproot, "WEB-INF/lib");
            File designtimeFolder = new File(extFolder, "designtime");
            File[] designJars = designtimeFolder.listFiles();
            for (int i = 0; i < designJars.length; i++) {
                IOUtils.copy(designJars[i], studioLib);
            }

            /*
             * Import the runtime jars STATUS: DONE
             */
            File templatesPwsFolder = new File(webapproot, "app/templates/pws/" + newName);
            File templatesPwsWEBINFFolder = new File(templatesPwsFolder, "WEB-INF");
            File templatesPwsWEBINFLibFolder = new File(templatesPwsWEBINFFolder, "lib");
            /* Delete any old jars from prior imports */
            if (templatesPwsFolder.exists()) {
                IOUtils.deleteRecursive(templatesPwsFolder);
            }

            IOUtils.makeDirectories(templatesPwsWEBINFLibFolder, webapproot);

            File runtimeFolder = new File(extFolder, "runtime");
            File[] runJars = runtimeFolder.listFiles();
            for (int i = 0; i < runJars.length; i++) {
                IOUtils.copy(runJars[i], studioLib);
                IOUtils.copy(runJars[i], templatesPwsWEBINFLibFolder);
            }

            /*
             * Import packages.js STATUS: DONE
             */
            String packagesExt = "";
            try {
                packagesExt = IOUtils.read(new File(extFolder, "packages.js"));
            } catch (Exception e) {
                packagesExt = "";
            }
            /* If there is a packages file provided... */
            if (packagesExt.length() > 0) {
                /* Build the string we're appending to packages.js */
                String startPackagesExt = "/* START PARTNER " + newName + " */\n";
                String endPackagesExt = "/* END PARTNER " + newName + " */\n";
                packagesExt = ",\n" + startPackagesExt + packagesExt + "\n" + endPackagesExt;

                /* Create the packagesDir if needed */
                File packagesDir = new File(this.fileSystem.getCommonDir().getFile(), "packages");
                if (!packagesDir.exists()) {
                    packagesDir.mkdir();
                }
                File commonPackagesFile = new File(packagesDir, "packages.js");
                String packages = IOUtils.read(commonPackagesFile);

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
                IOUtils.write(commonPackagesFile, packages);
            }

            /*
             * Import spring config files STATUS: DONE
             */
            File webinf = new File(webapproot, "WEB-INF");
            File designxml = new File(extFolder, newName + "-tools-beans.xml");
            File runtimexml = new File(extFolder, newName + "-runtime-beans.xml");
            IOUtils.copy(designxml, webinf);
            IOUtils.copy(runtimexml, webinf);
            IOUtils.copy(runtimexml, templatesPwsWEBINFFolder);

            /*
             * Modify Spring files to include beans in the partner package.
             */
            File studioSpringApp = new File(webinf, "studio-springapp.xml");
            PwsInstall.insertImport(studioSpringApp, newName + "-tools-beans.xml");
            PwsInstall.insertImport(studioSpringApp, newName + "-runtime-beans.xml");

            File studioPartnerBeans = new File(webinf, "studio-partner-beans.xml");
            PwsInstall.insertEntryKey(studioPartnerBeans, runJars, designJars, newName);

            File templatesPwsRootFolder = new File(webapproot, "app/templates/pws/");
            File templatesPwsRootWEBINFFolder = new File(templatesPwsRootFolder, "WEB-INF");
            File projectSpringApp = new File(templatesPwsRootWEBINFFolder, "project-springapp.xml");
            PwsInstall.insertImport(projectSpringApp, newName + "-runtime-beans.xml");

            File projectPartnerBeans = new File(templatesPwsRootWEBINFFolder, "project-partner-beans.xml");
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

    @Deprecated
    private StudioConfiguration getStudioConfiguration() {
        return (StudioConfiguration) this.fileSystem;
    }

    public UpgradeManager getUpgradeManager() {
        return this.upgradeManager;
    }

    public void setUpgradeManager(UpgradeManager upgradeManager) {
        this.upgradeManager = upgradeManager;
    }

    // inner classes
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

    //db2jcc.jar - com.ibm.db2.app.DB2StructOutput.class
    //ojdbc.jar - oracle.jdbc.driver.OracleDatabaseMetaData
    //wsdl4j.jar - javax.wsdl.factory.WSDLFactory.class
    //hibernate3.jar - org.hibernate.cfg.Environment.class
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

            File destDir = new File(WMAppContext.getInstance().getAppContextRoot());
            destDir = new File(destDir, "WEB-INF/lib");

            // Write the zip file to outputFile
            String originalName = file.getOriginalFilename();
            File outputFile = new File(destDir, originalName);

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
}
