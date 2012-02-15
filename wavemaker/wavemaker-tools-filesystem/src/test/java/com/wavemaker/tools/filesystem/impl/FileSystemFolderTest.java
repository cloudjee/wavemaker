
package com.wavemaker.tools.filesystem.impl;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import com.wavemaker.tools.filesystem.File;
import com.wavemaker.tools.filesystem.Folder;

public class FileSystemFolderTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Mock
    private FileSystem<Object> fileSystem;

    private FileSystemFolder<Object> folder;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.folder = new FileSystemFolder<Object>(new Path(), this.fileSystem, new Path());
        given(this.fileSystem.getKey(any(Path.class))).willAnswer(new Answer<Object>() {

            @Override
            public Object answer(InvocationOnMock invocation) throws Throwable {
                return invocation.getArguments()[0];
            }
        });
    }

    // FIXME
    // @Test
    // public void shouldNeedFileSystem() throws Exception {
    // this.thrown.expect(IllegalArgumentException.class);
    // this.thrown.expectMessage("FileSystem must not be null");
    // new FileSystemFolder<Object>(new Object(), null, null);
    // }
    //
    // @Test
    // public void shouldNeedRoot() throws Exception {
    // this.thrown.expect(IllegalArgumentException.class);
    // this.thrown.expectMessage("Root must not be null");
    // new FileSystemFolder<Object>(this.fileSystem, null, null);
    // }

    @Test
    public void shouldCreateWithNoParent() throws Exception {
        assertThat(this.folder.getParent(), is(nullValue()));
    }

    @Test
    public void shouldDelete() throws Exception {
        given(this.fileSystem.exists(this.folder.getKey())).willReturn(true);
        this.folder.delete();
        verify(this.fileSystem).deleteFolder(this.folder.getKey());
    }

    @Test
    public void shouldNotDeleteWhenDoesNotExist() throws Exception {
        given(this.fileSystem.exists(this.folder.getKey())).willReturn(false);
        this.folder.delete();
        verify(this.fileSystem, never()).deleteFolder(this.folder.getKey());
    }

    @Test
    public void shouldGetParent() throws Exception {
        Folder parent = this.folder.getFolder("a/b").getParent();
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
        given(this.fileSystem.exists(this.folder.getKey())).willReturn(true);
        assertThat(this.folder.exists(), is(true));
        verify(this.fileSystem).exists(this.folder.getKey());
    }

    @Test
    public void shouldGetChildFolder() throws Exception {
        Folder child = this.folder.getFolder("a");
        assertThat(child.getName(), is("a"));
        assertThat(child.toString(), is("/a/"));
    }

    @Test
    public void shouldGetNestedChildFolder() throws Exception {
        Folder child = this.folder.getFolder("a/b");
        assertThat(child.getName(), is("b"));
        assertThat(child.toString(), is("/a/b/"));
    }

    @Test
    public void shouldGetRelativeChildFolder() throws Exception {
        Folder child = this.folder.getFolder("a/b/../c");
        assertThat(child.getName(), is("c"));
        assertThat(child.toString(), is("/a/c/"));
    }

    @Test
    public void shouldGetNestedChildFile() throws Exception {
        File child = this.folder.getFile("a/b");
        assertThat(child.getName(), is("b"));
        assertThat(child.toString(), is("/a/b"));
    }

    @Test
    public void shouldGetRelativeChildFile() throws Exception {
        File child = this.folder.getFile("a/b/../c");
        assertThat(child.getName(), is("c"));
        assertThat(child.toString(), is("/a/c"));
    }

    @Test
    public void shouldTouchNewDirectory() throws Exception {
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        child.touch();
        verify(this.fileSystem).mkDirs(child.getKey());
    }

    @Test
    public void shouldNotTouchExistingDirectory() throws Exception {
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        given(this.fileSystem.exists(child.getKey())).willReturn(true);
        child.touch();
        verify(this.fileSystem, never()).mkDirs(child.getKey());
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
