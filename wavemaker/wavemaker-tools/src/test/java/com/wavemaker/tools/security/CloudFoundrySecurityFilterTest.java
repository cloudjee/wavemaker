
package com.wavemaker.tools.security;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;

import javax.servlet.FilterChain;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.wavemaker.tools.cloudfoundry.spinup.authentication.AuthenticationToken;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecret;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecretPropagation;

/**
 * Tests for {@link CloudFoundrySecurityFilter}.
 * 
 * @author Phillip Webb
 */
public class CloudFoundrySecurityFilterTest {

    private static final String COOKIE_NAME = "wavemaker_authentication_token";

    private static final String SPINUP_URL = "http://wavemakerspinup.cloudfoundry.com/login";

    private final CloudFoundrySecurityFilter filter = new CloudFoundrySecurityFilter();

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain chain;

    @Mock
    private SharedSecretPropagation propagation;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.filter.setPropagation(this.propagation);
    }

    @Test
    public void shouldNotRedirectIfAuthenticationTokenIsGood() throws Exception {
        SharedSecret sharedSecret = new SharedSecret();
        AuthenticationToken authenticationToken = new AuthenticationToken("test");
        Cookie cookie = new Cookie(COOKIE_NAME, sharedSecret.encrypt(authenticationToken).encode());
        given(this.request.getCookies()).willReturn(new Cookie[] { cookie });
        given(this.propagation.getForSelf(true)).willReturn(sharedSecret);
        this.filter.doFilter(this.request, this.response, this.chain);
        verify(this.chain).doFilter(this.request, this.response);
    }

    @Test
    public void shouldRedirectOnMissingCookie() throws Exception {
        this.filter.doFilter(this.request, this.response, this.chain);
        verify(this.response).sendRedirect(SPINUP_URL);
        verifyZeroInteractions(this.chain);
    }

    @Test
    public void shouldRedirectOnEmptyCookie() throws Exception {
        Cookie cookie = new Cookie(COOKIE_NAME, "");
        given(this.request.getCookies()).willReturn(new Cookie[] { cookie });
        this.filter.doFilter(this.request, this.response, this.chain);
        verify(this.response).sendRedirect(SPINUP_URL);
        verifyZeroInteractions(this.chain);
    }

    @Test
    public void shouldRedirectOnNoSharedSecret() throws Exception {
        SharedSecret sharedSecret = new SharedSecret();
        AuthenticationToken authenticationToken = new AuthenticationToken("test");
        Cookie cookie = new Cookie(COOKIE_NAME, sharedSecret.encrypt(authenticationToken).encode());
        given(this.request.getCookies()).willReturn(new Cookie[] { cookie });
        given(this.propagation.getForSelf(true)).willThrow(new IllegalStateException());
        this.filter.doFilter(this.request, this.response, this.chain);
        verify(this.response).sendRedirect(SPINUP_URL);
        verifyZeroInteractions(this.chain);
    }

    @Test
    public void shouldRedirectOnTokenDigestError() throws Exception {
        SharedSecret sharedSecret = new SharedSecret();
        AuthenticationToken authenticationToken = new AuthenticationToken("test");
        String encoded = sharedSecret.encrypt(authenticationToken).encode();
        Cookie cookie = new Cookie(COOKIE_NAME, encoded.substring(2));
        given(this.request.getCookies()).willReturn(new Cookie[] { cookie });
        given(this.propagation.getForSelf(true)).willReturn(sharedSecret);
        this.filter.doFilter(this.request, this.response, this.chain);
        verify(this.response).sendRedirect(SPINUP_URL);
        verifyZeroInteractions(this.chain);
    }
}
