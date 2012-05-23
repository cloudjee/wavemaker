
package com.wavemaker.tools.io.zip;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;

import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.hamcrest.Matcher;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.rules.TemporaryFolder;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.exception.ReadOnlyResourceException;
import com.wavemaker.tools.io.local.LocalFolder;

/**
 * Tests for {@link ZipFolder}.
 * 
 * @author Phillip Webb
 */
public class ZipFolderTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Rule
    public TemporaryFolder temporaryFolder = new TemporaryFolder();

    private java.io.File zipFile;

    private ZipFolder zip;

    @Before
    public void setup() throws Exception {
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
        this.zip = new ZipFolder(new LocalFolder(this.zipFile.getParentFile()).getFile(this.zipFile.getName()));
    }

    @Test
    public void shouldNeedZipFile() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("ZipFile must not be null");
        new ZipFolder((File) null);
    }

    @Test
    public void shouldNeedZipFileThatExists() throws Exception {
        File file = mock(File.class);
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("ZipFile must exist");
        new ZipFolder(file);
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
}
