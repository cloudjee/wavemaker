
package com.wavemaker.tools.io;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import org.junit.Test;

/**
 * Tests for {@link FilterOn}.
 * 
 * @author Phillip Webb
 */
public class IncludingTest {

    @Test
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public void shouldFilterFiles() throws Exception {
        ResourceFilter filter = FilterOn.fileNames();
        assertThat(filter.match(fileWithName("test")), is(true));
        assertThat(filter.match(folderWithName("test")), is(false));
    }

    @Test
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public void shouldFilterFolders() throws Exception {
        ResourceFilter filter = FilterOn.folderNames();
        assertThat(filter.match(fileWithName("test")), is(false));
        assertThat(filter.match(folderWithName("test")), is(true));
    }

    @Test
    public void shouldFilterOnFileName() throws Exception {
        ResourceFilter filter = FilterOn.fileNames().matching("a");
        assertThat(filter.match(fileWithName("a")), is(true));
        assertThat(filter.match(fileWithName("b")), is(false));
    }

    @Test
    public void shouldFilterOnFolderName() throws Exception {
        ResourceFilter filter = FilterOn.folderNames().matching("a");
        assertThat(filter.match(folderWithName("a")), is(true));
        assertThat(filter.match(folderWithName("b")), is(false));
    }

    @Test
    public void shouldFilterOnFilePath() throws Exception {
        ResourceFilter filter = FilterOn.filePaths().matching("/a/b.txt");
        assertThat(filter.match(fileWithPath("/a/b.txt")), is(true));
        assertThat(filter.match(fileWithPath("/a/c.txt")), is(false));
    }

    @Test
    public void shouldFilterOnFolderPath() throws Exception {
        ResourceFilter filter = FilterOn.folderPaths().matching("/a/b/");
        assertThat(filter.match(folderWithPath("/a/b/")), is(true));
        assertThat(filter.match(folderWithPath("/a/c/")), is(false));
    }

    @Test
    public void shouldFilterNamesStarting() throws Exception {
        ResourceFilter filter = FilterOn.fileNames().starting("a", "b");
        assertThat(filter.match(fileWithName("acd")), is(true));
        assertThat(filter.match(fileWithName("bcd")), is(true));
        assertThat(filter.match(fileWithName("ACD")), is(true));
        assertThat(filter.match(fileWithName("BCD")), is(true));
        assertThat(filter.match(fileWithName("ddd")), is(false));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesStarting() throws Exception {
        ResourceFilter filter = FilterOn.caseSensitiveFileNames().starting("a", "b");
        assertThat(filter.match(fileWithName("acd")), is(true));
        assertThat(filter.match(fileWithName("bcd")), is(true));
        assertThat(filter.match(fileWithName("ACD")), is(false));
        assertThat(filter.match(fileWithName("BCD")), is(false));
        assertThat(filter.match(fileWithName("ddd")), is(false));
    }

    @Test
    public void shouldFilterNamesNotStarting() throws Exception {
        ResourceFilter filter = FilterOn.fileNames().notStarting("a", "b");
        assertThat(filter.match(fileWithName("acd")), is(false));
        assertThat(filter.match(fileWithName("bcd")), is(false));
        assertThat(filter.match(fileWithName("ACD")), is(false));
        assertThat(filter.match(fileWithName("BCD")), is(false));
        assertThat(filter.match(fileWithName("ddd")), is(true));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesNotStarting() throws Exception {
        ResourceFilter filter = FilterOn.caseSensitiveFileNames().notStarting("a", "b");
        assertThat(filter.match(fileWithName("acd")), is(false));
        assertThat(filter.match(fileWithName("bcd")), is(false));
        assertThat(filter.match(fileWithName("ACD")), is(true));
        assertThat(filter.match(fileWithName("BCD")), is(true));
        assertThat(filter.match(fileWithName("ddd")), is(true));
    }

    @Test
    public void shouldFilterNamesEnding() throws Exception {
        ResourceFilter filter = FilterOn.fileNames().ending("a", "b");
        assertThat(filter.match(fileWithName("dca")), is(true));
        assertThat(filter.match(fileWithName("dcb")), is(true));
        assertThat(filter.match(fileWithName("DCA")), is(true));
        assertThat(filter.match(fileWithName("DCB")), is(true));
        assertThat(filter.match(fileWithName("ddd")), is(false));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesEnding() throws Exception {
        ResourceFilter filter = FilterOn.caseSensitiveFileNames().ending("a", "b");
        assertThat(filter.match(fileWithName("dca")), is(true));
        assertThat(filter.match(fileWithName("dcb")), is(true));
        assertThat(filter.match(fileWithName("DCA")), is(false));
        assertThat(filter.match(fileWithName("DCB")), is(false));
        assertThat(filter.match(fileWithName("ddd")), is(false));
    }

    @Test
    public void shouldFilterNamesNotEnding() throws Exception {
        ResourceFilter filter = FilterOn.fileNames().notEnding("a", "b");
        assertThat(filter.match(fileWithName("dca")), is(false));
        assertThat(filter.match(fileWithName("dcb")), is(false));
        assertThat(filter.match(fileWithName("DCA")), is(false));
        assertThat(filter.match(fileWithName("DCB")), is(false));
        assertThat(filter.match(fileWithName("ddd")), is(true));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesNotEnding() throws Exception {
        ResourceFilter filter = FilterOn.caseSensitiveFileNames().notEnding("a", "b");
        assertThat(filter.match(fileWithName("dca")), is(false));
        assertThat(filter.match(fileWithName("dcb")), is(false));
        assertThat(filter.match(fileWithName("DCA")), is(true));
        assertThat(filter.match(fileWithName("DCB")), is(true));
        assertThat(filter.match(fileWithName("ddd")), is(true));
    }

    @Test
    public void shouldFilterNamesContaining() throws Exception {
        ResourceFilter filter = FilterOn.fileNames().containing("a", "b");
        assertThat(filter.match(fileWithName("cad")), is(true));
        assertThat(filter.match(fileWithName("cbd")), is(true));
        assertThat(filter.match(fileWithName("CAD")), is(true));
        assertThat(filter.match(fileWithName("CBD")), is(true));
        assertThat(filter.match(fileWithName("ddd")), is(false));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesContaining() throws Exception {
        ResourceFilter filter = FilterOn.caseSensitiveFileNames().containing("a", "b");
        assertThat(filter.match(fileWithName("cad")), is(true));
        assertThat(filter.match(fileWithName("cbd")), is(true));
        assertThat(filter.match(fileWithName("CAD")), is(false));
        assertThat(filter.match(fileWithName("CBD")), is(false));
        assertThat(filter.match(fileWithName("ddd")), is(false));
    }

    @Test
    public void shouldFilterNamesNotContaining() throws Exception {
        ResourceFilter filter = FilterOn.fileNames().notContaining("a", "b");
        assertThat(filter.match(fileWithName("cad")), is(false));
        assertThat(filter.match(fileWithName("cbd")), is(false));
        assertThat(filter.match(fileWithName("CAD")), is(false));
        assertThat(filter.match(fileWithName("CBD")), is(false));
        assertThat(filter.match(fileWithName("ddd")), is(true));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesNotContaining() throws Exception {
        ResourceFilter filter = FilterOn.caseSensitiveFileNames().notContaining("a", "b");
        assertThat(filter.match(fileWithName("cad")), is(false));
        assertThat(filter.match(fileWithName("cbd")), is(false));
        assertThat(filter.match(fileWithName("CAD")), is(true));
        assertThat(filter.match(fileWithName("CBD")), is(true));
        assertThat(filter.match(fileWithName("ddd")), is(true));
    }

    @Test
    public void shouldFilterNamesMatching() throws Exception {
        ResourceFilter filter = FilterOn.fileNames().matching("a", "b");
        assertThat(filter.match(fileWithName("a")), is(true));
        assertThat(filter.match(fileWithName("b")), is(true));
        assertThat(filter.match(fileWithName("A")), is(true));
        assertThat(filter.match(fileWithName("B")), is(true));
        assertThat(filter.match(fileWithName("ab")), is(false));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesMatching() throws Exception {
        ResourceFilter filter = FilterOn.caseSensitiveFileNames().matching("a", "b");
        assertThat(filter.match(fileWithName("a")), is(true));
        assertThat(filter.match(fileWithName("b")), is(true));
        assertThat(filter.match(fileWithName("A")), is(false));
        assertThat(filter.match(fileWithName("B")), is(false));
        assertThat(filter.match(fileWithName("ab")), is(false));
    }

    @Test
    public void shouldFilterNamesNotMatching() throws Exception {
        ResourceFilter filter = FilterOn.fileNames().notMatching("a", "b");
        assertThat(filter.match(fileWithName("a")), is(false));
        assertThat(filter.match(fileWithName("b")), is(false));
        assertThat(filter.match(fileWithName("A")), is(false));
        assertThat(filter.match(fileWithName("B")), is(false));
        assertThat(filter.match(fileWithName("ab")), is(true));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesNotMatching() throws Exception {
        ResourceFilter filter = FilterOn.caseSensitiveFileNames().notMatching("a", "b");
        assertThat(filter.match(fileWithName("a")), is(false));
        assertThat(filter.match(fileWithName("b")), is(false));
        assertThat(filter.match(fileWithName("A")), is(true));
        assertThat(filter.match(fileWithName("B")), is(true));
        assertThat(filter.match(fileWithName("ab")), is(true));
    }

    @Test
    public void shouldSupportCompoundFilters() throws Exception {
        ResourceFilter filter = FilterOn.fileNames().starting("~").ending(".tmp", ".bak").notContaining("keep");
        assertThat(filter.match(fileWithName("~file.tmp")), is(true));
        assertThat(filter.match(fileWithName("~file.bak")), is(true));
        assertThat(filter.match(fileWithName("file.tmp")), is(false));
        assertThat(filter.match(fileWithName("~file.dat")), is(false));
        assertThat(filter.match(fileWithName("~xxkeepxx.bak")), is(false));
    }

    @Test
    public void shouldFilterHiddenResources() throws Exception {
        ResourceFilter filter = FilterOn.hiddenResources();
        assertThat(filter.match(fileWithName(".hidden")), is(true));
        assertThat(filter.match(fileWithName("nothidden")), is(false));
        assertThat(filter.match(folderWithName(".hidden")), is(true));
        assertThat(filter.match(folderWithName("nothidden")), is(false));
    }

    @Test
    public void shouldFilterNonHiddenResources() throws Exception {
        ResourceFilter filter = FilterOn.nonHiddenResources();
        assertThat(filter.match(fileWithName(".hidden")), is(false));
        assertThat(filter.match(fileWithName("nothidden")), is(true));
        assertThat(filter.match(folderWithName(".hidden")), is(false));
        assertThat(filter.match(folderWithName("nothidden")), is(true));
    }

    @Test
    public void shouldFilterHiddenFolders() throws Exception {
        ResourceFilter filter = FilterOn.hiddenFolders();
        assertThat(filter.match(folderWithName(".hidden")), is(true));
        assertThat(filter.match(folderWithName("nothidden")), is(false));
    }

    @Test
    public void shouldFilterNonHiddenFolders() throws Exception {
        ResourceFilter filter = FilterOn.nonHiddenFolders();
        assertThat(filter.match(folderWithName(".hidden")), is(false));
        assertThat(filter.match(folderWithName("nothidden")), is(true));
    }

    @Test
    public void shouldFilterHiddenFiles() throws Exception {
        ResourceFilter filter = FilterOn.hiddenFiles();
        assertThat(filter.match(fileWithName(".hidden")), is(true));
        assertThat(filter.match(fileWithName("nothidden")), is(false));
    }

    @Test
    public void shouldFilterNonHiddenFiles() throws Exception {
        ResourceFilter filter = FilterOn.nonHiddenFiles();
        assertThat(filter.match(fileWithName(".hidden")), is(false));
        assertThat(filter.match(fileWithName("nothidden")), is(true));
    }

    private File fileWithName(String name) {
        return resourceWithName(File.class, name, null);
    }

    private Folder folderWithName(String name) {
        return resourceWithName(Folder.class, name, null);
    }

    private File fileWithPath(String path) {
        return resourceWithName(File.class, null, path);
    }

    private Folder folderWithPath(String path) {
        return resourceWithName(Folder.class, null, path);
    }

    private <T extends Resource> T resourceWithName(Class<T> resourceType, String name, String path) {
        T resource = mock(resourceType);
        given(resource.getName()).willReturn(name);
        given(resource.toString()).willReturn(path);
        return resource;
    }
}
