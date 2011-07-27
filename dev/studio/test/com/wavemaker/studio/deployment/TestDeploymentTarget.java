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
package com.wavemaker.studio.deployment;

import java.util.Map;

import com.wavemaker.tools.deployment.DeploymentTarget;
import com.wavemaker.tools.deployment.DeploymentTargetManager;
import com.wavemaker.studio.infra.StudioTestCase;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class TestDeploymentTarget extends StudioTestCase {

    private static final String DPL_TARGET_MGR = "deploymentTargetManager";
    private static final String TOMCAT_DPL_TARGET = "tomcat";


    public void testConfigurableProperties() {
        DeploymentTargetManager dpl = getDeploymentTargetManager();
        DeploymentTarget tomcat = dpl.getDeploymentTarget(TOMCAT_DPL_TARGET);
        assertTrue("Cannot find Tomcat DeploymentTarget impl", tomcat != null);
        Map<String, String> props = tomcat.getConfigurableProperties();
        assertTrue("No properties", !props.isEmpty());
        assertTrue(props.containsKey("host"));
        assertTrue(props.containsKey("port"));
    }

    private DeploymentTargetManager getDeploymentTargetManager() {
        return (DeploymentTargetManager)getBean(DPL_TARGET_MGR);
    }

}
