
package com.wavemaker.tools.io.store;

import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;

import java.util.HashMap;
import java.util.Map;

import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.Resource;

public class MockStoredFolder extends StoredFolder {

    private final Map<JailedResourcePath, MockStoredFolder> childFolders;

    private final Map<JailedResourcePath, MockStoredFile> childFiles;

    private final FolderStore store;

    public MockStoredFolder() {
        this(new JailedResourcePath(), new HashMap<JailedResourcePath, MockStoredFolder>(), new HashMap<JailedResourcePath, MockStoredFile>());
    }

    public MockStoredFolder(JailedResourcePath path, Map<JailedResourcePath, MockStoredFolder> childFolders,
        Map<JailedResourcePath, MockStoredFile> childFiles) {
        this.childFolders = childFolders;
        this.childFiles = childFiles;
        this.store = mock(FolderStore.class);
        given(this.store.getPath()).willReturn(path);
        given(this.store.getFolder(any(JailedResourcePath.class))).willAnswer(new Answer<Folder>() {

            @Override
            public Folder answer(InvocationOnMock invocation) throws Throwable {
                JailedResourcePath path = (JailedResourcePath) invocation.getArguments()[0];
                MockStoredFolder child = MockStoredFolder.this.childFolders.get(path);
                if (child == null) {
                    child = new MockStoredFolder(path, MockStoredFolder.this.childFolders, MockStoredFolder.this.childFiles);
                    MockStoredFolder.this.childFolders.put(path, child);
                }
                return child;
            }
        });

        given(this.store.getFile(any(JailedResourcePath.class))).willAnswer(new Answer<File>() {

            @Override
            public File answer(InvocationOnMock invocation) throws Throwable {
                JailedResourcePath path = (JailedResourcePath) invocation.getArguments()[0];
                MockStoredFile child = MockStoredFolder.this.childFiles.get(path);
                if (child == null) {
                    child = new MockStoredFile(path);
                    MockStoredFolder.this.childFiles.put(path, child);
                }
                return child;
            }
        });

        given(this.store.getExisting(any(JailedResourcePath.class))).willAnswer(new Answer<Resource>() {

            @Override
            public Resource answer(InvocationOnMock invocation) throws Throwable {
                JailedResourcePath path = (JailedResourcePath) invocation.getArguments()[0];
                Resource resource = MockStoredFolder.this.childFolders.get(path);
                if (resource != null) {
                    return resource;
                }
                return MockStoredFolder.this.childFiles.get(path);
            }
        });

    }

    @Override
    public FolderStore getStore() {
        return this.store;
    }

    @Override
    public MockStoredFolder getFolder(String name) {
        return (MockStoredFolder) super.getFolder(name);
    }

    public MockStoredFolder getFolder(String name, boolean exists) {
        MockStoredFolder folder = getFolder(name);
        given(folder.getStore().exists()).willReturn(exists);
        return folder;
    }

    @Override
    public MockStoredFile getFile(String name) {
        return (MockStoredFile) super.getFile(name);
    }

    public MockStoredFile getFile(String name, boolean exists) {
        MockStoredFile file = getFile(name);
        given(file.getStore().exists()).willReturn(exists);
        return file;
    }

    public static class MockStoredFile extends StoredFile {

        private final FileStore store;

        public MockStoredFile(JailedResourcePath path) {
            this.store = mock(FileStore.class);
            given(this.store.getPath()).willReturn(path);
        }

        @Override
        public FileStore getStore() {
            return this.store;
        }
    }

}
