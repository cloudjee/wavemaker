/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.deployment.websphere;

import java.io.*;
import java.util.*;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.tools.deployment.DeploymentTarget;
import com.wavemaker.tools.deployment.AppInfo;

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
    private String DEPLOYMENT_COMMAND
            = (org.apache.commons.lang.SystemUtils.IS_OS_WINDOWS ? "Deployment.bat" : "Deployment.sh");

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
        String host = props.get(HOST_PROPERTY_NAME);
        String port = props.get(PORT_PROPERTY_NAME);
        String userId = props.get(MANAGER_USER_PROPERTY_NAME);
        String passwd = props.get(MANAGER_PASSWORD_PROPERTY_NAME);
        String earFileName = f.getAbsolutePath();
        String appName = extractAppName(f);
        
        String cmd = SystemUtils.getWavemakerRoot() + "/" + CommonConstants.IBMWAS_DIR + "/bin" +
                "/" + DEPLOYMENT_COMMAND + " deploy " + appName + " " + earFileName + " " + host + " " +
                port + " " + userId + " " + passwd;

        System.out.println("\ncommand = " + cmd + "\n");
        
        try {
            Process proc = Runtime.getRuntime().exec(cmd);

            StreamGobbler errorGobbler = new StreamGobbler(proc.getErrorStream(), "[StdErr]");

            StreamGobbler outputGobbler = new StreamGobbler(proc.getInputStream(), "[StdOut]");

            errorGobbler.start();
            outputGobbler.start();
            
            int exitVal = proc.waitFor();
            System.out.println("Exit Value = " + exitVal);

            if (exitVal != 0) {
                throw new WMRuntimeException("Deploy to WebSphere failed.  The exit value is " + exitVal + ".");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new WMRuntimeException(e);
        }

        return "";
    }

    public String undeploy(String contextRoot, Map<String, String> props) {
        String host = props.get(HOST_PROPERTY_NAME);
        String port = props.get(PORT_PROPERTY_NAME);
        String userId = props.get(MANAGER_USER_PROPERTY_NAME);
        String passwd = props.get(MANAGER_PASSWORD_PROPERTY_NAME);
        String earFileName = "dummy";
        String appName = contextRoot.substring(1);

        String cmd = SystemUtils.getWavemakerRoot() + "/" + CommonConstants.IBMWAS_DIR + "/bin" +
                "/" + DEPLOYMENT_COMMAND + " undeploy " + appName + " " + earFileName + " " + host + " " +
                port + " " + userId + " " + passwd;

        System.out.println("\ncommand = " + cmd + "\n");



        try {
            Process proc = Runtime.getRuntime().exec(cmd);

            StreamGobbler errorGobbler = new StreamGobbler(proc.getErrorStream(), "[StdErr]");

            StreamGobbler outputGobbler = new StreamGobbler(proc.getInputStream(), "[StdOut]");

            errorGobbler.start();
            outputGobbler.start();

            int exitVal = proc.waitFor();
            System.out.println("Exit Value = " + exitVal);

            if (exitVal != 0) {
                throw new WMRuntimeException("Undeploy from WebSphere failed.  The exit value is " + exitVal + ".");
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new WMRuntimeException(e);
        }

        return "";
    }

    public List<AppInfo> listDeploymentNames(Map<String, String> props) {
        String host = props.get(HOST_PROPERTY_NAME);
        String port = props.get(PORT_PROPERTY_NAME);
        String userId = props.get(MANAGER_USER_PROPERTY_NAME);
        String passwd = props.get(MANAGER_PASSWORD_PROPERTY_NAME);
        String earFileName = "dummy";
        String appName = "dummy";

        String cmd = SystemUtils.getWavemakerRoot() + "/" + CommonConstants.IBMWAS_DIR + "/bin" +
                "/" + DEPLOYMENT_COMMAND + " list " + appName + " " + earFileName + " " + host + " " +
                port + " " + userId + " " + passwd;

        System.out.println("\ncommand = " + cmd + "\n");

        try {
            Process proc = Runtime.getRuntime().exec(cmd);

            StreamGobbler errorGobbler = new StreamGobbler(proc.getErrorStream(), "[StdErr]");

            StreamGobblerForList outputGobbler = new StreamGobblerForList(proc.getInputStream(), "[StdOut]");

            errorGobbler.start();
            outputGobbler.start();

            int exitVal = proc.waitFor();
            System.out.println("Exit Value = " + exitVal);

            if (exitVal != 0) {
                throw new WMRuntimeException("Accessing WebSphere failed.  The exit value is " + exitVal + ".");
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new WMRuntimeException(e);
        }

        return appInfoList;
    }

    public String redeploy(String contextRoot,
                    Map<String, String> configuredProperties) {
        return null;
    }

    private String extractAppName(File earFile) {
        String fileName = earFile.getName();
        return fileName.substring(0, fileName.length()-4);
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
