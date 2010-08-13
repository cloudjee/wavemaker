/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.util;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.tools.ant.DefaultLogger;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.taskdefs.Copy;
import org.apache.tools.ant.taskdefs.Expand;
import org.apache.tools.ant.taskdefs.Jar;
import org.apache.tools.ant.taskdefs.Javac;
import org.apache.tools.ant.types.FileSet;
import org.apache.tools.ant.types.Path;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.ClassLoaderUtils.TaskNoRtn;
import com.wavemaker.tools.common.Bootstrap;

/**
 * @author Simon Toens
 */
public class AntUtils {

    public static void bootstrap(ClassLoader contextClassLoader) {

        // Ant doesn't set the context classloader, and Spring depends on
        // it for loading files
        ClassLoaderUtils.runInClassLoaderContext(new TaskNoRtn() {
            public void run() {
                Bootstrap.main(null);
            }
        }, contextClassLoader);
    }

    public static void javac(String srcdir, File destdir) {
        javac(srcdir, destdir, null);
    }

    public static void javac(String srcdir, File destdir, String includes) {
        javac(srcdir, destdir, null, includes);
    }

    public static void javac(String srcdir, File destdir, String classpath,
            String includes) {

        Javac javac = new Javac();
        Project project = getProject();
        javac.setProject(project);
        javac.setSrcdir(new Path(project, srcdir));
        javac.setDestdir(destdir);
        javac.setFork(true);

        if (includes != null) {
            javac.setIncludes(includes);
        }

        if (classpath != null) {
            javac.setClasspath(new Path(project, classpath));
        }

        javac.perform();
    }

    public static void copyDir(File srcdir, File destdir) {
        copyDir(srcdir, destdir, (List<String>) null, (List<String>) null);
    }

    public static void copyDir(File srcdir, File destdir, String include,
            String exclude) {
        List<String> i = new ArrayList<String>(1);
        if (include != null) {
            i.add(include);
        }

        List<String> e = new ArrayList<String>(1);
        if (exclude != null) {
            e.add(exclude);
        }
        copyDir(srcdir, destdir, i, e);
    }

    public static void copyDir(File srcdir, File destdir,
            List<String> includes, List<String> excludes) {
        Copy cp = new Copy();
        cp.setProject(getProject());
        cp.setTodir(destdir);
        FileSet fs = new FileSet();
        cp.addFileset(fs);
        fs.setDir(srcdir);
        if (includes != null) {
            fs.setIncludes(ObjectUtils.toString(includes, " "));
        }
        if (excludes != null) {
            fs.setExcludes(ObjectUtils.toString(excludes, " "));
        }

        cp.perform();

    }

    public static void jar(File destfile, File basedir) {
        Jar jar = new Jar();
        jar.setProject(getProject());
        jar.setDestFile(destfile);
        jar.setBasedir(basedir);
        jar.perform();
    }

    public static void unjar(File jarfile, File destdir) {
        Expand unjar = new Expand();
        unjar.setProject(getProject());
        unjar.setSrc(jarfile);
        unjar.setDest(destdir);
        unjar.perform();
    }

    private static Project getProject() {
        Project rtn = new Project();
        rtn.addBuildListener(new SysoutLogger());
        return rtn;
    }

    private static class SysoutLogger extends DefaultLogger {

        public SysoutLogger() {
            setMessageOutputLevel(Project.MSG_INFO);
            setOutputPrintStream(System.out);
            setEmacsMode(true);
        }
    }
}
