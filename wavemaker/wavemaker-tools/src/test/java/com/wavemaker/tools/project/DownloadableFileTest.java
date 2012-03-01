
package com.wavemaker.tools.project;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import java.io.InputStream;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.wavemaker.io.File;
import com.wavemaker.io.FileContent;

/**
 * Tests fpor {@link DownloadableFile}.
 * 
 * @author Phillip Webb
 */
public class DownloadableFileTest {

    @Mock
    private File file;

    private DownloadableFile downloadable;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.downloadable = new DownloadableFile(this.file);
    }

    @Test
    public void shouldReturnContents() throws Exception {
        FileContent content = mock(FileContent.class);
        InputStream inputStream = mock(InputStream.class);
        given(this.file.getContent()).willReturn(content);
        given(content.asInputStream()).willReturn(inputStream);
        assertThat(this.downloadable.getContents(), is(sameInstance(inputStream)));
    }

    @Test
    public void shouldHaveLength() throws Exception {
        given(this.file.getSize()).willReturn(123L);
        assertThat(this.downloadable.getContentLength(), is(123));
    }

    @Test
    public void shouldHaveContentType() throws Exception {
        assertThat(this.downloadable.getContentType(), is("application/unknown"));
    }

    @Test
    public void shouldUseFileName() throws Exception {
        given(this.file.getName()).willReturn("name.ext");
        assertThat(this.downloadable.getFileName(), is("name.ext"));
    }
}
