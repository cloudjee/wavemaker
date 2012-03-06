
package com.wavemaker.tools.io.filesystem;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourceFilter;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.io.exception.ResourceDoesNotExistException;
import com.wavemaker.tools.io.exception.ResourceTypeMismatchException;

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
        this.folder = new FileSystemFolder<Object>(new JailedResourcePath(), this.fileSystem, new JailedResourcePath());
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
        new FileSystemFolder<Object>(new JailedResourcePath(), null, new Object());
    }

    @Test
    public void shouldNeedKey() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Key must not be null");
        new FileSystemFolder<Object>(new JailedResourcePath(), this.fileSystem, null);
    }

    @Test
    public void shouldNotCreateFolderFromFile() throws Exception {
        given(this.fileSystem.getResourceType(new JailedResourcePath().get("a"))).willReturn(ResourceType.FILE);
        this.thrown.expect(ResourceTypeMismatchException.class);
        this.thrown.expectMessage("Unable to access resource '/a' as folder due to existing file");
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
        verify(this.fileSystem).delete(this.folder.getKey());
    }

    @Test
    public void shouldNotDeleteWhenDoesNotExist() throws Exception {
        given(this.fileSystem.getResourceType(this.folder.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        this.folder.delete();
        verify(this.fileSystem, never()).delete(this.folder.getKey());
    }

    @Test
    public void shouldDeleteChildren() throws Exception {
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        given(this.fileSystem.getResourceType(this.folder.getKey())).willReturn(ResourceType.FOLDER);
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.FOLDER);
        given(this.fileSystem.list(this.folder.getKey())).willReturn(Collections.singleton("a"));
        this.folder.delete();
        verify(this.fileSystem).delete(child.getKey());
        verify(this.fileSystem).delete(this.folder.getKey());
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
    public void shouldGetExistingFile() throws Exception {
        given(this.fileSystem.getResourceType(this.folder.getPath().get("a"))).willReturn(ResourceType.FILE);
        Resource child = this.folder.getExisting("a");
        assertThat(child, is(File.class));
        assertThat(child.getName(), is("a"));
        assertThat(child.toString(), is("/a"));
    }

    @Test
    public void shouldGetExistingFolder() throws Exception {
        given(this.fileSystem.getResourceType(this.folder.getPath().get("a"))).willReturn(ResourceType.FOLDER);
        Resource child = this.folder.getExisting("a");
        assertThat(child, is(Folder.class));
        assertThat(child.getName(), is("a"));
        assertThat(child.toString(), is("/a/"));
    }

    @Test
    public void shouldNotGetExistingIfDoesNotExist() throws Exception {
        given(this.fileSystem.getResourceType(this.folder.getPath().get("a"))).willReturn(ResourceType.DOES_NOT_EXIST);
        this.thrown.expect(ResourceDoesNotExistException.class);
        this.thrown.expectMessage("The resource 'a' does not exist in the folder '/'");
        this.folder.getExisting("a");
    }

    @Test
    public void shouldHaveExistingFile() throws Exception {
        given(this.fileSystem.getResourceType(this.folder.getPath().get("a"))).willReturn(ResourceType.FOLDER);
        boolean actual = this.folder.hasExisting("a");
        assertThat(actual, is(true));
    }

    @Test
    public void shouldNotHaveExistingFileIfDoesNotExist() throws Exception {
        given(this.fileSystem.getResourceType(this.folder.getPath().get("a"))).willReturn(ResourceType.DOES_NOT_EXIST);
        boolean actual = this.folder.hasExisting("a");
        assertThat(actual, is(false));
    }

    @Test
    public void shouldTouchNewDirectory() throws Exception {
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        child.touch();
        verify(this.fileSystem).createFolder(child.getKey());
    }

    @Test
    public void shouldNotTouchExistingDirectory() throws Exception {
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.FOLDER);
        child.touch();
        verify(this.fileSystem, never()).createFolder(child.getKey());
    }

    @Test
    public void shouldTouchParent() throws Exception {
        FileSystemFolder<Object> child = this.folder.getFolder("a");
        FileSystemFolder<Object> grandChild = child.getFolder("b");
        given(this.fileSystem.getResourceType(grandChild.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        grandChild.touch();
        verify(this.fileSystem).createFolder(grandChild.getKey());
        verify(this.fileSystem).createFolder(child.getKey());
    }

    @Test
    public void shouldListResources() throws Exception {
        JailedResourcePath pathA = new JailedResourcePath().get("a");
        JailedResourcePath pathB = new JailedResourcePath().get("b");
        given(this.fileSystem.list(this.folder.getKey())).willReturn(Arrays.asList("a", "b"));
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
        JailedResourcePath pathA = new JailedResourcePath().get("a");
        JailedResourcePath pathB = new JailedResourcePath().get("b");
        given(this.fileSystem.list(this.folder.getKey())).willReturn(Arrays.asList("a", "b"));
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
        this.thrown.expect(ResourceDoesNotExistException.class);
        child.moveTo(destination);
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
        given(this.fileSystem.list(child.getKey())).willReturn(Collections.singleton("b"));
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
        this.thrown.expect(ResourceDoesNotExistException.class);
        child.copyTo(destination);
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
        given(this.fileSystem.list(child.getKey())).willReturn(Collections.singleton("b"));
        given(destination.getFolder("a")).willReturn(destinationChild);
        given(destinationChild.getFolder("b")).willReturn(destinationGrandchild);
        child.copyTo(destination);
        verify(destinationGrandchild).touch();
    }

    @Test
    public void shouldRename() throws Exception {
        // FIXME
    }

    @Test
    public void shouldNotRenameIfDoesNotExist() throws Exception {
        // FIXME
    }

    @Test
    public void shouldNotRenameIfNameInUse() throws Exception {
        // FIXME
    }

    @Test
    public void shouldAppendPathToToString() throws Exception {
        FileSystemFolder<Object> child = this.folder.getFolder("a/b/c");
        assertThat(child.toString(), is("/a/b/c/"));
    }

    @Test
    public void shouldNeedNameForGet() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Name must not be empty");
        this.folder.get("", File.class);
    }

    @Test
    public void shouldNeedTypeForGet() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("ResourceType must not be null");
        this.folder.get("name", null);
    }

    @Test
    public void shouldGetFile() throws Exception {
        this.folder = spy(this.folder);
        this.folder.get("name", File.class);
        verify(this.folder).getFile("name");
    }

    @Test
    public void shouldGetFolder() throws Exception {
        this.folder = spy(this.folder);
        this.folder.get("name", Folder.class);
        verify(this.folder).getFolder("name");
    }

    @Test
    public void shouldGetResource() throws Exception {
        given(this.fileSystem.getResourceType(this.folder.getPath().get("name"))).willReturn(ResourceType.FILE);
        this.folder = spy(this.folder);
        this.folder.get("name", Resource.class);
        verify(this.folder).getExisting("name");
    }

    @Test
    public void shouldNeedUnzipInputStream() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("InputStream must not be null");
        this.folder.unzip((InputStream) null);
    }

    @Test
    public void shouldUnzip() throws Exception {
        ByteArrayOutputStream outputStreamB = new ByteArrayOutputStream();
        ByteArrayOutputStream outputStreamD = new ByteArrayOutputStream();
        given(this.fileSystem.getResourceType(any())).willReturn(ResourceType.DOES_NOT_EXIST);
        given(this.fileSystem.getOutputStream(new JailedResourcePath().get("a/b.txt"))).willReturn(outputStreamB);
        given(this.fileSystem.getOutputStream(new JailedResourcePath().get("c/d.txt"))).willReturn(outputStreamD);
        InputStream zipStream = getSampleZip();
        this.folder.unzip(zipStream);
        verify(this.fileSystem, atLeastOnce()).createFolder(new JailedResourcePath().get("a"));
        verify(this.fileSystem, atLeastOnce()).getResourceType(new JailedResourcePath().get("a/b.txt"));
        assertThat(new String(outputStreamB.toByteArray()), is("ab"));
        verify(this.fileSystem, atLeastOnce()).createFolder(new JailedResourcePath().get("c"));
        verify(this.fileSystem, atLeastOnce()).getResourceType(new JailedResourcePath().get("c/d.txt"));
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
    public void shouldJail() throws Exception {
        Folder jailed = this.folder.getFolder("a").jail();
        Folder sub = jailed.getFolder("/b");
        assertThat(sub.toString(), is("/b/"));
    }
}
