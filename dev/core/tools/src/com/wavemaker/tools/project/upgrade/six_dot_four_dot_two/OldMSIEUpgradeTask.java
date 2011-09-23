/**
 * Upgrades 6.4.1 Beta and older tasks to support MSIE older than 8 using Chrome Frame
 *
 */
package com.wavemaker.tools.project.upgrade.six_dot_four_dot_two;


import java.io.File;
import java.io.IOException;
//import java.util.regex.*;

import org.apache.commons.io.FileUtils;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author mkantor
 *
 */
public class OldMSIEUpgradeTask implements UpgradeTask {

    

	/* (non-Javadoc)
	 * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
	 */

	public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

		try{
			File indexFile = new File (project.getWebAppRoot() + "/index.html");
			String indexContent = FileUtils.readFileToString(indexFile);


			indexContent = updateContent(indexContent);
			System.out.println("INDEX:"+indexContent);
			FileUtils.writeStringToFile(indexFile, indexContent);
			upgradeInfo.addMessage("\nIndex.html has been upgraded to use IE9 mode and an improved Chromeframe. \n\tReview index.html if you are using other X-UA-Compatible modes");
		}catch (IOException ioe){
			ioe.printStackTrace();
			upgradeInfo.addMessage("\n*** Error upgrading index.html to use IE9 mode ***");
		}
		try{
			File loginFile = new File (project.getWebAppRoot() + "/login.html");
			if(loginFile.exists()){
				String loginContent = FileUtils.readFileToString(loginFile);

				loginContent = updateContent(loginContent);
				FileUtils.writeStringToFile(loginFile, loginContent);
				upgradeInfo.addMessage("\nlogin.html has been upgraded to use IE9 mode and an improved Chromeframe.\n\tReview login.html if you are using other X-UA-Compatible modes");
			}
			else {
				upgradeInfo.addMessage("\n\tInfo: No login page found in project to upgrade");
			}
		}catch (IOException ioe){
			ioe.printStackTrace();
			upgradeInfo.addMessage("\n*** Error upgrading login.html to use IE9 mode ***");
		}

	}
    private String updateContent(String indexContent) {
 String XUAmetaTagReplaceStr = "<!--[if lt IE 8]>\n" +
	    "<meta http-equiv=\"X-UA-Compatible\" content=\"chrome=1\">\n" +
	    "<![endif]-->\n" +
	    "<!--[if gt IE 8]>\n" +
	    "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\">\n" +
	    "<![endif]-->\n" +
	    "<!--[if IE 8]>\n" +
	    "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=8\">\n" +
	    "<![endif]-->\n" +
	    "<!--[if lt IE 8]>\n" +
	    "<script type=\"text/javascript\">\n" +
	    "var wmChromeFramePath = \"chromeframe.html\";\n" +
	    "</script>\n" +
	    "<![endif]-->\n";

        StringBuffer lostBuffer = new StringBuffer();

	StringBuffer b = new StringBuffer();
	String[] lines = indexContent.split("\\n");
	boolean inDialog = false;
	boolean skipALine = false;
	for (int i = 0; i < lines.length; i++) {
	    String l = lines[i];
	    if (l.indexOf("<head>") != -1) {
		l += "\n" + XUAmetaTagReplaceStr;
	    }
	    if (inDialog) {
		if (l.indexOf("_wm_loading") != -1) {
		    inDialog = false;
		} else if (l.indexOf("CFInstall.check") != -1) {
		    inDialog = false;
		    skipALine = true;
		    continue;
		}
	    } else if (l.indexOf("_wm_googleChromeDialog") != -1) {
		inDialog = true;
		b.append("<!--[if lt IE 8]>\n");
		b.append("<script type=\"text/javascript\">\n");
		b.append("  if (window[\"wmChromeFramePath\"]) {\n");
		b.append("     document.writeln('<iframe style=\"width:100%;height:100%;\" id=\"_wm_googleChromeDialog\" class=\"chromeFramePrompt\" src=\"' + wmChromeFramePath + '\"></iframe>');\n");
		b.append("  }\n");
		b.append("</script>\n");
		b.append("<![endif]-->\n");
	    } else if (l.indexOf("function promptGoogleFrame()") != -1) {
		inDialog = true;
	    }
	    if (!inDialog) {
		if (!skipALine && l.indexOf("X-UA_Compatible") == -1)
		    b.append(l + "\n");
		else 
		    skipALine = false;
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

