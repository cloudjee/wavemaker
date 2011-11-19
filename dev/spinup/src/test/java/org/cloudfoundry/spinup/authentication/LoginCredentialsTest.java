
package org.cloudfoundry.spinup.authentication;

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
}
