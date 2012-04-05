
package com.wavemaker.tools.cloudfoundry.timeout;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.wavemaker.tools.cloudfoundry.timeout.monitor.HttpServletResponseMonitorFactory;
import com.wavemaker.tools.cloudfoundry.timeout.monitor.MonitoredHttpServletResponseWrapper;

/**
 * Tests for {@link TimeoutProtectionFilter}.
 * 
 * @author Phillip Webb
 */
public class TimeoutProtectionFilterTest {

    private static final String UID = "xxxx-xxxx-xxxx-xxxx";

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private TimeoutProtectionFilter filter;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain chain;

    @Mock
    private TimeoutProtectionStrategy protector;

    @Mock
    private HttpServletResponseMonitorFactory monitorFactory;

    @Captor
    private ArgumentCaptor<ServletResponse> responseCaptor;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.filter = new TimeoutProtectionFilter();
        this.filter.setProtector(this.protector);
        given(this.protector.handleRequest(any(TimeoutProtectionHttpRequest.class))).willReturn(this.monitorFactory);
    }

    @Test
    public void shouldNeedTimeoutProtectionStrategy() throws Exception {
        TimeoutProtectionFilter filter = new TimeoutProtectionFilter();
        this.thrown.expect(IllegalStateException.class);
        this.thrown.expectMessage("Please set the TimeoutProtectionStrategy");
        filter.doFilter(this.request, this.response, this.chain);
    }

    @Test
    public void shouldNotAttemptToProtectNonHttp() throws Exception {
        ServletRequest request = mock(ServletRequest.class);
        ServletResponse response = mock(ServletResponse.class);
        this.filter.doFilter(request, response, this.chain);
        verify(this.chain).doFilter(request, response);
        verifyZeroInteractions(this.protector);
    }

    @Test
    public void shouldMonitorHttpResponse() throws Exception {
        setupInitialRequest();
        this.filter.doFilter(this.request, this.response, this.chain);
        verify(this.protector).handleRequest(any(TimeoutProtectionHttpRequest.class));
        verify(this.chain).doFilter(eq(this.request), this.responseCaptor.capture());
        assertThat(this.responseCaptor.getValue(), is(MonitoredHttpServletResponseWrapper.class));
    }

    @Test
    public void shouldCleanupOnSuccess() throws Exception {
        setupInitialRequest();
        this.filter.doFilter(this.request, this.response, this.chain);
        verify(this.protector).afterRequest(any(TimeoutProtectionHttpRequest.class), eq(this.monitorFactory));
    }

    @Test
    public void shouldCleanupOnFailure() throws Exception {
        setupInitialRequest();
        willThrow(new IOException()).given(this.chain).doFilter(this.request, this.response);
        this.filter.doFilter(this.request, this.response, this.chain);
        verify(this.protector).afterRequest(any(TimeoutProtectionHttpRequest.class), eq(this.monitorFactory));
    }

    @Test
    public void shouldHandlePoll() throws Exception {
        setupPollRequest();
        this.filter.doFilter(this.request, this.response, this.chain);
        verify(this.protector).handlePoll(any(TimeoutProtectionHttpRequest.class), eq(this.response));
    }

    private void setupInitialRequest() {
        given(this.request.getHeader(TimeoutProtectionHttpRequest.Type.INITIAL_REQUEST.value())).willReturn(UID);
    }

    private void setupPollRequest() {
        given(this.request.getHeader(TimeoutProtectionHttpRequest.Type.POLL.value())).willReturn(UID);
    }
}
