
package com.wavemaker.tools.io;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import java.util.Iterator;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

/**
 * Tests for {@link FilteredResources}.
 * 
 * @author Phillip Webb
 */
public class FilteredResourcesTest {

    @Mock
    private Folder source;

    @Mock
    private File fileA;

    @Mock
    private File fileB;

    @Mock
    private File fileC;

    @Mock
    private File fileD;

    private Resources<File> resources;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.resources = new ResourcesCollection<File>(this.source, this.fileA, this.fileB, this.fileC, this.fileD);
    }

    @Test
    public void shoulNotFilterAnyIncluded() throws Exception {
        Resources<File> actual = FilteredResources.include(this.resources, filterOn(this.fileA), filterOn(this.fileC));
        assertMatches(actual, this.fileA, this.fileC);
    }

    @Test
    public void shouldFilterEveryExcluded() throws Exception {
        Resources<File> actual = FilteredResources.exclude(this.resources, filterOn(this.fileA), filterOn(this.fileC));
        assertMatches(actual, this.fileB, this.fileD);
    }

    private void assertMatches(Resources<File> actual, File... expected) {
        Iterator<File> iterator = actual.iterator();
        for (File file : expected) {
            assertThat(iterator.next(), is(file));
        }
        assertThat(iterator.hasNext(), is(false));
    }

    private ResourceFilter filterOn(final Resource on) {
        return new ResourceFilter() {

            @Override
            public boolean match(Resource resource) {
                return resource == on;
            }
        };
    }
}
