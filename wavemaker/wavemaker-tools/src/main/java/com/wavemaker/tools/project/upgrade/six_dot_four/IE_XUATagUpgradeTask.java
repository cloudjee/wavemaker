/**
 *
 */

package com.wavemaker.tools.project.upgrade.six_dot_four;

import java.io.File;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.FileUtils;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author Ed Callahan
 * 
 */
public class IE_XUATagUpgradeTask implements UpgradeTask {

    private static String XUAmetaTagStr = "http-equiv=\"X-UA-Compatible\" content=\".*\"";

    private static String XUAmetaTagReplaceStr = "http-equiv=\"X-UA-Compatible\" content=\"IE=9\"";

    private static String headStr = "<head>";

    private static String headReplaceStr = "<head>\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\">";

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        Pattern XUAPattern = Pattern.compile(XUAmetaTagStr);

        try {
            File indexFile = new File(project.getWebAppRoot() + "/index.html");
            String indexContent = FileUtils.readFileToString(indexFile);
            Matcher XUAMatcher = XUAPattern.matcher(indexContent);
            if (XUAMatcher.find()) {
                indexContent = XUAMatcher.replaceAll(XUAmetaTagReplaceStr);
            } else {
                indexContent = indexContent.replace(headStr, headReplaceStr);
            }
            FileUtils.writeStringToFile(indexFile, indexContent);
            upgradeInfo.addMessage("\nIndex.html has been upgraded to use IE9 mode. \n\tReview index.html if you are using other X-UA-Compatible modes");
        } catch (IOException ioe) {
            ioe.printStackTrace();
            upgradeInfo.addMessage("\n*** Error upgrading index.html to use IE9 mode ***");
        }
        try {
            File loginFile = new File(project.getWebAppRoot() + "/login.html");
            if (loginFile.exists()) {
                String loginContent = FileUtils.readFileToString(loginFile);

                Matcher XUAMatcher = XUAPattern.matcher(loginContent);
                if (XUAMatcher.find()) {
                    loginContent = XUAMatcher.replaceAll(XUAmetaTagReplaceStr);
                } else {
                    loginContent = loginContent.replace(headStr, headReplaceStr);
                }
                FileUtils.writeStringToFile(loginFile, loginContent);
                upgradeInfo.addMessage("\nlogin.html has been upgraded to use IE9 mode.\n\tReview login.html if you are using other X-UA-Compatible modes");
            } else {
                upgradeInfo.addMessage("\n\tInfo: No login page found in project to upgrade");
            }
        } catch (IOException ioe) {
            ioe.printStackTrace();
            upgradeInfo.addMessage("\n*** Error upgrading login.html to use IE9 mode ***");
        }

    }

}
