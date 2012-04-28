
package com.wavemaker.tools.io;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import org.junit.Test;

/**
 * Tests for {@link Including}.
 * 
 * @author Phillip Webb
 */
public class ResourceFilteringTest {

    @Test
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public void shouldFilterFiles() throws Exception {
        ResourceIncludeFilter filter = Including.fileNames();
        assertThat(filter.include(fileWithName("test")), is(true));
        assertThat(filter.include(folderWithName("test")), is(false));
    }

    @Test
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public void shouldFilterFolders() throws Exception {
        ResourceIncludeFilter filter = Including.folderNames();
        assertThat(filter.include(fileWithName("test")), is(false));
        assertThat(filter.include(folderWithName("test")), is(true));
    }

    @Test
    public void shouldFilterOnFileName() throws Exception {
        ResourceIncludeFilter<File> filter = Including.fileNames().matching("a");
        assertThat(filter.include(fileWithName("a")), is(true));
        assertThat(filter.include(fileWithName("b")), is(false));
    }

    @Test
    public void shouldFilterOnFolderName() throws Exception {
        ResourceIncludeFilter<Folder> filter = Including.folderNames().matching("a");
        assertThat(filter.include(folderWithName("a")), is(true));
        assertThat(filter.include(folderWithName("b")), is(false));
    }

    @Test
    public void shouldFilterOnFilePath() throws Exception {
        ResourceIncludeFilter<File> filter = Including.filePaths().matching("/a/b.txt");
        assertThat(filter.include(fileWithPath("/a/b.txt")), is(true));
        assertThat(filter.include(fileWithPath("/a/c.txt")), is(false));
    }

    @Test
    public void shouldFilterOnFolderPath() throws Exception {
        ResourceIncludeFilter<Folder> filter = Including.folderPaths().matching("/a/b/");
        assertThat(filter.include(folderWithPath("/a/b/")), is(true));
        assertThat(filter.include(folderWithPath("/a/c/")), is(false));
    }

    @Test
    public void shouldFilterNamesStarting() throws Exception {
        ResourceIncludeFilter<File> filter = Including.fileNames().starting("a", "b");
        assertThat(filter.include(fileWithName("acd")), is(true));
        assertThat(filter.include(fileWithName("bcd")), is(true));
        assertThat(filter.include(fileWithName("ACD")), is(true));
        assertThat(filter.include(fileWithName("BCD")), is(true));
        assertThat(filter.include(fileWithName("ddd")), is(false));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesStarting() throws Exception {
        ResourceIncludeFilter<File> filter = Including.caseSensitiveFileNames().starting("a", "b");
        assertThat(filter.include(fileWithName("acd")), is(true));
        assertThat(filter.include(fileWithName("bcd")), is(true));
        assertThat(filter.include(fileWithName("ACD")), is(false));
        assertThat(filter.include(fileWithName("BCD")), is(false));
        assertThat(filter.include(fileWithName("ddd")), is(false));
    }

    @Test
    public void shouldFilterNamesNotStarting() throws Exception {
        ResourceIncludeFilter<File> filter = Including.fileNames().notStarting("a", "b");
        assertThat(filter.include(fileWithName("acd")), is(false));
        assertThat(filter.include(fileWithName("bcd")), is(false));
        assertThat(filter.include(fileWithName("ACD")), is(false));
        assertThat(filter.include(fileWithName("BCD")), is(false));
        assertThat(filter.include(fileWithName("ddd")), is(true));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesNotStarting() throws Exception {
        ResourceIncludeFilter<File> filter = Including.caseSensitiveFileNames().notStarting("a", "b");
        assertThat(filter.include(fileWithName("acd")), is(false));
        assertThat(filter.include(fileWithName("bcd")), is(false));
        assertThat(filter.include(fileWithName("ACD")), is(true));
        assertThat(filter.include(fileWithName("BCD")), is(true));
        assertThat(filter.include(fileWithName("ddd")), is(true));
    }

    @Test
    public void shouldFilterNamesEnding() throws Exception {
        ResourceIncludeFilter<File> filter = Including.fileNames().ending("a", "b");
        assertThat(filter.include(fileWithName("dca")), is(true));
        assertThat(filter.include(fileWithName("dcb")), is(true));
        assertThat(filter.include(fileWithName("DCA")), is(true));
        assertThat(filter.include(fileWithName("DCB")), is(true));
        assertThat(filter.include(fileWithName("ddd")), is(false));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesEnding() throws Exception {
        ResourceIncludeFilter<File> filter = Including.caseSensitiveFileNames().ending("a", "b");
        assertThat(filter.include(fileWithName("dca")), is(true));
        assertThat(filter.include(fileWithName("dcb")), is(true));
        assertThat(filter.include(fileWithName("DCA")), is(false));
        assertThat(filter.include(fileWithName("DCB")), is(false));
        assertThat(filter.include(fileWithName("ddd")), is(false));
    }

    @Test
    public void shouldFilterNamesNotEnding() throws Exception {
        ResourceIncludeFilter<File> filter = Including.fileNames().notEnding("a", "b");
        assertThat(filter.include(fileWithName("dca")), is(false));
        assertThat(filter.include(fileWithName("dcb")), is(false));
        assertThat(filter.include(fileWithName("DCA")), is(false));
        assertThat(filter.include(fileWithName("DCB")), is(false));
        assertThat(filter.include(fileWithName("ddd")), is(true));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesNotEnding() throws Exception {
        ResourceIncludeFilter<File> filter = Including.caseSensitiveFileNames().notEnding("a", "b");
        assertThat(filter.include(fileWithName("dca")), is(false));
        assertThat(filter.include(fileWithName("dcb")), is(false));
        assertThat(filter.include(fileWithName("DCA")), is(true));
        assertThat(filter.include(fileWithName("DCB")), is(true));
        assertThat(filter.include(fileWithName("ddd")), is(true));
    }

    @Test
    public void shouldFilterNamesContaining() throws Exception {
        ResourceIncludeFilter<File> filter = Including.fileNames().containing("a", "b");
        assertThat(filter.include(fileWithName("cad")), is(true));
        assertThat(filter.include(fileWithName("cbd")), is(true));
        assertThat(filter.include(fileWithName("CAD")), is(true));
        assertThat(filter.include(fileWithName("CBD")), is(true));
        assertThat(filter.include(fileWithName("ddd")), is(false));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesContaining() throws Exception {
        ResourceIncludeFilter<File> filter = Including.caseSensitiveFileNames().containing("a", "b");
        assertThat(filter.include(fileWithName("cad")), is(true));
        assertThat(filter.include(fileWithName("cbd")), is(true));
        assertThat(filter.include(fileWithName("CAD")), is(false));
        assertThat(filter.include(fileWithName("CBD")), is(false));
        assertThat(filter.include(fileWithName("ddd")), is(false));
    }

    @Test
    public void shouldFilterNamesNotContaining() throws Exception {
        ResourceIncludeFilter<File> filter = Including.fileNames().notContaining("a", "b");
        assertThat(filter.include(fileWithName("cad")), is(false));
        assertThat(filter.include(fileWithName("cbd")), is(false));
        assertThat(filter.include(fileWithName("CAD")), is(false));
        assertThat(filter.include(fileWithName("CBD")), is(false));
        assertThat(filter.include(fileWithName("ddd")), is(true));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesNotContaining() throws Exception {
        ResourceIncludeFilter<File> filter = Including.caseSensitiveFileNames().notContaining("a", "b");
        assertThat(filter.include(fileWithName("cad")), is(false));
        assertThat(filter.include(fileWithName("cbd")), is(false));
        assertThat(filter.include(fileWithName("CAD")), is(true));
        assertThat(filter.include(fileWithName("CBD")), is(true));
        assertThat(filter.include(fileWithName("ddd")), is(true));
    }

    @Test
    public void shouldFilterNamesMatching() throws Exception {
        ResourceIncludeFilter<File> filter = Including.fileNames().matching("a", "b");
        assertThat(filter.include(fileWithName("a")), is(true));
        assertThat(filter.include(fileWithName("b")), is(true));
        assertThat(filter.include(fileWithName("A")), is(true));
        assertThat(filter.include(fileWithName("B")), is(true));
        assertThat(filter.include(fileWithName("ab")), is(false));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesMatching() throws Exception {
        ResourceIncludeFilter<File> filter = Including.caseSensitiveFileNames().matching("a", "b");
        assertThat(filter.include(fileWithName("a")), is(true));
        assertThat(filter.include(fileWithName("b")), is(true));
        assertThat(filter.include(fileWithName("A")), is(false));
        assertThat(filter.include(fileWithName("B")), is(false));
        assertThat(filter.include(fileWithName("ab")), is(false));
    }

    @Test
    public void shouldFilterNamesNotMatching() throws Exception {
        ResourceIncludeFilter<File> filter = Including.fileNames().notMatching("a", "b");
        assertThat(filter.include(fileWithName("a")), is(false));
        assertThat(filter.include(fileWithName("b")), is(false));
        assertThat(filter.include(fileWithName("A")), is(false));
        assertThat(filter.include(fileWithName("B")), is(false));
        assertThat(filter.include(fileWithName("ab")), is(true));
    }

    @Test
    public void shouldFilterCaseSensitiveNamesNotMatching() throws Exception {
        ResourceIncludeFilter<File> filter = Including.caseSensitiveFileNames().notMatching("a", "b");
        assertThat(filter.include(fileWithName("a")), is(false));
        assertThat(filter.include(fileWithName("b")), is(false));
        assertThat(filter.include(fileWithName("A")), is(true));
        assertThat(filter.include(fileWithName("B")), is(true));
        assertThat(filter.include(fileWithName("ab")), is(true));
    }

    @Test
    public void shouldSupportCompoundFilters() throws Exception {
        ResourceIncludeFilter<File> filter = Including.fileNames().starting("~").ending(".tmp", ".bak").notContaining("keep");
        assertThat(filter.include(fileWithName("~file.tmp")), is(true));
        assertThat(filter.include(fileWithName("~file.bak")), is(true));
        assertThat(filter.include(fileWithName("file.tmp")), is(false));
        assertThat(filter.include(fileWithName("~file.dat")), is(false));
        assertThat(filter.include(fileWithName("~xxkeepxx.bak")), is(false));
    }

    @Test
    public void shouldFilterHiddenResources() throws Exception {
        ResourceIncludeFilter<Resource> filter = Including.hiddenResources();
        assertThat(filter.include(fileWithName(".hidden")), is(true));
        assertThat(filter.include(fileWithName("nothidden")), is(false));
        assertThat(filter.include(folderWithName(".hidden")), is(true));
        assertThat(filter.include(folderWithName("nothidden")), is(false));
    }

    @Test
    public void shouldFilterNonHiddenResources() throws Exception {
        ResourceIncludeFilter<Resource> filter = Including.nonHiddenResources();
        assertThat(filter.include(fileWithName(".hidden")), is(false));
        assertThat(filter.include(fileWithName("nothidden")), is(true));
        assertThat(filter.include(folderWithName(".hidden")), is(false));
        assertThat(filter.include(folderWithName("nothidden")), is(true));
    }

    @Test
    public void shouldFilterHiddenFolders() throws Exception {
        ResourceIncludeFilter<Folder> filter = Including.hiddenFolders();
        assertThat(filter.include(folderWithName(".hidden")), is(true));
        assertThat(filter.include(folderWithName("nothidden")), is(false));
    }

    @Test
    public void shouldFilterNonHiddenFolders() throws Exception {
        ResourceIncludeFilter<Folder> filter = Including.nonHiddenFolders();
        assertThat(filter.include(folderWithName(".hidden")), is(false));
        assertThat(filter.include(folderWithName("nothidden")), is(true));
    }

    @Test
    public void shouldFilterHiddenFiles() throws Exception {
        ResourceIncludeFilter<File> filter = Including.hiddenFiles();
        assertThat(filter.include(fileWithName(".hidden")), is(true));
        assertThat(filter.include(fileWithName("nothidden")), is(false));
    }

    @Test
    public void shouldFilterNonHiddenFiles() throws Exception {
        ResourceIncludeFilter<File> filter = Including.nonHiddenFiles();
        assertThat(filter.include(fileWithName(".hidden")), is(false));
        assertThat(filter.include(fileWithName("nothidden")), is(true));
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
