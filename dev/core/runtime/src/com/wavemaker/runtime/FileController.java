/*
 * Copyright (C) 2007-2010 VMWare, Inc. All rights reserved.
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


package com.wavemaker.runtime;

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
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.module.ModuleManager;

import com.wavemaker.runtime.data.DataServiceLoggers;
import com.wavemaker.runtime.server.ServerUtils;

/**
 * Controller (in the MVC sense) providing the studio access to project files.
 * Based off of the old StaticFileServlet.
 * 
 * @author Matt Small
 * @version $Rev: 28227 $ - $Date: 2009-12-16 12:09:58 -0800 (Wed, 16 Dec 2009) $
 */
public final class FileController extends AbstractController {

    private static final String WM_BUILD_GZIPPED_URL = "/lib/build/Gzipped/";
    private static final String WM_BUILD_DOJO_THEMES_URL = "/lib/build/themes/";
    private static final String WM_BUILD_WM_THEMES_URL = "/lib/wm/base/widget/themes/";
    private static final String WM_BUILD_DOJO_FOLDER_URL = "/lib/dojo/";
    private static final String WM_BUILD_DOJO_JS_URL = "/lib/dojo/dojo/dojo_build.js";
    private static final String WM_BOOT_URL = "/lib/boot/boot.js";
    private static final String WM_RUNTIME_LOADER_URL = "/lib/runtimeLoader.js";
    private static final String WM_IMAGE_URL = "/resources/images/";
    private static final String WM_GZIPPED_URL = "/resources/gzipped/";
    private static final String WM_STUDIO_BUILD_URL = "/build/";
    private static final String WM_CONFIG_URL = "/config.js";
    private static final String SERVER_TIME = "{serverTimeOffset}";
    
    @Override
    protected ModelAndView handleRequestInternal(HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        String path = WMAppContext.getInstance().getAppContextRoot();
    	boolean isGzipped = false;
    	boolean addExpiresTag = false;
    	String reqPath = request.getRequestURI();
    	String contextPath = request.getContextPath();
    	reqPath = reqPath.replaceAll("%20", " ");
	    reqPath = reqPath.replaceAll("//","/");


    	// trim off the servlet name
        if (!contextPath.equals("") && reqPath.startsWith(contextPath))
        	reqPath = reqPath.substring(reqPath.indexOf('/', 1));

        
        if (reqPath.startsWith(WM_BUILD_GZIPPED_URL) || reqPath.startsWith(WM_GZIPPED_URL) || reqPath.equals(WM_BUILD_DOJO_JS_URL)){
        	isGzipped = true;
        	addExpiresTag = true;
        	reqPath += ".gz";
        } else if (reqPath.startsWith(WM_BUILD_DOJO_THEMES_URL) ||
        		reqPath.startsWith(WM_BUILD_WM_THEMES_URL) || 
        		reqPath.startsWith(WM_BUILD_DOJO_FOLDER_URL) || 
        		reqPath.equals(WM_BOOT_URL)|| 
        		reqPath.equals(WM_RUNTIME_LOADER_URL) ||
        		reqPath.startsWith(WM_IMAGE_URL) ||
		        reqPath.startsWith(WM_STUDIO_BUILD_URL)){
        	addExpiresTag = true;
        } else if (!reqPath.contains(WM_CONFIG_URL)) {
            throw new WMRuntimeException(Resource.STUDIO_UNKNOWN_LOCATION,
                    reqPath, request.getRequestURI());
        }
        
        File sendFile = null;
        if (!isGzipped && reqPath.lastIndexOf(".js") == reqPath.length() - 3) {
            sendFile = new File(path, reqPath + ".gz");
            if (!sendFile.exists()) {
            sendFile = null;
            } else {
            isGzipped = true;
            }
        }

        if (sendFile == null)
	    sendFile = new File(path, reqPath);

        if (DataServiceLoggers.fileControllerLogger.isDebugEnabled()) {
            DataServiceLoggers.fileControllerLogger.debug("FileController: " + sendFile.getAbsolutePath() + "\t (" + reqPath + ")");
        }

        if (null!=sendFile && !sendFile.exists()) {
            handleError(response, "File " + reqPath
                    + " not found in expected path: " + sendFile,
                    HttpServletResponse.SC_NOT_FOUND);
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
            if (reqPath.contains(WM_CONFIG_URL)) {
                String content = IOUtils.toString(is);
                content += "\r\n" + "wm.serverTimeOffset = " + ServerUtils.getServerTimeOffset() + ";";
                IOUtils.write(content, os);
            } else {
                IOUtils.copy(is, os);
            }
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

    protected void handleError(HttpServletResponse response,
    		String errorMessage, int code) throws IOException {

    	response.setStatus(code);
    	Writer outputWriter = response.getWriter();
    	outputWriter.write(errorMessage);
    }

    protected void setContentType(HttpServletResponse response, File file) {
        ConfigurableMimeFileTypeMap mimeFileTypeMap = new ConfigurableMimeFileTypeMap();
        mimeFileTypeMap.setMappings(new String[] { "text/css css CSS",
                "application/json json JSON smd SMD" });

        response.setContentType(mimeFileTypeMap.getContentType(file));
    }
    
    // bean properties
    private ModuleManager moduleManager;
    
    public void setModuleManager(ModuleManager moduleManager) {
        this.moduleManager = moduleManager;
    }
    public ModuleManager getModuleManager() {
        return moduleManager;
    }
    
}