
package com.wavemaker.tools.filesystem.impl;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.util.Arrays;
import java.util.Iterator;

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
import com.wavemaker.tools.filesystem.Resource;
import com.wavemaker.tools.filesystem.ResourceFilter;
import com.wavemaker.tools.filesystem.Resources;

/**
 * Tests for {@link FileSystemFolder}.
 * 
 * @author Phillip Webb
 */
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
        given(this.fileSystem.getPath(any(Object.class))).willAnswer(new Answer<Path>() {

            @Override
            public Path answer(InvocationOnMock invocation) throws Throwable {
                return (Path) invocation.getArguments()[0];
            }
        });
    }

    @Test
    public void shouldNeedPath() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Path must not be null");
        new FileSystemFolder<Object>(null, this.fileSystem, new Object());
    }

    @Test
    public void shouldNeedFileSystem() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("FileSystem must not be null");
        new FileSystemFolder<Object>(new Path(), null, new Object());
    }

    @Test
    public void shouldNeedKey() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Key must not be null");
        new FileSystemFolder<Object>(new Path(), this.fileSystem, null);
    }

    @Test
    public void shouldCreateWithNoParent() throws Exception {
        assertThat(this.folder.getParent(), is(nullValue()));
    }

    @Test
    public void shouldDelete() throws Exception {
        given(this.fileSystem.getResourceType(this.folder.getKey())).willReturn(ResourceType.FOLDER);
        this.folder.delete();
        verify(this.fileSystem).deleteFolder(this.folder.getKey());
    }

    @Test
    public void shouldNotDeleteWhenDoesNotExist() throws Exception {
        given(this.fileSystem.getResourceType(this.folder.getKey())).willReturn(ResourceType.UNKNOWN);
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
        given(this.fileSystem.getResourceType(this.folder.getKey())).willReturn(ResourceType.FOLDER);
        assertThat(this.folder.exists(), is(true));
        verify(this.fileSystem).getResourceType(this.folder.getKey());
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
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.UNKNOWN);
        child.touch();
        verify(this.fileSystem).mkDir(child.getKey());
    }

    @Test
    public void shouldNotTouchExistingDirectory() throws Exception {
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.FOLDER);
        child.touch();
        verify(this.fileSystem, never()).mkDir(child.getKey());
    }

    @Test
    public void shouldListResources() throws Exception {
        Path pathA = new Path().get("a");
        Path pathB = new Path().get("b");
        given(this.fileSystem.list(this.folder.getKey())).willReturn(Arrays.<Object> asList(pathA, pathB));
        given(this.fileSystem.getResourceType(pathA)).willReturn(ResourceType.FOLDER);
        given(this.fileSystem.getResourceType(pathB)).willReturn(ResourceType.FILE);
        Resources<Resource> resources = this.folder.list();
        Iterator<Resource> iterator = resources.iterator();
        Resource resourceA = iterator.next();
        Resource resourceB = iterator.next();
        assertThat(iterator.hasNext(), is(false));
        assertThat(resourceA, is(Folder.class));
        assertThat(resourceB, is(File.class));
        assertThat(resourceA.toString(), is("/a/"));
        assertThat(resourceB.toString(), is("/b"));
    }

    @Test
    public void shouldListFilteredResources() throws Exception {
        Path pathA = new Path().get("a");
        Path pathB = new Path().get("b");
        given(this.fileSystem.list(this.folder.getKey())).willReturn(Arrays.<Object> asList(pathA, pathB));
        given(this.fileSystem.getResourceType(pathA)).willReturn(ResourceType.FOLDER);
        given(this.fileSystem.getResourceType(pathB)).willReturn(ResourceType.FILE);
        Resources<File> resources = this.folder.list(ResourceFilter.FILES);
        Iterator<File> iterator = resources.iterator();
        File file = iterator.next();
        assertThat(iterator.hasNext(), is(false));
        assertThat(file.toString(), is("/b"));
    }

    @Test
    public void shouldNeedListResourcesFilter() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Filter must not be null");
        this.folder.list(null);
    }
}
