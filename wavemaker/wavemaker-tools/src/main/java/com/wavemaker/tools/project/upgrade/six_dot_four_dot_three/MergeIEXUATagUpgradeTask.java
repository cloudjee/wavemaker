/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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
/**
 *
 *
 */

package com.wavemaker.tools.project.upgrade.six_dot_four_dot_three;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author Michael Kantor
 */
public class MergeIEXUATagUpgradeTask implements UpgradeTask {

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        try {
            File indexFile = project.getWebAppRootFolder().getFile("index.html");
            indexFile.rename("index.bak.6.4.3");
            String indexContent = indexFile.getContent().asString();
            String newIndexContent = updateContent(indexContent);
            if (newIndexContent != indexContent) {
                indexFile.getContent().write(newIndexContent);
                upgradeInfo.addMessage("\nIndex.html has been upgraded to use an improved X-UA-Compatible meta tag");
            } else {
                upgradeInfo.addMessage("\nWARNING: Index.html was not upgraded to use an improved X-UA-Compatible meta tag");
            }
        } catch (ResourceException e) {
            e.printStackTrace();
            upgradeInfo.addMessage("\n*** Error upgrading index.html to use improved X-UA-Compatible tag ***");
        }
        try {
            File loginFile = project.getWebAppRootFolder().getFile("login.html");
            if (loginFile.exists()) {
                // 1. rename /project/login.html to login.bak.6.4.3
                loginFile.rename("login.bak.6.4.3");
                String loginContent = loginFile.getContent().asString();
                String newLoginContent = updateContent(loginContent);
                if (newLoginContent != loginContent) {
                    loginFile.getContent().write(newLoginContent);
                    upgradeInfo.addMessage("\nlogin.html has been upgraded to use improved X-UA-Compatible tag.");
                } else {
                    upgradeInfo.addMessage("\nWARNING: login.html was not upgraded to use improved X-UA-Compatible tag.");
                }
            } else {
                upgradeInfo.addMessage("\n\tInfo: No login page found in project to upgrade");
            }
        } catch (ResourceException e) {
            e.printStackTrace();
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
