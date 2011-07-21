/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.desktop.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.*;
import java.util.*;

import org.apache.catalina.util.Base64;

/**
 * This class is called inside launcher to undeploy current project from tomcat server
 *
 * @author slee
 */
public class TomcatUndeployer {//extends Server {

    private static final String MANAGER_CHARSET = "utf-8";

    // from catalina ant task
    private static final String URL_ENCODE_CHARSET = "ISO-8859-1"; 

    private String username = "manager";

    private String password = "manager";

    private String managerUri = "manager";

    private InetAddress ip = null;

    private int port = 8080;

    public TomcatUndeployer() {}

    public String undeploy(String contextRoot, Map<String, String> props) {
        for (Map.Entry<String, String> mapEntry: props.entrySet()) {
            String key = mapEntry.getKey();
            String val = mapEntry.getValue();
            if (key.equals("tomcat.host")) {
                this.setHost(val);
            } else if (key.equals("tomcat.port")) {
                this.port = Integer.parseInt(val);
            } else if (key.equals("tomcat.manager.username")) {
                this.username = val;
            } else if (key.equals("tomcat.manager.password")) {
                this.password = val;
            }
        }

        contextRoot = checkContextRoot(contextRoot);

        return this.toString(
            getResponse(getManagerGetConnection("undeploy?" + 
                getPathParam(contextRoot))), "");
    }

    private void setHost(String host) {
        try {
            ip = InetAddress.getByName(host);
        } catch (UnknownHostException ex) {
            throw new RuntimeException(ex);
        }
    }

    private String toString(Collection c, String sep) {
        StringBuilder sb = new StringBuilder();
        for (Iterator iter = c.iterator(); iter.hasNext();) {
            sb.append(String.valueOf(iter.next()));
            if (iter.hasNext()) {
                sb.append(sep);
            }
        }
        return sb.toString();
    }

    private String getManagerUri() {
        return managerUri;
    }

    private String getPathParam(String contextRoot) {
        try {
            return "path=" + URLEncoder.encode(contextRoot, URL_ENCODE_CHARSET);
        } catch (UnsupportedEncodingException ex) {
            throw new AssertionError(ex);
        }
    }

    private HttpURLConnection getManagerGetConnection(String command) {

        HttpURLConnection rtn = 
            this.getGetConnection(getManagerUri() + "/" + command);

        return prepareConnection(rtn);
    }

    private HttpURLConnection getGetConnection(String uri) {

        HttpURLConnection rtn = getConnection(uri);
        try {
            rtn.setRequestMethod("GET");
        } catch (ProtocolException ex) {
            throw new RuntimeException(ex);
        }
        rtn.setDoOutput(false);

        return rtn;
    }

    private HttpURLConnection getConnection(String uri) {

        if (uri == null) {
            throw new IllegalArgumentException("uri cannot be null");
        }

        HttpURLConnection rtn = null;

        try {
            String url = "http://" + ip.getHostName() + ":" + port + "/" +
                uri;
            rtn = (HttpURLConnection)new URL(url).openConnection();
        } catch (MalformedURLException ex) {
            throw new AssertionError(ex);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }

        rtn.setAllowUserInteraction(false);
        rtn.setDoInput(true);
        rtn.setUseCaches(false);

        return rtn;
    }

    private HttpURLConnection prepareConnection(HttpURLConnection con) {

        // Copied from Catalina's DeployTask
        con.setRequestProperty("User-Agent",
                               "Catalina-Ant-Task/1.0");

        String input = username + ":" + password;
        String output = new String(Base64.encode(input.getBytes()));
        con.setRequestProperty("Authorization", "Basic " + output);

        try {
            con.connect();
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
        return con;
    }

    private List<String> getResponse(HttpURLConnection con) {
        return getResponse(con, true);
    }

    private List<String> getResponse(HttpURLConnection con, 
                                     boolean includeStatus) 
    {
        List<String> rtn = new ArrayList<String>();

        try {
            BufferedReader br = 
                new BufferedReader(new InputStreamReader(con.getInputStream(), 
                                                         MANAGER_CHARSET));

            String line = "";
            boolean isFirst = true;

            while ((line = br.readLine()) != null) {
                if (isFirst) {
                    if (!line.startsWith("OK")) {
                    	if(line.startsWith("FAIL - No context exists")){
                    	//Context not deployed
                    	}
                    	else
                        throw new RuntimeException(line);
                    }
                }
                if (!isFirst || includeStatus) {
                    rtn.add(line.trim());
                }
                isFirst = false;
            }

        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }

        return rtn;
    }

    private String checkContextRoot(String contextRoot) {

        if (contextRoot == null) {
            throw new IllegalArgumentException("contextRoot cannot be null");
        }

        if (!contextRoot.startsWith("/")) {
            return "/" + contextRoot;
        }
        return contextRoot;
    }
}
