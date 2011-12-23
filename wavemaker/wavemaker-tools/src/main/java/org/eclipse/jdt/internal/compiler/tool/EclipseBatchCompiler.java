
package org.eclipse.jdt.internal.compiler.tool;

import java.io.PrintWriter;
import java.util.Map;

import javax.annotation.processing.Processor;
import javax.tools.JavaFileObject;

import org.eclipse.jdt.core.compiler.CompilationProgress;

import com.wavemaker.tools.compiler.WaveMakerJavaCompiler;

/**
 * Exposes a variant of the internal eclipse batch compiler for use by the {@link WaveMakerJavaCompiler}. This is an
 * internal WaveMaker class and should not be used directly.
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