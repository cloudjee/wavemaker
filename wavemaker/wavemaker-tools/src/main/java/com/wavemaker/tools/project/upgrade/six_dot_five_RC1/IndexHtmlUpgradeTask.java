/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.project.upgrade.six_dot_five_RC1;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Upgrade of index.html and login.html for 6.5
 *  -Removes <script type="text/javascript" src="/wavemaker/lib/boot/boot.js"></script> since config.js loads boot.js
 *  -Removes <script type="text/javascript" src="lib_project.js"></script>  
 *  -Replaces <script type="text/javascript" src="Project47.js"></script> with project.a.js 
 *  -Removes <script type="text/javascript" src="types.js"></script> which is now loaded by project.a.js 
 *  -Adds <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"> 
 *  
 * @author Edward Callahan
 */
public class IndexHtmlUpgradeTask implements UpgradeTask {

	private String relativeIndexPath;
	private String message;

	private static String BOOTJSSTR = "<script type=\"text/javascript\" src=\"/wavemaker/lib/boot/boot.js\"></script>";
	private static String LIBPRJSTR = "<script type=\"text/javascript\" src=\"lib_project.js\"></script>";  
	private static String JSSRCSTR = "<script type=\"text/javascript\" src=\"";
	private static String JSCLOSESTR = ".js\"></script>";
	private static String PROJAJSSTR = "<script type=\"text/javascript\" src=\"project.a.js\"></script>";
	private static String TYPEJSSTR = "<script type=\"text/javascript\" src=\"types.js\"></script>";
	private static String HEADSTR = "<head>";
	private static String VIEWPORTSTR =  "\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no\">"; 
	private static String NOSTR = "";

	@Override
	public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

		if (this.relativeIndexPath == null) {
			throw new WMRuntimeException("No file provided");
		}
		try {
			File indexFile = project.getRootFolder().getFile(this.relativeIndexPath);
			String indexContent = indexFile.getContent().asString();
			String projName = project.getProjectName();
			Pattern BootPattern = Pattern.compile(BOOTJSSTR);
			Matcher BootMatcher = BootPattern.matcher(indexContent);
			if (BootMatcher.find()) {
				indexContent =indexContent.replace(BOOTJSSTR, NOSTR);
			}
			Pattern LibPattern = Pattern.compile(LIBPRJSTR);
			Matcher LibMatcher =  LibPattern.matcher(indexContent);
			if (LibMatcher.find()){
				indexContent = indexContent.replace(LIBPRJSTR, NOSTR);
			}
			String ProjectJsStr = JSSRCSTR + projName + JSCLOSESTR;
			Pattern ProjectJsPattern = Pattern.compile(ProjectJsStr);
			Matcher ProjectJsMatcher = ProjectJsPattern.matcher(indexContent);
			if(ProjectJsMatcher.find()){
				indexContent =indexContent.replace(ProjectJsStr, PROJAJSSTR);
			} 
			Pattern TypePattern = Pattern.compile(TYPEJSSTR);
			Matcher TypeMatcher =  TypePattern.matcher(indexContent);
			if (TypeMatcher.find()){
				indexContent =indexContent.replace(TYPEJSSTR, NOSTR);
			}
			Pattern HeadPattern = Pattern.compile(HEADSTR);
			Matcher HeadMatcher =  HeadPattern.matcher(indexContent);
			if (HeadMatcher.find()){
				indexContent= indexContent.replace(HEADSTR, HEADSTR + VIEWPORTSTR );
			}
			indexFile.getContent().write(indexContent);
			upgradeInfo.addMessage("\n\t Index.html updated to mobile compatible loading");

		}

		catch(ResourceException e){
			e.printStackTrace();
			upgradeInfo.addMessage("\n*** ERROR in IndexHtmlUpgradeTask See wm.log for details ***");
		}

		if (this.message != null) {
			upgradeInfo.addMessage(this.message);
		}
	}

	/**
	 * The relative path (relative to the project root) for the file to upgrade.
	 */
	public void setIndexFile(String file) {
		this.relativeIndexPath = file;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
