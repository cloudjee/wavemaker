/**
 *
 *
 */
package com.wavemaker.tools.project.upgrade.six_dot_four_dot_three;


import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;

import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.common.WMRuntimeException;

/**
 * @author mkantor
 *
 */
public class MergeIEXUATagUpgradeTask implements UpgradeTask {

    

	/* (non-Javadoc)
	 * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
	 */

    public void doUpgrade(Project project, UpgradeInfo upgradeInfo, StudioConfiguration studioConfig) {
		upgradeInfo.addMessage("\n*** YOUR UPGRADE MESSAGE HERE ***");
	}
    
   

}

