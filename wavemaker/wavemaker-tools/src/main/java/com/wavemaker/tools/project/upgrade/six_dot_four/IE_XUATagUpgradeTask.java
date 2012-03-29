/**
 *
 */

package com.wavemaker.tools.project.upgrade.six_dot_four;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author Ed Callahan
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
            File indexFile = project.getWebAppRootFolder().getFile("index.html");
            String indexContent = indexFile.getContent().asString();
            Matcher XUAMatcher = XUAPattern.matcher(indexContent);
            if (XUAMatcher.find()) {
                indexContent = XUAMatcher.replaceAll(XUAmetaTagReplaceStr);
            } else {
                indexContent = indexContent.replace(headStr, headReplaceStr);
            }
            indexFile.getContent().write(indexContent);
            upgradeInfo.addMessage("\nIndex.html has been upgraded to use IE9 mode. \n\tReview index.html if you are using other X-UA-Compatible modes");
        } catch (ResourceException e) {
            e.printStackTrace();
            upgradeInfo.addMessage("\n*** Error upgrading index.html to use IE9 mode ***");
        }
        try {
            File loginFile = project.getWebAppRootFolder().getFile("login.html");
            if (loginFile.exists()) {
                String loginContent = loginFile.getContent().asString();

                Matcher XUAMatcher = XUAPattern.matcher(loginContent);
                if (XUAMatcher.find()) {
                    loginContent = XUAMatcher.replaceAll(XUAmetaTagReplaceStr);
                } else {
                    loginContent = loginContent.replace(headStr, headReplaceStr);
                }
                loginFile.getContent().write(loginContent);
                upgradeInfo.addMessage("\nlogin.html has been upgraded to use IE9 mode.\n\tReview login.html if you are using other X-UA-Compatible modes");
            } else {
                upgradeInfo.addMessage("\n\tInfo: No login page found in project to upgrade");
            }
        } catch (ResourceException e) {
            e.printStackTrace();
            upgradeInfo.addMessage("\n*** Error upgrading login.html to use IE9 mode ***");
        }

    }

}
