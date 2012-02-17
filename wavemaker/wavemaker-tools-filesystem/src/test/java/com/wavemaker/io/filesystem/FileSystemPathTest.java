
package com.wavemaker.io.filesystem;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;



public class FileSystemPathTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void shouldCreateRoot() throws Exception {
        FileSystemPath path = new FileSystemPath();
        assertThat(path.getName(), is(""));
        assertThat(path.toString(), is(""));
    }

    @Test
    public void shouldNotCreateNullNested() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Path must not be empty");
        new FileSystemPath().get(null);
    }

    @Test
    public void shouldNotCreateEmptyNested() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Path must not be empty");
        new FileSystemPath().get("");
    }

    @Test
    public void shouldGetSimpleNested() throws Exception {
        FileSystemPath path = new FileSystemPath().get("a");
        assertThat(path.getName(), is("a"));
        assertThat(path.toString(), is("/a"));
    }

    @Test
    public void shouldGetDoubleNested() throws Exception {
        FileSystemPath path = new FileSystemPath().get("a").get("b");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));
    }

    @Test
    public void shouldGetNestedString() throws Exception {
        FileSystemPath path = new FileSystemPath().get("a/b");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));
    }

    @Test
    public void shouldGetRelative() throws Exception {
        FileSystemPath path = new FileSystemPath().get("a/b/../c");
        assertThat(path.getName(), is("c"));
        assertThat(path.toString(), is("/a/c"));
    }

    @Test
    public void shouldGetRelativeAtEnd() throws Exception {
        FileSystemPath path = new FileSystemPath().get("a/b/c/d/../..");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));

    }

    @Test
    public void shouldNotAllowRelativePastRoot() throws Exception {
        this.thrown.expect(IllegalStateException.class);
        new FileSystemPath().get("a/b/../../..");
    }

    @Test
    public void shouldSupportSlashAtFront() throws Exception {
        FileSystemPath path = new FileSystemPath().get("a").get("/b");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/b"));
    }

    @Test
    public void shouldSupportSlashAtEnd() throws Exception {
        FileSystemPath path = new FileSystemPath().get("a/b/");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));
    }

    @Test
    public void shouldIgnoreDoubleSlash() throws Exception {
        FileSystemPath path = new FileSystemPath().get("a///b/");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));
    }

    @Test
    public void shouldGetParent() throws Exception {
        FileSystemPath path = new FileSystemPath().get("a/b/").getParent();
        assertThat(path.getName(), is("a"));
        assertThat(path.toString(), is("/a"));

    }
}
