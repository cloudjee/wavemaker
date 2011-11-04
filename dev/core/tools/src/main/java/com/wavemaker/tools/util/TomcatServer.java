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

package com.wavemaker.tools.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import org.apache.catalina.util.Base64;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.tools.common.ConfigurationException;

/**
 * This class represents a Tomcat server somewhere on the network.
 * 
 * It uses the manager webapp to deploy,undeploy and list deployed apps.
 * 
 * @author Simon Toens
 */
public class TomcatServer extends Server {

    private static final String MANAGER_CHARSET = "utf-8";

    // from catalina ant task
    private static final String URL_ENCODE_CHARSET = "ISO-8859-1";

    private String username = "manager";

    private String password = "manager";

    private String managerUri = "manager";

    public TomcatServer() {
    }

    public TomcatServer(String host, int port) {
        super(host, port);
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getManagerUri() {
        return this.managerUri;
    }

    public void setManagerUrl(String managerUri) {
        this.managerUri = managerUri;
    }

    public String deploy(File war) {
        return deploy(war, null);
    }

    public String deploy(File war, String contextRoot) {

        if (war == null) {
            throw new IllegalArgumentException("war cannot be null");
        }

        if (!war.exists()) {
            throw new IllegalArgumentException("war does not exist");
        }

        if (war.isDirectory()) {
            throw new IllegalArgumentException("war cannot be a directory");
        }

        if (contextRoot == null) {
            contextRoot = StringUtils.fromFirstOccurrence(war.getName(), ".", -1);
        }

        contextRoot = checkContextRoot(contextRoot);

        if (isDeployed(contextRoot)) {
            undeploy(contextRoot);
        }

        String uri = getManagerUri() + "/deploy?" + getPathParam(contextRoot);

        HttpURLConnection con = super.getPutConnection(uri);

        con.setRequestProperty("Content-Type", "application/octet-stream");
        con.setRequestProperty("Content-Length", String.valueOf(war.length()));

        prepareConnection(con);

        try {
            BufferedInputStream bis = new BufferedInputStream(new FileInputStream(war));
            BufferedOutputStream bos = new BufferedOutputStream(con.getOutputStream());
            IOUtils.copy(bis, bos);
            bis.close();
            bos.close();
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        }

        return ObjectUtils.toString(getResponse(con), "");
    }

    /**
     * @param contextRoot
     * @return
     */
    private boolean isDeployed(String contextRoot) {
        List<Tuple.Two<String, String>> deployments = listDeployments();
        for (Tuple.Two<String, String> deployment : deployments) {
            if (deployment.v1.equals(contextRoot)) {
                return true;
            }
        }
        return false;
    }

    public String undeploy(String contextRoot) {

        contextRoot = checkContextRoot(contextRoot);

        return ObjectUtils.toString(getResponse(getManagerGetConnection("undeploy?" + getPathParam(contextRoot))), "");
    }

    public String redeploy(String contextRoot) {

        contextRoot = checkContextRoot(contextRoot);

        return ObjectUtils.toString(getResponse(getManagerGetConnection("reload?" + getPathParam(contextRoot))), "");
    }

    public String start(String contextRoot) {

        contextRoot = checkContextRoot(contextRoot);

        return ObjectUtils.toString(getResponse(getManagerGetConnection("start?" + getPathParam(contextRoot))), "");
    }

    public String stop(String contextRoot) {

        contextRoot = checkContextRoot(contextRoot);

        return ObjectUtils.toString(getResponse(getManagerGetConnection("stop?" + getPathParam(contextRoot))), "");
    }

    public List<Tuple.Two<String, String>> listDeployments() {
        return listDeployments(true);
    }

    public List<Tuple.Two<String, String>> listDeployments(boolean excludeRootWebApp) {
        List<String> resp = getResponse(getManagerGetConnection("list"), false);
        List<Tuple.Two<String, String>> rtn = new ArrayList<Tuple.Two<String, String>>(resp.size());

        for (int i = 0; i < resp.size(); i++) {
            String name = StringUtils.fromFirstOccurrence(resp.get(i), ":", -1);
            String status = StringUtils.fromFirstOccurrence(resp.get(i), ":");
            status = StringUtils.fromFirstOccurrence(status, ":", -1);

            if (name.equals("/") && excludeRootWebApp) {
                continue;
            }
            rtn.add(Tuple.tuple(name, status));
        }

        return rtn;
    }

    private String getPathParam(String contextRoot) {
        try {
            return "path=" + URLEncoder.encode(contextRoot, URL_ENCODE_CHARSET);
        } catch (UnsupportedEncodingException ex) {
            throw new AssertionError(ex);
        }
    }

    private HttpURLConnection getManagerGetConnection(String command) {

        HttpURLConnection rtn = super.getGetConnection(getManagerUri() + "/" + command);

        return prepareConnection(rtn);
    }

    private HttpURLConnection prepareConnection(HttpURLConnection con) {

        // Copied from Catalina's DeployTask
        con.setRequestProperty("User-Agent", "Catalina-Ant-Task/1.0");

        String input = this.username + ":" + this.password;
        String output = new String(Base64.encode(input.getBytes()));
        con.setRequestProperty("Authorization", "Basic " + output);

        try {
            con.connect();
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        }
        return con;
    }

    private List<String> getResponse(HttpURLConnection con) {
        return getResponse(con, true);
    }

    private List<String> getResponse(HttpURLConnection con, boolean includeStatus) {
        List<String> rtn = new ArrayList<String>();

        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), MANAGER_CHARSET));

            String line = "";
            boolean isFirst = true;

            while ((line = br.readLine()) != null) {
                if (isFirst) {
                    if (!line.startsWith("OK")) {
                        throw new ConfigurationException(line);
                    }
                }
                if (!isFirst || includeStatus) {
                    rtn.add(line.trim());
                }
                isFirst = false;
            }

        } catch (IOException ex) {
            throw new ConfigurationException(ex);
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
