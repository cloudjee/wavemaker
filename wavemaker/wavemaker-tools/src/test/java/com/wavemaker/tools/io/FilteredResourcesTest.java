
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
    public void shouldIncludeFile() throws Exception {
        Resource file = mock(File.class);
        Resources<Resource> resources = new ResourcesCollection<Resource>(file);
        assertThat(resources.include(FilterOn.files()).iterator().next(), is(file));
        assertThat(resources.include(FilterOn.folders()).iterator().hasNext(), is(false));
    }

    @Test
    public void shouldIncludeFolder() throws Exception {
        Resource folder = mock(Folder.class);
        Resources<Resource> resources = new ResourcesCollection<Resource>(folder);
        assertThat(resources.include(FilterOn.files()).iterator().hasNext(), is(false));
        assertThat(resources.include(FilterOn.folders()).iterator().next(), is(folder));
    }

    @Test
    public void shouldIncludeBasedOnCallback() throws Exception {
        final File file1 = mock(File.class);
        final Folder folder1 = mock(Folder.class);
        final File file2 = mock(File.class);
        final Folder folder2 = mock(Folder.class);
        Resources<Resource> resources = new ResourcesCollection<Resource>(file1, folder1, file2, folder2);
        Iterator<Resource> filtered = resources.include(new ResourceFilter() {

            @Override
            public boolean match(Resource resource) {
                return resource == file1 || resource == folder1;
            }
        }).iterator();
        assertThat(filtered.next(), is((Resource) file1));
        assertThat(filtered.next(), is((Resource) folder1));
        assertThat(filtered.hasNext(), is(false));
    }

    // FIXME excludes
    // @Test
    // public void shouldExcludeFile() throws Exception {
    // Resource file = mock(File.class);
    // Resources<Resource> resources = new ResourcesCollection<Resource>(file);
    // assertThat(resources.exclude(FilterOn.files()).iterator().hasNext(), is(false));
    // assertThat(resources.exclude(FilterOn.folders()).iterator().next(), is(file));
    // }
    //
    // @Test
    // public void shouldExcludeFolder() throws Exception {
    // Resource folder = mock(Folder.class);
    // Resources<Resource> resources = new ResourcesCollection<Resource>(folder);
    // assertThat(resources.exclude(FilterOn.files()).iterator().hasNext(), is(false));
    // assertThat(resources.exclude(FilterOn.folders()).iterator().next(), is(folder));
    // }
    //
    // @Test
    // public void shouldExcludeBasedOnCallback() throws Exception {
    // final File file1 = mock(File.class);
    // final Folder folder1 = mock(Folder.class);
    // final File file2 = mock(File.class);
    // final Folder folder2 = mock(Folder.class);
    // Resources<Resource> resources = new ResourcesCollection<Resource>(file1, folder1, file2, folder2);
    // Iterator<Resource> filtered = resources.exclude(new ResourceFilter() {
    //
    // @Override
    // public boolean match(Resource resource) {
    // return resource == file1 || resource == folder1;
    // }
    // }).iterator();
    // assertThat(filtered.next(), is((Resource) file1));
    // assertThat(filtered.next(), is((Resource) folder1));
    // assertThat(filtered.hasNext(), is(false));
    // }

}
