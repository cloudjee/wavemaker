/*
 *  Copyright (C) 2009-2011 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.module;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.Writer;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.SystemUtils;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONObject;
import com.wavemaker.runtime.server.ServerConstants;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class ModuleController extends AbstractController {
    
    public static final String MODULES_PREFIX = "modules";
    public static final String MODULES_JS = "modules.js";
    public static final String EXTENSION_PATH = "ep";
    public static final String ID_PATH = "id";
    
    protected Tuple.Two<ModuleWire, String> parseRequestPath(
            String requestURI) {

        final String prefixEP = "/" + MODULES_PREFIX + "/" + EXTENSION_PATH + "/";
        final String prefixID = "/" + MODULES_PREFIX + "/" + ID_PATH + "/";

        ModuleWire mw;
        String path;

        if (requestURI.startsWith(prefixEP)) {
            final int prefixEPLen = prefixEP.length();
            int endExtLoc = requestURI.indexOf('/', prefixEPLen);
            String ep = requestURI.substring(prefixEPLen, endExtLoc);
            path = requestURI.substring(endExtLoc+1);

            mw = moduleManager.getModule(ep);
        } else if (requestURI.startsWith(prefixID)) {
            final int prefixIDLen = prefixID.length();
            int endExtLoc = requestURI.indexOf('/', prefixIDLen);
	    String id;
	    if (endExtLoc == -1)
		 id = requestURI.substring(prefixIDLen);
	    else
		 id = requestURI.substring(prefixIDLen, endExtLoc);

            mw = moduleManager.getModuleByName(id);
            path = requestURI.substring(endExtLoc+1);
        } else {
            throw new WMRuntimeException(Resource.NO_MODULE_LOOKUP,
                    requestURI);
        }

        return new Tuple.Two<ModuleWire, String>(mw, path);
    }

    @Override
    protected ModelAndView handleRequestInternal(HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        String requestURI = request.getRequestURI();
        final String moduleURI = "/"+MODULES_PREFIX;
        final String moduleURIAbs = moduleURI+"/";
        final String moduleJsURI = moduleURIAbs+MODULES_JS;
        final String epURI = moduleURIAbs+EXTENSION_PATH;
        final String epURIAbs = epURI+"/";
        final String idURI = moduleURIAbs+ID_PATH;
        final String idURIAbs = idURI+"/";

        // trim off the servlet name
        requestURI = requestURI.substring(requestURI.indexOf('/', 1));

        if (moduleURI.equals(requestURI) ||
                moduleURIAbs.equals(requestURI)) {
        } else if (epURI.equals(requestURI) || epURIAbs.equals(requestURI)) {
            Set<String> names = moduleManager.listExtensionPoints();

            response.setContentType("text/html");
            Writer writer = response.getWriter();
            writer.write("<html><body>\n");
            for (String ext: names) {
                writer.write(ext+"<br />\n");
            }
            writer.write("</body></html>\n");
            writer.close();
        } else if (idURI.equals(requestURI) || idURIAbs.equals(requestURI)) {
            Set<String> names = moduleManager.listModules();

            response.setContentType("text/html");
            Writer writer = response.getWriter();
            writer.write("<html><body>\n");
            for (String ext: names) {
                writer.write(ext+"<br />\n");
            }
            writer.write("</body></html>\n");
            writer.close();
        } else if (moduleJsURI.equals(requestURI)) {
            Set<String> extensions = moduleManager.listExtensionPoints();

            JSONObject jo = new JSONObject();

            JSONObject extJO = new JSONObject();
            for (String extension: extensions) {
                JSONArray ja = new JSONArray();

                List<ModuleWire> wires = moduleManager.getModules(extension);
                for (ModuleWire wire: wires) {
                    ja.add(wire.getName());
                }

                extJO.put(extension, ja);
            }

            jo.put("extensionPoints", extJO);

            response.setContentType(ServerConstants.JSON_CONTENT_TYPE);
            Writer writer = response.getWriter();
            writer.write(jo.toString());
            writer.close();
        } else {
            Tuple.Two<ModuleWire, String> tuple = parseRequestPath(requestURI);
            if (null==tuple.v1) {
                String message = Resource.NO_MODULE_RESOURCE.getMessage(
                        requestURI, tuple.v2);
                logger.error(message);
                
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                Writer outputWriter = response.getWriter();
                outputWriter.write(message);
                
                return null;
            }
            
            URL url = moduleManager.getModuleResource(tuple.v1, tuple.v2);
            URLConnection conn = url.openConnection();
            if (SystemUtils.IS_OS_WINDOWS) {
                conn.setDefaultUseCaches(false);
            }

            response.setContentType(conn.getContentType());
            OutputStream os = null;
            InputStream is = null;

            try {
                os = response.getOutputStream();
                is = conn.getInputStream();

                IOUtils.copy(conn.getInputStream(), os);
            } finally {
                if (null!=os)
                    os.close();
                if (null!=is)
                    is.close();
            }
        }
        
        return null;
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
