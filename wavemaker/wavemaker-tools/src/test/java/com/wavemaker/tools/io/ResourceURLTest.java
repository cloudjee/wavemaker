
package com.wavemaker.tools.io;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.rules.TemporaryFolder;

import com.wavemaker.tools.io.filesystem.FileSystemFolder;
import com.wavemaker.tools.io.filesystem.local.LocalFileSystem;

/**
 * Tests for {@link ResourceURL}.
 * 
 * @author Phillip Webb
 */
public class ResourceURLTest {

    @Rule
    public TemporaryFolder temporaryFolder = new TemporaryFolder();

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private Folder root;

    @Before
    public void setup() throws Exception {
        File tempFolder = this.temporaryFolder.newFolder("fs");
        LocalFileSystem fileSystem = new LocalFileSystem(tempFolder);
        this.root = FileSystemFolder.getRoot(fileSystem);
        this.root.getFile("/jail/a/b/c.txt").getContent().write("c");
        this.root.getFile("/jail/x/y/z.txt").getContent().write("z");
    }

    @Test
    public void shouldGetFileURL() throws Exception {
        URL url = ResourceURL.get(this.root.getFile("/jail/a/b/c.txt"));
        assertThat(url.toString(), is(equalTo("rfs:/jail/a/b/c.txt")));
    }

    @Test
    public void shouldGetFolderURL() throws Exception {
        URL url = ResourceURL.get(this.root.getFolder("/jail/a/b"));
        assertThat(url.toString(), is(equalTo("rfs:/jail/a/b/")));
    }

    @Test
    public void shouldGetJailedURL() throws Exception {
        Folder jail = this.root.getFolder("jail").jail();
        URL url = ResourceURL.get(jail.getFile("/a/b/c.txt"));
        assertThat(url.toString(), is(equalTo("rfs:/a/b/c.txt")));
    }

    @Test
    public void shouldOpenStream() throws Exception {
        URL url = ResourceURL.get(this.root.getFile("/jail/a/b/c.txt"));
        assertThat(IOUtils.toString(url.openStream()), is(equalTo("c")));
    }

    @Test
    public void shouldOpenJailedStream() throws Exception {
        Folder jail = this.root.getFolder("jail").jail();
        URL url = ResourceURL.get(jail.getFile("/a/b/c.txt"));
        assertThat(IOUtils.toString(url.openStream()), is(equalTo("c")));
    }

    @Test
    public void shouldCreateRelativeToFolder() throws Exception {
        Folder jail = this.root.getFolder("jail").jail();
        URL ab = ResourceURL.get(jail.getFolder("a/b"));
        URL url = new URL(ab, "c.txt");
        assertThat(url.toString(), is(equalTo("rfs:/a/b/c.txt")));
        assertThat(IOUtils.toString(url.openStream()), is(equalTo("c")));
    }

    @Test
    public void shouldCreateExactToFolder() throws Exception {
        Folder jail = this.root.getFolder("jail").jail();
        URL ab = ResourceURL.get(jail.getFolder("a/b"));
        URL url = new URL(ab, "/x/y/z.txt");
        assertThat(url.toString(), is(equalTo("rfs:/x/y/z.txt")));
        assertThat(IOUtils.toString(url.openStream()), is(equalTo("z")));
    }

    @Test
    public void shouldCreateRelativeToFile() throws Exception {
        Folder jail = this.root.getFolder("jail").jail();
        URL abc = ResourceURL.get(jail.getFile("a/b/c.txt"));
        URL url = new URL(abc, "/x/y/z.txt");
        assertThat(url.toString(), is(equalTo("rfs:/x/y/z.txt")));
        assertThat(IOUtils.toString(url.openStream()), is(equalTo("z")));
    }

    @Test
    public void shouldThrowIOExceptionIfFileDoesNotExist() throws Exception {
        URL url = ResourceURL.get(this.root.getFile("doesnotexist.txt"));
        this.thrown.expect(IOException.class);
        this.thrown.expectMessage("File '/doesnotexist.txt' does not exist");
        url.openConnection();
    }

    @Test
    public void shouldThrowIOOpeningFolder() throws Exception {
        URL url = ResourceURL.get(this.root.getFolder("/jail/a/b"));
        this.thrown.expect(IOException.class);
        this.thrown.expectMessage("Unable to open URL connection to folder '/jail/a/b/'");
        url.openConnection();
    }

    @Test
    public void shouldWorkViaClassLoader() throws Exception {
        Folder jail = this.root.getFolder("jail").jail();
        URLClassLoader classLoader = new URLClassLoader(new URL[] { ResourceURL.get(jail) });
        assertThat(IOUtils.toString(classLoader.getResourceAsStream("/a/b/c.txt")), is(equalTo("c")));
        assertThat(classLoader.getResource("/x/y/z.txt").toString(), is(equalTo("rfs:/x/y/z.txt")));
    }

    @Test
    public void shouldGetForCollection() throws Exception {
        List<Folder> folders = new ArrayList<Folder>();
        folders.add(this.root.getFolder("/jail/a"));
        folders.add(this.root.getFolder("/jail/a/b"));
        List<URL> url = ResourceURL.getForResources(folders);
        assertThat(url.size(), is(2));
        assertThat(url.get(0).toString(), is(equalTo("rfs:/jail/a/")));
        assertThat(url.get(1).toString(), is(equalTo("rfs:/jail/a/b/")));
    }
}
