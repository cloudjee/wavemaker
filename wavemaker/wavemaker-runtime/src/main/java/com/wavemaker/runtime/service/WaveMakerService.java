/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.InternalRuntime;
import com.wavemaker.runtime.server.ServerUtils;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.runtime.service.events.ServiceEventNotifier;

/**
 * @author Ed Callahan
 */
@ExposeToClient
public class WaveMakerService {

	private final Log logger = LogFactory.getLog(getClass());

	private TypeManager typeManager;

	private ServiceManager serviceManager;

	private ServiceEventNotifier serviceEventNotifier;

	private InternalRuntime internalRuntime;

	private HashSet<String> hostSet;

	private HashSet<String> domainSet;

	private Boolean isStudio = false;

	private static final String WHITELIST = "whitelist.txt";

	private static final String STUDIO_SPRINGAPP = "studio-springapp.xml";
	
	/**
	 * Builds whitelist tables and sets isStudio for proxy security
	 */
	public WaveMakerService(){
		ServletContext context = RuntimeAccess.getInstance().getSession().getServletContext();
		String webinf = context.getRealPath("WEB-INF");
		try{
			isStudio = new File(webinf + File.separator + STUDIO_SPRINGAPP).exists();
		} catch (IllegalArgumentException iae) {
			isStudio = false;
		}

		try {  
			hostSet = new HashSet<String>();
			domainSet = new HashSet<String>();
			String whiteFile = IOUtils.read(new File(webinf + File.separator + WHITELIST));
			String[] urlList = whiteFile.split("\\r?\\n");

			for(String urlString:urlList){
				URL url = new URL(urlString);
				String host = url.getHost();
				hostSet.add(host);					
				String domain = hostToDomain(host);
				if (domain!= null){
					domainSet.add(domain);
				}
			}
			logger.debug("Allowed hosts: " + hostSet.toString());
			logger.debug("Allowed domains: " + domainSet.toString());

		} catch (IOException ioe){
			if(isStudio)
				logger.warn("*** ONLY Studio XHR calls allowed ***");		
			else	
				logger.warn("*** " + WHITELIST + " file not found, XHR proxy DISABLED ***");				
		}
	}

    private String hostToDomain(String host){
    	Pattern p = Pattern.compile(".*?([^.]+\\.[^.]+)");
    	Matcher m = p.matcher(host);
    	if(m.matches()){
    		return m.group(1);
    	}
    	else 
    		return null;
    }

    public String getLocalHostIP() {
        return SystemUtils.getIP();
    }

    public String getSessionId() {
        return RuntimeAccess.getInstance().getSession().getId();
    }

    public DownloadResponse echo(String contents, String contentType, String fileName) {
        DownloadResponse rv = null;
		if (fileName != null) {
			InputStream is;
			try {
				is = new ByteArrayInputStream(contents.getBytes("UTF-8"));
			} catch (final UnsupportedEncodingException e) {
				throw new WMRuntimeException(e);
			}
			rv = new DownloadResponse(is, contentType, fileName);	
		}
		return rv;
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
    public String remoteRESTCall(String remoteURL, String params, String method, String contentType) {
    	proxyCheck(remoteURL);
        String charset = "UTF-8";
        StringBuffer returnString = new StringBuffer();
        try {
            if (method.toLowerCase().equals("put") || method.toLowerCase().equals("post") || params == null || params.equals("")) {
            } else {
                if (remoteURL.indexOf("?") != -1) {
                    remoteURL += "&" + params;
                } else {
                    remoteURL += "?" + params;
                }
            }

            URL url = new URL(remoteURL);
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("Opening URL: " + url);
            }
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestMethod(method);
            connection.setDoInput(true);
            connection.setRequestProperty("Accept-Charset", "application/json");
            connection.setRequestProperty("Accept-Encoding", "text/plain");
            connection.setRequestProperty("Content-Language", charset);
            connection.setRequestProperty("Content-Type", contentType);
            connection.setRequestProperty("Transfer-Encoding", "identity");
            connection.setUseCaches(false);

            HttpServletRequest request = RuntimeAccess.getInstance().getRequest();
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String name = headerNames.nextElement();
                Enumeration<String> headers = request.getHeaders(name);
                if (headers != null && !name.toLowerCase().equals("accept-encoding") && !name.toLowerCase().equals("accept-charset") && !name.toLowerCase().equals("content-type")) {
                    while (headers.hasMoreElements()) {
                        String headerValue = headers.nextElement();
                        connection.setRequestProperty(name, headerValue);
                        if (this.logger.isDebugEnabled()) {
                            this.logger.debug("HEADER: " + name + ": " + headerValue);
                        }
                    }
                }
            }

            // Re-wrap single quotes into double quotes
            String finalParams;
            if (contentType.toLowerCase().equals("application/json")) {
                finalParams = params.replace("\'", "\"");
                if (!method.toLowerCase().equals("post") && !method.toLowerCase().equals("put") && method != null && !method.equals("")) {
                    URLEncoder.encode(finalParams, charset);
                }
            } else {
                finalParams = params;
            }

            connection.setRequestProperty("Content-Length", "" + Integer.toString(finalParams.getBytes().length));

            // set payload
            if (method.toLowerCase().equals("post") || method.toLowerCase().equals("put") || method == null || method.equals("")) {
                DataOutputStream writer = new DataOutputStream(connection.getOutputStream());
                writer.writeBytes(finalParams);
                writer.flush();
                writer.close();
            }

            InputStream response = connection.getInputStream();
            BufferedReader reader = null;
            int responseLen = 0;
            try {
            	int i = 0;
            	String field;
            	HttpServletResponse wmResponse = RuntimeAccess.getInstance().getResponse();
            	while((field = connection.getHeaderField(i)) != null) {
            		String key = connection.getHeaderFieldKey(i);
            		if(key == null || field == null) {
            		}
            		else {
            			if(key.toLowerCase().equals("proxy-connection")|| key.toLowerCase().equals("expires")){
            				logger.debug("Remote server returned header of: " + key + " " + field + " it was not forwarded");
            			}
            			else if(key.toLowerCase().equals("transfer-encoding") && field.toLowerCase().equals("chunked")){
            				logger.debug("Remote server returned header of: " + key + " " + field + " it was not forwarded");
            			}
            			else if(key.toLowerCase().equals("content-length")){
            				// do NOT use this length as return header value
            				responseLen = new Integer(field);
            			}
            			else{
            				wmResponse.addHeader(key, field);
            			}}
            		i++;
            	}
            	reader = new BufferedReader(new InputStreamReader(response, charset));
            	for (String line; (line = reader.readLine()) != null;) {
            		returnString.append(line);
            	}
            } finally {
                if (reader != null) {
                    try {
                        reader.close();
                    } catch (Exception e) {
                    }
                }
            }
            connection.disconnect();
            return returnString.toString();
        } catch (Exception e) {
        	logger.error("ERROR in XHR proxy call: " + e.getMessage());
            throw new WMRuntimeException(e);
        }
    }

    /*
     * Checks a url against the whitelist. Throws if not allowed
     * @remoteURl the url to check
     */
    private void proxyCheck(String remoteURL) throws  WMRuntimeException {
    	logger.debug("Checking: "  + remoteURL);  	
    	try{
    		String host = new URL(remoteURL).getHost();
    		if(host != null && (hostSet.contains(new URL(remoteURL).getHost()))){
    			return;
    		}
    		String domain = hostToDomain(host);    		
    		if(domain != null && (domainSet.contains(domain))){
    			return;
    		}
    		String referer = hostToDomain(new URL(RuntimeAccess.getInstance().getRequest().getHeader("referer")).getHost());
    		if(referer != null && referer.equals(domain) && isStudio){
    			return;
    		}
    		else{
    			throw new WMRuntimeException("Remote URL not allowed for Proxy call " + remoteURL);
    		}
    	}
    	catch(MalformedURLException e) {
    		logger.error("ERROR: " + e.getMessage() + remoteURL);
    		throw new WMRuntimeException("Malformed URL " + remoteURL);
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
     * Calculate the server time offset against UTC
     * 
     * @return the server time offset in milliseconds
     */
    public int getServerTimeOffset() {
        return ServerUtils.getServerTimeOffset();
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
    @HideFromClient
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

}