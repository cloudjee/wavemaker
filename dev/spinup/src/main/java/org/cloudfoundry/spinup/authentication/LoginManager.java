
package org.cloudfoundry.spinup.authentication;

public interface LoginManager {

    AuthenticationToken login(LoginCredentials credentials);

}
