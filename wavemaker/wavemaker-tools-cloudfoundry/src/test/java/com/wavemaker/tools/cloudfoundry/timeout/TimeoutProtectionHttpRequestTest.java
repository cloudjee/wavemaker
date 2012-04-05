
package com.wavemaker.tools.cloudfoundry.timeout;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.junit.Test;

/**
 * Tests for {@link TimeoutProtectionHttpRequest}.
 * 
 * @author Phillip Webb
 */
public class TimeoutProtectionHttpRequestTest {

    private static final String UID = "xxxx-xxxx-xxxx-xxxx";

    @Test
    public void shouldNotGetFromNotHttp() throws Exception {
        assertNull(TimeoutProtectionHttpRequest.get(null));
        assertNull(TimeoutProtectionHttpRequest.get(mock(ServletRequest.class)));
    }

    @Test
    public void shouldGetInitialRequest() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        given(request.getHeader("X-CloudFoundry-Timeout-Protection-Initial-Request")).willReturn(UID);
        TimeoutProtectionHttpRequest protectionRequest = TimeoutProtectionHttpRequest.get(request);
        assertNotNull(protectionRequest);
        assertThat(protectionRequest.getServletRequest(), is(request));
        assertThat(protectionRequest.getType(), is(TimeoutProtectionHttpRequest.Type.INITIAL_REQUEST));
        assertThat(protectionRequest.getUid(), is(UID));
    }

    @Test
    public void shouldGetPollRequest() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        given(request.getHeader("X-CloudFoundry-Timeout-Protection-Poll")).willReturn(UID);
        TimeoutProtectionHttpRequest protectionRequest = TimeoutProtectionHttpRequest.get(request);
        assertNotNull(protectionRequest);
        assertThat(protectionRequest.getServletRequest(), is(request));
        assertThat(protectionRequest.getType(), is(TimeoutProtectionHttpRequest.Type.POLL));
        assertThat(protectionRequest.getUid(), is(UID));
    }

    @Test
    public void shouldNotGetIfNoHeader() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        TimeoutProtectionHttpRequest protectionRequest = TimeoutProtectionHttpRequest.get(request);
        assertNull(protectionRequest);
    }

    @Test
    public void shouldNotGetIfEmptyHeader() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        given(request.getHeader("X-CloudFoundry-Timeout-Protection-Poll")).willReturn("");
        TimeoutProtectionHttpRequest protectionRequest = TimeoutProtectionHttpRequest.get(request);
        assertNull(protectionRequest);
    }

}
