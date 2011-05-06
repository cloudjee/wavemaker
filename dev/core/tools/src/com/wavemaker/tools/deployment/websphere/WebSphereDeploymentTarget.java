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

package com.wavemaker.tools.deployment.websphere;

import java.io.*;
import java.util.*;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.CommonConstants;
import com.wavemaker.tools.deployment.DeploymentTarget;
import com.wavemaker.tools.deployment.AppInfo;
import com.wavemaker.runtime.WMAppContext;

/**
 * @author slee
 *
 */
public class WebSphereDeploymentTarget implements DeploymentTarget {

    protected static final String HOST_PROPERTY_NAME = "host";
    protected static final String PORT_PROPERTY_NAME = "port";
    protected static final String MANAGER_USER_PROPERTY_NAME = "username";
    protected static final String MANAGER_PASSWORD_PROPERTY_NAME = "password";
    protected static final Map<String, String> CONFIGURABLE_PROPERTIES;

    static {
        Map<String, String> m = new LinkedHashMap<String, String>(4);
        m.put(HOST_PROPERTY_NAME, "localhost");
        m.put(PORT_PROPERTY_NAME, "8880");
        m.put(MANAGER_USER_PROPERTY_NAME, "virtuser");
        m.put(MANAGER_PASSWORD_PROPERTY_NAME, "chris1keene");
        CONFIGURABLE_PROPERTIES = Collections.unmodifiableMap(m);
    }

    private List<AppInfo> appInfoList;
    private boolean listCompleted = false;
    private boolean deployCompleted = false;
    private boolean undeployCompleted = false;
    private boolean listErrCompleted = false;
    private boolean deployErrCompleted = false;
    private boolean undeployErrCompleted = false;
    private int listCount = 0;
    private int deployCount = 0;
    private int undeployCount = 0;
    private String DEPLOYMENT_COMMAND
            = (org.apache.commons.lang.SystemUtils.IS_OS_WINDOWS ? "Deployment.bat" : "Deployment.sh");
    private String studioHome = WMAppContext.getInstance().getAppContextRoot();
    private String jsr88Home = studioHome + "/" + CommonConstants.IBMWAS_DIR;

    public Map<String, String> getConfigurableProperties() {

        return CONFIGURABLE_PROPERTIES;
    }

    public Map<String, String> getConfigurableProperties(String hostName) {

        Map<String, String> m = this.getConfigurableProperties();

        HashMap<String, String> hm = new HashMap<String, String>(m);
        hm.put(HOST_PROPERTY_NAME, hostName);
        return hm;
    }

    public String deploy(File f, String contextRoot,
                         Map<String, String> props) {
        String earFileName = f.getAbsolutePath();
        String appName = extractAppName(f);

        String[] cmd = setParams("deploy", props, earFileName, appName);
        
        try {
            Process proc = Runtime.getRuntime().exec(cmd);

            deployCompleted = false;
            deployErrCompleted = false;
            deployCount = 0;
            StreamGobbler errorGobbler = new StreamGobbler(proc.getErrorStream(), "[StdErr]");

            StreamGobbler outputGobbler = new StreamGobbler(proc.getInputStream(), "[StdOut]");

            errorGobbler.start();
            outputGobbler.start();
            
            int exitVal = proc.waitFor();
            System.out.println("Exit Value = " + exitVal);

            if (exitVal != 0) {
                throw new WMRuntimeException("Deploy to WebSphere failed.  The exit value is " + exitVal + ".");
            }

            waitAndCompleteDeploy();

        } catch (Exception e) {
            e.printStackTrace();
            throw new WMRuntimeException(e);
        }

        return "";
    }

    public String undeploy(String contextRoot, Map<String, String> props) {
        String earFileName = "dummy";
        String appName = contextRoot.substring(1);

        String[] cmd = setParams("undeploy", props, earFileName, appName);

        try {
            Process proc = Runtime.getRuntime().exec(cmd);

            undeployCompleted = false;
            undeployErrCompleted = false;
            undeployCount = 0;
            StreamGobbler errorGobbler = new StreamGobbler(proc.getErrorStream(), "[StdErr]");

            StreamGobbler outputGobbler = new StreamGobbler(proc.getInputStream(), "[StdOut]");

            errorGobbler.start();
            outputGobbler.start();

            int exitVal = proc.waitFor();
            System.out.println("Exit Value = " + exitVal);

            if (exitVal != 0) {
                throw new WMRuntimeException("Undeploy from WebSphere failed.  The exit value is " + exitVal + ".");
            }

            waitAndCompleteUndeploy();

        } catch (Exception e) {
            e.printStackTrace();
            throw new WMRuntimeException(e);
        }

        return "";
    }

    public List<AppInfo> listDeploymentNames(Map<String, String> props) {
        String earFileName = "dummy";
        String appName = "dummy";

        String[] cmd = setParams("list", props, earFileName, appName);

        try {           
            Process proc = Runtime.getRuntime().exec(cmd);

            listCompleted = false;
            listCount = 0;
            StreamGobbler errorGobbler = new StreamGobbler(proc.getErrorStream(), "[StdErr]");

            StreamGobblerForList outputGobbler = new StreamGobblerForList(proc.getInputStream(), "[StdOut]");

            errorGobbler.start();
            outputGobbler.start();

            int exitVal = proc.waitFor();
            System.out.println("Exit Value = " + exitVal);

            if (exitVal != 0) {
                throw new WMRuntimeException("Accessing WebSphere failed.  The exit value is " + exitVal + ".");
            }

            return waitAndGetAppInfoList();
        } catch (Exception e) {
            e.printStackTrace();
            throw new WMRuntimeException(e);
        }
    }

    public String redeploy(String contextRoot,
                    Map<String, String> configuredProperties) {
        return null;
    }

    private String extractAppName(File earFile) {
        String fileName = earFile.getName();
        return fileName.substring(0, fileName.length()-4);
    }

    private void waitAndCompleteDeploy() throws InterruptedException {
        if (deployCount > 1800)
            throw new WMRuntimeException("Time out");

        if (!deployCompleted || !deployErrCompleted) {
            Thread.sleep(100);
            deployCount++;
            waitAndCompleteDeploy();
        }
    }

    private void waitAndCompleteUndeploy() throws InterruptedException {
        if (undeployCount > 1800)
            throw new WMRuntimeException("Time out");

        if (!undeployCompleted || !undeployErrCompleted) {
            Thread.sleep(100);
            undeployCount++;
            waitAndCompleteUndeploy();
        }
    }

    private List<AppInfo> waitAndGetAppInfoList() throws InterruptedException {
        if (listCount > 1800)
            throw new WMRuntimeException("Time out");

        if (!listCompleted || !listErrCompleted) {
            Thread.sleep(100);
            listCount++;
            return waitAndGetAppInfoList();
        } else {
            return appInfoList;
        }
    }

    private String[] setParams(String action, Map<String, String> props, String earFile, String app) {
        String host = props.get(HOST_PROPERTY_NAME);
        String port = props.get(PORT_PROPERTY_NAME);
        String userId = props.get(MANAGER_USER_PROPERTY_NAME) == null ?
                "null" : props.get(MANAGER_USER_PROPERTY_NAME);
        String passwd = props.get(MANAGER_PASSWORD_PROPERTY_NAME) == null ?
                "null" : props.get(MANAGER_PASSWORD_PROPERTY_NAME);

        String cmdstr = jsr88Home +
               "/" + DEPLOYMENT_COMMAND + " list " + app + " " + earFile + " " + host + " " +
               port + " " + userId + " " + passwd + " " + jsr88Home;

        String[] cmd = new String[9];
        cmd[0] = jsr88Home + "/" + DEPLOYMENT_COMMAND;
        cmd[1] = action;
        cmd[2] = app;
        cmd[3] = earFile;
        cmd[4] = host;
        cmd[5] = port;
        cmd[6] = userId;
        cmd[7] = passwd;
        cmd[8] = jsr88Home;

        System.out.println("\ncommand = " + cmdstr + "\n");

        return cmd;
    }

    class StreamGobbler extends Thread
    {
        InputStream is;
        String type;

        StreamGobbler(InputStream is, String type)
        {
            this.is = is;
            this.type = type;
        }

        public void run()
        {
            try {
                InputStreamReader isr = new InputStreamReader(is);
                BufferedReader br = new BufferedReader(isr);
                String line;
                while ( (line = br.readLine()) != null)
                    System.out.println(type + " " + line);
            } catch (IOException ioe) {
                ioe.printStackTrace();
            } finally {
                if (type.equals("[StdOut]")) {
                    deployCompleted = true;
                    undeployCompleted = true;
                } else {
                    deployErrCompleted = true;
                    undeployErrCompleted = true;
                    listErrCompleted = true;
                }
            }
        }

    }

    class StreamGobblerForList extends Thread
    {
        InputStream is;
        String type;

        StreamGobblerForList(InputStream is, String type)
        {
            this.is = is;
            this.type = type;
        }

        public void run()
        {
            try {
                StringBuilder sb = new StringBuilder();
                InputStreamReader isr = new InputStreamReader(is);
                BufferedReader br = new BufferedReader(isr);
                String line;
                while ( (line = br.readLine()) != null) {
                    sb.append(line);
                    System.out.println(type + " " + line);
                }

                appInfoList = buildAppInfoList(sb);

            } catch (IOException ioe) {
                ioe.printStackTrace();
            } finally {
                listCompleted = true;
            }
        }

        private List<AppInfo> buildAppInfoList(StringBuilder sb) {
            String startstr = "--- start of module list ---";
            String endstr = "--- end of module list ---";
            int indx1 = sb.indexOf(startstr);
            int indx2 = sb.indexOf(endstr);

            String str = sb.substring(indx1+startstr.length(), indx2-1);

            String[] lines = str.split("\\$");
            List<AppInfo> rtn = new ArrayList<AppInfo>(lines.length);

            for (String line: lines) {
                String[] props = line.split("\\|");
                StringBuilder url = new StringBuilder();
                url.append("http://").append(props[1]).append(":")
                    .append("9080").append("/").append(props[0]);
                StringBuilder href = new StringBuilder();
                href.append("<a href=\"")
                    .append(url)
                    .append("\" target=\"_blank\">")
                    .append(url)
                    .append("</a>");
                rtn.add(new AppInfo("/"+props[0], href.toString(), props[2]));
            }

            return rtn;
        }
    }
}
