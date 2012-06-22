
package com.wavemaker.tools.packager;

import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.project.Project;

public interface Packager {

    <P extends Package> P createPackage(Project project, DeploymentInfo deploymentInfo, Class<P> packageClass);

}
