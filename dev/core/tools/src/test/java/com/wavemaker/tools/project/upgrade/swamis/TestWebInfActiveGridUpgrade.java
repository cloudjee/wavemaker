/*
 *  Copyright (C) 2008-2009 WaveMaker Software, Inc.
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

package com.wavemaker.tools.project.upgrade.swamis;

import java.io.File;
import java.util.ArrayList;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.service.ConfigurationCompiler;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestWebInfActiveGridUpgrade extends WMTestCase {

    public void testWebInfUpgrade() throws Exception {

        StudioConfiguration config = new LocalStudioConfiguration();

        File sourceProjectRoot = new ClassPathResource("com/wavemaker/tools/project/upgrade/swamis/webinfactivegridupgrade/").getFile();
        assertTrue(sourceProjectRoot.exists());

        File projectRoot = IOUtils.createTempDirectory("testWebInfUpgrade", "_dir");
        config.copyRecursive(new FileSystemResource(sourceProjectRoot.getAbsolutePath()),
            new FileSystemResource(projectRoot.getAbsolutePath() + "/"), new ArrayList<String>());
        // FileUtils.copyDirectory(sourceProjectRoot, projectRoot);

        Project p = new Project(new FileSystemResource(projectRoot.getAbsolutePath() + "/"), new LocalStudioConfiguration());
        File webinf = p.getWebInf().getFile();
        assertTrue(webinf.exists());

        File servicesConfig = new File(webinf, ConfigurationCompiler.RUNTIME_SERVICES);
        File managersConfig = new File(webinf, ConfigurationCompiler.RUNTIME_MANAGERS);
        File webxml = new File(webinf, ProjectConstants.WEB_XML);
        assertTrue(servicesConfig.exists());
        assertTrue(managersConfig.exists());
        assertTrue(webxml.exists());

        String webxmlContents = FileUtils.readFileToString(webxml);
        assertTrue(webxmlContents.contains("com.activegrid.runtime.server.CleanupListener"));
        assertFalse(webxmlContents.contains("com.wavemaker.runtime.server.CleanupListener"));

        WebInfActiveGridUpgrade upgrade = new WebInfActiveGridUpgrade();
        UpgradeInfo upgradeInfo = new UpgradeInfo();
        upgrade.doUpgrade(p, upgradeInfo);
        assertEquals("verbose was: " + upgradeInfo.getVerbose() + ", messages: " + upgradeInfo.getMessages(),
            "Removed com.activegrid references from web.xml\nRe-generated files: project-services.xml, project-managers.xml",
            upgradeInfo.getVerbose().get("-1.0").get(0));

        webxmlContents = FileUtils.readFileToString(webxml);
        assertFalse(webxmlContents.contains("com.activegrid.runtime.server.CleanupListener"));
        assertTrue(webxmlContents.contains("com.wavemaker.runtime.server.CleanupListener"));

        assertTrue(servicesConfig.exists());
        assertTrue(managersConfig.exists());

        String servicesConfigContents = FileUtils.readFileToString(servicesConfig);
        String managersConfigContents = FileUtils.readFileToString(managersConfig);

        assertFalse(servicesConfigContents.contains("activegrid"));
        assertFalse(managersConfigContents.contains("activegrid"));
    }
}