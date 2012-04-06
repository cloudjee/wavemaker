/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package org.eclipse.jdt.internal.compiler.tool;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.annotation.processing.Processor;
import javax.tools.JavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.StandardLocation;

import org.eclipse.jdt.core.compiler.CompilationProgress;
import org.eclipse.jdt.internal.compiler.batch.FileSystem;

import com.wavemaker.tools.compiler.WaveMakerJavaCompiler;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.compiler.ResourceJavaFileManager;

/**
 * Exposes a variant of the internal eclipse batch compiler for use by the {@link WaveMakerJavaCompiler}. This is an
 * internal WaveMaker class and should not be used directly.
 * <p>
 * Can compile classes not contained on the filesystem and support {@link ResourceJavaFileManager}s.
 * 
 * @author Phillip Webb
 */
@SuppressWarnings("rawtypes")
public class EclipseBatchCompiler extends EclipseCompilerImpl {

    // This class intentionally uses the org.eclipse.jdt.internal.compiler.tool package in order to access package
    // scoped eclipse classes

    private static final String CLASS_NAMES_ARG = "-classNames";

    private static final String CLASS_NAMES_VALUE = "None";

    public EclipseBatchCompiler(PrintWriter out, PrintWriter err, boolean systemExitWhenFinished) {
        super(out, err, systemExitWhenFinished);
    }

    @Override
    public void initialize(PrintWriter outWriter, PrintWriter errWriter, boolean systemExit, Map customDefaultOptions,
        CompilationProgress compilationProgress) {
        super.initialize(outWriter, errWriter, systemExit, customDefaultOptions, compilationProgress);
    }

    @Override
    public void configure(String[] argv) {

        // Although the eclipse compiler can work without needed direct access to a file system the command line
        // will fail if no source files and no class files are specified. To work around this we add a dummy
        // -classNames argument that will be immediately removed

        boolean insertedClassName = false;
        String[] completeArguments = argv;
        if (!hasClassNamesOption(argv)) {
            completeArguments = new String[argv.length + 2];
            System.arraycopy(argv, 0, completeArguments, 0, argv.length);
            completeArguments[argv.length] = CLASS_NAMES_ARG;
            completeArguments[argv.length + 1] = CLASS_NAMES_VALUE;
            insertedClassName = true;
        }
        super.configure(completeArguments);
        if (insertedClassName) {
            this.classNames = null;
        }
    }

    @Override
    protected void setPaths(ArrayList bootclasspaths, String sourcepathClasspathArg, ArrayList sourcepathClasspaths, ArrayList classpaths,
        ArrayList extdirsClasspaths, ArrayList endorsedDirClasspaths, String customEncoding) {

        // Override set paths to deal with any ResourceFolderJavaFileManagers.

        // If we are using a ResourceFileManager call use the parent when setting paths
        JavaFileManager originalFileManager = this.fileManager;
        try {
            if (this.fileManager instanceof ResourceJavaFileManager) {
                this.fileManager = ((ResourceJavaFileManager) this.fileManager).getParentFileManager();
            }
            super.setPaths(bootclasspaths, sourcepathClasspathArg, sourcepathClasspaths, classpaths, extdirsClasspaths, endorsedDirClasspaths,
                customEncoding);
        } finally {
            this.fileManager = originalFileManager;
        }

        // Add any classpath folders exposed by the ResourceJavaFileManager
        if (this.fileManager instanceof ResourceJavaFileManager) {
            ResourceJavaFileManager resourceFolderJavaFileManager = (ResourceJavaFileManager) this.fileManager;
            Iterable<Folder> classPathFolders = resourceFolderJavaFileManager.getLocationFolders(StandardLocation.CLASS_PATH);
            if (classPathFolders != null) {
                List<FileSystem.Classpath> checkedClasspathList = new ArrayList<FileSystem.Classpath>();
                checkedClasspathList.addAll(Arrays.asList(this.checkedClasspaths));
                for (Folder folder : classPathFolders) {
                    checkedClasspathList.add(new ResourceFolderFileSystemClasspath(folder));
                }
                this.checkedClasspaths = checkedClasspathList.toArray(new FileSystem.Classpath[checkedClasspathList.size()]);
            }
        }
    }

    private boolean hasClassNamesOption(String[] argv) {
        for (String arg : argv) {
            if (CLASS_NAMES_ARG.equals(arg)) {
                return true;
            }
        }
        return false;
    }

    public void setCompilationUnits(Iterable<? extends JavaFileObject> compilationUnits) {
        this.compilationUnits = compilationUnits;
    }

    public void setProcessors(Processor[] processors) {
        this.processors = processors;
    }
}