
package com.wavemaker.tools.project;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.local.LocalFolder;

/**
 * Tests for {@link DownloadableFolder}.
 * 
 * @author Phillip Webb
 */
public class DownloadableFolderTest {

    @Rule
    public TemporaryFolder temporaryFolder = new TemporaryFolder();

    private DownloadableFolder downloadable;

    private Folder folder;

    @Before
    public void setup() {
        this.folder = new LocalFolder(this.temporaryFolder.getRoot()).getFolder("name");
        this.downloadable = new DownloadableFolder(this.folder, "defaultName");
    }

    @Test
    public void shouldReturnZipContents() throws Exception {
        assertThat(this.downloadable.getContents(), is(not(nullValue())));
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
        assertThat(this.downloadable.getFileName(), is("name.zip"));
    }

    @Test
    public void shouldUseDefaultNameIfNoFolderName() throws Exception {
        this.downloadable = new DownloadableFolder(this.folder.getParent(), "defaultName");
        assertThat(this.downloadable.getFileName(), is("defaultName.zip"));
    }
}
