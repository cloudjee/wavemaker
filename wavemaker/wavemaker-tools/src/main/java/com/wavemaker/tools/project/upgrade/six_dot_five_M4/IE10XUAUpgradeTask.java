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

package com.wavemaker.tools.project.upgrade.six_dot_five_M4;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Upgrade add or replace any existing <tt>X-UA-Compatible</tt> with IE10 support.
 * 
 * The new tag is : <code>
 *  &lt;meta http-equiv="X-UA-Compatible" content="IE=10; IE=9; IE=8; chrome=1"&gt;
 *  </code>
 * 
 * @author Phillip Webb
 */
public class IE10XUAUpgradeTask implements UpgradeTask {

    private static final Pattern EXISTING_UA_HEADER_PATTERN = Pattern.compile("http-equiv=\"X-UA-Compatible\" content=\".*\"");

    private static final String EXISTING_UA_HEADER_REPLACEMENT = "http-equiv=\"X-UA-Compatible\" content=\"IE=10; IE=9; IE=8; chrome=1\"";

    private static final String NEW_UA_HEADER_LOCATION = "<head>";

    private static final String NEW_UA_HEADER_REPLACEMENT = NEW_UA_HEADER_LOCATION + "\n<meta " + EXISTING_UA_HEADER_REPLACEMENT + ">";

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        upgrade(project.getWebAppRootFolder().getFile("index.html"), upgradeInfo);
        upgrade(project.getWebAppRootFolder().getFile("login.html"), upgradeInfo);
    }

    private void upgrade(File file, UpgradeInfo upgradeInfo) {
        if (file.exists()) {
            try {
                upgradeContent(file);
                upgradeInfo.addMessage("\n" + file
                    + " has been upgraded to use IE10 UA mode. \n\tReview index.html if you are using other X-UA-Compatible modes");
            } catch (Exception e) {
                e.printStackTrace();
                upgradeInfo.addMessage("\n*** Error upgrading " + file + " to use IE10 UA mode ***");
            }
        }
    }

    private void upgradeContent(File file) {
        String content = file.getContent().asString();
        Matcher matcher = EXISTING_UA_HEADER_PATTERN.matcher(content);
        if (matcher.find()) {
            content = matcher.replaceAll(EXISTING_UA_HEADER_REPLACEMENT);
        } else {
            content = content.replace(NEW_UA_HEADER_LOCATION, NEW_UA_HEADER_REPLACEMENT);
        }
        file.getContent().write(content);
    }
}
