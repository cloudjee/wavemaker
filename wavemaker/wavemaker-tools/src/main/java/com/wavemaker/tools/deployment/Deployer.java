
package com.wavemaker.tools.deployment;

import com.wavemaker.tools.packager.PackagedApplication;

public interface Deployer {

    Deployment deploy(PackagedApplication application);

}
