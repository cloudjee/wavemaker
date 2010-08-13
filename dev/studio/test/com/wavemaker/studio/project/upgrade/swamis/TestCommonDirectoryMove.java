/*
 * Copyright (C) 2008 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.wavemaker.studio.project.upgrade.swamis;

import java.io.File;
import java.util.List;

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.config.ConfigurationStore;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.project.upgrade.swamis.CommonDirectoryMove;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestCommonDirectoryMove extends StudioTestCase {

    public void testCommonDirMove_YesOldKey_NoNewKey() throws Exception {

        StudioConfiguration sc = (StudioConfiguration) getBean("studioConfiguration");
        
        boolean oldIsUpgrade = ConfigurationStore.getPreferenceBoolean(
                CommonDirectoryMove.class, CommonDirectoryMove.UPGRADED_KEY,
                false);
        double oldStudioVersion = UpgradeManager.getStudioVersion();
        File commonDirBak = new File(sc.getStudioWebAppRootFile(),
                "lib/wm/"+StudioConfiguration.COMMON_DIR+".bak");
        File commonDirBakBak = new File(sc.getStudioWebAppRootFile(),
                "lib/wm/"+StudioConfiguration.COMMON_DIR+".bak.bak");
        if (commonDirBak.exists()) {
            FileUtils.copyDirectory(commonDirBak, commonDirBakBak);
            FileUtils.forceDelete(commonDirBak);
        }
            
        try {
            UpgradeManager.setStudioVersion(0.0);
            
            ConfigurationStore.setPreferenceBoolean(
                    CommonDirectoryMove.class, CommonDirectoryMove.UPGRADED_KEY,
                    false);

            File commonDir = sc.getCommonDir();
            assertTrue(commonDir.exists());

            File commonDirFile = new File(commonDir, "foo.txt");
            IOUtils.touch(commonDirFile);
            assertTrue(commonDirFile.exists());

            CommonDirectoryMove cdm = new CommonDirectoryMove();
            cdm.setStudioConfiguration(sc);
            UpgradeInfo ui = new UpgradeInfo();
            cdm.doUpgrade(ui);

            assertTrue(commonDir.exists());
            assertFalse(commonDirFile.exists());

            File commonDirFileTwo = new File(commonDir, "foo.2.txt");
            IOUtils.touch(commonDirFileTwo);

            // this should work, but the directory won't be updated
            UpgradeManager.setStudioVersion(0.0);
            ui = new UpgradeInfo();
            ui.setVersion(1.0);
            cdm.doUpgrade(ui);
            assertEquals(1, ui.getMessages().size());
            assertTrue(ui.getMessages().containsKey("1.0"));
            List<String> messages = ui.getMessages().get("1.0");
            assertEquals(1, messages.size());
            assertTrue(messages.get(0).endsWith("already exists"));

            assertTrue(commonDirFileTwo.exists());
        } finally {
            UpgradeManager.setStudioVersion(oldStudioVersion);
            
            ConfigurationStore.setPreferenceBoolean(
                    CommonDirectoryMove.class, CommonDirectoryMove.UPGRADED_KEY,
                    oldIsUpgrade);
            FileUtils.forceDelete(commonDirBak);
            if (commonDirBakBak.exists()) {
                FileUtils.copyDirectory(commonDirBakBak, commonDirBak);
                FileUtils.forceDelete(commonDirBakBak);
            }
        }
    }
}