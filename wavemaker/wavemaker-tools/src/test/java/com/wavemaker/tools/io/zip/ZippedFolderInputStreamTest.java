
package com.wavemaker.tools.io.zip;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.springframework.util.FileCopyUtils;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Including;
import com.wavemaker.tools.io.local.LocalFolder;

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
        Folder rootFolder = createLayout();
        ZippedFolderInputStream inputStream = new ZippedFolderInputStream(rootFolder.getFolder("y"), "x");
        List<String> entryNames = getEntryNames(inputStream);
        assertThat(entryNames.size(), is(5));
        assertTrue(entryNames.contains("x/a/"));
        assertTrue(entryNames.contains("x/a/aa.txt"));
        assertTrue(entryNames.contains("x/a/ab.txt"));
        assertTrue(entryNames.contains("x/b/"));
        assertTrue(entryNames.contains("x/b/ba.txt"));
    }

    @Test
    public void shouldCreateFilteredZipFile() throws Exception {
        Folder rootFolder = createLayout();
        ZippedFolderInputStream inputStream = new ZippedFolderInputStream(rootFolder.getFolder("y"), "x", Including.fileNames().notStarting("ab"));
        List<String> entryNames = getEntryNames(inputStream);
        assertThat(entryNames.size(), is(4));
        assertTrue(entryNames.contains("x/a/"));
        assertTrue(entryNames.contains("x/a/aa.txt"));
        assertTrue(entryNames.contains("x/b/"));
        assertTrue(entryNames.contains("x/b/ba.txt"));
    }

    private Folder createLayout() {
        Folder rootFolder = new LocalFolder(this.temporaryFolder.newFolder("ziptest"));
        rootFolder.getFolder("y/a").getFile("aa.txt").getContent().write("aa test");
        rootFolder.getFolder("y/a").getFile("ab.txt").getContent().write("ab test");
        rootFolder.getFolder("y/b").getFile("ba.txt").getContent().write("ba test");
        return rootFolder;
    }

    private List<String> getEntryNames(ZippedFolderInputStream inputStream) throws IOException {
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
        return entryNames;
    }
}
