
package com.wavemaker.spinup.web;

import org.cloudfoundry.spinup.authentication.LoginCredentials;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * Data holder used to collect {@link LoginCredentials}.
 */
public class LoginCredentialsBean implements LoginCredentials {

    @NotEmpty
    private String username;

    @NotEmpty
    private String password;

    @Override
    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
