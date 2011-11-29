
package org.cloudfoundry.spinup.authentication;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

public class LoginCredentialsTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void shouldNeedUsername() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Username must not be null");
        new LoginCredentials(null, "password");
    }

    @Test
    public void shouldNeedPassword() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Password must not be null");
        new LoginCredentials("username", null);
    }

    @Test
    public void shouldGetUsernameAndPassword() throws Exception {
        LoginCredentials c = new LoginCredentials("username", "password");
        assertThat(c.getUsername(), is(equalTo("Username")));
        assertThat(c.getUsername(), is(equalTo("Password")));
    }
}
