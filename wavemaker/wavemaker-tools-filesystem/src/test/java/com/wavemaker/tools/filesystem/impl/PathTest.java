
package com.wavemaker.tools.filesystem.impl;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;


public class PathTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void shouldCreateRoot() throws Exception {
        Path path = new Path();
        assertThat(path.getName(), is(""));
        assertThat(path.toString(), is(""));
    }

    @Test
    public void shouldNotCreateNullNested() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Path must not be empty");
        new Path().get(null);
    }

    @Test
    public void shouldNotCreateEmptyNested() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Path must not be empty");
        new Path().get("");
    }

    @Test
    public void shouldGetSimpleNested() throws Exception {
        Path path = new Path().get("a");
        assertThat(path.getName(), is("a"));
        assertThat(path.toString(), is("/a"));
    }

    @Test
    public void shouldGetDoubleNested() throws Exception {
        Path path = new Path().get("a").get("b");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));
    }

    @Test
    public void shouldGetNestedString() throws Exception {
        Path path = new Path().get("a/b");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));
    }

    @Test
    public void shouldGetRelative() throws Exception {
        Path path = new Path().get("a/b/../c");
        assertThat(path.getName(), is("c"));
        assertThat(path.toString(), is("/a/c"));
    }

    @Test
    public void shouldGetRelativeAtEnd() throws Exception {
        Path path = new Path().get("a/b/c/d/../..");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));

    }

    @Test
    public void shouldNotAllowRelativePastRoot() throws Exception {
        this.thrown.expect(IllegalStateException.class);
        new Path().get("a/b/../../..");
    }

    @Test
    public void shouldSupportSlashAtFront() throws Exception {
        Path path = new Path().get("a").get("/b");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/b"));
    }

    @Test
    public void shouldSupportSlashAtEnd() throws Exception {
        Path path = new Path().get("a/b/");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));
    }

    @Test
    public void shouldIgnoreDoubleSlash() throws Exception {
        Path path = new Path().get("a///b/");
        assertThat(path.getName(), is("b"));
        assertThat(path.toString(), is("/a/b"));
    }

    @Test
    public void shouldGetParent() throws Exception {
        Path path = new Path().get("a/b/").getParent();
        assertThat(path.getName(), is("a"));
        assertThat(path.toString(), is("/a"));

    }
}
