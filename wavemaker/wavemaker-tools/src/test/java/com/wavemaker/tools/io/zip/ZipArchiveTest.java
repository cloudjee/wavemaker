
package com.wavemaker.tools.io.zip;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.IOUtils;
import org.hamcrest.Matcher;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.rules.TemporaryFolder;
import org.mockito.MockitoAnnotations;
import org.springframework.util.FileCopyUtils;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.FilterOn;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.exception.ReadOnlyResourceException;
import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.io.store.MockStoredFolder;

/**
 * Tests for {@link ZipArchive}.
 * 
 * @author Phillip Webb
 */
public class ZipArchiveTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Rule
    public TemporaryFolder temporaryFolder = new TemporaryFolder();

    private final MockStoredFolder folder = new MockStoredFolder();

    private java.io.File zipFile;

    private ZipArchive zip;

    @Before
    public void setup() throws Exception {
        MockitoAnnotations.initMocks(this);
        this.zipFile = this.temporaryFolder.newFile("zipfile.zip");
        ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(this.zipFile));
        try {
            zipOutputStream.putNextEntry(new ZipEntry("/a/b/c.txt"));
            zipOutputStream.write("c".getBytes());
            zipOutputStream.putNextEntry(new ZipEntry("/d/"));
            zipOutputStream.putNextEntry(new ZipEntry("/d/e/"));
            zipOutputStream.putNextEntry(new ZipEntry("/d/f/"));
            zipOutputStream.putNextEntry(new ZipEntry("/d/f/g.txt"));
            zipOutputStream.putNextEntry(new ZipEntry("/d/f/h/"));
            zipOutputStream.write("g".getBytes());
        } finally {
            zipOutputStream.close();
        }
        this.zip = new ZipArchive(new LocalFolder(this.zipFile.getParentFile()).getFile(this.zipFile.getName()));
    }

    @Test
    public void shouldNeedZipFile() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("ZipFile must not be null");
        new ZipArchive((File) null);
    }

    @Test
    public void shouldNeedZipFileThatExists() throws Exception {
        File file = mock(File.class);
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("ZipFile must exist");
        new ZipArchive(file);
    }

    @Test
    public void shouldGetFolderNotInZipFile() throws Exception {
        Folder folder = this.zip.getFolder("/a/b/c");
        assertThat(folder.toString(), is("/a/b/c/"));
        assertThat(folder.exists(), is(false));
    }

    @Test
    public void shouldGetFileNotInZip() throws Exception {
        File file = this.zip.getFile("/a/b/c");
        assertThat(file.toString(), is("/a/b/c"));
        assertThat(file.exists(), is(false));
    }

    @Test
    public void shouldGetFileThatIsInZip() throws Exception {
        File file = this.zip.getFile("/a/b/c.txt");
        assertThat(file.toString(), is("/a/b/c.txt"));
        assertThat(file.exists(), is(true));
    }

    @Test
    public void shouldGetFolderThatIsInZip() throws Exception {
        Folder folder = this.zip.getFolder("/d/e");
        assertThat(folder.toString(), is("/d/e/"));
        assertThat(folder.exists(), is(true));
    }

    @Test
    public void shouldGetVirtualFolder() throws Exception {
        Folder folder = this.zip.getFolder("/a/b");
        assertThat(folder.toString(), is("/a/b/"));
        assertThat(folder.exists(), is(true));
    }

    @Test
    public void shouldNotCreateFile() throws Exception {
        this.thrown.expect(ReadOnlyResourceException.class);
        this.thrown.expectMessage(zipErrorMessage());
        this.zip.getFile("/a/b/x.txt").createIfMissing();
    }

    @Test
    public void shouldNotCreateFolder() throws Exception {
        this.thrown.expect(ReadOnlyResourceException.class);
        this.thrown.expectMessage(zipErrorMessage());
        this.zip.getFolder("/a/b/c").createIfMissing();
    }

    @Test
    public void shouldList() throws Exception {
        List<String> list = asList(this.zip.getFolder("/d/f").list());
        assertThat(list.size(), is(2));
        assertTrue(list.contains("g.txt"));
        assertTrue(list.contains("h"));
    }

    @Test
    public void shouldListIncludingVirtualFolder() throws Exception {
        List<String> list = asList(this.zip.getFolder("/a").list());
        assertThat(list.size(), is(1));
        assertTrue(list.contains("b"));
    }

    @Test
    public void shouldListFromVirtualFolder() throws Exception {
        List<String> list = asList(this.zip.getFolder("/a/b").list());
        assertThat(list.size(), is(1));
        assertTrue(list.contains("c.txt"));
    }

    @Test
    public void shouldGetSize() throws Exception {
        long actual = this.zip.getFile("/a/b/c.txt").getSize();
        assertThat(actual, is(1L));
    }

    @Test
    public void shouldDelegateGetLastModified() throws Exception {
        long actual = this.zip.getFile("/a/b/c.txt").getLastModified();
        assertThat(actual, is(this.zipFile.lastModified()));
    }

    @Test
    public void shouldGetInputStream() throws Exception {
        String actual = this.zip.getFile("/a/b/c.txt").getContent().asString();
        assertThat(actual, is("c"));
    }

    @Test
    public void shouldNotGetOutputStream() throws Exception {
        this.thrown.expect(ReadOnlyResourceException.class);
        this.thrown.expectMessage(zipErrorMessage());
        this.zip.getFile("/a/b/c.txt").getContent().asOutputStream();
    }

    @Test
    public void shouldNotDelete() throws Exception {
        this.thrown.expect(ReadOnlyResourceException.class);
        this.thrown.expectMessage(zipErrorMessage());
        this.zip.getFile("/a/b/c.txt").delete();
    }

    @Test
    public void shouldNotRename() throws Exception {
        this.thrown.expect(ReadOnlyResourceException.class);
        this.thrown.expectMessage(zipErrorMessage());
        this.zip.getFile("/a/b/c.txt").rename("newname");
    }

    @Test
    public void shouldReloadIfChanged() throws Exception {
        File file = this.zip.getFile("a/b/c.txt");
        assertThat(file.getContent().asString(), is("c"));
        ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(this.zipFile));
        try {
            zipOutputStream.putNextEntry(new ZipEntry("/a/b/c.txt"));
            zipOutputStream.write("c2".getBytes());
        } finally {
            zipOutputStream.close();
        }
        assertThat(file.getContent().asString(), is("c2"));
    }

    private List<String> asList(Iterable<? extends Resource> iterable) {
        List<String> list = new ArrayList<String>();
        for (Resource item : iterable) {
            list.add(item.getName());
        }
        return list;
    }

    @SuppressWarnings("unchecked")
    private Matcher<String> zipErrorMessage() {
        return allOf(startsWith("The Zip File"), endsWith("is read-only"));
    }

    @Test
    public void shouldNeedUnzipInputStream() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("InputStream must not be null");
        ZipArchive.unpack((InputStream) null, this.folder);
    }

    @Test
    public void shouldUnzip() throws Exception {
        ByteArrayOutputStream outputStreamB = new ByteArrayOutputStream();
        ByteArrayOutputStream outputStreamD = new ByteArrayOutputStream();
        given(this.folder.getStore().exists()).willReturn(true);
        given(this.folder.getFile("a/b.txt").getStore().getOutputStream()).willReturn(outputStreamB);
        given(this.folder.getFile("c/d.txt").getStore().getOutputStream()).willReturn(outputStreamD);
        InputStream zipStream = getSampleZip();
        ZipArchive.unpack(zipStream, this.folder);
        verify(this.folder.getFolder("a").getStore()).create();
        verify(this.folder.getFolder("c").getStore()).create();
        assertThat(new String(outputStreamB.toByteArray()), is("ab"));
        assertThat(new String(outputStreamD.toByteArray()), is("cd"));
    }

    private InputStream getSampleZip() throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ZipOutputStream zipOutputStream = new ZipOutputStream(outputStream);
        zipOutputStream.putNextEntry(new ZipEntry("a/"));
        zipOutputStream.closeEntry();
        zipOutputStream.putNextEntry(new ZipEntry("a/b.txt"));
        IOUtils.write("ab", zipOutputStream);
        zipOutputStream.closeEntry();
        zipOutputStream.putNextEntry(new ZipEntry("c/"));
        zipOutputStream.closeEntry();
        zipOutputStream.putNextEntry(new ZipEntry("c/d.txt"));
        IOUtils.write("cd", zipOutputStream);
        zipOutputStream.closeEntry();
        zipOutputStream.close();
        return new ByteArrayInputStream(outputStream.toByteArray());
    }

    @Test
    public void shouldCreateZipFileWithPrefix() throws Exception {
        Folder rootFolder = createLayout();
        InputStream inputStream = ZipArchive.compress(rootFolder.getFolder("y"), "x");
        List<String> entryNames = getEntryNames(inputStream);
        assertThat(entryNames.size(), is(5));
        assertTrue(entryNames.contains("x/a/"));
        assertTrue(entryNames.contains("x/a/aa.txt"));
        assertTrue(entryNames.contains("x/a/ab.txt"));
        assertTrue(entryNames.contains("x/b/"));
        assertTrue(entryNames.contains("x/b/ba.txt"));
    }

    @Test
    public void shouldCreateZipFileWithoutPrefix() throws Exception {
        Folder rootFolder = createLayout();
        InputStream inputStream = ZipArchive.compress(rootFolder.getFolder("y"));
        List<String> entryNames = getEntryNames(inputStream);
        assertThat(entryNames.size(), is(5));
        assertTrue(entryNames.contains("a/aa.txt"));
        assertTrue(entryNames.contains("a/ab.txt"));
        assertTrue(entryNames.contains("b/"));
        assertTrue(entryNames.contains("b/ba.txt"));
    }

    @Test
    public void shouldCreateFilteredZipFile() throws Exception {
        Folder rootFolder = createLayout();
        InputStream inputStream = new ZippedFolderInputStream(rootFolder.getFolder("y").find().include(FilterOn.names().notStarting("ab")), "x");
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

    private List<String> getEntryNames(InputStream inputStream) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        FileCopyUtils.copy(inputStream, outputStream);
        ZipInputStream readInputStream = new ZipInputStream(new ByteArrayInputStream(outputStream.toByteArray()));
        List<String> entryNames = new ArrayList<String>();
        ZipEntry entry = readInputStream.getNextEntry();
        while (entry != null) {
            entryNames.add(entry.getName());
            readInputStream.closeEntry();
            entry = readInputStream.getNextEntry();
        }
        return entryNames;
    }
}
