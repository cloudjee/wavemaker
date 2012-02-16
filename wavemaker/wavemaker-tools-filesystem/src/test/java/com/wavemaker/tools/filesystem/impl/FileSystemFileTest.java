
package com.wavemaker.tools.filesystem.impl;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.io.InputStream;
import java.io.OutputStream;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

/**
 * Tests for {@link FileSystemFile}.
 * 
 * @author Phillip Webb
 */
public class FileSystemFileTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Mock
    private FileSystem<Object> fileSystem;

    private FileSystemFile<Object> file;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        Path path = new Path().get("file.txt");
        this.file = new FileSystemFile<Object>(path, this.fileSystem, path);
    }

    @Test
    public void shouldNeedPath() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Path must not be null");
        new FileSystemFile<Object>(null, this.fileSystem, new Object());
    }

    @Test
    public void shouldNeedFileSystem() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("FileSystem must not be null");
        new FileSystemFile<Object>(new Path(), null, new Object());
    }

    @Test
    public void shouldNeedKey() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Key must not be null");
        new FileSystemFile<Object>(new Path(), this.fileSystem, null);
    }

    @Test
    public void shouldGetSizeFromFileSystem() throws Exception {
        Long size = 100L;
        given(this.fileSystem.getSize(this.file.getKey())).willReturn(size);
        assertThat(this.file.getSize(), is(equalTo(size)));
        verify(this.fileSystem).getSize(this.file.getKey());
    }

    @Test
    public void shouldGetLastModifiedFromFileSystem() throws Exception {
        Long lastModified = 100L;
        given(this.fileSystem.getLastModified(this.file.getKey())).willReturn(lastModified);
        assertThat(this.file.getLastModified(), is(equalTo(lastModified)));
        verify(this.fileSystem).getLastModified(this.file.getKey());
    }

    @Test
    public void shouldGetSha1FromFileSystem() throws Exception {
        byte[] sha1 = { 1, 2, 3 };
        given(this.fileSystem.getSha1Digest(this.file.getKey())).willReturn(sha1);
        assertThat(this.file.getSha1Digest(), is(equalTo(sha1)));
        verify(this.fileSystem).getSha1Digest(this.file.getKey());
    }

    @Test
    public void shouldGetContentInputStreamFromFileSystem() throws Exception {
        InputStream inputStream = mock(InputStream.class);
        given(this.fileSystem.getInputStream(this.file.getKey())).willReturn(inputStream);
        assertThat(this.file.getContent().asInputStream(), is(inputStream));
    }

    @Test
    public void shouldGetContentOutputStreamFromFileSystem() throws Exception {
        OutputStream outputStream = mock(OutputStream.class);
        given(this.fileSystem.getOutputStream(this.file.getKey())).willReturn(outputStream);
        assertThat(this.file.getContent().asOutputStream(), is(outputStream));
    }

    @Test
    public void shouldGetContentAsAbstractContent() throws Exception {
        assertThat(this.file.getContent(), is(AbstractFileContent.class));
    }

    @Test
    public void shouldDelete() throws Exception {
        given(this.fileSystem.getResourceType(this.file.getKey())).willReturn(ResourceType.FILE);
        this.file.delete();
        verify(this.fileSystem).deleteFile(this.file.getKey());
    }

    @Test
    public void shouldNotDeleteWhenDoesNotExist() throws Exception {
        given(this.fileSystem.getResourceType(this.file.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        this.file.delete();
        verify(this.fileSystem, never()).deleteFile(this.file.getKey());
    }

    @Test
    public void shouldTouchNewFile() throws Exception {
        given(this.fileSystem.getResourceType(this.file.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        this.file.touch();
        verify(this.fileSystem).touch(this.file.getKey());
    }

    @Test
    public void shouldNotTouchExistingFile() throws Exception {
        given(this.fileSystem.getResourceType(this.file.getKey())).willReturn(ResourceType.FOLDER);
        this.file.touch();
        verify(this.fileSystem, never()).touch(this.file.getKey());
    }

    @Test
    public void shouldNotMoveIfDoesNotExist() throws Exception {
        // Folder destination = mock(Folder.class);
        // FileSystemFolder<Object> child = this.folder.getFolder("a");
        // given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        // child.moveTo(destination);
        // verifyNoMoreInteractions(destination);
    }

    @Test
    public void shouldMove() throws Exception {

    }

    @Test
    public void shouldNotCopyIfDoesNotExist() throws Exception {
        // Folder destination = mock(Folder.class);
        // FileSystemFolder<Object> child = this.folder.getFolder("a");
        // given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        // child.copyTo(destination);
        // verifyNoMoreInteractions(destination);
    }

    @Test
    public void shouldCopy() throws Exception {
        // Folder destination = mock(Folder.class);
        // Folder destinationChild = mock(Folder.class);
        // Folder destinationGrandchild = mock(Folder.class);
        // FileSystemFolder<Object> child = this.folder.getFolder("a");
        // FileSystemFolder<Object> grandchild = child.getFolder("b");
        // given(this.fileSystem.getResourceType(child.getKey())).willReturn(ResourceType.FOLDER);
        // given(this.fileSystem.getResourceType(grandchild.getKey())).willReturn(ResourceType.FOLDER);
        // given(this.fileSystem.list(child.getKey())).willReturn(Collections.singleton(grandchild.getKey()));
        // given(destination.getFolder("a")).willReturn(destinationChild);
        // given(destinationChild.getFolder("b")).willReturn(destinationGrandchild);
        // child.copyTo(destination);
        // verify(destinationGrandchild).touch();
    }

    @Test
    public void shouldHaveToString() throws Exception {
        assertThat(this.file.toString(), is("/file.txt"));
    }

}
