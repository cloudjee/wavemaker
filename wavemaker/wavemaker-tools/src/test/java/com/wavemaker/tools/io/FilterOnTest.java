
package com.wavemaker.tools.io;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import com.wavemaker.tools.io.FilterOn.PathStyle;

/**
 * Tests for {@link FilterOn}.
 * 
 * @author Phillip Webb
 */
public class FilterOnTest {

    @Mock
    private ResourceFilterContext context;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void shouldSupportCompoundFilters() throws Exception {
        ResourceFilter filter = FilterOn.names().starting("~").ending(".tmp", ".bak").notContaining("keep");
        assertThat(filter.match(this.context, fileWithName("~file.tmp")), is(true));
        assertThat(filter.match(this.context, fileWithName("~file.bak")), is(true));
        assertThat(filter.match(this.context, fileWithName("file.tmp")), is(false));
        assertThat(filter.match(this.context, fileWithName("~file.dat")), is(false));
        assertThat(filter.match(this.context, fileWithName("~xxkeepxx.bak")), is(false));
    }

    @Test
    public void shouldFilterHiddenResources() throws Exception {
        ResourceFilter filter = FilterOn.hidden();
        assertThat(filter.match(this.context, fileWithName(".hidden")), is(true));
        assertThat(filter.match(this.context, fileWithName("nothidden")), is(false));
        assertThat(filter.match(this.context, folderWithName(".hidden")), is(true));
        assertThat(filter.match(this.context, folderWithName("nothidden")), is(false));
    }

    @Test
    public void shouldFilterNonHiddenResources() throws Exception {
        ResourceFilter filter = FilterOn.nonHidden();
        assertThat(filter.match(this.context, fileWithName(".hidden")), is(false));
        assertThat(filter.match(this.context, fileWithName("nothidden")), is(true));
        assertThat(filter.match(this.context, folderWithName(".hidden")), is(false));
        assertThat(filter.match(this.context, folderWithName("nothidden")), is(true));
    }

    @Test
    public void shouldFilterOnPatternWithFullPathStyle() throws Exception {
        ResourceFilter filter = FilterOn.antPattern(PathStyle.FULL, "/dojo/**/tests/**");
        assertThat(filter.match(this.context, folderWithPath("/dojo/folder/tests/file.js")), is(true));
        assertThat(filter.match(this.context, folderWithPath("/dojo/some/folder/tests/file.js")), is(true));
        assertThat(filter.match(this.context, folderWithPath("/dojo/some/folder/tests/another/file.js")), is(true));
    }

    @Test
    public void shouldFilterOnPattern() throws Exception {
        Folder source = folderWithPath("/x/");
        given(this.context.getSource()).willReturn(source);
        ResourceFilter filter = FilterOn.antPattern("dojo/**/tests/**");
        assertThat(filter.match(this.context, folderWithPath("/x/dojo/folder/tests/file.js")), is(true));
        assertThat(filter.match(this.context, folderWithPath("/x/dojo/some/folder/tests/file.js")), is(true));
        assertThat(filter.match(this.context, folderWithPath("/x/dojo/some/folder/tests/another/file.js")), is(true));
    }

    @Test
    public void shouldFilterOnPatternWithExtraSlash() throws Exception {
        Folder source = folderWithPath("/");
        given(this.context.getSource()).willReturn(source);
        ResourceFilter filter = FilterOn.antPattern("/dojo/**/tests/**");
        assertThat(filter.match(this.context, folderWithPath("/dojo/folder/tests/file.js")), is(true));
        assertThat(filter.match(this.context, folderWithPath("/dojo/some/folder/tests/file.js")), is(true));
        assertThat(filter.match(this.context, folderWithPath("/dojo/some/folder/tests/another/file.js")), is(true));
    }

    private File fileWithName(String name) {
        return resourceWithName(File.class, name, null);
    }

    private Folder folderWithName(String name) {
        return resourceWithName(Folder.class, name, null);
    }

    private Folder folderWithPath(String path) {
        String name = new ResourcePath().get(path).getName();
        return resourceWithName(Folder.class, name, path);
    }

    private <T extends Resource> T resourceWithName(Class<T> resourceType, String name, final String path) {
        T resource = mock(resourceType);
        given(resource.getName()).willReturn(name);
        given(resource.toString()).willReturn(path);
        given(resource.toStringRelativeTo(any(Folder.class))).willAnswer(new Answer<String>() {

            @Override
            public String answer(InvocationOnMock invocation) throws Throwable {
                final ResourcePath resourcePath = new ResourcePath().get(path);
                return resourcePath.toStringRelativeTo(invocation.getArguments()[0].toString());
            }
        });
        return resource;
    }
}
