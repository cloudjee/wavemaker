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
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.regex.Matcher;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.junit.Test;

import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.PagesManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.swamis.ClientSideRefactorUpgrade;

/**
 * @author small
 * @author Jeremy Grelle
 * 
 */
public class TestClientSideRefactorUpgrade extends StudioTestCase {

	String app_js_expectedFor_5 = "dojo.declare(\"StillMan\", wm.Application, {\n"
			+ "    main: \"MainGrid\",\n"
			+ "    widgets: {\n"
			+ "        getProjects: [\"wm.ServiceVariable\"],\n"
			+ "        pane: [\"wm.PageContainer\"]\n" + "    }\n" + "});";

	String app_js_inputFor_5 = "dojo.declare(\"StillMan\", turbo.Application, {\n"
			+ "    main: \"MainGrid\",\n"
			+ "    widgets: {\n"
			+ "        getProjects: [\"turbo.ServiceCall\"],\n"
			+ "        pane: [\"turbo.Pane\"]\n"
			+ "    }\n"
			+ "});\n"
			+ "turbo.types = {\"AnyData\":{\"value\":{\"type\":\"Any\",\"isList\":false,\"isObject\":false}}};\n"
			+ "turbo.primitives = {\"java.lang.String\":{\"name\":\"String\",\"type\":\"StringData\"}";

	String MainGrid_widgets_input = "MainGrid.widgets = {\n"
			+ "    getProjects: [\"turbo.ServiceCall\", {autoUpdate: true, operation: \"getProjectList\", service: \"stillman\"}, {}, {\n"
			+ "        input: [\"turbo.Variable\", {type: \"getProjectListInputs\"}, {}],\n"
			+ "        queue: [\"turbo.ServiceQueue\", {}, {}]\n"
			+ "    }],\n"
			+ "    gotoPane1: [\"turbo.NavigationCall\", {operation: \"gotoPanePage\"}, {}, {\n"
			+ "        input: [\"turbo.Variable\", {type: \"gotoPanePageInputs\"}, {}, {\n"
			+ "            binding: [\"turbo.Binding\", {}, {}, {\n"
			+ "                wire: [\"turbo.Wire\", {source: \"pane1\", targetProperty: \"pane\"}, {}]\n"
			+ "            }]\n"
			+ "        }]\n"
			+ "    }],\n"
			+ "    layoutBox1: [\"turbo.Layout\", {box: \"v\", size: 1}, {}, {\n"
			+ "        panel1: [\"turbo.Panel\", {box: \"v\", sizeUnits: \"flex\"}, {}, {}, {\n"
			+ "            pane: [\"turbo.Pane\"]\n" + "        }]\n"
			+ "    }]\n" + "};\n";

	String MainGrid_widgets_expected_2 = "MainGrid.widgets = {\n"
			+ "    getProjects: [\"wm.ServiceVariable\", {autoUpdate: true, operation: \"getProjectList\", service: \"stillman\"}, {}, {\n"
			+ "        input: [\"wm.ServiceInputVariable\", {type: \"getProjectListInputs\"}, {}],\n"
			+ "        queue: [\"wm.ServiceQueue\", {}, {}]\n"
			+ "    }],\n"
			+ "    gotoPane1: [\"wm.NavigationCall\", {operation: \"gotoPageContainerPage\"}, {}, {\n"
			+ "        input: [\"wm.Variable\", {type: \"gotoPageContainerPageInputs\"}, {}, {\n"
			+ "            binding: [\"wm.Binding\", {}, {}, {\n"
			+ "                wire: [\"wm.Wire\", {source: \"pane1\", targetProperty: \"pageContainer\"}, {}]\n"
			+ "            }]\n"
			+ "        }]\n"
			+ "    }],\n"
			+ "    layoutBox1: [\"wm.Layout\", {box: \"v\", size: 1}, {}, {\n"
			+ "        panel1: [\"wm.Panel\", {box: \"v\", sizeUnits: \"flex\"}, {}, {}, {\n"
			+ "            pane: [\"wm.PageContainer\"]\n" + "        }]\n"
			+ "    }]\n" + "};\n";

	String EditPage_js_input = "dojo.declare(\"EditPage\", turbo.Part, {\n"
			+ "    start: function() {\n" + "   \n" + "    },\n"
			+ "    saveButton1Click: function(inSender) {\n"
			+ "        this.closeButtonClick(inSender);\n"
			+ "        return inSender;\n" + "    },\n"
			+ "    closeButtonClick: function(inSender) {\n"
			+ "        delete this.autoForm1.components.dataOutput.data.id;\n"
			+ "        return inSender;\n" + "    },\n" + "    _end: 0\n"
			+ "});\n";

	String EditPage_js_expected_2 = "dojo.declare(\"EditPage\", wm.Page, {\n"
			+ "    start: function() {\n" + "   \n" + "    },\n"
			+ "    saveButton1Click: function(inSender) {\n"
			+ "        this.closeButtonClick(inSender);\n"
			+ "        return inSender;\n" + "    },\n"
			+ "    closeButtonClick: function(inSender) {\n"
			+ "        delete this.autoForm1.components.dataOutput.data.id;\n"
			+ "        return inSender;\n" + "    },\n" + "    _end: 0\n"
			+ "});\n";

	String input_4 = "MainGrid.widgets = {\n"
			+ "    getProjects: [\"turbo.ServiceCall\", {autoUpdate: true, operation: \"getProjectList\", service: \"stillman\"}, {}, {\n"
			+ "        input: [\"turbo.Variable\", {type: \"getProjectListInputs\"}, {}],\n"
			+ "        queue: [\"turbo.ServiceQueue\", {}, {}]\n"
			+ "    }],\n"
			+ "    gotoPane1: [\"turbo.NavigationCall\", {operation: \"gotoPanePage\"}, {}, {\n"
			+ "        input: [\"turbo.Variable\", {type: \"gotoPanePageInputs\"}, {}, {\n"
			+ "            binding: [\"turbo.Binding\", {}, {}, {\n"
			+ "                wire: [\"turbo.Wire\", {source: \"pane1\", targetProperty: \"pane\"}, {}]\n"
			+ "            }]\n" + "        }]\n" + "    }]\n" + "};\n";

	String expected_4 = "MainGrid.widgets = {\n"
			+ "    getProjects: [\"wm.ServiceVariable\", {autoUpdate: true, operation: \"getProjectList\", service: \"stillman\"}, {}, {\n"
			+
			// without 8, this next is just wm.Variable
			"        input: [\"wm.ServiceInputVariable\", {type: \"getProjectListInputs\"}, {}],\n"
			+ "        queue: [\"wm.ServiceQueue\", {}, {}]\n"
			+ "    }],\n"
			+ "    gotoPane1: [\"wm.NavigationCall\", {operation: \"gotoPageContainerPage\"}, {}, {\n"
			+ "        input: [\"wm.Variable\", {type: \"gotoPageContainerPageInputs\"}, {}, {\n"
			+ "            binding: [\"wm.Binding\", {}, {}, {\n"
			+ "                wire: [\"wm.Wire\", {source: \"pane1\", targetProperty: \"pageContainer\"}, {}]\n"
			+ "            }]\n" + "        }]\n" + "    }]\n" + "};\n";

	String input_7 = "Main.widgets = {\n"
			+ "    layoutBox1: [\"turbo.Layout\", {}, {}, {\n"
			+ "        label1: [\"turbo.Label\", {}, {}, {\n"
			+ "            binding2: [\"turbo.Binding\", {}, {}, {\n"
			+ "                wire: [\"turbo.Wire\", {targetProperty: \"caption\", expression: \"%%12\"}, {}]\n"
			+ "            }],\n"
			+ "            format: [\"turbo.DataFormatter\", {}, {}],\n"
			+ "            binding: [\"turbo.Binding\", {}, {}, {\n"
			+ "                wire: [\"turbo.Wire\", {targetProperty: \"caption\", expression: \"hi\"}, {}]\n"
			+ "            }],\n"
			+ "            binding3: [\"turbo.Binding\", {}, {}, {\n"
			+ "                wire: [\"turbo.Wire\", {targetProperty: \"caption\", expression: \"^^true\"}, {}]\n"
			+ "            }]\n" + "        }]\n" + "    }]\n" + "}\n";

	String expected_7 = "Main.widgets = {\n"
			+ "    layoutBox1: [\"wm.Layout\", {}, {}, {\n"
			+ "        label1: [\"wm.Label\", {}, {}, {\n"
			+ "            binding2: [\"wm.Binding\", {}, {}, {\n"
			+ "                wire: [\"wm.Wire\", {targetProperty: \"caption\", expression: \"Number(12)\"}, {}]\n"
			+ "            }],\n"
			+ "            format: [\"wm.DataFormatter\", {}, {}],\n"
			+ "            binding: [\"wm.Binding\", {}, {}, {\n"
			+ "                wire: [\"wm.Wire\", {targetProperty: \"caption\", expression: \"\\\"hi\\\"\"}, {}]\n"
			+ "            }],\n"
			+ "            binding3: [\"wm.Binding\", {}, {}, {\n"
			+ "                wire: [\"wm.Wire\", {targetProperty: \"caption\", expression: \"Boolean(true)\"}, {}]\n"
			+ "            }]\n" + "        }]\n" + "    }]\n" + "}\n";

	String input_Ordering = "Main.widgets = {\n"
			+ "    layoutBox1: [\"turbo.Layout\", {}, {}, {\n"
			+ "        label1: [\"turbo.Label\", {}, {}, {\n"
			+ "            binding2: [],\n" + "            format: [],\n"
			+ "            binding: [],\n" + "            binding3: []\n"
			+ "        }]\n" + "    }]\n" + "}\n";

	String expected_Ordering = "Main.widgets = {\n"
			+ "    layoutBox1: [\"wm.Layout\", {}, {}, {\n"
			+ "        label1: [\"wm.Label\", {}, {}, {\n"
			+ "            binding2: [],\n" + "            format: [],\n"
			+ "            binding: [],\n" + "            binding3: []\n"
			+ "        }]\n" + "    }]\n" + "}\n";

	@Test
	public void test_1_IndexRename() throws Exception {

		makeProject("test_1_IndexRename", false);
		Project p = ((ProjectManager) getBean("projectManager"))
				.getCurrentProject();
		populateFor_1(p);

		File indexhtml = new File(p.getWebAppRoot().getFile(),
				ProjectConstants.INDEX_HTML);
		File bakIndexhtml = new File(indexhtml.getAbsolutePath() + "."
				+ ClientSideRefactorUpgrade.BACKUP_EXT);
		assertTrue(indexhtml.exists());
		assertFalse(bakIndexhtml.exists());
		String indexhtmlContents = FileUtils.readFileToString(indexhtml);

		ClientSideRefactorUpgrade csru = new ClientSideRefactorUpgrade();
		csru.setPagesManager((PagesManager) getBean("pagesManager"));
		csru.doUpgrade(p, new UpgradeInfo());

		assertFalse(indexhtml.exists());
		assertTrue(bakIndexhtml.exists());

		String bakIndexhtmlContents = FileUtils.readFileToString(bakIndexhtml);
		assertEquals(indexhtmlContents, bakIndexhtmlContents);
	}

	@Test
	public void test_2_RemoveWM__3_WidgetNameChanges__4__8() throws Exception {

		makeProject("test_2_RemoveWM__3_WidgetNameChanges__4__8", false);
		Project p = ((ProjectManager) getBean("projectManager"))
				.getCurrentProject();

		populateFor_2(p);
		populateFor_5(p);

		ClientSideRefactorUpgrade csru = new ClientSideRefactorUpgrade();
		csru.setPagesManager((PagesManager) getBean("pagesManager"));
		csru.doUpgrade(p, new UpgradeInfo());

		File maingridWidgetsJS = new File(p.getWebAppRoot().getFile(),
				"pages/MainGrid/MainGrid.widgets.js");
		assertTrue(maingridWidgetsJS.exists());
		assertEquals(StringUtils.deleteWhitespace(MainGrid_widgets_expected_2),
				StringUtils.deleteWhitespace(FileUtils
						.readFileToString(maingridWidgetsJS)));
		File maingridJS = new File(p.getWebAppRoot().getFile(),
				"pages/MainGrid/MainGrid.js");
		assertFalse(maingridJS.exists());

		File editpageWidgetsJS = new File(p.getWebAppRoot().getFile(),
				"pages/EditPage/EditPage.widgets.js");
		assertFalse(editpageWidgetsJS.exists());
		File editpageJS = new File(p.getWebAppRoot().getFile(),
				"pages/EditPage/EditPage.js");
		assertTrue(editpageJS.exists());
		assertEquals(EditPage_js_expected_2,
				FileUtils.readFileToString(editpageJS));
	}

	@Test
	public void test_4() throws Exception {

		makeProject("test_4", false);
		Project p = ((ProjectManager) getBean("projectManager"))
				.getCurrentProject();

		populateFor_4(p);

		ClientSideRefactorUpgrade csru = new ClientSideRefactorUpgrade();
		csru.setPagesManager((PagesManager) getBean("pagesManager"));
		csru.doUpgrade(p, new UpgradeInfo());

		File mainWidgetsJS = new File(p.getWebAppRoot().getFile(),
				"pages/Main/Main.widgets.js");
		assertTrue(mainWidgetsJS.exists());
		assertEquals(expected_4, FileUtils.readFileToString(mainWidgetsJS));
	}

	@Test
	public void test_5_TrimTypes() throws Exception {

		makeProject("test_5_TrimTypes", false);
		Project p = ((ProjectManager) getBean("projectManager"))
				.getCurrentProject();

		populateFor_5(p);

		ClientSideRefactorUpgrade csru = new ClientSideRefactorUpgrade();
		csru.setPagesManager((PagesManager) getBean("pagesManager"));
		csru.doUpgrade(p, new UpgradeInfo());

		File appJS = new File(p.getWebAppRoot().getFile(), p.getProjectName()
				+ ".js");
		assertTrue(appJS.exists());
		String actual = FileUtils.readFileToString(appJS);
		assertEquals(app_js_expectedFor_5, actual);
	}

	@Test
	public void test_7() throws Exception {

		makeProject("test_7", false);
		Project p = ((ProjectManager) getBean("projectManager"))
				.getCurrentProject();

		populateFor_2(p);
		populateFor_5(p);
		populateFor_7(p);

		ClientSideRefactorUpgrade csru = new ClientSideRefactorUpgrade();
		csru.setPagesManager((PagesManager) getBean("pagesManager"));
		csru.doUpgrade(p, new UpgradeInfo());

		File mainWidgetsJS = new File(p.getWebAppRoot().getFile(),
				"pages/Main/Main.widgets.js");
		assertTrue(mainWidgetsJS.exists());
		assertEquals(StringUtils.deleteWhitespace(expected_7),
				StringUtils.deleteWhitespace(FileUtils
						.readFileToString(mainWidgetsJS)));
	}

	@Test
	public void testOrdering() throws Exception {

		makeProject("test_7", false);
		Project p = ((ProjectManager) getBean("projectManager"))
				.getCurrentProject();

		populateFor_Ordering(p);

		ClientSideRefactorUpgrade csru = new ClientSideRefactorUpgrade();
		csru.setPagesManager((PagesManager) getBean("pagesManager"));
		csru.doUpgrade(p, new UpgradeInfo());

		File mainWidgetsJS = new File(p.getWebAppRoot().getFile(),
				"pages/Main/Main.widgets.js");
		assertTrue(mainWidgetsJS.exists());
		assertEquals(StringUtils.deleteWhitespace(expected_Ordering),
				StringUtils.deleteWhitespace(FileUtils
						.readFileToString(mainWidgetsJS)));
	}

	@Test
	public void testTrimOutTypes() throws Exception {

		String test = "fo{oturbo.types={blabla{fjd\nksla}fjkdsf};b}ar";
		String expected = "fo{ob}ar";
		assertEquals(expected, ClientSideRefactorUpgrade.trimOutTypes(test));

		test = "fo{oturbo.types={blabla{fjd\nksla}fjkdsf};";
		expected = "fo{o";
		assertEquals(expected, ClientSideRefactorUpgrade.trimOutTypes(test));

		test = "turbo.types={blabla{fjd\nksla}fjkdsf}";
		expected = "";
		assertEquals(expected, ClientSideRefactorUpgrade.trimOutTypes(test));

		test = "bbturbo.types={blabla{fjd\nksla}fjkdsf};cc;turbo.primitives={fjksl{Fds}};aa";
		expected = "bbcc;aa";
		assertEquals(expected, ClientSideRefactorUpgrade.trimOutTypes(test));

		test = "t";
		expected = "t";
		assertEquals(expected, ClientSideRefactorUpgrade.trimOutTypes(test));
	}

	@Test
	public void testUpgradeExpression() throws Exception {

		assertEquals("\\\"foo\\\"",
				ClientSideRefactorUpgrade.upgradeExpression("foo"));
		assertEquals("Number(12)",
				ClientSideRefactorUpgrade.upgradeExpression("%%12"));
		assertEquals("Boolean(true)",
				ClientSideRefactorUpgrade.upgradeExpression("^^true"));
	}

	@Test
	public void testPanePagePattern() throws Exception {

		ClientSideRefactorUpgrade csru = new ClientSideRefactorUpgrade();
		String sample = "rue, operation: \"gotoPanePage\", \"servi";
		Matcher matcher = csru.panePagePattern.matcher(sample);
		assertTrue(matcher.find());
		assertEquals("operation: \"", matcher.group(1));
		assertEquals("rue, foo, \"servi", matcher.replaceAll("foo"));
		assertEquals("rue, operation: \"gotoPageContainerPage\", \"servi",
				matcher.replaceAll(csru.panePageReplaceStr));

		sample = sample + sample;
		matcher = csru.panePagePattern.matcher(sample);
		assertEquals("rue, operation: \"gotoPageContainerPage\", \"servi"
				+ "rue, operation: \"gotoPageContainerPage\", \"servi",
				matcher.replaceAll(csru.panePageReplaceStr));

		sample = "\"wm.Variable\", {type: \"gotoPanePageInputs\"}, {}, {";
		matcher = csru.panePagePattern.matcher(sample);
		assertTrue(matcher.find());
		assertEquals(
				"\"wm.Variable\", {type: \"gotoPageContainerPageInputs\"}, {}, {",
				matcher.replaceAll(csru.panePageReplaceStr));
	}

	@Test
	public void testPanePattern() throws Exception {

		ClientSideRefactorUpgrade csru = new ClientSideRefactorUpgrade();

		String sampleStartPrefix = "    gotoPane1: ";
		String sampleStart = "[\"wm.NavigationCall\", {operation: \"gotoPageContainerPage\"}, {}, {\n"
				+ "        input: [\"wm.Variable\", {type: \"gotoPageContainerPageInputs\"}, {}, {\n"
				+ "            binding: [\"wm.Binding\", {}, {}, {\n"
				+ "                wire: [\"wm.Wire\", {source: \"pane1\", targetProperty: \"";
		String sampleEnd = "\"}, {}]";
		String sampleEndPostfix = "\n" + "            }]\n" + "        }]\n"
				+ "    }],\n";
		String sample = sampleStartPrefix + sampleStart + "pane" + sampleEnd
				+ sampleEndPostfix;
		;

		Matcher matcher = csru.panePattern.matcher(sample);
		assertTrue(matcher.find());
		assertEquals(sampleStart, matcher.group(1));
		assertEquals(sampleEnd, matcher.group(2));
		assertEquals(sampleStartPrefix + sampleStart + "foo" + sampleEnd
				+ sampleEndPostfix, matcher.replaceAll("$1foo$2"));
		assertEquals(sampleStartPrefix + sampleStart + "pageContainer"
				+ sampleEnd + sampleEndPostfix,
				matcher.replaceAll(csru.paneReplaceStr));

		matcher = csru.panePattern.matcher(sample + sample);
		assertEquals(sampleStartPrefix + sampleStart + "pageContainer"
				+ sampleEnd + sampleEndPostfix + sampleStartPrefix
				+ sampleStart + "pageContainer" + sampleEnd + sampleEndPostfix,
				matcher.replaceAll(csru.paneReplaceStr));
	}

	@Test
	public void testServiceInputVariablePattern() throws Exception {

		ClientSideRefactorUpgrade csru = new ClientSideRefactorUpgrade();

		String sample = "    getProjects: [\"wm.ServiceVariable\", {autoUpdate: true, operation: \"getProjectList\", service: \"stillman\"}, {}, {\n"
				+ "        input: [\"wm.Variable\", {type: \"getProjectListInputs\"}, {}]";
		String expected = "    getProjects: [\"wm.ServiceVariable\", {autoUpdate: true, operation: \"getProjectList\", service: \"stillman\"}, {}, {\n"
				+ "        input: [\"wm.ServiceInputVariable\", {type: \"getProjectListInputs\"}, {}]";

		Matcher matcher = csru.serviceInputVariablePattern.matcher(sample);
		assertTrue(matcher.find());
		assertEquals(expected,
				matcher.replaceAll(csru.serviceInputVariableReplaceStr));
	}

	private void populateFor_1(Project p) throws Exception {
		populateProject(p.getProjectRoot().getFile());
	}

	private void populateFor_2(Project p) throws Exception {

		File pagesdir = new File(p.getWebAppRoot().getFile(),
				ProjectConstants.PAGES_DIR);
		if (!pagesdir.exists()) {
			pagesdir.mkdir();
		}

		File editpage = new File(pagesdir, "EditPage");
		editpage.mkdir();
		File editpageJS = new File(editpage, "EditPage.js");
		FileUtils.writeStringToFile(editpageJS, EditPage_js_input);

		File maingrid = new File(pagesdir, "MainGrid");
		maingrid.mkdir();
		File maingridWidgetsJS = new File(maingrid, "MainGrid.widgets.js");
		FileUtils.writeStringToFile(maingridWidgetsJS, MainGrid_widgets_input);
	}

	private void populateFor_4(Project p) throws Exception {

		File pagesdir = new File(p.getWebAppRoot().getFile(),
				ProjectConstants.PAGES_DIR);
		if (!pagesdir.exists()) {
			pagesdir.mkdir();
		}

		File editpage = new File(pagesdir, "Main");
		editpage.mkdir();
		File editpageJS = new File(editpage, "Main.widgets.js");
		FileUtils.writeStringToFile(editpageJS, input_4);
	}

	private void populateFor_5(Project p) throws Exception {

		File appJS = new File(p.getWebAppRoot().getFile(), p.getProjectName()
				+ ".js");
		assertFalse(appJS.exists());
		FileUtils.writeStringToFile(appJS, app_js_inputFor_5);
	}

	private void populateFor_7(Project p) throws Exception {

		File pagesdir = new File(p.getWebAppRoot().getFile(),
				ProjectConstants.PAGES_DIR);
		if (!pagesdir.exists()) {
			pagesdir.mkdir();
		}

		File editpage = new File(pagesdir, "Main");
		editpage.mkdir();
		File editpageJS = new File(editpage, "Main.widgets.js");
		FileUtils.writeStringToFile(editpageJS, input_7);
	}

	private void populateFor_Ordering(Project p) throws Exception {

		File pagesdir = new File(p.getWebAppRoot().getFile(),
				ProjectConstants.PAGES_DIR);
		if (!pagesdir.exists()) {
			pagesdir.mkdir();
		}

		File editpage = new File(pagesdir, "Main");
		editpage.mkdir();
		File editpageJS = new File(editpage, "Main.widgets.js");
		FileUtils.writeStringToFile(editpageJS, input_Ordering);
	}
}