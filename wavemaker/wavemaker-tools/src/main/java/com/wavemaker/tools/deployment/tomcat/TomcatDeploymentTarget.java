/*
 *  Copyright (C) 2008-2013 VMware, Inc. All rights reserved.
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

import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.deployment.DeploymentStatusException;
import com.wavemaker.tools.deployment.DeploymentTarget;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.Project;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 * 
 */
public class TomcatDeploymentTarget implements DeploymentTarget {

    @Override
    public String deploy(Project project, DeploymentInfo deploymentInfo, java.io.File tempWebAppRoot) throws DeploymentStatusException {
        File warFile = project.getRootFolder().getFile(DeploymentManager.DIST_DIR_DEFAULT + project.getProjectName() + ".war");
        TomcatManager tomcat = initTomcat(deploymentInfo);
        tomcat.deploy(deploymentInfo.getApplicationName(), warFile);
        return "SUCCESS";
    }

    @Override
    public void undeploy(DeploymentInfo deploymentInfo, boolean deleteServices) throws DeploymentStatusException {
        TomcatManager tomcat = initTomcat(deploymentInfo);
        tomcat.undeploy(deploymentInfo.getApplicationName());
    }

    private TomcatManager initTomcat(DeploymentInfo deploymentInfo) {
        if (SystemUtils.isEncrypted(deploymentInfo.getPassword())) {
            deploymentInfo.setPassword(SystemUtils.decrypt(deploymentInfo.getPassword()));
        }
        return new TomcatManager(deploymentInfo.getHost(), deploymentInfo.getPort(), deploymentInfo.getUsername(), deploymentInfo.getPassword());
    }

    @Override
    public String getUrl(DeploymentInfo deploymentInfo) {
        return "Not Implemented for Tomcat";
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void validateDeployment(DeploymentInfo deploymentInfo) {
        // No-op
    }
}
