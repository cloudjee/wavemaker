/*
 * Copyright (C) 2007-2008 WaveMaker Software, Inc.
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
package com.wavemaker.studio;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.File;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.servlet.ModelAndView;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.StudioConfiguration;

/**
 * @author small
 * @author Jeremy Grelle
 */
public class TestStaticFileController extends StudioTestCase {

	ProjectManager pm;

	@Before
	@Override
	public void setUp() throws Exception {

		super.setUp();

		pm = (ProjectManager) getApplicationContext().getBean("projectManager");
	}

	@Test
	public void testGetFile() throws Exception {

		String projectName = "testGetFile";
		makeProject(projectName);
		Project project = pm.getCurrentProject();

		File webapproot = project.getWebAppRoot().getFile();
		File indexHtml = new File(webapproot, "index.html");
		FileUtils.writeStringToFile(indexHtml, "<html>hi</html>");
		File fooSmd = new File(webapproot, "foo.smd");
		FileUtils.writeStringToFile(fooSmd, "{}");

		MockHttpServletRequest mhr = new MockHttpServletRequest("GET",
				"/servletname/projects/" + projectName + "/index.html");
		MockHttpServletResponse mhresp = new MockHttpServletResponse();

		StaticFileController sc = (StaticFileController) getApplicationContext()
				.getBean("agStaticFileController");
		ModelAndView mav = sc.handleRequest(mhr, mhresp);
		assertNull(mav);

		assertEquals(FileUtils.readFileToString(indexHtml),
				mhresp.getContentAsString());
		assertEquals(HttpServletResponse.SC_OK, mhresp.getStatus());
		assertEquals("text/html", mhresp.getContentType());

		mhr = new MockHttpServletRequest("GET", "/servletname/projects/"
				+ projectName + "/foo.smd");
		mhresp = new MockHttpServletResponse();
		mav = sc.handleRequest(mhr, mhresp);
		assertNull(mav);

		assertEquals(FileUtils.readFileToString(fooSmd),
				mhresp.getContentAsString());
		assertEquals(HttpServletResponse.SC_OK, mhresp.getStatus());
		assertEquals("application/json", mhresp.getContentType());
	}

	@Test
	public void testProjectList() throws Exception {

		String projectName1 = "testProjectList_foo";
		String projectName2 = "testProjectList_bar";
		makeProject(projectName1);
		makeProject(projectName2);

		MockHttpServletRequest mhr = new MockHttpServletRequest("GET",
				"/servletname/projects/");
		MockHttpServletResponse mhresp = new MockHttpServletResponse();

		StaticFileController sc = (StaticFileController) getApplicationContext()
				.getBean("agStaticFileController");
		sc.handleRequest(mhr, mhresp);

		String response = mhresp.getContentAsString();
		assertTrue(response.contains(projectName1));
		assertTrue(response.contains(projectName2));
	}

	@Test
	public void testProjectListNoTrailingSlash() throws Exception {

		String projectName1 = "testProjectList_foo";
		String projectName2 = "testProjectList_bar";
		makeProject(projectName1);
		makeProject(projectName2);

		MockHttpServletRequest mhr = new MockHttpServletRequest("GET",
				"/servletname/projects");
		MockHttpServletResponse mhresp = new MockHttpServletResponse();

		StaticFileController sc = (StaticFileController) getApplicationContext()
				.getBean("agStaticFileController");
		sc.handleRequest(mhr, mhresp);

		String response = mhresp.getContentAsString();
		assertTrue(response.contains(projectName1));
		assertTrue(response.contains(projectName2));
	}

	@Test
	public void testGetDirList() throws Exception {

		String projectName = "testGetDirList";
		makeProject(projectName);
		Project project = pm.getCurrentProject();

		File webapproot = project.getWebAppRoot().getFile();
		File indexHtml = new File(webapproot, "index.html");
		FileUtils.writeStringToFile(indexHtml, "<html>hi</html>");

		MockHttpServletRequest mhr = new MockHttpServletRequest("GET",
				"/servletname/projects/" + projectName + "/");
		MockHttpServletResponse mhresp = new MockHttpServletResponse();

		StaticFileController sc = (StaticFileController) getApplicationContext()
				.getBean("agStaticFileController");
		sc.handleRequest(mhr, mhresp);

		String response = mhresp.getContentAsString();
		assertTrue(response.contains("index.html"));

		// test without trailing /
		mhr = new MockHttpServletRequest("GET", "/servletname/projects/"
				+ projectName);
		mhresp = new MockHttpServletResponse();
		sc.handleRequest(mhr, mhresp);

		assertEquals(response, mhresp.getContentAsString());
	}

	@Test
	public void testNoProject() throws Exception {

		String otherProjectName = "projectE";
		makeProject(otherProjectName);

		String projectName = "projectDNE";

		MockHttpServletRequest mhr = new MockHttpServletRequest("GET",
				"/servletname/projects/" + projectName + "/index.html");
		MockHttpServletResponse mhresp = new MockHttpServletResponse();

		StaticFileController sc = (StaticFileController) getApplicationContext()
				.getBean("agStaticFileController");
		ModelAndView mav = sc.handleRequest(mhr, mhresp);
		assertNull(mav);

		assertEquals(HttpServletResponse.SC_NOT_FOUND, mhresp.getStatus());
		assertTrue(mhresp.getContentAsString().startsWith("Project "));
	}

	@Test
	public void testNoFile() throws Exception {

		String projectName = "fileDNE";
		makeProject(projectName);

		MockHttpServletRequest mhr = new MockHttpServletRequest("GET",
				"/servletname/projects/" + projectName + "/dne.html");
		MockHttpServletResponse mhresp = new MockHttpServletResponse();

		StaticFileController sc = (StaticFileController) getApplicationContext()
				.getBean("agStaticFileController");
		ModelAndView mav = sc.handleRequest(mhr, mhresp);
		assertNull(mav);

		assertEquals(HttpServletResponse.SC_NOT_FOUND, mhresp.getStatus());
		assertTrue(mhresp.getContentAsString().startsWith("File "));
	}

	@Test
	public void testGetCSSFile() throws Exception {

		String projectName = "foo";
		makeProject(projectName);
		Project project = pm.getCurrentProject();

		File webapproot = project.getWebAppRoot().getFile();
		File indexHtml = new File(webapproot, "foo.css");
		FileUtils.writeStringToFile(indexHtml, ".a{}");

		MockHttpServletRequest mhr = new MockHttpServletRequest("GET",
				"/servletname/projects/" + projectName + "/foo.css");
		MockHttpServletResponse mhresp = new MockHttpServletResponse();

		StaticFileController sc = (StaticFileController) getApplicationContext()
				.getBean("agStaticFileController");
		ModelAndView mav = sc.handleRequest(mhr, mhresp);
		assertNull(mav);

		assertEquals(FileUtils.readFileToString(indexHtml),
				mhresp.getContentAsString());
		assertEquals(HttpServletResponse.SC_OK, mhresp.getStatus());
		assertEquals("text/css", mhresp.getContentType());
	}

	@Test
	public void testBadTopLevel() throws Exception {

		MockHttpServletRequest mhr = new MockHttpServletRequest("GET",
				"/servletname/foobar/bar.html");
		MockHttpServletResponse mhresp = new MockHttpServletResponse();

		StaticFileController sc = (StaticFileController) getApplicationContext()
				.getBean("agStaticFileController");
		try {
			sc.handleRequest(mhr, mhresp);
			fail("expected exception");
		} catch (WMRuntimeException e) {
			assertEquals(MessageResource.STUDIO_UNKNOWN_LOCATION.getId(),
					e.getMessageId());
		}
	}

	@Test
	public void testWmGetFile() throws Exception {

		StudioConfiguration config = (StudioConfiguration) getApplicationContext()
				.getBean("studioConfiguration");

		assertTrue(config.getWaveMakerHome().exists());
		config.getCommonDir().getFile().mkdir();
		File testFile = config.getCommonDir().createRelative("foo.widgets.js")
				.getFile();
		String testFileContents = "widgets = []";
		FileUtils.writeStringToFile(testFile, testFileContents);

		MockHttpServletRequest mhr = new MockHttpServletRequest("GET",
				"/servletname/lib/wm/common/foo.widgets.js");
		MockHttpServletResponse mhresp = new MockHttpServletResponse();

		StaticFileController sc = (StaticFileController) getApplicationContext()
				.getBean("agStaticFileController");
		ModelAndView mav = sc.handleRequest(mhr, mhresp);
		assertNull(mav);

		assertEquals(testFileContents, mhresp.getContentAsString());
		assertEquals(HttpServletResponse.SC_OK, mhresp.getStatus());
		assertEquals("text/javascript", mhresp.getContentType());

		// and a non-existant file
		mhr = new MockHttpServletRequest("GET",
				"/servletname/lib/wm/common/fooDNE");
		mhresp = new MockHttpServletResponse();
		sc.handleRequest(mhr, mhresp);

		assertEquals(HttpServletResponse.SC_NOT_FOUND, mhresp.getStatus());
	}

	@Test
	public void testWmGetDirList() throws Exception {

		LocalStudioConfiguration config = (LocalStudioConfiguration) getApplicationContext()
				.getBean("studioConfiguration");
		config.getCommonDir().getFile().mkdir();
		File testFile = config.getCommonDir().createRelative("foo.widgets.js")
				.getFile();
		String testFileContents = "widgets = []";
		FileUtils.writeStringToFile(testFile, testFileContents);

		MockHttpServletRequest mhr = new MockHttpServletRequest("GET",
				"/servletname/lib/wm/common/");
		MockHttpServletResponse mhresp = new MockHttpServletResponse();

		StaticFileController sc = (StaticFileController) getApplicationContext()
				.getBean("agStaticFileController");
		sc.handleRequest(mhr, mhresp);

		String response = mhresp.getContentAsString();
		assertTrue("response: " + response.toString(),
				response.contains("foo.widgets.js"));

		// test without trailing /
		mhr = new MockHttpServletRequest("GET", "/servletname/lib/wm/common");
		mhresp = new MockHttpServletResponse();
		sc.handleRequest(mhr, mhresp);
		assertEquals(response, mhresp.getContentAsString());

		// finally, test a non-existent aghome
		File agHomeParent = IOUtils.createTempDirectory();
		File wmHome = new File(agHomeParent, "foobar");
		config.setTestWaveMakerHome(wmHome);
		FileUtils.forceDelete(agHomeParent);
		assertFalse(agHomeParent.exists());
		assertFalse(config.getCommonDir().exists());

		mhr = new MockHttpServletRequest("GET", "/servletname/lib/wm/common/");
		mhresp = new MockHttpServletResponse();
		sc.handleRequest(mhr, mhresp);

		assertEquals(HttpServletResponse.SC_NOT_FOUND, mhresp.getStatus());
	}
}