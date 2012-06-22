
package com.wavemaker.tools.deploy;

import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.project.Project;

/**
 * Target that can be used to 'deploy' a wavemaker project.
 * 
 * @author Phillip Webb
 */
public interface DeployTarget {

    /**
     * Deploy the project using the specified deployment information
     * 
     * @param project the project to deploy
     * @param deploymentInfo deployment information
     * @return a deployment
     */
    Deployment deploy(Project project, DeploymentInfo deploymentInfo);

}
