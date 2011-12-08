/**
 * Upgrades 6.4.1 Beta and older tasks to support MSIE older than 8 using Chrome Frame
 *
 */

package com.wavemaker.tools.project.upgrade.six_dot_four_dot_two;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author Michael Kantor
 * 
 */
public class OldMSIEUpgradeTask implements UpgradeTask {

    private final StudioFileSystem fileSystem;

    public OldMSIEUpgradeTask(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project,
     * com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        copyChromeframeFile(project, upgradeInfo);

        try {
            File indexFile = new File(project.getWebAppRoot() + "/index.html");
            String indexContent = FileUtils.readFileToString(indexFile);

            // 1. rename /project/index.html to index.bak
            File webapp = project.getWebAppRoot().getFile();
            File bakIndexhtml = new File(webapp, "index.bak");

            FileUtils.copyFile(indexFile, bakIndexhtml);

            indexContent = updateContent(indexContent);
            FileUtils.writeStringToFile(indexFile, indexContent);
            upgradeInfo.addMessage("\nIndex.html has been upgraded to use IE9 mode and an improved Chromeframe. \n\tReview index.html if you are using other X-UA-Compatible modes");
        } catch (IOException ioe) {
            ioe.printStackTrace();
            upgradeInfo.addMessage("\n*** Error upgrading index.html to use IE9 mode ***");
        }
        try {
            File loginFile = new File(project.getWebAppRoot() + "/login.html");
            if (loginFile.exists()) {

                // 1. rename /project/login.html to login.bak
                File webapp = project.getWebAppRoot().getFile();
                File bakLoginHtml = new File(webapp, "login.bak");
                FileUtils.copyFile(loginFile, bakLoginHtml);

                String loginContent = FileUtils.readFileToString(loginFile);

                loginContent = updateContent(loginContent);
                FileUtils.writeStringToFile(loginFile, loginContent);
                upgradeInfo.addMessage("\nlogin.html has been upgraded to use IE9 mode and an improved Chromeframe.\n\tReview login.html if you are using other X-UA-Compatible modes");
            } else {
                upgradeInfo.addMessage("\n\tInfo: No login page found in project to upgrade");
            }
        } catch (IOException ioe) {
            ioe.printStackTrace();
            upgradeInfo.addMessage("\n*** Error upgrading login.html to use IE9 mode ***");
        }

    }

    private void copyChromeframeFile(Project project, UpgradeInfo upgradeInfo) {
        try {
            String relativePath = "chromeframe.html";
            File chromeFrameFile = project.getWebAppRoot().createRelative(relativePath).getFile();
            if (!chromeFrameFile.exists()) {
                IOUtils.copy(this.fileSystem.getStudioWebAppRoot().createRelative("app/templates/project/chromeframe.html").getFile(),
                    chromeFrameFile);
            }

        } catch (IOException ioe) {
            ioe.printStackTrace();
            upgradeInfo.addMessage("\n*** Error copying in chromeframe.html ***");
        }
    }

    private String updateContent(String indexContent) {
        String XUAmetaTagReplaceStr = "<!--[if lt IE 8]>\n" + "<meta http-equiv=\"X-UA-Compatible\" content=\"chrome=1\">\n" + "<![endif]-->\n"
            + "<!--[if gt IE 8]>\n" + "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\">\n" + "<![endif]-->\n" + "<!--[if IE 8]>\n"
            + "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=8\">\n" + "<![endif]-->\n" + "<!--[if lt IE 8]>\n"
            + "<script type=\"text/javascript\">\n" + "var wmChromeFramePath = \"chromeframe.html\";\n" + "</script>\n" + "<![endif]-->\n";

        StringBuffer lostBuffer = new StringBuffer();

        StringBuffer b = new StringBuffer();
        String[] lines = indexContent.split("\\n");
        boolean inDialog = false;
        boolean findEndBlock = false;
        for (int i = 0; i < lines.length; i++) {
            String l = lines[i];
            if (findEndBlock) {
                int indexOfBrace = l.indexOf("}");
                if (indexOfBrace != -1) {
                    l = l.substring(indexOfBrace + 1);
                    findEndBlock = false;
                }
            }
            if (l.indexOf("<head>") != -1) {
                l += "\n" + XUAmetaTagReplaceStr;
            }
            if (inDialog) {
                if (l.indexOf("_wm_loading") != -1) {
                    inDialog = false;
                } else if (l.indexOf("CFInstall.check") != -1) {
                    inDialog = false;
                    findEndBlock = true;
                    continue;
                }
            } else if (l.indexOf("_wm_googleChromeDialog") != -1) {
                inDialog = true;
                b.append("<!--[if lt IE 8]>\n");
                b.append("<style>");
                b.append(".BrowserNotSupported {");
                b.append("   background-color: #aaa;");
                b.append("   padding: 0px 40px;");
                b.append("   height: 100%;");
                b.append("}");
                b.append(".BrowserNotSupported div {");
                b.append("  padding-top: 15px;");
                b.append("  text-align: center;");
                b.append("  font-size: 16pt;");
                b.append("  height: 65px;");
                b.append("}");
                b.append(".BrowserNotSupported iframe {");
                b.append("  border: solid 2px #333;");
                b.append("  height: 80%;");
                b.append("  width: 100%;");
                b.append("}");
                b.append("</style>");
                b.append("<script type=\"text/javascript\">\n");
                b.append("  if (window[\"wmChromeFramePath\"]) {\n");
                b.append("      document.writeln('<div class=\"BrowserNotSupported\"><div>Project6 can not be run in this browser; please review the information below on upgrading your browser</div><iframe id=\"_wm_googleChromeDialog\" class=\"chromeFramePrompt\" src=\"' + wmChromeFramePath + '\"></iframe></div>');\n");
                b.append("  }\n");
                b.append("</script>\n");
                b.append("<![endif]-->\n");
            } else if (l.indexOf("function promptGoogleFrame()") != -1) {
                inDialog = true;
            }
            if (!inDialog) {
                if (l.indexOf("X-UA_Compatible") == -1) {
                    b.append(l + "\n");
                }
            } else {
                lostBuffer.append(l + "\n");
            }
        }
        /* Error! recover lost lines if we failed to exit the dialog nodes */
        if (inDialog) {
            b.append(lostBuffer);
        }

        return b.toString();
    }

}
