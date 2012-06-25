
package com.wavemaker.tools.packager;

import com.wavemaker.tools.deployment.Deployer;
import com.wavemaker.tools.deployment.cloudfoundry.CloudFoundryDeployer;
import com.wavemaker.tools.deployment.tomcat.TomcatDeployer;
import com.wavemaker.tools.packager.jee.EarPackagedApplication;
import com.wavemaker.tools.packager.jee.WarPackagedApplication;

/**
 * Base interface that is used to represent a packaged form of a WaveMaker applications. Specific package
 * representations are handled by subclasses (for example {@link WarPackagedApplication war} and {@link EarPackagedApplication ear} are common
 * package formats).
 * <p>
 * {@link PackagedApplication}s can be generated using a {@link Packager} and often {@link Deployer deployed} to an
 * application server (for example {@link TomcatDeployer tomcat}) or a cloud service (for example
 * {@link CloudFoundryDeployer cloud foundry}). Packages might also be saved locally or made available for a user to
 * download.
 * 
 * @see Packager
 * @see Deployer
 * 
 * @author Phillip Webb
 */
public interface PackagedApplication {

}
