
package com.wavemaker.tools.project;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;

import java.util.Collections;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ZippedFolderInputStream;

/**
 * Tests for {@link DownloadableFolder}.
 * 
 * @author Phillip Webb
 */
public class DownloadableFolderTest {

    @Mock
    private Folder folder;

    private DownloadableFolder downloadable;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        given(this.folder.iterator()).willReturn(Collections.<Resource> emptySet().iterator());
        this.downloadable = new DownloadableFolder(this.folder, "defaultName");
    }

    @Test
    public void shouldReturnZipContents() throws Exception {
        assertThat(this.downloadable.getContents(), is(ZippedFolderInputStream.class));
    }

    @Test
    public void shouldHaveNullLength() throws Exception {
        assertThat(this.downloadable.getContentLength(), is(nullValue()));
    }

    @Test
    public void shouldHaveContentType() throws Exception {
        assertThat(this.downloadable.getContentType(), is("application/zip"));
    }

    @Test
    public void shouldUseFolderName() throws Exception {
        given(this.folder.getName()).willReturn("name");
        assertThat(this.downloadable.getFileName(), is("name.zip"));
    }

    @Test
    public void shouldUseDefaultNameIfNoFolderName() throws Exception {
        given(this.folder.getName()).willReturn("");
        assertThat(this.downloadable.getFileName(), is("defaultName.zip"));
    }
}
