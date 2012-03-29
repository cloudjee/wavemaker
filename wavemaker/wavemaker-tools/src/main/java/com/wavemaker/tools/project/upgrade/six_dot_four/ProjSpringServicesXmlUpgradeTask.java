/**
 * 
 */

package com.wavemaker.tools.project.upgrade.six_dot_four;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author Ed Callahan
 */
public class ProjSpringServicesXmlUpgradeTask implements UpgradeTask {

    private static String fromStr = "</beans>";

    private static String toStr = "    <import resource=\"classpath:com/wavemaker/runtime/service/waveMakerServiceBean.xml\"/>\r\n</beans>";

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        File file = project.getWebInfFolder().getFile("project-services.xml");
        try {
            String content = file.getContent().asString();
            content = content.replace(fromStr, toStr);
            file.getContent().write(content);
            upgradeInfo.addMessage("\nUpgrading project-services.xml completed successfully.");
        } catch (ResourceException e) {
            e.printStackTrace();
            upgradeInfo.addMessage("\n*** Terminated with error while upgrading project-services.xml. " + "Please check the console message.***");
        }
    }

}
