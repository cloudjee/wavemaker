/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.deployment.tomcat;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.tools.deployment.AppInfo;
import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.deployment.DeploymentStatusException;
import com.wavemaker.tools.deployment.DeploymentTarget;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.util.TomcatServer;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 * 
 */
public class TomcatDeploymentTarget implements DeploymentTarget {

    public static final String HOST_PROPERTY_NAME = "host";

    public static final String PORT_PROPERTY_NAME = "port";

    public static final String MANAGER_USER_PROPERTY_NAME = "username";

    public static final String MANAGER_PASSWORD_PROPERTY_NAME = "password";

    public static final Map<String, String> CONFIGURABLE_PROPERTIES;

    static {
        Map<String, String> m = new LinkedHashMap<String, String>(4);
        m.put(HOST_PROPERTY_NAME, "localhost");
        m.put(PORT_PROPERTY_NAME, "8080");
        m.put(MANAGER_USER_PROPERTY_NAME, "manager");
        m.put(MANAGER_PASSWORD_PROPERTY_NAME, "manager");
        CONFIGURABLE_PROPERTIES = Collections.unmodifiableMap(m);
    }

    @Override
    public void deploy(Project project, DeploymentInfo deploymentInfo) throws DeploymentStatusException {
        try {
            Resource warFile = project.getProjectRoot().createRelative(DeploymentManager.DIST_DIR_DEFAULT + project.getProjectName() + ".war");
            TomcatServer tomcat = initTomcat(deploymentInfo);
            verifyOK(tomcat.deploy(warFile.getFile(), deploymentInfo.getApplicationName()));
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    @Override
    public void undeploy(DeploymentInfo deploymentInfo, boolean deleteServices) throws DeploymentStatusException {
        TomcatServer tomcat = initTomcat(deploymentInfo);
        verifyOK(tomcat.undeploy(deploymentInfo.getApplicationName()));
    }

    private void verifyOK(String output) throws DeploymentStatusException {
        if (output != null) {
            if (output.trim().startsWith("OK") || output.trim().equals("SUCCESS")) {
                return;
            }
        }
        throw new DeploymentStatusException(output);
    }

    @Override
    public String redeploy(DeploymentInfo deploymentInfo) {
        TomcatServer tomcat = initTomcat(deploymentInfo);
        return tomcat.redeploy(deploymentInfo.getApplicationName());
    }

    @Override
    public String start(DeploymentInfo deploymentInfo) {
        TomcatServer tomcat = initTomcat(deploymentInfo);
        return tomcat.start(deploymentInfo.getApplicationName());
    }

    @Override
    public String stop(DeploymentInfo deploymentInfo) {
        TomcatServer tomcat = initTomcat(deploymentInfo);
        return tomcat.stop(deploymentInfo.getApplicationName());
    }

    @Deprecated
    public List<AppInfo> listDeploymentNames(DeploymentInfo deploymentInfo) {
        TomcatServer tomcat = initTomcat(deploymentInfo);
        List<Tuple.Two<String, String>> apps = tomcat.listDeployments();
        List<AppInfo> rtn = new ArrayList<AppInfo>(apps.size());
        for (Tuple.Two<String, String> t : apps) {
            StringBuilder url = new StringBuilder();
            url.append("http://").append(deploymentInfo.getHost()).append(":").append(deploymentInfo.getPort()).append(t.v1);
            StringBuilder href = new StringBuilder();
            href.append("<a href=\"").append(url).append("\" target=\"_blank\">").append(url).append("</a>");
            rtn.add(new AppInfo(t.v1, href.toString(), t.v2));
        }

        Collections.sort(rtn);

        return rtn;
    }

    @Deprecated
    public Map<String, String> getConfigurableProperties() {
        return CONFIGURABLE_PROPERTIES;
    }

    private TomcatServer initTomcat(DeploymentInfo deploymentInfo) {
        if (SystemUtils.isEncrypted(deploymentInfo.getPassword())) {
            deploymentInfo.setPassword(SystemUtils.decrypt(deploymentInfo.getPassword()));
        }

        TomcatServer rtn = new TomcatServer();
        rtn.setHost(deploymentInfo.getHost());
        rtn.setPort(deploymentInfo.getPort());
        rtn.setUsername(deploymentInfo.getUsername());
        rtn.setPassword(deploymentInfo.getPassword());
        return rtn;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void validateDeployment(DeploymentInfo deploymentInfo) {
        // No-op
    }
}
