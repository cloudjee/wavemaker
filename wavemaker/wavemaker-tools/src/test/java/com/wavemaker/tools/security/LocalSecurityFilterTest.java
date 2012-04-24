
package com.wavemaker.tools.security;

import static org.mockito.Mockito.verify;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

/**
 * Tests for {@link LocalSecurityFilter}.
 * 
 * @author Phillip Webb
 */
@RunWith(MockitoJUnitRunner.class)
public class LocalSecurityFilterTest {

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain chain;

    private final LocalSecurityFilter filter = new LocalSecurityFilter();

    @Test
    public void shouldDoNothing() throws Exception {
        this.filter.doFilter(this.request, this.response, this.chain);
        verify(this.chain).doFilter(this.request, this.response);
    }

}
