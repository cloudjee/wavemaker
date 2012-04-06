/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade.six_dot_two;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Changes for enabling live data even when security is on
 * 
 * @author Seung Lee
 * @author Jeremy Grelle
 */
public class ProjSecurityXmlUpgradeTask implements UpgradeTask {

    private boolean error = false;

    private final String[] fromStrs = { "org.acegisecurity.context.HttpSessionContextIntegrationFilter",
        "com.wavemaker.runtime.security.AcegiAjaxLogoutFilter", "org.acegisecurity.ui.webapp.AuthenticationProcessingFilter",
        "org.acegisecurity.providers.anonymous.AnonymousProcessingFilter", "com.wavemaker.runtime.security.JSONExceptionTranslationFilter",
        "org.acegisecurity.intercept.web.FilterSecurityInterceptor" };

    private final String[] toStrs = { "com.wavemaker.runtime.security.WMHttpSessionContextIntegrationFilter",
        "com.wavemaker.runtime.security.WMAcegiAjaxLogoutFilter", "com.wavemaker.runtime.security.WMAuthenticationProcessingFilter",
        "com.wavemaker.runtime.security.WMAnonymousProcessingFilter", "com.wavemaker.runtime.security.WMExceptionTranslationFilter",
        "com.wavemaker.runtime.security.WMFilterSecurityInterceptor" };

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        File securityXmlFile = project.getSecurityXmlFile();
        try {
            String content = securityXmlFile.getContent().asString();
            for (int i = 0; i < 6; i++) {
                content = content.replace(this.fromStrs[i], this.toStrs[i]);
            }
            securityXmlFile.getContent().write(content);
        } catch (ResourceException e) {
            e.printStackTrace();
            this.error = true;
        }

        if (this.error) {
            upgradeInfo.addMessage("*** Terminated with error while upgrading project-security.xml. " + "Please check the console message.***");
        } else {
            upgradeInfo.addMessage("Upgrading project-security.xml completed successfully.");
        }
    }
}
