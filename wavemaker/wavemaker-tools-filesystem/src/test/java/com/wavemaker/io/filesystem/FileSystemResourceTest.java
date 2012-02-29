
package com.wavemaker.io.filesystem;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.wavemaker.io.Folder;
import com.wavemaker.io.Resource;
import com.wavemaker.io.ResourcePath;
import com.wavemaker.io.exception.ResourceExistsException;

/**
 * Tests for {@link FileSystemResource}.
 * 
 * @author Phillip Webb
 */
@RunWith(MockitoJUnitRunner.class)
public class FileSystemResourceTest {

    @Mock
    private FileSystem<Object> fileSystem1;

    @Mock
    private FileSystem<Object> fileSystem2;

    private final ResourcePath path1a = new ResourcePath().get("path1");

    private final ResourcePath path1b = new ResourcePath().get("path1");

    private final ResourcePath path2 = new ResourcePath().get("path2");

    private final Object key = new Object();

    @Test
    public void shouldEqualIfUsingSameFileSystemAndPath() throws Exception {
        FileSystemResource<Object> resource1 = new MockFileSystemResource(this.path1a, this.fileSystem1, this.key);
        FileSystemResource<Object> resource2 = new MockFileSystemResource(this.path1b, this.fileSystem1, this.key);
        assertThat(resource1, is(equalTo(resource2)));
    }

    @Test
    public void shouldNotEqualIfDifferentFileSystem() throws Exception {
        FileSystemResource<Object> resource1 = new MockFileSystemResource(this.path1a, this.fileSystem1, this.key);
        FileSystemResource<Object> resource2 = new MockFileSystemResource(this.path1b, this.fileSystem2, this.key);
        assertThat(resource1, is(not(equalTo(resource2))));
    }

    @Test
    public void shouldNotEqualIfDifferentPath() throws Exception {
        FileSystemResource<Object> resource1 = new MockFileSystemResource(this.path1a, this.fileSystem1, this.key);
        FileSystemResource<Object> resource2 = new MockFileSystemResource(this.path2, this.fileSystem1, this.key);
        assertThat(resource1, is(not(equalTo(resource2))));
    }

    private static class MockFileSystemResource extends FileSystemResource<Object> {

        MockFileSystemResource(ResourcePath path, FileSystem<Object> fileSystem, Object key) {
            super(path, fileSystem, key);
        }

        @Override
        public void touch() {
        }

        @Override
        public void delete() {
        }

        @Override
        public Resource moveTo(Folder folder) {
            return null;
        }

        @Override
        public Resource copyTo(Folder folder) {
            return null;
        }

        @Override
        public Resource rename(String name) throws ResourceExistsException {
            return null;
        }
    }
}
