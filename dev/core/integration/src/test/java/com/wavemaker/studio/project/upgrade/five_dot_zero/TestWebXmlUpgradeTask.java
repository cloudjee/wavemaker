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
package com.wavemaker.studio.project.upgrade.five_dot_zero;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.Test;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.project.upgrade.five_dot_zero.WebXmlUpgradeTask;
import com.wavemaker.tools.service.DesignServiceManager;

/**
 * @author small
 * @author Jeremy Grelle
 * 
 */
public class TestWebXmlUpgradeTask extends StudioTestCase {

	@Test
	public void testUpgradeWebXml() throws Exception {

		makeProject("testUpgradeWebXml", false);

		DesignServiceManager dsm = (DesignServiceManager) getBean("designServiceManager");
		Project project = dsm.getProjectManager().getCurrentProject();

		File webInf = project.getWebInf().getFile();
		File webXml = new File(webInf, "web.xml");
		File userWebXml = new File(webInf, "user-web.xml");
		File bakWebXml = new File(webInf, "web.xml.4_5_bak");

		// default project
		assertTrue(userWebXml.exists());
		assertFalse(webXml.exists());
		assertFalse(bakWebXml.exists());

		userWebXml.delete();
		IOUtils.touch(webXml);
		assertFalse(userWebXml.exists());
		assertTrue(webXml.exists());
		assertFalse(bakWebXml.exists());

		UpgradeTask ut = new WebXmlUpgradeTask();
		UpgradeInfo info = new UpgradeInfo();
		ut.doUpgrade(project, info);

		assertTrue(userWebXml.exists());
		assertFalse(webXml.exists());
		assertTrue(bakWebXml.exists());

		String userWebXmlContents = FileUtils.readFileToString(userWebXml);
		assertTrue(userWebXmlContents.contains("display-name"));
	}

	@Test
	public void testUpgradeTaskPresent() throws Exception {

		boolean foundTask = false;

		UpgradeManager um = (UpgradeManager) getBean("upgradeManager");

		outer: for (List<UpgradeTask> uts : um.getUpgrades().values()) {
			for (UpgradeTask ut : uts) {
				if (ut instanceof WebXmlUpgradeTask) {
					foundTask = true;
					break outer;
				}
			}
		}

		assertTrue(foundTask);
	}
}
