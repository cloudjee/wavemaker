
package com.wavemaker.tools.filesystem.impl;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.wavemaker.tools.filesystem.MutableFile;
import com.wavemaker.tools.filesystem.MutableFolder;

public class FileSystemMutableFolderTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Mock
    private FileSystem<Object> fileSystem;

    @Mock
    private Object root;

    private FileSystemMutableFolder<Object> folder;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.folder = new FileSystemMutableFolder<Object>(this.fileSystem, this.root, new Path());
        // FIXME how to create + null path check
    }

    @Test
    public void shouldNeedFileSystem() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("FileSystem must not be null");
        new FileSystemMutableFolder<Object>(null, new Object(), null);
    }

    @Test
    public void shouldNeedRoot() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Root must not be null");
        new FileSystemMutableFolder<Object>(this.fileSystem, null, null);
    }

    @Test
    public void shouldCreateWithNoParent() throws Exception {
        assertThat(this.folder.getParent(), is(nullValue()));
    }

    @Test
    public void shouldDelete() throws Exception {
        given(this.fileSystem.exists(this.root, this.folder.getPath())).willReturn(true);
        this.folder.delete();
        verify(this.fileSystem).deleteFolder(this.root, this.folder.getPath());
    }

    @Test
    public void shouldNotDeleteWhenDoesNotExist() throws Exception {
        given(this.fileSystem.exists(this.root, this.folder.getPath())).willReturn(false);
        this.folder.delete();
        verify(this.fileSystem, never()).deleteFolder(this.root, this.folder.getPath());
    }

    @Test
    public void shouldGetParent() throws Exception {
        MutableFolder parent = this.folder.getFolder("a/b").getParent();
        assertThat(parent.getName(), is("a"));
        assertThat(parent.toString(), is("/a/"));
    }

    @Test
    public void shouldCreateWithNoName() throws Exception {
        assertThat(this.folder.getName(), is(""));
    }

    @Test
    public void shouldCreateWithPathName() throws Exception {
        assertThat(this.folder.toString(), is("/"));
    }

    @Test
    public void shouldDelegateToFileSystemForExists() throws Exception {
        Path path = new Path();
        given(this.fileSystem.exists(this.root, path)).willReturn(true);
        assertThat(this.folder.exists(), is(true));
        verify(this.fileSystem).exists(this.root, path);
    }

    @Test
    public void shouldGetChildFolder() throws Exception {
        MutableFolder child = this.folder.getFolder("a");
        assertThat(child.getName(), is("a"));
        assertThat(child.toString(), is("/a/"));
    }

    @Test
    public void shouldGetNestedChildFolder() throws Exception {
        MutableFolder child = this.folder.getFolder("a/b");
        assertThat(child.getName(), is("b"));
        assertThat(child.toString(), is("/a/b/"));
    }

    @Test
    public void shouldGetRelativeChildFolder() throws Exception {
        MutableFolder child = this.folder.getFolder("a/b/../c");
        assertThat(child.getName(), is("c"));
        assertThat(child.toString(), is("/a/c/"));
    }

    @Test
    public void shouldGetNestedChildFile() throws Exception {
        MutableFile child = this.folder.getFile("a/b");
        assertThat(child.getName(), is("b"));
        assertThat(child.toString(), is("/a/b"));
    }

    @Test
    public void shouldGetRelativeChildFile() throws Exception {
        MutableFile child = this.folder.getFile("a/b/../c");
        assertThat(child.getName(), is("c"));
        assertThat(child.toString(), is("/a/c"));
    }

    @Test
    public void shouldTouchNewDirectory() throws Exception {
        FileSystemMutableFolder<Object> child = this.folder.getFolder("a");
        child.touch();
        verify(this.fileSystem).mkDirs(this.root, child.getPath());
    }

    @Test
    public void shouldNotTouchExistingDirectory() throws Exception {
        FileSystemMutableFolder<Object> child = this.folder.getFolder("a");
        given(this.fileSystem.exists(this.root, child.getPath())).willReturn(true);
        child.touch();
        verify(this.fileSystem, never()).mkDirs(this.root, child.getPath());
    }

    @Test
    public void shouldListResources() throws Exception {

    }

    @Test
    public void shouldNeedListResourcesFilter() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Filter must not be null");
        this.folder.list(null);
    }
}
