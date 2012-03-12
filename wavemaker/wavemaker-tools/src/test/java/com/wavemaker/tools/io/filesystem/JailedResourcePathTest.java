
package com.wavemaker.tools.io.filesystem;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import com.wavemaker.tools.io.ResourcePath;

/**
 * Tests for {@link JailedResourcePath}.
 * 
 * @author Phillip Webb
 */
public class JailedResourcePathTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private final ResourcePath pathA = new ResourcePath().get("a");

    private final ResourcePath pathB = new ResourcePath().get("b");

    @Test
    public void shouldNeedJail() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("JailPath must not be null");
        new JailedResourcePath(null, new ResourcePath());
    }

    @Test
    public void shouldNeedPath() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Path must not be null");
        new JailedResourcePath(new ResourcePath(), null);
    }

    @Test
    public void shouldCreateFromJailAndPath() throws Exception {
        JailedResourcePath jailedResourcePath = new JailedResourcePath(this.pathA, this.pathB);
        assertThat(jailedResourcePath.getJailPath(), is(this.pathA));
        assertThat(jailedResourcePath.getPath(), is(this.pathB));
    }

    @Test
    public void shouldCreateRoot() throws Exception {
        JailedResourcePath jailedResourcePath = new JailedResourcePath();
        assertThat(jailedResourcePath.getJailPath().isRootPath(), is(true));
        assertThat(jailedResourcePath.getPath().isRootPath(), is(true));
    }

    @Test
    public void shouldGetNullParent() throws Exception {
        JailedResourcePath jailedResourcePath = new JailedResourcePath(this.pathA, new ResourcePath());
        assertThat(jailedResourcePath.getParent(), is(nullValue()));
    }

    @Test
    public void shouldGetParent() throws Exception {
        JailedResourcePath jailedResourcePath = new JailedResourcePath(this.pathA, new ResourcePath().get("b/c"));
        JailedResourcePath expected = new JailedResourcePath(this.pathA, this.pathB);
        assertThat(jailedResourcePath.getParent(), is(equalTo(expected)));
    }

    @Test
    public void shouldGet() throws Exception {
        JailedResourcePath jailedResourcePath = new JailedResourcePath(this.pathA, new ResourcePath());
        jailedResourcePath = jailedResourcePath.get("b/c");
        JailedResourcePath expected = new JailedResourcePath(this.pathA, new ResourcePath().get("b/c"));
        assertThat(jailedResourcePath, is(equalTo(expected)));

    }

    @Test
    public void shouldGetUnjailedRootPath() throws Exception {
        JailedResourcePath jailedResourcePath = new JailedResourcePath(new ResourcePath(), this.pathA);
        assertThat(jailedResourcePath.getUnjailedPath(), is(equalTo(new ResourcePath().get("a"))));
    }

    @Test
    public void shouldGetUnjailedPath() throws Exception {
        JailedResourcePath jailedResourcePath = new JailedResourcePath(this.pathA, this.pathB);
        assertThat(jailedResourcePath.getUnjailedPath(), is(equalTo(new ResourcePath().get("a/b"))));
    }

    @Test
    public void shouldUsePathToString() throws Exception {
        JailedResourcePath jailedResourcePath = new JailedResourcePath(this.pathA, this.pathB);
        assertThat(jailedResourcePath.toString(), is(equalTo("/b")));
    }
}
