
package com.wavemaker.tools.io.filesystem;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import com.wavemaker.tools.io.ResourcePath;

public class FileSystemPathTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void shouldCreateRoot() throws Exception {
        ResourcePath path = new ResourcePath();
        assertThat(path.getName(), is(""));
        assertThat(path.toString(), is(""));
    }

    @Test
    public void shouldNotCreateNullNested() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Path must not be empty");
        new ResourcePath().get(null);
    }

    @Test
    public void shouldNotCreateEmptyNested() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Path must not be empty");
        new ResourcePath().get("");
    }

    @Test
    public void shouldGetSimpleNested() throws Exception {
        ResourcePath path = new ResourcePath().get("a");
        assertThat(path.getName(), is("a"));
        assertThat(path.toString(), is("/a"));
    }

    @Test
    public void shouldGetDoubleNested() throws Exception {
        ResourcePath path = new ResourcePath().get("a").get("b");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));
    }

    @Test
    public void shouldGetNestedString() throws Exception {
        ResourcePath path = new ResourcePath().get("a/b");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));
    }

    @Test
    public void shouldGetRelative() throws Exception {
        ResourcePath path = new ResourcePath().get("a/b/../c");
        assertThat(path.getName(), is("c"));
        assertThat(path.toString(), is("/a/c"));
    }

    @Test
    public void shouldGetRelativeAtEnd() throws Exception {
        ResourcePath path = new ResourcePath().get("a/b/c/d/../..");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));

    }

    @Test
    public void shouldNotAllowRelativePastRoot() throws Exception {
        this.thrown.expect(IllegalStateException.class);
        new ResourcePath().get("a/b/../../..");
    }

    @Test
    public void shouldSupportSlashAtFront() throws Exception {
        ResourcePath path = new ResourcePath().get("a").get("/b");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/b"));
    }

    @Test
    public void shouldSupportSlashAtEnd() throws Exception {
        ResourcePath path = new ResourcePath().get("a/b/");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));
    }

    @Test
    public void shouldIgnoreDoubleSlash() throws Exception {
        ResourcePath path = new ResourcePath().get("a///b/");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));
    }

    @Test
    public void shouldGetParent() throws Exception {
        ResourcePath path = new ResourcePath().get("a/b/").getParent();
        assertThat(path.getName(), is("a"));
        assertThat(path.toString(), is("/a"));
    }
}
