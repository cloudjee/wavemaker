
package com.wavemaker.tools.io;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;

import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

/**
 * Tests for {@link ResourcesCollection}.
 * 
 * @author Phillip Webb
 */
@RunWith(MockitoJUnitRunner.class)
public class ResourcesCollectionTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Mock
    private Folder folder;

    @Mock
    private File file;

    @Test
    public void shouldNeedResources() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Resources must not be null");
        new ResourcesCollection<Resource>((Collection<Resource>) null);
    }

    @Test
    public void shouldNeedResourcesArray() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Resources must not be null");
        new ResourcesCollection<Resource>((Resource[]) null);
    }

    @Test
    public void shouldIterateCollection() throws Exception {
        ResourcesCollection<Resource> collection = new ResourcesCollection<Resource>(Arrays.asList(this.folder, this.file));
        Iterator<Resource> iterator = collection.iterator();
        assertThat(iterator.next(), is((Resource) this.folder));
        assertThat(iterator.next(), is((Resource) this.file));
        assertThat(iterator.hasNext(), is(false));
    }

    @Test
    public void shouldIterateArray() throws Exception {
        ResourcesCollection<Resource> collection = new ResourcesCollection<Resource>(this.folder, this.file);
        Iterator<Resource> iterator = collection.iterator();
        assertThat(iterator.next(), is((Resource) this.folder));
        assertThat(iterator.next(), is((Resource) this.file));
        assertThat(iterator.hasNext(), is(false));
    }

    @Test
    public void shouldDeleteAgainstItems() throws Exception {
        ResourcesCollection<Resource> collection = new ResourcesCollection<Resource>(this.folder, this.file);
        collection.delete();
        InOrder ordered = inOrder(this.folder, this.file);
        ordered.verify(this.folder).delete();
        ordered.verify(this.file).delete();
    }

    @Test
    public void shouldMoveToAgainstItems() throws Exception {
        ResourcesCollection<Resource> collection = new ResourcesCollection<Resource>(this.folder, this.file);
        Folder destination = mock(Folder.class);
        collection.moveTo(destination);
        InOrder ordered = inOrder(this.folder, this.file);
        ordered.verify((Resource) this.folder).moveTo(destination);
        ordered.verify((Resource) this.file).moveTo(destination);
    }

    @Test
    public void shouldCopyToAgainstItems() throws Exception {
        ResourcesCollection<Resource> collection = new ResourcesCollection<Resource>(this.folder, this.file);
        Folder destination = mock(Folder.class);
        collection.copyTo(destination);
        InOrder ordered = inOrder(this.folder, this.file);
        ordered.verify((Resource) this.folder).copyTo(destination);
        ordered.verify((Resource) this.file).copyTo(destination);
    }
}
