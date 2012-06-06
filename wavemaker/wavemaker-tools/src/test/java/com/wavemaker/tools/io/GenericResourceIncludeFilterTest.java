
package com.wavemaker.tools.io;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

/**
 * Tests for {@link GenericResourceIncludeFilter}.
 * 
 * @author Phillip Webb
 */
@RunWith(MockitoJUnitRunner.class)
public class GenericResourceIncludeFilterTest {

    @Mock
    private File file;

    @Mock
    private Folder folder;

    @Test
    public void shouldFilterFileType() throws Exception {
        ResourceIncludeFilter<Resource> filter = GenericResourceIncludeFilter.filterNonMatchingGeneric(Including.files());
        assertThat(filter.include(this.file), is(true));
        assertThat(filter.include(this.folder), is(false));
    }

    @Test
    public void shouldFilterFolderType() throws Exception {
        ResourceIncludeFilter<Resource> filter = GenericResourceIncludeFilter.filterNonMatchingGeneric(Including.folders());
        assertThat(filter.include(this.file), is(false));
        assertThat(filter.include(this.folder), is(true));
    }

    @Test
    public void shouldFilterResourceType() throws Exception {
        ResourceIncludeFilter<Resource> filter = GenericResourceIncludeFilter.filterNonMatchingGeneric(Including.all());
        assertThat(filter.include(this.file), is(true));
        assertThat(filter.include(this.folder), is(true));
    }

    @Test
    public void shouldIncludeFileType() throws Exception {
        ResourceIncludeFilter<Resource> filter = GenericResourceIncludeFilter.includeNonMatchingGeneric(Including.files());
        assertThat(filter.include(this.file), is(true));
        assertThat(filter.include(this.folder), is(true));
    }

    @Test
    public void shouldIncludeFolderType() throws Exception {
        ResourceIncludeFilter<Resource> filter = GenericResourceIncludeFilter.includeNonMatchingGeneric(Including.folders());
        assertThat(filter.include(this.file), is(true));
        assertThat(filter.include(this.folder), is(true));
    }

    @Test
    public void shouldIncludeResourceType() throws Exception {
        ResourceIncludeFilter<Resource> filter = GenericResourceIncludeFilter.includeNonMatchingGeneric(Including.all());
        assertThat(filter.include(this.file), is(true));
        assertThat(filter.include(this.folder), is(true));
    }

}
