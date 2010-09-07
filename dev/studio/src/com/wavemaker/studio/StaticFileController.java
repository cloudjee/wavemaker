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

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Writer;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.TimeZone;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.mail.javamail.ConfigurableMimeFileTypeMap;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioConfiguration;

/**
 * Controller (in the MVC sense) providing the studio access to project files.
 * Based off of the old StaticFileServlet.
 * 
 * @author Matt Small
 * @version $Rev$ - $Date$
 */
public final class StaticFileController extends AbstractController {

    private static final String WM_COMMON_URL = "lib/wm/"
        + StudioConfiguration.COMMON_DIR;
    private static final String WM_BUILD_GZIPPED_URL = "/lib//build/Gzipped/";
    private static final String WM_BUILD_DOJO_THEMES_URL = "/lib/build/themes/";
    private static final String WM_BUILD_WM_THEMES_URL = "/lib/wm/base/widget/themes/";
    private static final String WM_BUILD_DOJO_FOLDER_URL = "/lib/dojo/";
    private static final String WM_BUILD_DOJO_JS_URL = "/lib/dojo/dojo/dojo_build.js";
    private static final String WM_BOOT_URL = "/lib/boot/boot.js";
    private static final String WM_RUNTIME_LOADER_URL = "/lib/runtimeLoader.js";
    
    /**
     * Return true iff reqPath points to a valid path within baseDir, including
     * case.  Returns false if the path isn't found or if the case doesn't match
     * a file.  The two paths are combines via:
     * 
     *   new File(baseDir, reqPath)
     * 
     * @param baseDir
     * @param reqPath
     * @throws IOException
     */
    private boolean isCaseValid(File baseDir, String reqPath) throws IOException {
        baseDir = baseDir.getCanonicalFile();
        File file = new File(baseDir, reqPath);
        
        String abs = file.getAbsolutePath();
        String can = file.getCanonicalPath();
        
        if (file.isDirectory() && (abs.endsWith("/") || abs.endsWith("\\"))) {
            abs = abs.substring(0, abs.length()-1);
        }
        if (file.isDirectory() && (can.endsWith("/") || can.endsWith("\\"))) {
            can = can.substring(0, can.length()-1);
        }
        
        return abs.equals(can);
    }

    @Override
    protected ModelAndView handleRequestInternal(HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	
    	boolean isGzipped = false;
    	boolean addExpiresTag = false;
    	String reqPath = request.getRequestURI();
	reqPath = reqPath.replaceAll("%20", " ");
        // trim off the servlet name
        reqPath = reqPath.substring(reqPath.indexOf('/', 1));
        if (reqPath.matches("\\/projects\\/.+")) {
	    String userprefix = getProjectManager().getUserProjectPrefix();
	    reqPath = "/projects/" + userprefix + reqPath.substring(10);
	}
        File sendFile = null;

        if(reqPath.startsWith(WM_BUILD_GZIPPED_URL) || reqPath.equals(WM_BUILD_DOJO_JS_URL)){
        	isGzipped = true;
        	addExpiresTag = true;
        	reqPath += ".gz";
        	sendFile = new File(getStudioConfiguration().getStudioWebAppRootFile(), reqPath);
        }else if (reqPath.startsWith(WM_BUILD_DOJO_THEMES_URL) || 
        		reqPath.startsWith(WM_BUILD_WM_THEMES_URL) || 
        		reqPath.startsWith(WM_BUILD_DOJO_FOLDER_URL) || 
        		reqPath.equals(WM_BOOT_URL)|| 
        		reqPath.equals(WM_RUNTIME_LOADER_URL)){

        	sendFile = new File(getStudioConfiguration().getStudioWebAppRootFile(), reqPath);
        	addExpiresTag = true;

        }else if (reqPath.equals("/" + StudioConfiguration.PROJECTS_DIR) ||
        		reqPath.startsWith("/"+StudioConfiguration.PROJECTS_DIR+"/")) {
        	if (reqPath.equals("/" + StudioConfiguration.PROJECTS_DIR)) {
        		reqPath = "";
        	} else {
        		reqPath = reqPath.substring(
        				StudioConfiguration.PROJECTS_DIR.length() + 2);
            }

            // see if we're doing a list of projects
            if (0 == reqPath.length()) {
                handleProjectsList(request.getRequestURL().toString(), response);
                return null;
            }

            String projectName;
            if (-1 != reqPath.indexOf('/')) {
                projectName = reqPath.substring(0, reqPath.indexOf('/'));
                reqPath = reqPath.substring(reqPath.indexOf('/') + 1);
            } else {
                projectName = reqPath;
                reqPath = "";
            }

            File projectPath = getProjectManager().getProjectDir(projectName,
                    false);
            if (!projectPath.exists()) {
                handleError(response, "Project " + projectName + " not found",
                        HttpServletResponse.SC_NOT_FOUND);
                return null;
            } else if (!projectPath.getCanonicalFile().getName().equals(projectName)) {
                handleError(response, "Project " + projectName + " not found",
                        HttpServletResponse.SC_NOT_FOUND);
                return null;
            }

            File webapproot = new File(projectPath, ProjectConstants.WEB_DIR);
            
            if (!isCaseValid(webapproot, reqPath)) {
                handleError(response, "File " + reqPath
                        + " not found in expected path: " + webapproot,
                        HttpServletResponse.SC_NOT_FOUND);
                return null;
            }
            
            sendFile = new File(webapproot, reqPath);
        } else if (reqPath.equals("/" + WM_COMMON_URL) ||
                reqPath.startsWith("/"+WM_COMMON_URL+"/")) {
            reqPath = reqPath.substring(("/"+WM_COMMON_URL).length());
            File userWmDir = getStudioConfiguration().getCommonDir();
            if (!userWmDir.exists()) {
                handleError(response, "Expected wm directory does not exist: "+
                        userWmDir, HttpServletResponse.SC_NOT_FOUND);
                return null;
            }
            
            if (!isCaseValid(userWmDir, reqPath)) {
                handleError(response, "File " + reqPath
                        + " not found in expected path: " + userWmDir,
                        HttpServletResponse.SC_NOT_FOUND);
                return null;
            }
            
            sendFile = new File(userWmDir, reqPath);
        } else {
            throw new WMRuntimeException(Resource.STUDIO_UNKNOWN_LOCATION,
                    reqPath, request.getRequestURI());
        }
        

        if (null!=sendFile && !sendFile.exists()) {
            handleError(response, "File " + reqPath
                    + " not found in expected path: " + sendFile,
                    HttpServletResponse.SC_NOT_FOUND);
        } else if (null!=sendFile && sendFile.isDirectory()) {
            handleDirectoryList(sendFile, request.getRequestURL().toString(),
                    response);
        } else if (null != sendFile) {
        	if (addExpiresTag)
        	{
            	// setting cache expire to one year.
        		setCacheExpireDate(response, 365*24*60*60);
        	}
        	
        	if (!isGzipped)
        	{
        		setContentType(response, sendFile);
        	}
        	else 
        	{
        		response.setHeader("Content-Encoding", "gzip");
        	}
        	
            OutputStream os = response.getOutputStream();
            InputStream is = new FileInputStream(sendFile);
            IOUtils.copy(is, os);
            os.close();
            is.close();
        }

        // we've already written our response
        return null;
    }

	public static void setCacheExpireDate(HttpServletResponse response,	int seconds) {
		if (response != null) {
			Calendar cal = new GregorianCalendar();
			cal.add(Calendar.SECOND, seconds);
			response.setHeader("Cache-Control", "PUBLIC, max-age=" + seconds + ", must-revalidate");
			response.setHeader("Expires", htmlExpiresDateFormat().format(cal.getTime()));
		}
	}

        public static DateFormat htmlExpiresDateFormat() {
            DateFormat httpDateFormat = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.US);
            httpDateFormat.setTimeZone(TimeZone.getTimeZone("GMT"));
            return httpDateFormat;
        }    
    /**
     * Sets the content type based on filename extension.
     */
    protected void setContentType(HttpServletResponse response, File file) {
        ConfigurableMimeFileTypeMap mimeFileTypeMap = new ConfigurableMimeFileTypeMap();
        mimeFileTypeMap.setMappings(new String[] { "text/css css CSS",
                "application/json json JSON smd SMD" });

        response.setContentType(mimeFileTypeMap.getContentType(file));
    }

    protected void handleError(HttpServletResponse response,
            String errorMessage, int code) throws IOException {
        
        response.setStatus(code);
        Writer outputWriter = response.getWriter();
        outputWriter.write(errorMessage);
    }
    
    protected void handleProjectsList(String reqFqURL,
            HttpServletResponse response) throws IOException {
        //System.out.println("handleProjectList");
        if (!reqFqURL.endsWith("/")) {
            reqFqURL += "/";
        }

        response.setContentType("text/html");
        Writer writer = response.getWriter();
        writer.write("<html><body>\n");
	String userprefix = getProjectManager().getUserProjectPrefix();
        for (String project : getProjectManager().listProjects(userprefix)) {
	    project = project.substring(userprefix.length());
            writer.write("\t<a href=\"" + reqFqURL + project + "/\">" + project
                    + "/</a>\n");
            writer.write("\t<br/>\n");
        }
        writer.write("</body></html>\n");
        writer.close();
    }

    protected void handleDirectoryList(File dir, String reqFqURL,
            HttpServletResponse response) throws IOException {
        //System.out.println("handleDirectoryList");
        if (!reqFqURL.endsWith("/")) {
            reqFqURL += "/";
        }

        response.setContentType("text/html");
        Writer writer = response.getWriter();
        writer.write("<html><body>\n");

        for (File file : dir.listFiles()) {
            writer.write("\t<a href=\"" + reqFqURL + file.getName());
            if (file.isDirectory()) {
                writer.write("/");
            }
            writer.write("\">" + file.getName());
            if (file.isDirectory()) {
                writer.write("/");
            }
            writer.write("</a>\n");
            writer.write("\t    <br/>\n");
        }

        writer.write("</body></html>\n");
        writer.close();
    }

    // spring-managed bean properties
    private ProjectManager projectManager;

    private StudioConfiguration studioConfiguration;

    public ProjectManager getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public StudioConfiguration getStudioConfiguration() {
        return studioConfiguration;
    }

    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }
}
