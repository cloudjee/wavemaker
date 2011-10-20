/*
 * Copyright (C) 2009 WaveMaker Software, Inc.
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

package com.wavemaker.studio.module;

import java.io.File;

import org.junit.Before;
import org.junit.Test;

import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.studio.project.TestLocalDeploymentManager;
import com.wavemaker.tools.project.LocalDeploymentManager;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestAppModules extends StudioTestCase {

    private static String PROJECT_TYPE = System.getProperty("test.project.type");

    protected LocalDeploymentManager deploymentManager;

    @Before
    @Override
    public void setUp() throws Exception {

        super.setUp();

        this.deploymentManager = (LocalDeploymentManager) getBean("deploymentManager");
    }

    @Test
    public void testAppModules() throws Exception {

        File testTestRunDir = makeProject("testTestRun", /* noTemplate= */false);
        String deployName = getTestWaveMakerHome().getName() + "-testTestRun";

        this.deploymentManager.testRunStart(testTestRunDir.getAbsolutePath(), deployName);

        try {
            if ("cloud".equals(PROJECT_TYPE)) {
                TestLocalDeploymentManager.checkURLContent(testTestRunDir, deployName, "modules/id/wm.cloud/cloud.src.resource", "",
                    TestLocalDeploymentManager.RETRY_SECONDS, this.deploymentManager);
            } else {
                TestLocalDeploymentManager.checkURLContent(testTestRunDir, deployName, "modules/id/wm.local/local.src.resource", "",
                    TestLocalDeploymentManager.RETRY_SECONDS, this.deploymentManager);
            }
        } finally {
            this.deploymentManager.testRunClean(testTestRunDir.getAbsolutePath(), deployName);
        }
    }
}