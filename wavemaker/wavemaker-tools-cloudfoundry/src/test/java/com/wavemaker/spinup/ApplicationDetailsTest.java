
package com.wavemaker.spinup;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import com.wavemaker.spinup.ApplicationDetails;

/**
 * Tests for {@link ApplicationDetails}.
 * 
 * @author Phillip Webb
 */
public class ApplicationDetailsTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void shouldNeedName() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Name must not be null");
        new ApplicationDetails(null, "http://localhost");
    }

    @Test
    public void shouldNeedURL() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("URL must not be null");
        new ApplicationDetails("name", null);
    }

    @Test
    public void shouldGetNameAndURL() throws Exception {
        ApplicationDetails details = new ApplicationDetails("name", "http://localhost");
        assertThat(details.getName(), is(equalTo("name")));
        assertThat(details.getUrl(), is(equalTo("http://localhost")));
    }

}
