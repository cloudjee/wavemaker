
package com.wavemaker.tools.io.filesystem;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.exception.ResourceExistsException;

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

    private final JailedResourcePath path1a = new JailedResourcePath().get("path1");

    private final JailedResourcePath path1b = new JailedResourcePath().get("path1");

    private final JailedResourcePath path2 = new JailedResourcePath().get("path2");

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

        MockFileSystemResource(JailedResourcePath path, FileSystem<Object> fileSystem, Object key) {
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
