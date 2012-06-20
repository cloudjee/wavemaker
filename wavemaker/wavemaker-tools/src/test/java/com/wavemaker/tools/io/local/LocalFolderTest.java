
package com.wavemaker.tools.io.local;

import static org.hamcrest.Matchers.is;
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
}
