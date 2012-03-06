
package com.wavemaker.tools.io;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import org.junit.Test;

/**
 * Tests for {@link ResourceFilter}
 * 
 * @author Phillip Webb
 */
public class ResourceFilterTest {

    @Test
    public void shouldFilterHiddenResources() {
        ResourceFilter<Resource> filter = ResourceFilter.HIDDEN_RESOURCES;
        assertThat(filter.include(mockFolder(".hidden")), is(false));
        assertThat(filter.include(mockFolder(".hidden")), is(false));
        assertThat(filter.include(mockFile("nothidden")), is(true));
        assertThat(filter.include(mockFile("nothidden")), is(true));
    }

    private File mockFile(String name) {
        File file = mock(File.class);
        given(file.getName()).willReturn(name);
        return file;
    }

    private Folder mockFolder(String name) {
        Folder folder = mock(Folder.class);
        given(folder.getName()).willReturn(name);
        return folder;
    }
}
