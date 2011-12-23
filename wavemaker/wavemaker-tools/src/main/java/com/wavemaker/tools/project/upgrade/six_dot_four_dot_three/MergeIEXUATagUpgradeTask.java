/**
 *
 *
 */

package com.wavemaker.tools.project.upgrade.six_dot_four_dot_three;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author Michael Kantor
 * 
 */
public class MergeIEXUATagUpgradeTask implements UpgradeTask {

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project,
     * com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        try {
            File indexFile = new File(project.getWebAppRoot() + "/index.html");
            String indexContent = FileUtils.readFileToString(indexFile);

            // 1. rename /project/index.html to index.bak.6.4.3
            File webapp = project.getWebAppRoot().getFile();
            File bakIndexhtml = new File(webapp, "index.bak.6.4.3");

            FileUtils.copyFile(indexFile, bakIndexhtml);

            String newIndexContent = updateContent(indexContent);
            if (newIndexContent != indexContent) {
                FileUtils.writeStringToFile(indexFile, newIndexContent);
                upgradeInfo.addMessage("\nIndex.html has been upgraded to use an improved X-UA-Compatible meta tag");
            } else {
                upgradeInfo.addMessage("\nWARNING: Index.html was not upgraded to use an improved X-UA-Compatible meta tag");
            }
        } catch (IOException ioe) {
            ioe.printStackTrace();
            upgradeInfo.addMessage("\n*** Error upgrading index.html to use improved X-UA-Compatible tag ***");
        }
        try {
            File loginFile = new File(project.getWebAppRoot() + "/login.html");
            if (loginFile.exists()) {

                // 1. rename /project/login.html to login.bak.6.4.3
                File webapp = project.getWebAppRoot().getFile();
                File bakLoginHtml = new File(webapp, "login.bak.6.4.3");
                FileUtils.copyFile(loginFile, bakLoginHtml);

                String loginContent = FileUtils.readFileToString(loginFile);

                String newLoginContent = updateContent(loginContent);
                if (newLoginContent != loginContent) {
                    FileUtils.writeStringToFile(loginFile, newLoginContent);
                    upgradeInfo.addMessage("\nlogin.html has been upgraded to use improved X-UA-Compatible tag.");
                } else {
                    upgradeInfo.addMessage("\nWARNING: login.html was not upgraded to use improved X-UA-Compatible tag.");
                }
            } else {
                upgradeInfo.addMessage("\n\tInfo: No login page found in project to upgrade");
            }
        } catch (IOException ioe) {
            ioe.printStackTrace();
            upgradeInfo.addMessage("\n*** Error upgrading login.html to use improved X-UA-Compatible tag ***");
        }
    }

    private String updateContent(String indexContent) {
        String searchStr1 = "<meta http-equiv=\"X-UA-Compatible\" content=\"chrome=1\">";
        String searchStr2 = "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=8\">";
        int index1 = indexContent.indexOf(searchStr1);
        int index2 = indexContent.indexOf(searchStr2);

        /* If either of these is not found, then this has been edited, don't try and upgrade */
        if (index1 == -1 || index2 == -1) {
            return indexContent;
        }

        index1 = indexContent.lastIndexOf("<!--[if", index1);
        System.out.println("INDEX2a:" + index2);
        index2 = indexContent.indexOf("<![endif]-->", index2) + "<![endif]-->".length();
        System.out.println("INDEX2b:" + index2);
        return indexContent.substring(0, index1) + "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=9; IE=8; chrome=1\">"
            + indexContent.substring(index2);
    }

}
