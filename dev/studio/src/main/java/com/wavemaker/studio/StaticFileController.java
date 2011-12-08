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

import java.io.IOException;
import java.io.Writer;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.TimeZone;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioFileSystem;

/**
 * Controller (in the MVC sense) providing the studio access to project files. Based off of the old StaticFileServlet.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public final class StaticFileController extends AbstractController {

    private static final String WM_COMMON_URL = "lib/wm/common";

    private static final String WM_PROJECTS_PATH = "projects";

    private static final String WM_BUILD_GZIPPED_URL = "/lib//build/Gzipped/";

    private static final String WM_BUILD_DOJO_THEMES_URL = "/lib/build/themes/";

    private static final String WM_BUILD_WM_THEMES_URL = "/lib/wm/base/widget/themes/";

    private static final String WM_BUILD_DOJO_FOLDER_URL = "/lib/dojo/";

    private static final String WM_BUILD_DOJO_JS_URL = "/lib/dojo/dojo/dojo_build.js";

    private static final String WM_BOOT_URL = "/lib/boot/boot.js";

    private static final String WM_RUNTIME_LOADER_URL = "/lib/runtimeLoader.js";

    private ProjectManager projectManager;

    private StudioFileSystem fileSystem;

    @Override
    protected ModelAndView handleRequestInternal(HttpServletRequest request, HttpServletResponse response) throws Exception {

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
        Resource sendFile = null;

        if (reqPath.startsWith(WM_BUILD_GZIPPED_URL) || reqPath.equals(WM_BUILD_DOJO_JS_URL)) {
            isGzipped = true;
            addExpiresTag = true;
            reqPath += ".gz";
            sendFile = this.fileSystem.getStudioWebAppRoot().createRelative(reqPath);
        } else if (reqPath.startsWith(WM_BUILD_DOJO_THEMES_URL) || reqPath.startsWith(WM_BUILD_WM_THEMES_URL)
            || reqPath.startsWith(WM_BUILD_DOJO_FOLDER_URL) || reqPath.equals(WM_BOOT_URL) || reqPath.equals(WM_RUNTIME_LOADER_URL)) {

            sendFile = this.fileSystem.getStudioWebAppRoot().createRelative(reqPath);
            addExpiresTag = true;

        } else if (reqPath.equals("/" + WM_PROJECTS_PATH) || reqPath.startsWith("/" + WM_PROJECTS_PATH + "/")) {
            if (reqPath.equals("/" + WM_PROJECTS_PATH)) {
                reqPath = "";
            } else {
                reqPath = reqPath.substring(WM_PROJECTS_PATH.length() + 2);
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

            Resource projectPath = getProjectManager().getProjectDir(projectName, false);
            if (!projectPath.exists()) {
                handleError(response, "Project " + projectName + " not found", HttpServletResponse.SC_NOT_FOUND);
                return null;
            } else if (!projectPath.getFilename().equals(projectName)) {
                handleError(response, "Project " + projectName + " not found", HttpServletResponse.SC_NOT_FOUND);
                return null;
            }

            Resource webapproot = projectPath.createRelative(ProjectConstants.WEB_DIR);
            sendFile = webapproot.createRelative(reqPath);
        } else if (reqPath.equals("/" + WM_COMMON_URL) || reqPath.startsWith("/" + WM_COMMON_URL + "/")) {
            reqPath = reqPath.substring(("/" + WM_COMMON_URL).length());
            Resource userWmDir = this.fileSystem.getCommonDir();
            if (!userWmDir.exists()) {
                handleError(response, "Expected wm directory does not exist: " + userWmDir, HttpServletResponse.SC_NOT_FOUND);
                return null;
            }

            sendFile = userWmDir.createRelative(reqPath);
        } else {
            throw new WMRuntimeException(MessageResource.STUDIO_UNKNOWN_LOCATION, reqPath, request.getRequestURI());
        }

        if (null != sendFile && !sendFile.exists()) {
            handleError(response, "File " + reqPath + " not found in expected path: " + sendFile, HttpServletResponse.SC_NOT_FOUND);
        } else if (null != sendFile && StringUtils.getFilenameExtension(sendFile.getFilename()) == null) {
            handleDirectoryList(sendFile, request.getRequestURL().toString(), response);
        } else if (null != sendFile) {
            if (addExpiresTag) {
                // setting cache expire to one year.
                setCacheExpireDate(response, 365 * 24 * 60 * 60);
            }

            if (!isGzipped) {
                setContentType(response, sendFile);
            } else {
                response.setHeader("Content-Encoding", "gzip");
            }

            FileCopyUtils.copy(sendFile.getInputStream(), response.getOutputStream());
        }

        // we've already written our response
        return null;
    }

    public static void setCacheExpireDate(HttpServletResponse response, int seconds) {
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
    protected void setContentType(HttpServletResponse response, Resource file) {
        response.setContentType(getMediaType(file).toString());
    }

    protected void handleError(HttpServletResponse response, String errorMessage, int code) throws IOException {

        response.setStatus(code);
        Writer outputWriter = response.getWriter();
        outputWriter.write(errorMessage);
    }

    protected void handleProjectsList(String reqFqURL, HttpServletResponse response) throws IOException {
        // System.out.println("handleProjectList");
        if (!reqFqURL.endsWith("/")) {
            reqFqURL += "/";
        }

        response.setContentType("text/html");
        Writer writer = response.getWriter();
        writer.write("<html><body>\n");
        String userprefix = getProjectManager().getUserProjectPrefix();
        for (String project : getProjectManager().listProjects(userprefix)) {
            project = project.substring(userprefix.length());
            writer.write("\t<a href=\"" + reqFqURL + project + "/\">" + project + "/</a>\n");
            writer.write("\t<br/>\n");
        }
        writer.write("</body></html>\n");
        writer.close();
    }

    protected void handleDirectoryList(Resource dir, String reqFqURL, HttpServletResponse response) throws IOException {
        // System.out.println("handleDirectoryList");
        if (!reqFqURL.endsWith("/")) {
            reqFqURL += "/";
        }

        response.setContentType("text/html");
        Writer writer = response.getWriter();
        writer.write("<html><body>\n");

        for (Resource file : this.fileSystem.listChildren(dir)) {
            writer.write("\t<a href=\"" + reqFqURL + file.getFilename());
            if (StringUtils.getFilenameExtension(file.getFilename()) == null) {
                writer.write("/");
            }
            writer.write("\">" + file.getFilename());
            if (StringUtils.getFilenameExtension(file.getFilename()) == null) {
                writer.write("/");
            }
            writer.write("</a>\n");
            writer.write("\t    <br/>\n");
        }

        writer.write("</body></html>\n");
        writer.close();
    }

    /**
     * Determine an appropriate media type for the given resource.
     * 
     * @param resource the resource to check
     * @return the corresponding media type, or <code>null</code> if none found
     */
    protected MediaType getMediaType(Resource resource) {
        String mimeType = getServletContext().getMimeType(resource.getFilename());
        return StringUtils.hasText(mimeType) ? MediaType.parseMediaType(mimeType) : null;
    }

    public ProjectManager getProjectManager() {
        return this.projectManager;
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }
}
