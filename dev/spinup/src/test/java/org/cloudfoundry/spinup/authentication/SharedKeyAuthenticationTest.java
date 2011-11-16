
package org.cloudfoundry.spinup.authentication;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

/**
 * Tests for {@link SharedKeyAuthentication}
 * 
 * @author Phillip Webb
 */
public class SharedKeyAuthenticationTest {

    private static final byte[] NO_BYTES = new byte[] {};

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Mock
    private LoginManager loginManager;

    @Mock
    private SharedSecret sharedSecret;

    private SharedKeyAuthentication sharedKeyAuthentication;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.sharedKeyAuthentication = new SharedKeyAuthentication(this.sharedSecret, this.loginManager);
    }

    @Test
    public void shouldNeedSharedSecret() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("SharedSecret must not be null");
        new SharedKeyAuthentication(null, this.loginManager);
    }

    @Test
    public void shouldNeeLoginManager() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("LoginManager must not be null");
        new SharedKeyAuthentication(this.sharedSecret, null);
    }

    @Test
    public void shouldNeedLoginCredentials() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Credentials must not be null");
        this.sharedKeyAuthentication.getTransportToken(null);
    }

    @Test
    public void shouldNeedTransportToken() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("TransportToken must not be null");
        this.sharedKeyAuthentication.getAuthenticationToken(null);
    }

    @Test
    public void shouldTransportCredentials() throws Exception {
        LoginCredentials credentials = mock(LoginCredentials.class);
        AuthenticationToken authenticationToken = new AuthenticationToken(NO_BYTES);
        TransportToken transportToken = new TransportToken(NO_BYTES, NO_BYTES);
        given(this.loginManager.login(credentials)).willReturn(authenticationToken);
        given(this.sharedSecret.encrypt(authenticationToken)).willReturn(transportToken);
        given(this.sharedSecret.decrypt(transportToken)).willReturn(authenticationToken);
        TransportToken actualTransportToken = this.sharedKeyAuthentication.getTransportToken(credentials);
        AuthenticationToken actualAuthenticationToken = this.sharedKeyAuthentication.getAuthenticationToken(actualTransportToken);
        assertThat(actualAuthenticationToken, is(sameInstance(authenticationToken)));
    }
}
