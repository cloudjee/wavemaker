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



/**
 * Controller (in the MVC sense) providing the studio access to project files.
 * Based off of the old StaticFileServlet.
 * 
 * @author Matt Small
 * @version $Rev: 28227 $ - $Date: 2009-12-16 12:09:58 -0800 (Wed, 16 Dec 2009) $
 */
public final class FileController extends AbstractController {

    private static final String WM_BUILD_GZIPPED_URL = "/lib//build/Gzipped/";
    private static final String WM_BUILD_DOJO_THEMES_URL = "/lib/build/themes/";
    private static final String WM_BUILD_WM_THEMES_URL = "/lib/wm/base/widget/themes/";
    private static final String WM_BUILD_DOJO_FOLDER_URL = "/lib/dojo/";
    private static final String WM_BUILD_DOJO_JS_URL = "/lib/dojo/dojo/dojo_build.js";
    private static final String WM_BOOT_URL = "/lib/boot/boot.js";
    private static final String WM_RUNTIME_LOADER_URL = "/lib/runtimeLoader.js";
    private static final String WM_IMAGE_URL = "/resources/images/";
    private static final String WM_GZIPPED_URL = "/resources/gzipped/";
    
    @Override
    protected ModelAndView handleRequestInternal(HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        String appName = WMAppContext.getInstance().getAppName();
        String path = WMAppContext.getInstance().getAppContextRoot();
    	boolean isGzipped = false;
    	boolean addExpiresTag = false;
    	String reqPath = request.getRequestURI();
    	String contextPath = request.getContextPath();
    	reqPath = reqPath.replaceAll("%20", " ");
    	
    	// trim off the servlet name
        if (!contextPath.equals("") && reqPath.startsWith(contextPath))
        	reqPath = reqPath.substring(reqPath.indexOf('/', 1));

        
    	File sendFile = new File(path, reqPath);

        if(reqPath.startsWith(WM_BUILD_GZIPPED_URL) || reqPath.startsWith(WM_GZIPPED_URL) || reqPath.equals(WM_BUILD_DOJO_JS_URL)){
        	isGzipped = true;
        	addExpiresTag = true;
        }else if (reqPath.startsWith(WM_BUILD_DOJO_THEMES_URL) || 
        		reqPath.startsWith(WM_BUILD_WM_THEMES_URL) || 
        		reqPath.startsWith(WM_BUILD_DOJO_FOLDER_URL) || 
        		reqPath.equals(WM_BOOT_URL)|| 
        		reqPath.equals(WM_RUNTIME_LOADER_URL) ||
        		reqPath.startsWith(WM_IMAGE_URL)){
        	addExpiresTag = true;
        }else{
            throw new WMRuntimeException(Resource.STUDIO_UNKNOWN_LOCATION,
                    reqPath, request.getRequestURI());
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