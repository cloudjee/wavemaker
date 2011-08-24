/**
 * 
 */
package com.wavemaker.tools.project.upgrade.six_dot_four;


import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author ecallahan
 *
 */
public class IE_XUATagUpgradeTask implements UpgradeTask {

	private static String IE8metaTagStr  = "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=8\" />";
	private static String IE8metaTagReplaceStr = "<!--<meta http-equiv=\"X-UA-Compatible\" content=\"IE=8\" />-->";
	
	private static String GCFmetaTagStr = "<meta http-equiv=\"X-UA-Compatible\" content=\"chrome=1\">";
	private static String GCFmetaTagReplaceStr ="<!--<meta http-equiv=\"X-UA-Compatible\" content=\"chrome=1\">-->";
	
	private static String headStr = "<head>";
	private static String headReplaceStr = "<head>\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\">";
	
	
	/* (non-Javadoc)
	 * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
	 */

	public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

		try{
			File indexFile = new File (project.getWebAppRoot() + "/index.html");
			String indexContent = FileUtils.readFileToString(indexFile);
			indexContent = indexContent.replace(IE8metaTagStr, IE8metaTagReplaceStr);
			indexContent = indexContent.replace(GCFmetaTagStr, GCFmetaTagReplaceStr);
			indexContent = indexContent.replace(headStr, headReplaceStr);
			FileUtils.writeStringToFile(indexFile, indexContent);					
			upgradeInfo.addMessage("\nIndex.html has been upgraded to use IE9 mode. \n\tReview index.html if you have been using other X-UA-Compatible modes");
		}catch (IOException ioe){
			ioe.printStackTrace();
			upgradeInfo.addMessage("\n*** Error upgrading index.html to use IE9 mode ***");
		}
		try{
			File loginFile = new File (project.getWebAppRoot() + "/login.html");
			if(loginFile.exists()){
			String loginContent = FileUtils.readFileToString(loginFile);
			loginContent = loginContent.replace(IE8metaTagStr, IE8metaTagReplaceStr);
			loginContent = loginContent.replace(GCFmetaTagStr, GCFmetaTagReplaceStr);
			loginContent = loginContent.replace(headStr, headReplaceStr);
			FileUtils.writeStringToFile(loginFile, loginContent);					
			upgradeInfo.addMessage("\nlogin.html has been upgraded to use IE9 mode.\n\tReview login.html if you have been using other X-UA-Compatible modes");
			}
			else {
			upgradeInfo.addMessage("\n\tNo login page found to upgrade");
			}
		}catch (IOException ioe){
			ioe.printStackTrace();
			upgradeInfo.addMessage("\n*** Error upgrading login.html to use IE9 mode ***");
		}
	
	}

}
