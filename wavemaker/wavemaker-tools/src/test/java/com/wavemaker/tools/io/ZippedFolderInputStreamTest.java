
package com.wavemaker.tools.io;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.springframework.util.FileCopyUtils;

import com.wavemaker.tools.io.filesystem.RootFileSystemFolderFactory;
import com.wavemaker.tools.io.filesystem.local.LocalFileSystem;

/**
 * Tests for {@link ZippedFolderInputStream}.
 * 
 * @author Phillip Webb
 */
public class ZippedFolderInputStreamTest {

    @Rule
    public TemporaryFolder temporaryFolder = new TemporaryFolder();

    private ZipInputStream readInputStream;

    @Test
    public void shouldCreateZipFile() throws Exception {
        File root = this.temporaryFolder.newFolder("ziptest");
        System.out.println(root);
        LocalFileSystem fileSystem = new LocalFileSystem(root);
        Folder rootFolder = RootFileSystemFolderFactory.getRoot(fileSystem);
        rootFolder.getFolder("y/a").getFile("aa.txt").getContent().write("aa test");
        rootFolder.getFolder("y/a").getFile("ab.txt").getContent().write("ab test");
        rootFolder.getFolder("y/b").getFile("ba.txt").getContent().write("ba test");
        ZippedFolderInputStream inputStream = new ZippedFolderInputStream(rootFolder.getFolder("y"), "x");
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        FileCopyUtils.copy(inputStream, outputStream);
        this.readInputStream = new ZipInputStream(new ByteArrayInputStream(outputStream.toByteArray()));
        assertEntry(this.readInputStream.getNextEntry(), "x/a/");
        assertEntry(this.readInputStream.getNextEntry(), "x/a/aa.txt");
        assertEntry(this.readInputStream.getNextEntry(), "x/a/ab.txt");
        assertEntry(this.readInputStream.getNextEntry(), "x/b/");
        assertEntry(this.readInputStream.getNextEntry(), "x/b/ba.txt");
        assertThat(this.readInputStream.getNextEntry(), is(nullValue()));
    }

    private void assertEntry(ZipEntry entry, String name) throws IOException {
        assertThat(entry.getName(), is(name));
        this.readInputStream.closeEntry();
    }
}
