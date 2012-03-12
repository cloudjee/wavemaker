
package com.wavemaker.tools.io;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;

import java.util.Iterator;

import org.junit.Test;

/**
 * Tests for {@link FilteredResources}.
 * 
 * @author Phillip Webb
 */
public class FilteredResourcesTest {

    @Test
    public void shouldFilterBasedOnFileGeneric() throws Exception {
        File file = mock(File.class);
        Resources<File> resources = new ResourcesCollection<File>(file);
        assertThat(FilteredResources.apply(resources, ResourceFilter.FILES).iterator().next(), is(file));
        assertThat(FilteredResources.apply(resources, ResourceFilter.FOLDERS).iterator().hasNext(), is(false));
    }

    @Test
    public void shouldFilterBasedOnFolderGeneric() throws Exception {
        Folder folder = mock(Folder.class);
        Resources<Folder> resources = new ResourcesCollection<Folder>(folder);
        assertThat(FilteredResources.apply(resources, ResourceFilter.FILES).iterator().hasNext(), is(false));
        assertThat(FilteredResources.apply(resources, ResourceFilter.FOLDERS).iterator().next(), is(folder));
    }

    @Test
    public void shouldFilterBasedOnCallback() throws Exception {
        final File file1 = mock(File.class);
        final Folder folder1 = mock(Folder.class);
        final File file2 = mock(File.class);
        final Folder folder2 = mock(Folder.class);
        Resources<Resource> resources = new ResourcesCollection<Resource>(file1, folder1, file2, folder2);
        Iterator<Resource> filtered = FilteredResources.apply(resources, new ResourceFilter<Resource>() {

            @Override
            public boolean include(Resource resource) {
                return resource == file1 || resource == folder1;
            }
        }).iterator();
        assertThat(filtered.next(), is((Resource) file1));
        assertThat(filtered.next(), is((Resource) folder1));
        assertThat(filtered.hasNext(), is(false));
    }
}
