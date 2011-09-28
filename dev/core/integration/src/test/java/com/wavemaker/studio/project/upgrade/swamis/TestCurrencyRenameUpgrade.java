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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;

import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.PagesManager;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.project.upgrade.swamis.CurrencyRenameUpgrade;

/**
 * @author small
 * @author Jeremy Grelle
 * 
 */
public class TestCurrencyRenameUpgrade extends StudioTestCase {

	@Test
	public void testEventUpgrade() throws Exception {

		ProjectManager pm = (ProjectManager) getBean("projectManager");

		makeProject("testEventUpgrade", false);
		pm.getCurrentProject().setProjectVersion(0.22);

		pm.getCurrentProject().getWebAppRoot().getFile().mkdir();
		assertTrue(pm.getCurrentProject().getWebAppRoot().exists());
		File pages = new File(pm.getCurrentProject().getWebAppRoot().getFile(),
				ProjectConstants.PAGES_DIR);
		pages.mkdir();
		File page = new File(pages, "Main");
		page.mkdir();
		assertTrue(page.exists());
		File destWidgets = new File(page, "Main." + PagesManager.PAGE_WIDGETS);

		File sourceWidgets = (new ClassPathResource(
				"com/wavemaker/tools/project/upgrade/swamis/currencyrename.widgets.js"))
				.getFile();
		FileUtils.copyFile(sourceWidgets, destWidgets);

		CurrencyRenameUpgrade cru = new CurrencyRenameUpgrade();
		cru.setPagesManager((PagesManager) getBean("pagesManager"));
		UpgradeInfo ui = new UpgradeInfo();
		cru.doUpgrade(pm.getCurrentProject(), ui);

		File expectedWidgets = (new ClassPathResource(
				"com/wavemaker/tools/project/upgrade/swamis/currencyrename.widgets.js.expected"))
				.getFile();
		assertEquals(StringUtils.deleteWhitespace(FileUtils
				.readFileToString(expectedWidgets)),
				StringUtils.deleteWhitespace(FileUtils
						.readFileToString(destWidgets)));
	}

	@Test
	public void testUpgradeTaskPresent() throws Exception {

		boolean foundTask = false;

		UpgradeManager um = (UpgradeManager) getBean("upgradeManager");

		outer: for (List<UpgradeTask> uts : um.getUpgrades().values()) {
			for (UpgradeTask ut : uts) {
				if (ut instanceof CurrencyRenameUpgrade) {
					foundTask = true;
					break outer;
				}
			}
		}

		assertTrue(foundTask);
	}
}