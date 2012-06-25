
package com.wavemaker.tools.deployment.tomcat;

import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.tools.deployment.DeploymentInfo;

/**
 * Target to deploy via a tomcat manager.
 * 
 * @author Phillip Webb
 */
public class TomcatManagerDeployTarget {

    // FIXME Delete

    // @Override
    // public WebDeployment deploy(Project project, DeploymentInfo deploymentInfo) {
    // TomcatManager manager = getManager(deploymentInfo);
    // Folder warFolder = this.assemble.warFolder(project, deploymentInfo);
    // String context = deploymentInfo.getApplicationName();
    // return new WebDeployment(manager.deploy(context, ZipArchive.compress(warFolder)));
    // }

    private TomcatManager getManager(DeploymentInfo deploymentInfo) {
        String host = deploymentInfo.getHost();
        int port = deploymentInfo.getPort();
        String username = deploymentInfo.getUsername();
        String password = deploymentInfo.getPassword();
        if (SystemUtils.isEncrypted(password)) {
            password = SystemUtils.decrypt(password);
        }
        return new TomcatManager(host, port, username, password);
    }
}
