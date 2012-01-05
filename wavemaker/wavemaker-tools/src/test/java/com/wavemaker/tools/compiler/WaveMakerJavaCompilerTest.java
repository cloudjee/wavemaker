
package com.wavemaker.tools.compiler;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyBoolean;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;

import javax.tools.JavaCompiler.CompilationTask;
import javax.tools.JavaFileManager;
import javax.tools.JavaFileManager.Location;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;
import javax.tools.StandardJavaFileManager;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.eclipse.jdt.internal.compiler.tool.EclipseFileManager;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

/**
 * Tests for {@link WaveMakerJavaCompiler}.
 * 
 * @author Phillip Webb
 */
public class WaveMakerJavaCompilerTest {

    @Rule
    public TemporaryFolder tempFolder = new TemporaryFolder();

    private final WaveMakerJavaCompiler javaCompiler = new WaveMakerJavaCompiler();

    @Test
    public void shouldGetStandardFileManager() throws Exception {
        StandardJavaFileManager fileManager = this.javaCompiler.getStandardFileManager(null, null, null);
        assertThat(fileManager, is(notNullValue()));
        assertThat(fileManager, is(EclipseFileManager.class));
    }

    @Test
    public void shouldCompilePhysicalFile() throws Exception {
        StandardJavaFileManager fileManager = this.javaCompiler.getStandardFileManager(null, null, null);
        try {
            Iterable<? extends JavaFileObject> compilationUnits = fileManager.getJavaFileObjects(new File[] { createExampleJavaFile() });
            CompilationTask task = this.javaCompiler.getTask(null, fileManager, null, standardCompilerOptions(), null, compilationUnits);
            assertThat(task.call(), is(Boolean.TRUE));
            assertTrue(new File(this.tempFolder.getRoot(), "Example.class").exists());
        } finally {
            fileManager.close();
        }
    }

    @Test
    public void shouldCompileVirtualFile() throws Exception {
        JavaFileObject sourceFile = mock(JavaFileObject.class);
        given(sourceFile.getKind()).willReturn(Kind.SOURCE);
        given(sourceFile.getName()).willReturn("Example.java");
        given(sourceFile.getCharContent(anyBoolean())).willReturn(getExampleJavaContent());
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        JavaFileObject classFile = mock(JavaFileObject.class);
        given(classFile.openOutputStream()).willReturn(outputStream);

        JavaFileManager fileManager = mock(JavaFileManager.class);
        given(fileManager.getJavaFileForOutput(any(Location.class), anyString(), eq(Kind.CLASS), eq(sourceFile))).willReturn(classFile);
        Iterable<? extends JavaFileObject> compilationUnits = Collections.singleton(sourceFile);
        CompilationTask task = this.javaCompiler.getTask(null, fileManager, null, standardCompilerOptions(), null, compilationUnits);
        assertThat(task.call(), is(Boolean.TRUE));
        assertThat(outputStream.toByteArray().length, is(greaterThan(0)));
    }

    private File createExampleJavaFile() throws Exception {
        File file = this.tempFolder.newFile("Example.java");
        FileOutputStream fileOutputStream = new FileOutputStream(file);
        try {
            IOUtils.copy(getExampleJavaContentStream(), fileOutputStream);
            return file;
        } finally {
            fileOutputStream.close();
        }
    }

    private InputStream getExampleJavaContentStream() {
        return new ByteArrayInputStream(getExampleJavaContent().getBytes());
    }

    private String getExampleJavaContent() {
        return "public class Example {}";
    }

    private Iterable<String> standardCompilerOptions() {
        Set<String> options = new LinkedHashSet<String>();
        options.add("-encoding");
        options.add("utf8");
        return options;
    }
}
