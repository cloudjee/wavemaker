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

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.File;

import org.junit.Test;

import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.upgrade.UpgradeManager;

/**
 * @author small
 * @autthor Jeremy Grelle
 * 
 */
public class TestCopyAppCssUpgrade extends StudioTestCase {

    @Test
    public void testCopyAppCssUpgrade() throws Exception {

        ProjectManager pm = (ProjectManager) getBean("projectManager");
        UpgradeManager um = (UpgradeManager) getBean("upgradeManager");

        makeProject("testCopyAppCssUpgrade", false);

        File expectedAppCss = new File(pm.getCurrentProject().getWebAppRoot().getFile(), "app.css");
        expectedAppCss.delete();
        assertFalse(expectedAppCss.exists());
        pm.getCurrentProject().setProjectVersion(0.19);

        um.doUpgrades(pm.getCurrentProject());

        assertTrue(expectedAppCss.exists());
    }
}