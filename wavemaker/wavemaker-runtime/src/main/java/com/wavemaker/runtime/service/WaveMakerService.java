/*
 *  Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.service;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.InternalRuntime;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.runtime.service.events.ServiceEventNotifier;

/**
 * @author Ed Callahan
 */
@ExposeToClient
public class WaveMakerService {

    private TypeManager typeManager;

    private ServiceManager serviceManager;

    private ServiceEventNotifier serviceEventNotifier;

    private InternalRuntime internalRuntime;

    private RuntimeAccess runtimeAccess;

    public String getLocalHostIP() {
        return SystemUtils.getIP();
    }

    public String getSessionId() {
        return RuntimeAccess.getInstance().getSession().getId();
    }

    public DownloadResponse echo(String contents, String contentType, String fileName) {
        InputStream is;
        try {
            is = new ByteArrayInputStream(contents.getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            throw new WMRuntimeException(e);
        }
        return new DownloadResponse(is, contentType, fileName);
    }

    /*
     * Forward a request to a remote service
     * 
     * @remoteURl - The url to be invoked
     * 
     * @params - Params to be used
     * 
     * @method - request method, POST, GET, etc, default is POST
     * 
     * @contentType - default is application/json
     * 
     * @return - whatever the service returned - no typing applied
     * 
     * Example of wm java service taking two strings: wmService.requestAsync("remoteRESTCall",
     * ["http://localhost:8080/AppScopeReFire/services/test.json",
     * "{'params':['string one','string two'],'method':'test','id':1}"]);
     */
    public String remoteRESTCall(String remoteURL, String params, String method, String contentType){
    	String charset = "UTF-8";
    	StringBuffer returnString = new StringBuffer();
    	try{
		System.out.println("URL: " + remoteURL);
		if (method.equals("PUT") || method.equals("POST") || params == null || params.equals("")) {
		} else {
		    if (remoteURL.indexOf("?") != -1) {
			remoteURL += "&" + params;
		    } else {
			remoteURL += "?" + params;
		    }
		}

    		URL url  = new URL (remoteURL);
    		HttpURLConnection connection = (HttpURLConnection) url.openConnection(); 
    		connection.setDoOutput(true); 
    		connection.setRequestMethod(method);
		System.out.println("METHOD: " + method);
    		connection.setDoInput(true);  
    		connection.setRequestProperty("Accept-Charset", "application/json");
    		connection.setRequestProperty("Content-Type", contentType);       
		System.out.println("Content-type: " + contentType);
    		connection.setRequestProperty("Content-Language", charset);   			
    		connection.setUseCaches (false);
    		
    		HttpServletRequest request = RuntimeAccess.getInstance().getRequest();
    		Enumeration<String> headerNames = request.getHeaderNames();
    			while(headerNames.hasMoreElements()) {
    				String name = (String)headerNames.nextElement();
    				Enumeration<String> headers = request.getHeaders(name);
    				if(headers!=null){
    					while(headers.hasMoreElements()){
    					String headerValue = (String) headers.nextElement();
    					connection.setRequestProperty(name, headerValue);
					System.out.println("HEADER: " + name + ": " + headerValue);
    					}
    				}
    			}
    		
    		//Re-wrap single quotes into double quotes
			String finalParams;
			if (contentType == "application/json") {
			    finalParams = params.replace("\'", "\""); 
			    if (!method.equals("POST") && !method.equals("PUT") && method != null && !method.equals("")) { 
				URLEncoder.encode(finalParams, charset);  		
			    }
			} else {
			    finalParams = params;
			}

    		connection.setRequestProperty("Content-Length", "" + 
    				Integer.toString(finalParams.getBytes().length));

    		//set payload 
		if (method.equals("POST") || method.equals("PUT") || method == null || method.equals("")) {
		    DataOutputStream writer = new DataOutputStream (
								    connection.getOutputStream ());
		    writer.writeBytes(finalParams);
		    writer.flush ();
		    writer.close ();
		} 

    		InputStream response = connection.getInputStream();
    		BufferedReader reader = null;
    		try {
    			reader = new BufferedReader(new InputStreamReader(response, charset));
    			for (String line; (line = reader.readLine()) != null;) {
    				returnString.append(line);
    			}
    		} finally {
    			if (reader != null) try { reader.close(); } catch (Exception e) {}
    		}
    		connection.disconnect(); 
    		return  returnString.toString();
    	} catch(Exception e) { 
    		throw new WMRuntimeException(e); 
    	} 
    }

    /*
     * Forward a request to a remote service, using POST
     * 
     * @remoteURl - The url to be invoked
     * 
     * @params - Params to be used Uses method POST and contentType appliation/JSON
     * 
     * @return - whatever the service returned - no typing applied
     */
    public String remoteRESTCall(String remoteURL, String params, String method) {
        return remoteRESTCall(remoteURL, params, "POST", "application/json");
    }

    /**
     * Get the service. If serviceName is not null or "", use the serviceName. If not, use the owning service of
     * typeName.
     * 
     * @param serviceName The serviceName (can be null or "") of the desired service..
     * @param typeName The typeName (only used if serviceName is null or "") owned by the desired service.
     * @return The service bean object.
     * @throws WMRuntimeException if no appropriate service can be found.
     */
    public ServiceWire getServiceWire(String serviceName, String typeName) {
        ServiceWire serviceWire = null;
        Exception enclosedException = null;

        if (serviceName != null && 0 != serviceName.length()) {
            serviceWire = this.serviceManager.getServiceWire(serviceName);
        } else {
            try {
                String serviceId = this.typeManager.getServiceIdForType(typeName);
                serviceWire = this.serviceManager.getServiceWire(serviceId);
            } catch (TypeNotFoundException e) {
                enclosedException = e;
            } catch (WMRuntimeException e2) {
                enclosedException = e2;
            }
        }

        if (serviceWire == null && enclosedException == null) {
            throw new WMRuntimeException(MessageResource.NO_SERVICE_FROM_ID_TYPE, serviceName, typeName);
        } else if (serviceWire == null) {
            throw new WMRuntimeException(MessageResource.NO_SERVICE_FROM_ID_TYPE, enclosedException, serviceName, typeName);
        }

        return serviceWire;
    }

    @HideFromClient
    public TypeManager getTypeManager() {
        return this.typeManager;
    }

    @HideFromClient
    public void setTypeManager(TypeManager typeManager) {
        this.typeManager = typeManager;
    }

    @HideFromClient
    public ServiceManager getServiceManager() {
        return this.serviceManager;
    }

    @HideFromClient
    public void setServiceManager(ServiceManager serviceManager) {
        this.serviceManager = serviceManager;
    }

    @HideFromClient
    public ServiceEventNotifier getServiceEventNotifier() {
        return this.serviceEventNotifier;
    }

    @HideFromClient
    public void setServiceEventNotifier(ServiceEventNotifier serviceEventNotifier) {
        this.serviceEventNotifier = serviceEventNotifier;
    }

    @HideFromClient
    public InternalRuntime getInternalRuntime() {
        return this.internalRuntime;
    }

    @HideFromClient
    public void setInternalRuntime(InternalRuntime internalRuntime) {
        this.internalRuntime = internalRuntime;
    }

    @HideFromClient
    public RuntimeAccess getRuntimeAccess() {
        return this.runtimeAccess;
    }

    @HideFromClient
    public void setRuntimeAccess(RuntimeAccess runtimeAccess) {
        this.runtimeAccess = runtimeAccess;
    }
}