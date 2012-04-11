/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.compiler;

import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.Writer;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.annotation.processing.Processor;
import javax.lang.model.SourceVersion;
import javax.tools.DiagnosticListener;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.StandardLocation;

import org.eclipse.jdt.internal.compiler.batch.Main;
import org.eclipse.jdt.internal.compiler.impl.CompilerOptions;
import org.eclipse.jdt.internal.compiler.tool.EclipseBatchCompiler;
import org.eclipse.jdt.internal.compiler.tool.EclipseFileManager;
import org.eclipse.jdt.internal.compiler.tool.Options;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

/**
 * {@link JavaCompiler} implementation for use with WaveMaker.
 * 
 * @author Phillip Webb
 */
public class WaveMakerJavaCompiler implements JavaCompiler {

    private static final Set<SourceVersion> SOURCE_VERSIONS;
    static {
        SOURCE_VERSIONS = Collections.unmodifiableSet(EnumSet.range(SourceVersion.RELEASE_0, SourceVersion.RELEASE_6));
    }

    @Override
    public Set<SourceVersion> getSourceVersions() {
        return SOURCE_VERSIONS;
    }

    @Override
    public StandardJavaFileManager getStandardFileManager(DiagnosticListener<? super JavaFileObject> diagnosticListener, Locale locale,
        Charset charset) {
        return new EclipseFileManager(locale, charset);
    }

    @Override
    @SuppressWarnings("unchecked")
    public CompilationTask getTask(Writer out, JavaFileManager fileManager, DiagnosticListener<? super JavaFileObject> diagnosticListener,
        Iterable<String> options, Iterable<String> classes, Iterable<? extends JavaFileObject> compilationUnits) {

        if (fileManager == null) {
            fileManager = this.getStandardFileManager(diagnosticListener, null, null);
        }

        PrintWriter writer = createPrintWriter(out);

        EclipseBatchCompiler batchCompiler = new EclipseBatchCompiler(writer, writer, false);

        batchCompiler.options.put(CompilerOptions.OPTION_Compliance, CompilerOptions.VERSION_1_6);
        batchCompiler.options.put(CompilerOptions.OPTION_Source, CompilerOptions.VERSION_1_6);
        batchCompiler.options.put(CompilerOptions.OPTION_TargetPlatform, CompilerOptions.VERSION_1_6);
        batchCompiler.diagnosticListener = diagnosticListener;
        batchCompiler.fileManager = fileManager;
        batchCompiler.setCompilationUnits(compilationUnits);

        if (options != null) {
            for (Iterator<String> iterator = options.iterator(); iterator.hasNext();) {
                batchCompiler.fileManager.handleOption(iterator.next(), iterator);
            }
        }
        batchCompiler.configure(getArgumentsForBatchCompiler(asList(options), asList(classes)));
        if (fileManager instanceof StandardJavaFileManager) {
            Iterable<? extends File> location = ((StandardJavaFileManager) fileManager).getLocation(StandardLocation.CLASS_OUTPUT);
            if (location != null) {
                batchCompiler.setDestinationPath(location.iterator().next().getAbsolutePath());
            }
        }

        return new CompilationTaskImpl(batchCompiler);
    }

    /**
     * Adapt any tasks options for use with the eclipse batch compiler.
     * 
     * @param options the source options (never null)
     * @param classes the class (never null)
     * @return a set of options that can be applied to the {@link EclipseBatchCompiler}
     */
    private String[] getArgumentsForBatchCompiler(List<String> options, List<String> classes) {
        ArrayList<String> arguments = new ArrayList<String>();
        arguments.addAll(options);
        if (!classes.isEmpty()) {
            arguments.add("-classNames");
            arguments.add(StringUtils.collectionToCommaDelimitedString(classes));
        }
        return arguments.toArray(new String[arguments.size()]);
    }

    @Override
    public int isSupportedOption(String option) {
        return Options.processOptions(option);
    }

    @Override
    public int run(InputStream in, OutputStream out, OutputStream err, String... arguments) {
        Main compiler = new Main(createPrintWriter(out), createPrintWriter(err), true, null, null);
        boolean succeed = compiler.compile(arguments);
        return succeed ? 0 : -1;
    }

    /**
     * Create a new {@link PrintWriter} for the specified output stream.
     * 
     * @param outputStream the output stream
     * @return a print writer
     */
    private PrintWriter createPrintWriter(OutputStream outputStream) {
        Assert.notNull(outputStream, "OutputStream must not be null");
        return createPrintWriter(new OutputStreamWriter(outputStream));
    }

    /**
     * Create a new {@link PrintWriter} for the specified (optional) writer. If the writer is not specified
     * {@link System#err} will be used.
     * 
     * @param writer a writer or <tt>null</tt>
     * @return a print writer
     */
    private PrintWriter createPrintWriter(Writer writer) {
        if (writer != null) {
            return new PrintWriter(writer);
        }
        return new PrintWriter(System.err);
    }

    /**
     * Adapt an iterable to a list. If the iterable is <tt>null</tt> an empty list is returned.
     * 
     * @param iterable the iterable to convert
     * @return a list containing all items from the iterable
     */
    private static <T> List<T> asList(Iterable<T> iterable) {
        if (iterable == null) {
            return Collections.emptyList();
        }
        List<T> list = new ArrayList<T>();
        for (T item : iterable) {
            list.add(item);
        }
        return list;
    }

    /**
     * The compilation task implementation.
     */
    private static class CompilationTaskImpl implements CompilationTask {

        private final EclipseBatchCompiler compiler;

        private boolean called = false;

        public CompilationTaskImpl(EclipseBatchCompiler compiler) {
            this.compiler = compiler;
        }

        @Override
        public void setLocale(Locale locale) {
            this.compiler.setLocale(locale);
        }

        @Override
        public void setProcessors(Iterable<? extends Processor> processors) {
            List<? extends Processor> processorsList = asList(processors);
            Processor[] processorsArray = processorsList.toArray(new Processor[processorsList.size()]);
            this.compiler.setProcessors(processorsArray);
        }

        @Override
        public Boolean call() {
            try {
                Assert.state(!this.called, "The compilation task has already been called");
                return this.compiler.call();
            } finally {
                this.called = true;
            }
        }
    }
}
