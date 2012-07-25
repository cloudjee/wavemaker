
package com.wavemaker.tools.io.local;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertThat;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.FilterOn;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.Resources;

/**
 * Tests for {@link LocalFolder}.
 * 
 * @author Phillip Webb
 */
public class LocalFolderTest {

    @Rule
    public TemporaryFolder temp = new TemporaryFolder();

    @Rule
    public TemporaryFolder dest = new TemporaryFolder();

    private LocalFolder root;

    @Before
    public void setup() {
        this.root = new LocalFolder(this.temp.getRoot());
        this.root.getFile("/a/b/c.txt").getContent().write("c");
        this.root.getFile("/d/e/f.txt").getContent().write("d");
        this.root.getFile("/g.txt").getContent().write("g");
    }

    @Test
    public void shouldFind() throws Exception {
        List<Resource> all = this.root.find().fetchAll();
        Set<String> actual = getNames(all);
        Set<String> expected = new HashSet<String>();
        expected.add("/a/");
        expected.add("/a/b/");
        expected.add("/a/b/c.txt");
        expected.add("/d/");
        expected.add("/d/e/");
        expected.add("/d/e/f.txt");
        expected.add("/g.txt");
        assertThat(actual, is(expected));
    }

    @Test
    public void shouldFindSingle() throws Exception {
        List<Resource> all = this.root.getFolder("a/b").find().fetchAll();
        Set<String> actual = getNames(all);
        Set<String> expected = new HashSet<String>();
        expected.add("/a/b/c.txt");
        assertThat(actual, is(expected));
    }

    @Test
    public void shouldFindFiles() throws Exception {
        List<File> all = this.root.find().files().fetchAll();
        Set<String> actual = getNames(all);
        Set<String> expected = new HashSet<String>();
        expected.add("/a/b/c.txt");
        expected.add("/d/e/f.txt");
        expected.add("/g.txt");
        assertThat(actual, is(expected));
    }

    @Test
    public void shouldFindFilesTwice() throws Exception {
        // WM-4280
        Resources<File> files = this.root.find().files();
        List<File> all1 = files.fetchAll();
        List<File> all2 = files.fetchAll();
        assertThat(all1.size(), is(all2.size()));
    }

    @Test
    public void shouldCopy() throws Exception {
        Folder destination = new LocalFolder(this.dest.getRoot());
        this.root.find().files().exclude(FilterOn.names().starting("f")).copyTo(destination);
        Set<String> actual = getNames(destination.find());
        Set<String> expected = new HashSet<String>();
        expected.add("/a/");
        expected.add("/a/b/");
        expected.add("/a/b/c.txt");
        expected.add("/g.txt");
        assertThat(actual, is(expected));
    }

    private Set<String> getNames(Iterable<? extends Resource> resources) {
        Set<String> allNames = new HashSet<String>();
        for (Resource resource : resources) {
            allNames.add(resource.toString());
        }
        return allNames;
    }

    @Test
    public void shouldUseUnderlyingResourceForEqualsAndHashCode() throws Exception {
        Folder folder1 = new LocalFolder(this.temp.getRoot()).getFolder("folder");
        folder1.createIfMissing();
        Folder folder2 = new LocalFolder(new java.io.File(this.temp.getRoot(), "folder"));
        Folder folder3 = new LocalFolder(this.temp.getRoot()).getFolder("xfolder");
        File file1 = folder1.getFile("file");
        File file2 = folder2.getFile("file");
        File file3 = folder3.getFile("file");
        file1.createIfMissing();
        file2.createIfMissing();
        file3.createIfMissing();

        assertThat(folder1, is(equalTo(folder1)));
        assertThat(folder1, is(equalTo(folder2)));
        assertThat(folder1, is(not(equalTo(folder3))));
        assertThat(file1, is(equalTo(file1)));
        assertThat(file1, is(equalTo(file2)));
        assertThat(file1, is(not(equalTo(file3))));

        assertThat(folder1.hashCode(), is(equalTo(folder1.hashCode())));
        assertThat(folder1.hashCode(), is(equalTo(folder2.hashCode())));
        assertThat(folder1.hashCode(), is(not(equalTo(folder3.hashCode()))));
        assertThat(file1.hashCode(), is(equalTo(file1.hashCode())));
        assertThat(file1.hashCode(), is(equalTo(file2.hashCode())));
        assertThat(file1.hashCode(), is(not(equalTo(file3.hashCode()))));
    }
}
