/**
 * 
 */
package com.wavemaker.tools.project.upgrade.six_dot_four;

import java.io.File;
import java.io.IOException;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.runtime.server.ServerConstants;

import org.apache.commons.io.FileUtils;


/**
 * @author ecallahan
 *
 */
public class CloudFoundryPropertiesUpgradeTask implements UpgradeTask {

	private static String fileStr = "/src/META-INF/cloudfoundry.properties";
	private static String propStr = "autostaging=false";
	private boolean error = false;
	/* (non-Javadoc)
	 * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
	 */

	public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

		try{
		project.writeFile(fileStr, propStr, true);
		}catch (IOException ioe){
			ioe.printStackTrace();
		}
	if (error) {
		upgradeInfo.addMessage("\n *** Error adding CloudFoundry properties in project upgrade task");
	} else {
		upgradeInfo.addMessage("\nSuccessfully added CloudFoundry properties to project");
	}
	
	}

}
