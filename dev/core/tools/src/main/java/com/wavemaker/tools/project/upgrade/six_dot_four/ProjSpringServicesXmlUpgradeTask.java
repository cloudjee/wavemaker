/**
 * 
 */

package com.wavemaker.tools.project.upgrade.six_dot_four;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author Ed Callahan
 * 
 */
public class ProjSpringServicesXmlUpgradeTask implements UpgradeTask {

    private static String fromStr = "</beans>";

    private static String toStr = "    <import resource=\"classpath:com/wavemaker/runtime/service/waveMakerServiceBean.xml\"/>\r\n</beans>";

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        File file = new File(project.getWebInf() + "/project-services.xml");

        try {
            String content = FileUtils.readFileToString(file, ServerConstants.DEFAULT_ENCODING);
            content = content.replace(fromStr, toStr);
            FileUtils.writeStringToFile(file, content, ServerConstants.DEFAULT_ENCODING);
            upgradeInfo.addMessage("\nUpgrading project-services.xml completed successfully.");
        } catch (IOException ioe) {
            ioe.printStackTrace();
            upgradeInfo.addMessage("\n*** Terminated with error while upgrading project-services.xml. " + "Please check the console message.***");
        }
    }

}
