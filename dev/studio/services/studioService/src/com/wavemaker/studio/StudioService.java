/*
 * Copyright (C) 2007-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
package com.wavemaker.studio;

/* Added for closure */
import java.net.URLEncoder;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URLConnection;
import java.io.OutputStreamWriter;



import java.io.File;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.InputStream;
import java.net.URL;
import java.io.IOException;
import java.util.Map;
import java.util.Properties;
import java.util.SortedSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.FileUtils;

import org.apache.tools.ant.BuildException;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.serializer.FileSerializerException;

import com.wavemaker.common.util.IOUtils;

import java.util.regex.Pattern;
import java.util.regex.Matcher;

/**
 * Main Studio service interface.  This service will manage the other studio
 * services, their inclusion into the HTTPSession, the current project, etc.
 * 
 * @author Matt Small
 * @version $Rev$ - $Date$
 *
 */
@HideFromClient
public class StudioService {

    @ExposeToClient
    public String closurecompile(String s) {
       String result  = null;
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
           String data = "output_format=json&output_info=errors&js_code=" +  java.net.URLEncoder.encode(s);
           
           //write parameters
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
        } catch(Exception e) {System.out.println(e.toString());}
      System.out.println("F: " + result);
       return result;
    }


    /**
     * Undeploy and close the project.
     * @see ProjectManager#closeProject()
     * @see DeploymentManager#undeploy()
     * @throws IOException
     */
    @ExposeToClient
    public void closeProject() throws IOException {
        
        try {
            deploymentManager.undeploy();
        } catch (RuntimeException ignore) {
            // if Tomcat isn't running, or we can't do it for some other reason,
            // just close the project
        }
        
        projectManager.closeProject();
    }
    
    /**
     * @see ProjectManager#openProject(String)
     * @return An OpenProjectReturn object containing the current web path, as
     *         well as any upgrades that were performed.
     */
    @ExposeToClient
    public OpenProjectReturn openProject(String projectName)
            throws IOException {
        projectManager.openProject(projectManager.getUserProjectPrefix() + projectName);

        OpenProjectReturn ret = new OpenProjectReturn();
        ret.setUpgradeMessages(getUpgradeManager().doUpgrades(
                projectManager.getCurrentProject()));
        ret.setWebPath(getWebPath());
        return ret;
    }

    /**
     * @see ProjectManager#newProject(String)
     * @return getWebPath()
     */
    @ExposeToClient
    public String newProject(String projectName) throws IOException {

        projectManager.newProject(projectManager.getUserProjectPrefix() + projectName);
        return getWebPath();
    }
    
    /**
     * @see ProjectManager#newProject(String, boolean)
     * @return getWebPath()
     */
    @ExposeToClient
    public String newProjectNoTemplate(String projectName)
            throws IOException {

        projectManager.newProject(projectManager.getUserProjectPrefix() + projectName, true);
        return getWebPath();
    }
    
    /**
     * In addition to deleting the project, this will undeploy it from Tomcat.
     * @see ProjectManager#deleteProject(String)
     */
    @ExposeToClient
    public void deleteProject(String projectName) throws IOException {
        String pName = projectManager.getUserProjectPrefix() + projectName;        
        try {
            deploymentManager.testRunClean(projectManager.getProjectDir(
                    pName, true).getAbsolutePath(), pName);
        } catch (WMRuntimeException e) {
            // if Tomcat isn't running, or we can't do it for some other reason,
            // just delete the project
        } catch (BuildException e) {
            // if Tomcat isn't running, or we can't do it for some other reason,
            // just delete the project
        }
        
        projectManager.deleteProject(pName);
    }
    
    /**
     * @see ProjectManager#copyProject(String, String)
     */
    @ExposeToClient
    public void copyProject(String sourceProjectName,
            String destinationProjectName) throws IOException {
        projectManager.copyProject(projectManager.getUserProjectPrefix() + sourceProjectName, projectManager.getUserProjectPrefix() + destinationProjectName);
    }
    
    /**
     * @throws FileAccessException
     * @see ProjectManager#listProjects()
     */
    @ExposeToClient
    public String[] listProjects() throws FileAccessException {
        String prefix = projectManager.getUserProjectPrefix();
        SortedSet<String> projects = projectManager.listProjects( prefix);
	Object[] projectListO = projects.toArray();
	String[] projectList = new String[projectListO.length];
	for (int i = 0; i < projectListO.length; i++) {
	    String s = projectListO[i].toString();
	    if (s.startsWith(prefix))
		projectList[i] = s.substring(prefix.length());
	    else
		projectList[i] = s;
	}
        return projectList;
    }
    
    /**
     * Write a file to the project, with specified relativePath and contents of
     * a serialization of obj.
     * 
     * @param relativePath
     *                The path to the object (relative to the project's root).
     * @param obj
     *                The Object representing the contents of the file.
     * @throws FileSerializerException
     */
    @ExposeToClient
    public void writeObject(String relativePath, Object obj)
            throws FileSerializerException {
        
        projectManager.getCurrentProject().writeObject(relativePath, obj);
    }
    
    /**
     * Read a file from the project, with specified relativePath. Returns the
     * Object representing the contents of the file.
     * 
     * @param relativePath
     *                The path to the object (relative to the project's root).
     * @return The Object representing the contents of the file, or null if the
     *         file doesn't exist.
     * @throws ProjectFileSerializerException
     */
    @ExposeToClient
    public Object readObject(String relativePath)
            throws FileSerializerException {             
        return projectManager.getCurrentProject().readObject(relativePath);
    }
    
    /**
     * Write arbitrary data to a file. The file can be relative to the
     * activeGridHome, or eventually absolute.  This will clobber existing
     * files.
     * 
     * @param path
     *                The path to write to (relative to the project root).
     * @param data
     *                The data to write (as a String).
     * @throws IOException
     */
    @ExposeToClient
    public void writeFile(String path, String data) throws IOException {
        
        writeFile(path, data, false);
    }

    @ExposeToClient
    public void writeFile(String path, String data, boolean noClobber)
            throws IOException {
        
        projectManager.getCurrentProject().writeFile(path, data, noClobber);
    }

    /**
     * Read arbitrary data from a file.
     * 
     * @param path
     *                The path to read from (relative to the project root).
     * @return
     *                The data read
     * @throws IOException
     */
    @ExposeToClient
    public String readFile(String path)
        throws IOException
    {
        return projectManager.getCurrentProject().readFile(path);
    }
    
    /**
     * Returns true if the file exists.
     * 
     * @param path The path to check (relative to the project root).
     * @return True iff the path points to an existant file or directory.
     */
    @ExposeToClient
    public boolean fileExists(String path) {
        return projectManager.getCurrentProject().fileExists(projectManager.getUserProjectPrefix()  + path);
    }
    
    /**
     * Write arbitrary data to a file in this project's web directory.
     * @param path
     * @param data
     */
    @ExposeToClient
    public void writeWebFile(String path, String data) throws IOException {
        
        writeWebFile(path, data, false);
    }

    /**
     * Write arbitrary data to a file in this project's web directory.
     * @param path
     * @param data
     */
    @ExposeToClient
    public void writeWebFile(String path, String data, boolean noClobber)
            throws IOException {
        
        String newPath = ProjectConstants.WEB_DIR + "/" + path;
        projectManager.getCurrentProject().writeFile(newPath, data, noClobber);
    }
    
    /**
     * Read arbitrary data from a file in this project's web directory.
     * @param path
     * @param data
     */
    @ExposeToClient
    public String readWebFile(String path) throws IOException {

        String newPath = ProjectConstants.WEB_DIR + "/" + projectManager.getUserProjectPrefix() + path;
        return projectManager.getCurrentProject().readFile(newPath);
    }
    
    /**
     * Return the web path of the current project (including the project name).
     * For instance, if your project is named "foo", this will return
     * "foo/webapproot".
     * @return
     */
    @ExposeToClient
    public String getWebPath() {
        return projectManager.getCurrentProject().getProjectName() + "/" +
                ProjectConstants.WEB_DIR;
    }
    
    /**
     * Get a map of the current studio preferences.
     */
    @ExposeToClient
    public Map<String,String> getPreferences() {
        return getStudioConfiguration().getPreferencesMap();
    }
    
    /**
     * Update the preferences with new values.
     * @param prefs
     * @throws FileAccessException
     */
    @ExposeToClient
    public void setPreferences(Map<String,String> prefs)
            throws FileAccessException {
        getStudioConfiguration().setPreferencesMap(prefs);
    }

    /**
     * Get Project properties for given prefix.
     */
    @ExposeToClient
    public Properties getProperties(String prefix) {
	return projectManager.getCurrentProject().getProperties(prefix);
    }
    
    /**
     * Get the projec type for the current build of studio (right now, one of
     * enterprise, community, or cloud).
     * @throws IOException 
     */
    @ExposeToClient
    public String getStudioProjectType() throws IOException {
        
        String versionFileContents = StudioConfiguration.getCurrentVersionInfoString();
        final Pattern p = Pattern.compile("^Build type: (.*)$",
                Pattern.MULTILINE);

        Matcher m = p.matcher(versionFileContents);
        if(!m.find()) {
            throw new WMRuntimeException("bad version string: "+
                    versionFileContents);
        }
        return m.group(1);

    }

    @ExposeToClient
    public java.util.Hashtable getLogUpdate(String filename, String lastStamp) throws IOException {
	File logFolder = new File(System.getProperty("catalina.home") + "/logs/ProjectLogs", projectManager.getCurrentProject().getProjectName());
	//File logFolder =  projectManager.getCurrentProject().getLogFolder();
	  File logFile = new File(logFolder, filename);
	  //System.out.println("READING LOG FILE : " + logFile.toString());
	  if (!logFile.exists()) {
		  java.util.Hashtable PEmpty = new java.util.Hashtable();
		  PEmpty.put("logs","");
		  PEmpty.put("lastStamp",0);
		  return PEmpty;
	      }
	  String s = IOUtils.read(logFile);

	  if (lastStamp.length() > 0) {

	      // remove everything up to START_WM_LOG_LINE lastStamp 
	      Pattern newStuffPattern = Pattern.compile("^.*START_WM_LOG_LINE\\s+" + lastStamp + "\\s+", java.util.regex.Pattern.DOTALL);
	      Matcher newStuffMatcher = newStuffPattern.matcher(s);
	      s = newStuffMatcher.replaceFirst("");
	      s = s.replaceFirst("^.*?END_WM_LOG_LINE",""); // replace everything from the start of whats left of this line to END_WM_LOG_LINE
	  }

	  java.util.regex.Pattern htmlTagPattern = java.util.regex.Pattern.compile("(START_WM_LOG_LINE\\s+\\d+\\:\\d+\\:\\d+,\\d+\\s+)(\\S+) (\\(.*\\))");
	  java.util.regex.Matcher htmlTagMatcher = htmlTagPattern.matcher(s);
	  s = htmlTagMatcher.replaceAll("$1<span class='LogType$2'>$2</span> <span class='LogLocation'>$3</span>");
	  java.util.regex.Pattern p = java.util.regex.Pattern.compile("START_WM_LOG_LINE\\s+\\d+\\:\\d+\\:\\d+,\\d+");
	  java.util.regex.Matcher m = p.matcher(s);
	  String timestamp = "";
	  while (m.find()) {
	      timestamp = m.group();
	      timestamp = timestamp.replaceFirst("START_WM_LOG_LINE\\s+.*?","");
	  }
          java.util.Hashtable P = new java.util.Hashtable();
	  s = m.replaceAll(""); // remove all START_WM_LOG_LINE xxx:xxx:xxx,xxx
	  s = s.replaceAll(" END_WM_LOG_LINE","");
	  if (s.matches("^\\s+$")) s = "";
	  s = s.replaceAll("(\\S+)(\\n\\r|\\r\\n|\\n|\\r)","$1<br/>");
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
		help_url = new URL("http://dev.wavemaker.com/wiki/bin/view/PropertyDocumentation/" + url);
    
		// Read all the text returned by the server
		BufferedReader in = new BufferedReader(new InputStreamReader(help_url.openStream()));
		String str;
		StringBuffer sbuf = new StringBuffer();
		while ((str = in.readLine()) != null) {
		      sbuf.append(str + "\n");
		      // str is one line of text; readLine() strips the newline character(s)
		}
		str = sbuf.toString();

		in.close();
		int startDiv = str.indexOf("<div class=\"main layoutsubsection\">");
		int endDivID = str.indexOf("\"xwikidata\"");
		int endDiv   = str.lastIndexOf("<div", endDivID);
		s = str.substring(startDiv,endDiv);
		s = s.replaceAll("<a ", "<a target='wiki' ");
		s = s.replaceAll("/wiki/bin/", "http://dev.wavemaker.com/wiki/bin/");
	  } catch(Exception e) {
		s += "  " + e.getMessage() + ": No documentation found for this topic";
	  }

	  return s;
    }

    /* Note this should probably be moved to javaServices.java,
       but I didn't want to spend the time to figure out how to
       access studioConfiguration from that file */  
    @ExposeToClient
    public String getJavaServiceTemplate(String templateName) throws IOException {
        return FileUtils.readFileToString(new File(studioConfiguration.getStudioWebAppRootFile() + "/app/templates/javaservices", templateName));
    }



    // bean properties
    private RuntimeAccess runtimeAccess;
    private ProjectManager projectManager;
    private DeploymentManager deploymentManager;
    private StudioConfiguration studioConfiguration;
    private UpgradeManager upgradeManager;


    public RuntimeAccess getRuntimeAccess() {
        return runtimeAccess;
    }
    public void setRuntimeAccess(RuntimeAccess runtimeAccess) {
        this.runtimeAccess = runtimeAccess;
    }

    public ProjectManager getProjectManager() {
        return projectManager;
    }
    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public DeploymentManager getDeploymentManager() {
        return deploymentManager;
    }
    public void setDeploymentManager(DeploymentManager deploymentManager) {
        this.deploymentManager = deploymentManager;
    }

    public StudioConfiguration getStudioConfiguration() {
        return studioConfiguration;
    }
    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    public UpgradeManager getUpgradeManager() {
        return upgradeManager;
    }
    public void setUpgradeManager(UpgradeManager upgradeManager) {
        this.upgradeManager = upgradeManager;
    }
    
    // inner classes
    /**
     * An inner class containing the return from an openProject operation.  This
     * includes the web path to the project, and any messages to display to the
     * user about the project.
     */
    public static class OpenProjectReturn {
        
        private String webPath;
        private UpgradeInfo upgradeMessages;
        
        public String getWebPath() {
            return webPath;
        }
        public void setWebPath(String webPath) {
            this.webPath = webPath;
        }
        
        public UpgradeInfo getUpgradeMessages() {
            return upgradeMessages;
        }
        public void setUpgradeMessages(UpgradeInfo upgradeMessages) {
            this.upgradeMessages = upgradeMessages;
        }
    }
}
