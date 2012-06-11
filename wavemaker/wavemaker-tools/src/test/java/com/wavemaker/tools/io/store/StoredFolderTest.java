
package com.wavemaker.tools.io.store;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.InOrder;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.FileContent;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Including;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourceIncludeFilter;
import com.wavemaker.tools.io.ResourceOperation;
import com.wavemaker.tools.io.ResourceStringFormat;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.io.exception.ResourceDoesNotExistException;

/**
 * Tests for {@link StoredFolder}.
 * 
 * @author Phillip Webb
 */
public class StoredFolderTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private MockStoredFolder folder;

    private final Map<JailedResourcePath, MockStoredFolder> childFolders = new HashMap<JailedResourcePath, MockStoredFolder>();

    private final Map<JailedResourcePath, MockStoredFile> childFiles = new HashMap<JailedResourcePath, MockStoredFile>();

    @Before
    public void setup() {
        this.folder = new MockStoredFolder(new JailedResourcePath());
    }

    @Test
    public void shouldCreateWithNoParent() throws Exception {
        assertThat(this.folder.getParent(), is(nullValue()));
    }

    @Test
    public void shouldDelete() throws Exception {
        given(this.folder.getStore().exists()).willReturn(true);
        this.folder.delete();
        verify(this.folder.getStore()).delete();
    }

    @Test
    public void shouldNotDeleteWhenDoesNotExist() throws Exception {
        given(this.folder.getStore().exists()).willReturn(false);
        this.folder.delete();
        verify(this.folder.getStore(), never()).delete();
    }

    @Test
    public void shouldDeleteChildren() throws Exception {
        MockStoredFolder child = this.folder.getFolder("a", true);
        given(this.folder.getStore().exists()).willReturn(true);
        given(this.folder.getStore().list()).willReturn(Collections.singleton("a"));
        this.folder.delete();
        verify(child.getStore()).delete();
        verify(this.folder.getStore()).delete();
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
        given(this.folder.getStore().exists()).willReturn(true);
        assertThat(this.folder.exists(), is(true));
        verify(this.folder.getStore()).exists();
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
        this.folder.getFile("a");
        Resource child = this.folder.getExisting("a");
        assertThat(child, is(File.class));
        assertThat(child.getName(), is("a"));
        assertThat(child.toString(), is("/a"));
    }

    @Test
    public void shouldGetExistingFolder() throws Exception {
        this.folder.getFolder("a");
        Resource child = this.folder.getExisting("a");
        assertThat(child, is(Folder.class));
        assertThat(child.getName(), is("a"));
        assertThat(child.toString(), is("/a/"));
    }

    @Test
    public void shouldNotGetExistingIfDoesNotExist() throws Exception {
        this.thrown.expect(ResourceDoesNotExistException.class);
        this.thrown.expectMessage("The resource 'a' does not exist in the folder '/'");
        this.folder.getExisting("a");
    }

    @Test
    public void shouldNotHaveExistingFileIfDoesNotExist() throws Exception {
        boolean actual = this.folder.hasExisting("a");
        assertThat(actual, is(false));
    }

    @Test
    public void shouldHaveExistingFile() throws Exception {
        this.folder.getFolder("a");
        boolean actual = this.folder.hasExisting("a");
        assertThat(actual, is(true));
    }

    @Test
    public void shouldCreateMissingDirectory() throws Exception {
        MockStoredFolder child = this.folder.getFolder("a");
        child.createIfMissing();
        verify(child.getStore()).create();
    }

    @Test
    public void shouldNotCreateExistingDirectory() throws Exception {
        MockStoredFolder child = this.folder.getFolder("a", true);
        child.createIfMissing();
        verify(child.getStore(), never()).create();
    }

    @Test
    public void shouldCreateParent() throws Exception {
        MockStoredFolder child = this.folder.getFolder("a");
        MockStoredFolder grandChild = child.getFolder("b");
        grandChild.createIfMissing();
        InOrder inOrder = inOrder(grandChild.getStore(), child.getStore());
        inOrder.verify(child.getStore()).create();
        inOrder.verify(grandChild.getStore()).create();
    }

    @Test
    public void shouldListResources() throws Exception {
        this.folder.getFolder("a", true);
        this.folder.getFile("b", true);
        given(this.folder.getStore().exists()).willReturn(true);
        given(this.folder.getStore().list()).willReturn(Arrays.asList("a", "b"));
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
        this.folder.getFolder("a", true);
        this.folder.getFile("b", true);
        given(this.folder.getStore().exists()).willReturn(true);
        given(this.folder.getStore().list()).willReturn(Arrays.asList("a", "b"));
        Resources<File> resources = this.folder.list(Including.files());
        Iterator<File> iterator = resources.iterator();
        File file = iterator.next();
        assertThat(iterator.hasNext(), is(false));
        assertThat(file.toString(), is("/b"));
    }

    @Test
    public void shouldListFilteredResourcesWithAnonymousClass() throws Exception {
        this.folder.getFolder("a", true);
        this.folder.getFile("b", true);
        given(this.folder.getStore().exists()).willReturn(true);
        given(this.folder.getStore().list()).willReturn(Arrays.asList("a", "b"));
        Resources<File> resources = this.folder.list(new ResourceIncludeFilter<File>() {

            @Override
            public boolean include(File resource) {
                return true;
            }
        });
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
    public void shouldIterateUsingList() throws Exception {
        this.folder.getFolder("a", true);
        this.folder.getFile("b", true);
        given(this.folder.getStore().exists()).willReturn(true);
        given(this.folder.getStore().list()).willReturn(Arrays.asList("a", "b"));
        Iterator<Resource> iterator = this.folder.iterator();
        Resource resourceA = iterator.next();
        Resource resourceB = iterator.next();
        assertThat(iterator.hasNext(), is(false));
        assertThat(resourceA, is(Folder.class));
        assertThat(resourceB, is(File.class));
        assertThat(resourceA.toString(), is("/a/"));
        assertThat(resourceB.toString(), is("/b"));
    }

    @Test
    public void shouldPerformOperationRecursively() throws Exception {
        MockStoredFolder a = this.folder.getFolder("a");
        MockStoredFile b = a.getFile("b");
        MockStoredFolder c = this.folder.getFolder("c");
        given(this.folder.exists()).willReturn(true);
        given(a.exists()).willReturn(true);
        given(b.exists()).willReturn(true);
        given(c.exists()).willReturn(true);
        given(this.folder.getStore().list()).willReturn(Arrays.asList("a", "c"));
        given(a.getStore().list()).willReturn(Arrays.asList("b"));

        final Set<String> seen = new HashSet<String>();
        this.folder.performOperationRecursively(new ResourceOperation<Resource>() {

            @Override
            public void perform(Resource resource) {
                seen.add(resource.toString());
            }
        });
        assertThat(seen, is(equalTo((Set<String>) new HashSet<String>(Arrays.asList("/a/", "/a/b", "/c/")))));
    }

    @Test
    public void shouldMoveWithoutChildren() throws Exception {
        Folder destination = mock(Folder.class);
        Folder destinationChild = mock(Folder.class);
        MockStoredFolder child = this.folder.getFolder("a", true);
        given(this.folder.getStore().exists()).willReturn(true);
        given(destination.getFolder("a")).willReturn(destinationChild);
        child.moveTo(destination);
        verify(destination).getFolder("a");
        verify(destinationChild).createIfMissing();
    }

    @Test
    public void shouldNotMoveIfDoesNotExist() throws Exception {
        Folder destination = mock(Folder.class);
        MockStoredFolder child = this.folder.getFolder("a", false);
        given(this.folder.getStore().exists()).willReturn(true);
        this.thrown.expect(ResourceDoesNotExistException.class);
        child.moveTo(destination);
    }

    @Test
    public void shouldNotMoveRoot() throws Exception {
        Folder destination = mock(Folder.class);
        given(this.folder.getStore().exists()).willReturn(true);
        this.thrown.expect(IllegalStateException.class);
        this.thrown.expectMessage("Unable to move a root folder");
        this.folder.moveTo(destination);
    }

    @Test
    public void shouldMoveChildren() throws Exception {
        Folder destination = mock(Folder.class);
        Folder destinationChild = mock(Folder.class);
        Folder destinationGrandchild = mock(Folder.class);
        MockStoredFolder child = this.folder.getFolder("a", true);
        child.getFolder("b", true);
        given(child.getStore().list()).willReturn(Collections.singleton("b"));
        given(destination.getFolder("a")).willReturn(destinationChild);
        given(destinationChild.getFolder("b")).willReturn(destinationGrandchild);
        child.moveTo(destination);
        verify(destinationGrandchild).createIfMissing();
    }

    @Test
    public void shouldCopyWithoutChildren() throws Exception {
        Folder destination = mock(Folder.class);
        Folder destinationChild = mock(Folder.class);
        MockStoredFolder child = this.folder.getFolder("a", true);
        given(this.folder.getStore().exists()).willReturn(true);
        given(destination.getFolder("a")).willReturn(destinationChild);
        child.copyTo(destination);
        verify(destination).getFolder("a");
        verify(destinationChild).createIfMissing();
    }

    @Test
    public void shouldNotCopyIfDoesNotExist() throws Exception {
        Folder destination = mock(Folder.class);
        MockStoredFolder child = this.folder.getFolder("a");
        given(this.folder.getStore().exists()).willReturn(false);
        this.thrown.expect(ResourceDoesNotExistException.class);
        child.copyTo(destination);
    }

    @Test
    public void shouldNotCopyRoot() throws Exception {
        given(this.folder.getStore().exists()).willReturn(true);
        Folder destination = mock(Folder.class);
        this.thrown.expect(IllegalStateException.class);
        this.thrown.expectMessage("Unable to copy a root folder");
        this.folder.copyTo(destination);
    }

    @Test
    public void shouldCopyChildren() throws Exception {
        MockStoredFolder child = this.folder.getFolder("a", true);
        child.getFolder("b", true);
        given(this.folder.getStore().exists()).willReturn(true);
        given(child.getStore().list()).willReturn(Collections.singleton("b"));
        Folder destination = mock(Folder.class);
        Folder destinationChild = mock(Folder.class);
        Folder destinationGrandchild = mock(Folder.class);
        given(destination.getFolder("a")).willReturn(destinationChild);
        given(destinationChild.getFolder("b")).willReturn(destinationGrandchild);
        child.copyTo(destination);
        verify(destinationGrandchild).createIfMissing();
    }

    @Test
    public void shouldCopyWithFileFilter() throws Exception {
        MockStoredFolder child = this.folder.getFolder("a", true);
        child.getFile("a.java", true);
        child.getFile("a.class", true);
        child.getFolder("b", true);

        given(this.folder.getStore().exists()).willReturn(true);
        given(child.getStore().list()).willReturn(Arrays.asList("a.java", "a.class", "b"));

        Folder destination = mock(Folder.class);
        Folder destinationChild = mock(Folder.class);
        File destinationJavaFile = mock(File.class);
        FileContent destinationJavaFileContent = mock(FileContent.class);
        File destinationClassFile = mock(File.class);
        FileContent destinationClassFileContent = mock(FileContent.class);
        Folder destinationGrandchild = mock(Folder.class);

        given(destination.getFolder("a")).willReturn(destinationChild);
        given(destinationChild.getFile("a.java")).willReturn(destinationJavaFile);
        given(destinationJavaFile.getContent()).willReturn(destinationJavaFileContent);
        given(destinationChild.getFile("a.class")).willReturn(destinationClassFile);
        given(destinationClassFile.getContent()).willReturn(destinationClassFileContent);
        given(destinationChild.getFolder("b")).willReturn(destinationGrandchild);

        child.copyTo(destination, Including.fileNames().notEnding(".class"));
        verify(destinationGrandchild).createIfMissing();
        verify(destinationJavaFileContent).write(any(InputStream.class));
        verify(destinationClassFileContent, never()).write(any(InputStream.class));
    }

    @Test
    public void shouldFilteredCopyWithoutChildren() throws Exception {
        Folder destination = mock(Folder.class);
        Folder destinationChild = mock(Folder.class);
        @SuppressWarnings("unchecked")
        ResourceIncludeFilter<File> filter = mock(ResourceIncludeFilter.class);
        given(filter.include(any(File.class))).willReturn(true);
        given(this.folder.getStore().exists()).willReturn(true);
        MockStoredFolder child = this.folder.getFolder("a", true);
        given(destination.getFolder("a")).willReturn(destinationChild);
        child.copyTo(destination, filter);
        verify(destination).getFolder("a");
        verify(destinationChild).createIfMissing();
    }

    @Test
    public void shouldNotFilteredCopyIfDoesNotExist() throws Exception {
        Folder destination = mock(Folder.class);
        @SuppressWarnings("unchecked")
        ResourceIncludeFilter<File> filter = mock(ResourceIncludeFilter.class);
        given(filter.include(any(File.class))).willReturn(true);
        given(this.folder.getStore().exists()).willReturn(true);
        MockStoredFolder child = this.folder.getFolder("a", false);
        this.thrown.expect(ResourceDoesNotExistException.class);
        child.copyTo(destination, filter);
    }

    @Test
    public void shouldNotFilteredCopyRoot() throws Exception {
        Folder destination = mock(Folder.class);
        @SuppressWarnings("unchecked")
        ResourceIncludeFilter<File> filter = mock(ResourceIncludeFilter.class);
        given(this.folder.getStore().exists()).willReturn(true);
        given(filter.include(any(File.class))).willReturn(true);
        this.thrown.expect(IllegalStateException.class);
        this.thrown.expectMessage("Unable to copy a root folder");
        this.folder.copyTo(destination, filter);
    }

    @Test
    public void shouldFilteredCopyChildren() throws Exception {
        Folder destination = mock(Folder.class);
        Folder destinationChild = mock(Folder.class);
        Folder destinationGrandchild = mock(Folder.class);
        MockStoredFolder child = this.folder.getFolder("a", true);
        child.getFolder("b", true);
        given(this.folder.getStore().exists()).willReturn(true);
        given(child.getStore().list()).willReturn(Collections.singleton("b"));
        given(destination.getFolder("a")).willReturn(destinationChild);
        given(destinationChild.getFolder("b")).willReturn(destinationGrandchild);
        child.copyTo(destination, new ResourceIncludeFilter<File>() {

            @Override
            public boolean include(File resource) {
                return true;
            }
        });
        verify(destinationGrandchild).createIfMissing();
    }

    @Test
    public void shouldRename() throws Exception {
        MockStoredFolder subFolder = this.folder.getFolder("subfolder");
        given(subFolder.getStore().exists()).willReturn(true);
        subFolder.rename("folder.bak");
        verify(subFolder.getStore()).rename("folder.bak");
    }

    @Test
    public void shouldNotRenameRootFolder() throws Exception {
        given(this.folder.getStore().exists()).willReturn(true);
        this.thrown.expect(IllegalStateException.class);
        this.thrown.expectMessage("Root folders cannot be renamed");
        this.folder.rename("folder.bak");
    }

    @Test
    public void shouldNotRenameIfDoesNotExist() throws Exception {
        MockStoredFolder subFolder = this.folder.getFolder("subfolder");
        given(subFolder.getStore().exists()).willReturn(false);
        this.thrown.expect(ResourceDoesNotExistException.class);
        this.thrown.expectMessage("The resource '/subfolder/' does not exist");
        subFolder.rename("file.bak");
    }

    @Test
    public void shouldNotRenameToEmpty() throws Exception {
        MockStoredFolder subFolder = this.folder.getFolder("subfolder");
        given(subFolder.getStore().exists()).willReturn(true);
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Name must not be empty");
        subFolder.rename("");
    }

    @Test
    public void shouldNotRenameWithPathElements() throws Exception {
        given(this.folder.getStore().exists()).willReturn(true);
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Name must not contain path elements");
        this.folder.rename("file/bak");
    }

    @Test
    public void shouldAppendPathToToString() throws Exception {
        MockStoredFolder child = this.folder.getFolder("a/b/c");
        assertThat(child.toString(), is("/a/b/c/"));
    }

    @Test
    public void shouldFormatToString() throws Exception {
        Folder child = this.folder.getFolder("a", true).jail().getFolder("b/c");
        assertThat(child.toString(), is("/b/c/"));
        assertThat(child.toString(ResourceStringFormat.FULL), is("/b/c/"));
        assertThat(child.toString(ResourceStringFormat.UNJAILED), is("/a/b/c/"));
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
        this.folder.getFile("name", true);
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
        given(this.folder.getStore().exists()).willReturn(true);
        given(this.folder.getFile("a/b.txt").getStore().getOutputStream()).willReturn(outputStreamB);
        given(this.folder.getFile("c/d.txt").getStore().getOutputStream()).willReturn(outputStreamD);
        InputStream zipStream = getSampleZip();
        this.folder.unzip(zipStream);
        verify(this.folder.getFolder("a").getStore()).create();
        verify(this.folder.getFolder("c").getStore()).create();
        assertThat(new String(outputStreamB.toByteArray()), is("ab"));
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
        assertThat(sub.toString(ResourceStringFormat.UNJAILED), is("/a/b/"));
    }

    @Test
    public void shouldDoubleJail() throws Exception {
        Folder jailed = this.folder.getFolder("a").jail().jail();
        Folder sub = jailed.getFolder("/b");
        assertThat(sub.toString(), is("/b/"));
        assertThat(sub.toString(ResourceStringFormat.UNJAILED), is("/a/b/"));
    }

    private class MockStoredFolder extends StoredFolder {

        private final FolderStore store;

        public MockStoredFolder(JailedResourcePath path) {
            this.store = mock(FolderStore.class);
            given(this.store.getPath()).willReturn(path);
            given(this.store.getFolder(any(JailedResourcePath.class))).willAnswer(new Answer<Folder>() {

                @Override
                public Folder answer(InvocationOnMock invocation) throws Throwable {
                    JailedResourcePath path = (JailedResourcePath) invocation.getArguments()[0];
                    MockStoredFolder child = StoredFolderTest.this.childFolders.get(path);
                    if (child == null) {
                        child = new MockStoredFolder(path);
                        StoredFolderTest.this.childFolders.put(path, child);
                    }
                    return child;
                }
            });

            given(this.store.getFile(any(JailedResourcePath.class))).willAnswer(new Answer<File>() {

                @Override
                public File answer(InvocationOnMock invocation) throws Throwable {
                    JailedResourcePath path = (JailedResourcePath) invocation.getArguments()[0];
                    MockStoredFile child = StoredFolderTest.this.childFiles.get(path);
                    if (child == null) {
                        child = new MockStoredFile(path);
                        StoredFolderTest.this.childFiles.put(path, child);
                    }
                    return child;
                }
            });

            given(this.store.getExisting(any(JailedResourcePath.class))).willAnswer(new Answer<Resource>() {

                @Override
                public Resource answer(InvocationOnMock invocation) throws Throwable {
                    JailedResourcePath path = (JailedResourcePath) invocation.getArguments()[0];
                    Resource resource = StoredFolderTest.this.childFolders.get(path);
                    if (resource != null) {
                        return resource;
                    }
                    return StoredFolderTest.this.childFiles.get(path);
                }
            });

        }

        @Override
        protected FolderStore getStore() {
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
    }

    private static class MockStoredFile extends StoredFile {

        private final FileStore store;

        public MockStoredFile(JailedResourcePath path) {
            this.store = mock(FileStore.class);
            given(this.store.getPath()).willReturn(path);
        }

        @Override
        protected FileStore getStore() {
            return this.store;
        }
    }
}
