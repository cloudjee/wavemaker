
package com.wavemaker.tools.io.zip;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;

import java.io.FileOutputStream;
import java.io.InputStream;
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
import org.springframework.util.FileCopyUtils;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.ResourcePath;
import com.wavemaker.tools.io.exception.ReadOnlyResourceException;
import com.wavemaker.tools.io.filesystem.FileSystemFolder;
import com.wavemaker.tools.io.filesystem.JailedResourcePath;
import com.wavemaker.tools.io.filesystem.ResourceType;
import com.wavemaker.tools.io.filesystem.local.LocalFileSystem;

/**
 * Tests for {@link ZipFileSystem}.
 * 
 * @author Phillip Webb
 */
public class ZipFileSystemTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Rule
    public TemporaryFolder temporaryFolder = new TemporaryFolder();

    private java.io.File zipFile;

    private ZipFileSystem zipFileSystem;

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
        LocalFileSystem localFileSystem = new LocalFileSystem(this.zipFile.getParentFile());
        this.zipFileSystem = new ZipFileSystem(FileSystemFolder.getRoot(localFileSystem).getFile(this.zipFile.getName()));
    }

    @Test
    public void shouldNeedZipFile() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("ZipFile must not be null");
        new ZipFileSystem(null);
    }

    @Test
    public void shouldNeedZipFileThatExists() throws Exception {
        File file = mock(File.class);
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("ZipFile must exist");
        new ZipFileSystem(file);
    }

    @Test
    public void shouldGetKeyAndPath() throws Exception {
        JailedResourcePath path = new JailedResourcePath().get("/a/b/c");
        ZipFileSystemKey key = this.zipFileSystem.getKey(path);
        JailedResourcePath actual = this.zipFileSystem.getPath(key);
        assertThat(key, is(not(nullValue())));
        assertThat(actual, is(equalTo(path)));
    }

    @Test
    public void shouldGetResourceTypeForFile() throws Exception {
        ResourceType actual = this.zipFileSystem.getResourceType(keyFor("/a/b/c.txt"));
        assertThat(actual, is(ResourceType.FILE));
    }

    @Test
    public void shouldGetResourceTypeForFolder() throws Exception {
        ResourceType actual = this.zipFileSystem.getResourceType(keyFor("/d/e/"));
        assertThat(actual, is(ResourceType.FOLDER));
    }

    @Test
    public void shouldGetResourceTypeForVirtualFolder() throws Exception {
        ResourceType actual = this.zipFileSystem.getResourceType(keyFor("/a/b"));
        assertThat(actual, is(ResourceType.FOLDER));
    }

    @Test
    public void shouldGetResourceTypeForDoesNotExist() throws Exception {
        ResourceType actual = this.zipFileSystem.getResourceType(keyFor("/a/b/d"));
        assertThat(actual, is(ResourceType.DOES_NOT_EXIST));
    }

    @Test
    public void shouldNotCreateFile() throws Exception {
        this.thrown.expect(ReadOnlyResourceException.class);
        this.thrown.expectMessage(zipErrorMessage());
        this.zipFileSystem.createFile(keyFor("/a/b/c.txt"));
    }

    @Test
    public void shouldNotCreateFolder() throws Exception {
        this.thrown.expect(ReadOnlyResourceException.class);
        this.thrown.expectMessage(zipErrorMessage());
        this.zipFileSystem.createFile(keyFor("/a/b/c.txt"));
    }

    @Test
    public void shouldList() throws Exception {
        List<String> list = asList(this.zipFileSystem.list(keyFor("/d/f/")));
        assertThat(list.size(), is(2));
        assertTrue(list.contains("g.txt"));
        assertTrue(list.contains("h"));
    }

    @Test
    public void shouldListIncludingVirtualFolder() throws Exception {
        List<String> list = asList(this.zipFileSystem.list(keyFor("/a")));
        assertThat(list.size(), is(1));
        assertTrue(list.contains("b"));
    }

    @Test
    public void shouldListFromVirtualFolder() throws Exception {
        List<String> list = asList(this.zipFileSystem.list(keyFor("/a/b")));
        assertThat(list.size(), is(1));
        assertTrue(list.contains("c.txt"));
    }

    @Test
    public void shouldGetSize() throws Exception {
        long actual = this.zipFileSystem.getSize(keyFor("/a/b/c.txt"));
        assertThat(actual, is(1L));
    }

    @Test
    public void shouldDelegateGetLastModified() throws Exception {
        long actual = this.zipFileSystem.getLastModified(keyFor("/a/b/c.txt"));
        assertThat(actual, is(this.zipFile.lastModified()));
    }

    @Test
    public void shouldGetInputStream() throws Exception {
        InputStream actual = this.zipFileSystem.getInputStream(keyFor("/a/b/c.txt"));
        assertThat(FileCopyUtils.copyToByteArray(actual), is(equalTo("c".getBytes())));
    }

    @Test
    public void shouldNotGetOutputStream() throws Exception {
        this.thrown.expect(ReadOnlyResourceException.class);
        this.thrown.expectMessage(zipErrorMessage());
        this.zipFileSystem.getOutputStream(keyFor("/a/b/c.txt"));
    }

    @Test
    public void shouldNotDelete() throws Exception {
        this.thrown.expect(ReadOnlyResourceException.class);
        this.thrown.expectMessage(zipErrorMessage());
        this.zipFileSystem.delete(keyFor("/a/b/c.txt"));
    }

    @Test
    public void shouldNotRename() throws Exception {
        this.thrown.expect(ReadOnlyResourceException.class);
        this.thrown.expectMessage(zipErrorMessage());
        this.zipFileSystem.rename(keyFor("/a/b/c.txt"), "newname");
    }

    @Test
    public void shouldReloadIfChanged() throws Exception {
        File file = FileSystemFolder.getRoot(this.zipFileSystem).getFile("a/b/c.txt");
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

    private <T> List<T> asList(Iterable<T> iterable) {
        List<T> list = new ArrayList<T>();
        for (T item : iterable) {
            list.add(item);
        }
        return list;
    }

    private ZipFileSystemKey keyFor(String path) {
        JailedResourcePath jailedPath = new JailedResourcePath(new ResourcePath(), new ResourcePath().get(path));
        return this.zipFileSystem.getKey(jailedPath);
    }

    @SuppressWarnings("unchecked")
    private Matcher<String> zipErrorMessage() {
        return allOf(startsWith("The Zip File"), endsWith("is read-only"));
    }
}
