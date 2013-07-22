/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.virtual.VirtualFolder;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;

/**
 * Tests for {@link IE10XUAUpgradeTask}.
 * 
 * @author Phillip Webb
 */
public class IE10XUAUpgradeTaskTest {

    private static final String MISSING = "<head></head>";

    private static final String EXISTING = "<head>\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=9; IE=8; chrome=1\"></head>";

    private static final String EXPECTED = "<head>\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=10; IE=9; IE=8; chrome=1\"></head>";

    private final IE10XUAUpgradeTask task = new IE10XUAUpgradeTask();

    @Mock
    private Project project;

    @Mock
    private UpgradeInfo upgradeInfo;

    private final Folder webAppRoot = new VirtualFolder();

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        given(this.project.getWebAppRootFolder()).willReturn(this.webAppRoot);
    }

    @Test
    public void shouldUpgradeExisting() throws Exception {
        this.webAppRoot.getFile("index.html").getContent().write(EXISTING);
        this.webAppRoot.getFile("login.html").getContent().write(EXISTING);
        this.task.doUpgrade(this.project, this.upgradeInfo);
        assertThat(this.webAppRoot.getFile("index.html").getContent().asString(), is(EXPECTED));
        assertThat(this.webAppRoot.getFile("login.html").getContent().asString(), is(EXPECTED));
    }

    @Test
    public void shouldUpgradeMissing() throws Exception {
        this.webAppRoot.getFile("index.html").getContent().write(MISSING);
        this.webAppRoot.getFile("login.html").getContent().write(MISSING);
        this.task.doUpgrade(this.project, this.upgradeInfo);
        assertThat(this.webAppRoot.getFile("index.html").getContent().asString(), is(EXPECTED));
        assertThat(this.webAppRoot.getFile("login.html").getContent().asString(), is(EXPECTED));
    }

    @Test
    public void shouldNotFailIfMissing() throws Exception {
        this.task.doUpgrade(this.project, this.upgradeInfo);
    }
}
