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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.File;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.wavemaker.common.util.Tuple;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.studio.project.TestDeploymentManager;
import com.wavemaker.testsupport.UtilTest;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.util.TomcatServer;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class TestTomcat extends StudioTestCase {

    private String tomcatHost;

    private int tomcatPort;

    private String semaphore;

    @Before
    @Override
    public void setUp() throws Exception {

        super.setUp();
        this.semaphore = UtilTest.lockSemaphore("TestTomcat");

        // make a call, just to init the request
        invokeService_toObject("studioService", "listProjects", new Object[] {});

        LocalStudioConfiguration sc = (LocalStudioConfiguration) getBean("studioConfiguration");
        this.tomcatHost = sc.getTomcatHost();
        this.tomcatPort = sc.getTomcatPort();
    }

    @After
    @Override
    public void tearDown() throws Exception {
        UtilTest.unlockSemaphore(this.semaphore);
    }

    @Test
    public void testServer() {
        TomcatServer server = new TomcatServer(this.tomcatHost, this.tomcatPort);
        assertEquals(this.tomcatHost, server.getHostName());
        assertEquals(this.tomcatPort, server.getPort());
    }

    @Test
    public void testListening() {
        TomcatServer server = new TomcatServer(this.tomcatHost, this.tomcatPort);
        assertTrue(server.isListening());
    }

    @Test
    public void testNotListening() {
        TomcatServer server = new TomcatServer(this.tomcatHost, 9159);
        assertFalse(server.isListening());
    }

    @Test
    public void testDeploy() throws Exception {

        // create war to deploy
        String projectName = "testDeploy";
        File projectDir = makeProject(projectName, false);
        populateProject(projectDir);
        ((DeploymentManager) getBean("deploymentManager")).buildWar();
        File war = new File(projectDir, "dist/" + projectName + ".war");
        assertTrue("war " + war + " does not exist", war.exists());
        TestDeploymentManager.trimWar(war);

        // deploy, check deployments, undeploy, check deployments
        TomcatServer server = new TomcatServer(this.tomcatHost, this.tomcatPort);

        String contextRoot = "/" + System.getProperty("user.name") + "swar_TestTomcat_" + System.currentTimeMillis();

        try {
            server.deploy(war, contextRoot);
            boolean found = false;
            for (Tuple.Two<String, String> t : server.listDeployments()) {
                if (t.v1.equals(contextRoot)) {
                    found = true;
                    break;
                }
            }
            assertTrue("deployed app not in list of apps", found);

        } finally {
            server.undeploy(contextRoot);
            assertFalse("undeployed app still in list of apps", server.listDeployments().contains(contextRoot));
        }
    }
}
