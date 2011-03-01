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
package com.wavemaker.tools.deployment.tomcat;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.util.Tuple;
import com.wavemaker.tools.util.TomcatServer;
import com.wavemaker.tools.deployment.DeploymentTarget;
import com.wavemaker.tools.deployment.AppInfo;

/**
 * @author Simon Toens
 * @version $Rev: 28194 $ - $Date: 2009-12-03 14:19:22 -0800 (Thu, 03 Dec 2009) $
 *
 */
public class TomcatDeploymentTarget implements DeploymentTarget {

    protected static final String HOST_PROPERTY_NAME = "host";
    protected static final String PORT_PROPERTY_NAME = "port";
    protected static final String MANAGER_USER_PROPERTY_NAME = "username";
    protected static final String MANAGER_PASSWORD_PROPERTY_NAME = "password";
    protected static final Map<String, String> CONFIGURABLE_PROPERTIES;  

    static {
        Map<String, String> m = new LinkedHashMap<String, String>(4);
        m.put(HOST_PROPERTY_NAME, "localhost");
        m.put(PORT_PROPERTY_NAME, "8080");
        m.put(MANAGER_USER_PROPERTY_NAME, "manager");
        m.put(MANAGER_PASSWORD_PROPERTY_NAME, "manager");
        CONFIGURABLE_PROPERTIES = Collections.unmodifiableMap(m);
    }

    public String deploy(File f, String contextRoot,
                         Map<String, String> props) 
    {
        TomcatServer tomcat = initTomcat(props);
        return tomcat.deploy(f, contextRoot);
    }

    public String undeploy(String contextRoot, Map<String, String> props) {
        TomcatServer tomcat = initTomcat(props);
        return tomcat.undeploy(contextRoot);
    }

    public String redeploy(String contextRoot, Map<String, String> props) {
        TomcatServer tomcat = initTomcat(props);
        return tomcat.redeploy(contextRoot);
    }

    public List<AppInfo> listDeploymentNames(Map<String, String> props) {
        TomcatServer tomcat = initTomcat(props);
        List<Tuple.Two<String, String>> apps = tomcat.listDeployments();
        List<AppInfo> rtn = new ArrayList<AppInfo>(apps.size());
        for (Tuple.Two<String, String> t : apps) {
            StringBuilder url = new StringBuilder();
            url.append("http://").append(getHostName(props)).append(":")
                .append(getPort(props)).append(t.v1);
            StringBuilder href = new StringBuilder();
            href.append("<a href=\"")
                .append(url)
                .append("\" target=\"_blank\">")
                .append(url)
                .append("</a>");
            rtn.add(new AppInfo(t.v1, href.toString(), t.v2));
        }

        Collections.sort(rtn);

        return rtn;
    }

    public Map<String, String> getConfigurableProperties() {
        return CONFIGURABLE_PROPERTIES;
    }

    private String getHostName(Map<String, String> props) {
        return props.get(HOST_PROPERTY_NAME);
    }

    private int getPort(Map<String, String> props) {
        return Integer.parseInt(props.get(PORT_PROPERTY_NAME));
    }

    private String getUsername(Map<String, String> props) {
        return props.get(MANAGER_USER_PROPERTY_NAME);
    }

    private String getPassword(Map<String, String> props) {
        return props.get(MANAGER_PASSWORD_PROPERTY_NAME);
    }

    private TomcatServer initTomcat(Map<String, String> props) {
        TomcatServer rtn = new TomcatServer();
        rtn.setHost(getHostName(props));
        rtn.setPort(getPort(props));
        rtn.setUsername(getUsername(props));
        rtn.setPassword(getPassword(props));
        return rtn;
    }
}
