
package com.wavemaker.tools.io;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.springframework.util.FileCopyUtils;

import com.wavemaker.tools.io.filesystem.FileSystemFolder;
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
        Folder rootFolder = FileSystemFolder.getRoot(fileSystem);
        rootFolder.getFolder("y/a").getFile("aa.txt").getContent().write("aa test");
        rootFolder.getFolder("y/a").getFile("ab.txt").getContent().write("ab test");
        rootFolder.getFolder("y/b").getFile("ba.txt").getContent().write("ba test");
        ZippedFolderInputStream inputStream = new ZippedFolderInputStream(rootFolder.getFolder("y"), "x");
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        FileCopyUtils.copy(inputStream, outputStream);
        this.readInputStream = new ZipInputStream(new ByteArrayInputStream(outputStream.toByteArray()));
        List<String> entryNames = new ArrayList<String>();
        ZipEntry entry = this.readInputStream.getNextEntry();
        while (entry != null) {
            entryNames.add(entry.getName());
            this.readInputStream.closeEntry();
            entry = this.readInputStream.getNextEntry();
        }
        assertThat(entryNames.size(), is(5));
        assertTrue(entryNames.contains("x/a/"));
        assertTrue(entryNames.contains("x/a/aa.txt"));
        assertTrue(entryNames.contains("x/a/ab.txt"));
        assertTrue(entryNames.contains("x/b/"));
        assertTrue(entryNames.contains("x/b/ba.txt"));
    }
}
