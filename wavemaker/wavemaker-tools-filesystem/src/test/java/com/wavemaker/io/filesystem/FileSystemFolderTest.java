
package com.wavemaker.io.filesystem;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;

import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;

import org.junit.Before;
import org.junit.Test;

import com.wavemaker.io.File;
import com.wavemaker.io.Folder;
import com.wavemaker.io.Resource;
import com.wavemaker.io.ResourceFilter;
import com.wavemaker.io.Resources;

/**
 * Tests for {@link FileSystemFolder}.
 * 
 * @author Phillip Webb
 */
public class FileSystemFolderTest extends AbstractFileSystemResourceTest {

    private FileSystemFolder<Object> folder;

    @Before
    @Override
    public void setup() {
        super.setup();
        this.folder = new FileSystemFolder<Object>(new FileSystemPath(), this.fileSystem, new FileSystemPath());
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
        new FileSystemFolder<Object>(new FileSystemPath(), null, new Object());
    }

    @Test
    public void shouldNeedKey() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Key must not be null");
        new FileSystemFolder<Object>(new FileSystemPath(), this.fileSystem, null);
    }

    @Test
    public void shouldNotCreateFolderFromFile() throws Exception {
        given(this.fileSystem.getResourceType(new FileSystemPath().get("a"))).willReturn(ResourceType.FILE);
        this.thrown.expect(IllegalStateException.class);
        this.thrown.expectMessage("Unable to access existing file '/a' as a folder");
        this.folder.getFolder("a");
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
        given(this.fileSystem.getResourceType(this.folder.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        this.folder.delete();
        verify(this.fileSystem, never()).deleteFolder(this.folder.getKey());
    }

    @Test
    public void shouldDeleteChildren() throws Exception {
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        given(this.fileSystem.getResourceType(this.folder.getKey())).willReturn(ResourceType.FOLDER);
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.FOLDER);
        given(this.fileSystem.list(this.folder.getKey())).willReturn(Collections.singleton(child.getKey()));
        this.folder.delete();
        verify(this.fileSystem).deleteFolder(child.getKey());
        verify(this.fileSystem).deleteFolder(this.folder.getKey());
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
        verify(this.fileSystem, times(2)).getResourceType(this.folder.getKey());
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
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
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
    public void shouldTouchParent() throws Exception {
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        FileSystemFolder<Object> grandChild = child.getFolder("b");
        given(this.fileSystem.getResourceType(grandChild.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        grandChild.touch();
        verify(this.fileSystem).mkDir(grandChild.getKey());
        verify(this.fileSystem).mkDir(child.getKey());
    }

    @Test
    public void shouldListResources() throws Exception {
        FileSystemPath pathA = new FileSystemPath().get("a");
        FileSystemPath pathB = new FileSystemPath().get("b");
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
        FileSystemPath pathA = new FileSystemPath().get("a");
        FileSystemPath pathB = new FileSystemPath().get("b");
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

    @Test
    public void shouldMoveWithoutChildren() throws Exception {
        Folder destination = mock(Folder.class);
        Folder destinationChild = mock(Folder.class);
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.FOLDER);
        given(destination.getFolder("a")).willReturn(destinationChild);
        child.moveTo(destination);
        verify(destination).getFolder("a");
        verify(destinationChild).touch();
    }

    @Test
    public void shouldNotMoveIfDoesNotExist() throws Exception {
        Folder destination = mock(Folder.class);
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        child.moveTo(destination);
        verifyZeroInteractions(destination);
    }

    @Test
    public void shouldNotMoveRoot() throws Exception {
        Folder destination = mock(Folder.class);
        this.thrown.expect(IllegalStateException.class);
        this.thrown.expectMessage("Unable to move a root folder");
        this.folder.moveTo(destination);
    }

    @Test
    public void shouldMoveChildren() throws Exception {
        Folder destination = mock(Folder.class);
        Folder destinationChild = mock(Folder.class);
        Folder destinationGrandchild = mock(Folder.class);
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        FileSystemFolder<Object> grandchild = child.getFolder("b");
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.FOLDER);
        given(this.fileSystem.getResourceType(grandchild.getKey())).willReturn(ResourceType.FOLDER);
        given(this.fileSystem.list(child.getKey())).willReturn(Collections.singleton(grandchild.getKey()));
        given(destination.getFolder("a")).willReturn(destinationChild);
        given(destinationChild.getFolder("b")).willReturn(destinationGrandchild);
        child.moveTo(destination);
        verify(destinationGrandchild).touch();
    }

    @Test
    public void shouldCopyWithoutChildren() throws Exception {
        Folder destination = mock(Folder.class);
        Folder destinationChild = mock(Folder.class);
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.FOLDER);
        given(destination.getFolder("a")).willReturn(destinationChild);
        child.copyTo(destination);
        verify(destination).getFolder("a");
        verify(destinationChild).touch();
    }

    @Test
    public void shouldNotCopyIfDoesNotExist() throws Exception {
        Folder destination = mock(Folder.class);
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        child.copyTo(destination);
        verifyZeroInteractions(destination);
    }

    @Test
    public void shouldNotCopyRoot() throws Exception {
        Folder destination = mock(Folder.class);
        this.thrown.expect(IllegalStateException.class);
        this.thrown.expectMessage("Unable to copy a root folder");
        this.folder.copyTo(destination);
    }

    @Test
    public void shouldCopyChildren() throws Exception {
        Folder destination = mock(Folder.class);
        Folder destinationChild = mock(Folder.class);
        Folder destinationGrandchild = mock(Folder.class);
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        FileSystemFolder<Object> grandchild = child.getFolder("b");
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.FOLDER);
        given(this.fileSystem.getResourceType(grandchild.getKey())).willReturn(ResourceType.FOLDER);
        given(this.fileSystem.list(child.getKey())).willReturn(Collections.singleton(grandchild.getKey()));
        given(destination.getFolder("a")).willReturn(destinationChild);
        given(destinationChild.getFolder("b")).willReturn(destinationGrandchild);
        child.copyTo(destination);
        verify(destinationGrandchild).touch();
    }

    @Test
    public void shouldAppendPathToToString() throws Exception {
        FileSystemFolder<Object> child = this.folder.getFolder("a/b/c");
        assertThat(child.toString(), is("/a/b/c/"));
    }
}
