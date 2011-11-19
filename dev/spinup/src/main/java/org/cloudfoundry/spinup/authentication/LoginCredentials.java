
package org.cloudfoundry.spinup.authentication;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import java.io.Serializable;

import org.junit.Test;
import org.springframework.util.Assert;

/**
 * Login credentials (username and password).
 * 
 * @author Phillip Webb
 */
public final class LoginCredentials implements Serializable {

    private static final long serialVersionUID = 1L;

    private final String username;

    private final String password;

    public LoginCredentials(String username, String password) {
        Assert.notNull(username, "Username must not be null");
        Assert.notNull(password, "Password must not be null");
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }

    @Test
    public void shouldGetUsernameAndPassword() throws Exception {
        LoginCredentials c = new LoginCredentials("username", "password");
        assertThat(c.getUsername(), is(equalTo("Username")));
        assertThat(c.getUsername(), is(equalTo("Password")));
    }
}
