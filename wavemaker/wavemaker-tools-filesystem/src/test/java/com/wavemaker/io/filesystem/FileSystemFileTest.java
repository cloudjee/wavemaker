
package com.wavemaker.io.filesystem;

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
import org.junit.Test;

import com.wavemaker.io.AbstractFileContent;
import com.wavemaker.io.File;
import com.wavemaker.io.FileContent;
import com.wavemaker.io.Folder;
import com.wavemaker.io.ResourcePath;
import com.wavemaker.io.exception.ResourceDoesNotExistException;

/**
 * Tests for {@link FileSystemFile}.
 * 
 * @author Phillip Webb
 */
public class FileSystemFileTest extends AbstractFileSystemResourceTest {

    private FileSystemFile<Object> file;

    @Before
    @Override
    public void setup() {
        super.setup();
        ResourcePath path = new ResourcePath().get("file.txt");
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
        new FileSystemFile<Object>(new ResourcePath(), null, new Object());
    }

    @Test
    public void shouldNeedKey() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Key must not be null");
        new FileSystemFile<Object>(new ResourcePath(), this.fileSystem, null);
    }

    @Test
    public void shouldNotCreateFolderFromFile() throws Exception {
        ResourcePath path = new ResourcePath().get("a");
        given(this.fileSystem.getResourceType(path)).willReturn(ResourceType.FOLDER);
        this.thrown.expect(IllegalStateException.class);
        this.thrown.expectMessage("Unable to access existing folder '/a' as a file");
        new FileSystemFile<Object>(path, this.fileSystem, path);

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
        verify(this.fileSystem).delete(this.file.getKey());
    }

    @Test
    public void shouldNotDeleteWhenDoesNotExist() throws Exception {
        given(this.fileSystem.getResourceType(this.file.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        this.file.delete();
        verify(this.fileSystem, never()).delete(this.file.getKey());
    }

    @Test
    public void shouldTouchNewFile() throws Exception {
        given(this.fileSystem.getResourceType(this.file.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        this.file.touch();
        verify(this.fileSystem).createFile(this.file.getKey());
    }

    @Test
    public void shouldNotTouchExistingFile() throws Exception {
        given(this.fileSystem.getResourceType(this.file.getKey())).willReturn(ResourceType.FOLDER);
        this.file.touch();
        verify(this.fileSystem, never()).createFile(this.file.getKey());
    }

    @Test
    public void shouldNotMoveIfDoesNotExist() throws Exception {
        Folder destination = mock(Folder.class);
        given(this.fileSystem.getResourceType(this.file.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        this.thrown.expect(ResourceDoesNotExistException.class);
        this.file.moveTo(destination);
    }

    @Test
    public void shouldMove() throws Exception {
        Folder destination = mock(Folder.class);
        File destinationFile = mock(File.class);
        FileContent destinationContent = mock(FileContent.class);
        InputStream inputStream = mock(InputStream.class);
        given(destination.getFile("file.txt")).willReturn(destinationFile);
        given(destinationFile.getContent()).willReturn(destinationContent);
        given(this.fileSystem.getResourceType(this.file.getKey())).willReturn(ResourceType.FILE);
        given(this.fileSystem.getInputStream(this.file.getKey())).willReturn(inputStream);
        this.file.moveTo(destination);
        verify(destinationContent).write(inputStream);
        verify(this.fileSystem).delete(this.file.getKey());
    }

    @Test
    public void shouldNotCopyIfDoesNotExist() throws Exception {
        Folder destination = mock(Folder.class);
        given(this.fileSystem.getResourceType(this.file.getKey())).willReturn(ResourceType.DOES_NOT_EXIST);
        this.thrown.expect(ResourceDoesNotExistException.class);
        this.file.copyTo(destination);
    }

    @Test
    public void shouldCopy() throws Exception {
        Folder destination = mock(Folder.class);
        File destinationFile = mock(File.class);
        FileContent destinationContent = mock(FileContent.class);
        InputStream inputStream = mock(InputStream.class);
        given(destination.getFile("file.txt")).willReturn(destinationFile);
        given(destinationFile.getContent()).willReturn(destinationContent);
        given(this.fileSystem.getResourceType(this.file.getKey())).willReturn(ResourceType.FILE);
        given(this.fileSystem.getInputStream(this.file.getKey())).willReturn(inputStream);
        this.file.copyTo(destination);
        verify(destinationContent).write(inputStream);
        verify(this.fileSystem, never()).delete(this.file.getKey());
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
    public void shouldHaveToString() throws Exception {
        assertThat(this.file.toString(), is("/file.txt"));
    }
}
