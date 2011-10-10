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

package com.wavemaker.studio.ant;

import java.io.File;

import org.apache.tools.ant.Project;
import org.apache.tools.ant.types.Path;
import org.apache.tools.ant.types.Reference;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.ResourceUtils;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.ant.CopyRuntimeJarsTask;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestCopyRuntimeJarsTask extends WMTestCase {

    public void testCopyModulesWithJarReferences() throws Exception {

        ClassPathResource cpr = new ClassPathResource(this.getClass().getName().replace(".", "/") + ".class");
        File jarOne = new File(cpr.getFile().getParentFile(), "copyruntime_module_jar_one.jar");
        assertTrue(jarOne.exists());

        cpr = new ClassPathResource(RuntimeAccess.class.getName().replace(".", "/") + ".class");
        assertTrue(ResourceUtils.isJarURL(cpr.getURL()));
        File runtimeJar = new File(ResourceUtils.extractJarFileURL(cpr.getURL()).getFile());
        assertTrue(runtimeJar.exists());

        Project antProject = new Project();
        File projectRoot = IOUtils.createTempDirectory("TestCopyRunTimeJarsTask_testCopyModulesWithJarReferences", "dir");
        File webapproot = new File(projectRoot, "webapproot/WEB-INF/lib");
        webapproot.mkdirs();

        File expectedJarOne = new File(webapproot, jarOne.getName());
        File expectedJarTwo = new File(webapproot, "copyruntime_module_jar_two.jar");
        assertFalse(expectedJarOne.exists());
        assertFalse(expectedJarTwo.exists());

        Path p = new Path(antProject);
        p.createPath().setLocation(jarOne);
        antProject.addReference("jarone-path", p);

        CopyRuntimeJarsTask crjt = new CopyRuntimeJarsTask();
        crjt.setProject(antProject);
        crjt.setProjectRoot(projectRoot);
        crjt.setTodir(webapproot);
        crjt.setFrom(runtimeJar.getParentFile());
        crjt.setClasspathRef(new Reference(antProject, "jarone-path"));
        crjt.perform();

        assertTrue(expectedJarOne.exists());
        assertTrue(expectedJarTwo.exists());
    }

    public void testCopyModules() throws Exception {

        ClassPathResource cpr = new ClassPathResource(this.getClass().getName().replace(".", "/") + ".class");
        File jarOne = new File(cpr.getFile().getParentFile(), "copyruntime_module_jar_two.jar");
        assertTrue(jarOne.exists());

        cpr = new ClassPathResource(RuntimeAccess.class.getName().replace(".", "/") + ".class");
        assertTrue(ResourceUtils.isJarURL(cpr.getURL()));
        File runtimeJar = new File(ResourceUtils.extractJarFileURL(cpr.getURL()).getFile());
        assertTrue(runtimeJar.exists());

        Project antProject = new Project();
        File projectRoot = IOUtils.createTempDirectory("TestCopyRunTimeJarsTask_testCopyModulesWithJarReferences", "dir");
        File webapproot = new File(projectRoot, "webapproot/WEB-INF/lib");
        webapproot.mkdirs();

        File expectedJarTwo = new File(webapproot, jarOne.getName());
        File expectedJarOne = new File(webapproot, "copyruntime_module_jar_one.jar");
        assertFalse(expectedJarTwo.exists());
        assertFalse(expectedJarOne.exists());

        Path p = new Path(antProject);
        p.createPath().setLocation(jarOne);
        antProject.addReference("jarone-path", p);

        CopyRuntimeJarsTask crjt = new CopyRuntimeJarsTask();
        crjt.setProject(antProject);
        crjt.setProjectRoot(projectRoot);
        crjt.setTodir(webapproot);
        crjt.setFrom(runtimeJar.getParentFile());
        crjt.setClasspathRef(new Reference(antProject, "jarone-path"));
        crjt.perform();

        assertTrue(expectedJarTwo.exists());
        assertFalse(expectedJarOne.exists());
    }
}