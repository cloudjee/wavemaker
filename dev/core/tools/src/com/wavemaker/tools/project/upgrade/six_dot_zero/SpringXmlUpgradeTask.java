/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.project.upgrade.six_dot_zero;

import java.io.File;
import java.io.IOException;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.runtime.server.ServerConstants;

import org.apache.commons.io.FileUtils;
/**
 * Changes the package of WMPropertyPlaceholderConfigurer.
 * 
 * @author S Lee
 */
public class SpringXmlUpgradeTask implements UpgradeTask {

    private String fromStr = "com.wavemaker.common.WMPropertyPlaceholderConfigurer";
    private String toStr = "com.wavemaker.runtime.data.spring.WMPropertyPlaceholderConfigurer";
    private boolean processed = false;
    private boolean error = false;

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        String svcPath = project.getProjectRoot() + "/services";
        File svc = new File(svcPath);

        File[] mdls = svc.listFiles();
		if (mdls == null || mdls.length == 0) return;

        for (File mdl: mdls) {
            File mdlsrc = new File(mdl.getAbsolutePath() + "/src");
            processSingleMdl(mdlsrc);
		}

        if (error) {
            upgradeInfo.addMessage("*** Terminated with error while upgrading Data Model Spring config file. " +
                    "Please check the console message.***");
        } else if (!processed) {
            upgradeInfo.addMessage("Upgrading Data Model Spring config file completed. No files processed.");
        } else {
            upgradeInfo.addMessage("Upgrading Data Model Spring config file completed successfully.");
        }
    }

    private void processSingleMdl(File mdl) {
        File[] xmls = mdl.listFiles();

        if (xmls == null || xmls.length == 0) return;

        for (File xmlf: xmls) {
            if (xmlf.isDirectory()) continue;
            processSingleXml(xmlf);
		}
    }

    private void processSingleXml(File xmlf) {
        String fileName = xmlf.getName();
        if (!fileName.contains("spring.xml")) return;

        try {
            String content = FileUtils.readFileToString(xmlf, ServerConstants.DEFAULT_ENCODING);
            content = content.replace(fromStr, toStr);
            FileUtils.writeStringToFile(xmlf, content, ServerConstants.DEFAULT_ENCODING);
            processed = true;
        } catch (IOException ioe) {
            ioe.printStackTrace();
            error = true;
        }
    }
}
