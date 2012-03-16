
package com.wavemaker.tools.io.compiler;

import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;

import javax.tools.Diagnostic;
import javax.tools.DiagnosticListener;
import javax.tools.JavaCompiler;
import javax.tools.JavaCompiler.CompilationTask;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;
import javax.tools.StandardJavaFileManager;
import javax.tools.StandardLocation;
import javax.tools.ToolProvider;

import org.junit.Ignore;
import org.junit.Test;

import com.wavemaker.tools.compiler.WaveMakerJavaCompiler;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.filesystem.FileSystemFolder;
import com.wavemaker.tools.io.filesystem.local.LocalFileSystem;

/**
 * Tests for {@link ResourceJavaFileManager}.
 * 
 * @author Phillip Webb
 */
public class ResourceFolderJavaFileManagerTest {

    // FIXME PW write tests for ResourceFolderJavaFileManager

    @Test
    public void test() throws IOException {

        // Folder m2 = FileSystemFolder.getRoot(new LocalFileSystem(new java.io.File("/Users/pwebb/.m2/repository")));
        // File faces = m2.getFile("com/sun/faces/jsf-api/2.1.7/jsf-api-2.1.7.jar");

        java.io.File testSourceFolder = new java.io.File("src/test/java").getAbsoluteFile();
        LocalFileSystem fileSystem = new LocalFileSystem(testSourceFolder);
        Folder root = FileSystemFolder.getRoot(fileSystem);

        // JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        JavaCompiler compiler = new WaveMakerJavaCompiler();

        StandardJavaFileManager standardFileManager = compiler.getStandardFileManager(null, null, null);
        ResourceJavaFileManager fileManager = new ResourceJavaFileManager(standardFileManager);
        fileManager.setLocation(StandardLocation.SOURCE_PATH, Arrays.asList(root));
        fileManager.setLocation(StandardLocation.CLASS_OUTPUT, Arrays.asList(root));
        // fileManager.setLocation(StandardLocation.CLASS_PATH, Arrays.asList(faces));

        JavaFileObject example = fileManager.getJavaFileForInput(StandardLocation.SOURCE_PATH, "com.wavemaker.tools.io.compiler.ExampleClass",
            Kind.SOURCE);
        DiagnosticListener<JavaFileObject> dl = new DiagnosticListener<JavaFileObject>() {

            @Override
            public void report(Diagnostic<? extends JavaFileObject> diagnostic) {
                System.out.println(">>> " + diagnostic);
            }
        };
        CompilationTask task = compiler.getTask(new PrintWriter(System.out), fileManager, dl, null, null, Arrays.asList(example));
        assertTrue(task.call());
    }

    @Ignore
    @Test
    public void testName() throws Exception {
        java.io.File testSourceFolder = new java.io.File("src/test/java").getAbsoluteFile();

        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        StandardJavaFileManager fileManager = compiler.getStandardFileManager(null, null, null);
        fileManager.setLocation(StandardLocation.SOURCE_PATH, Arrays.asList(testSourceFolder));
        fileManager.setLocation(StandardLocation.CLASS_PATH,
            Arrays.asList(new java.io.File("/Users/pwebb/.m2/repository/com/sun/faces/jsf-api/2.1.7/jsf-api-2.1.7.jar")));
        JavaFileObject example = fileManager.getJavaFileForInput(StandardLocation.SOURCE_PATH, "com.wavemaker.tools.compiler.io.ExampleClass",
            Kind.SOURCE);
        CompilationTask task = compiler.getTask(new PrintWriter(System.out), fileManager, null, null, null, Arrays.asList(example));
        assertTrue(task.call());
    }

}
