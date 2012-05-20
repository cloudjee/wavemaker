
package com.wavemaker.tools.cloudfoundry.timeout.monitor;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Locale;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

/**
 * Tests for {@link DuplicatingHttpServletResponseMonitorFactory}.
 * 
 * @author Phillip Webb
 */
public class DuplicatingHttpServletResponseMonitorFactoryTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private HttpServletResponseMonitor monitor;

    @Mock
    private HttpServletResponse response;

    private final ByteArrayOutputStream responseOutputStream = new ByteArrayOutputStream();

    @Before
    public void setup() throws IOException {
        MockitoAnnotations.initMocks(this);
        this.monitor = new DuplicatingHttpServletResponseMonitorFactory(this.response).getMonitor();
        ServletOutputStream servletOutputStream = new ServletOutputStream() {

            @Override
            public void write(int b) throws IOException {
                DuplicatingHttpServletResponseMonitorFactoryTest.this.responseOutputStream.write(b);
            }
        };
        given(this.response.getOutputStream()).willReturn(servletOutputStream);
    }

    @Test
    public void shouldNeedResponse() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Response must not be null");
        new DuplicatingHttpServletResponseMonitorFactory(null);
    }

    @Test
    public void shouldRecordAddCookie() throws Exception {
        Cookie cookie = mock(Cookie.class);
        this.monitor.addCookie(cookie);
        verify(this.response).addCookie(cookie);
    }

    @Test
    public void shouldRecordSendError() throws Exception {
        int sc = 500;
        this.monitor.sendError(sc);
        verify(this.response).sendError(sc);
    }

    @Test
    public void shouldRecordSendErrorWithMessage() throws Exception {
        int sc = 500;
        String msg = "Message";
        this.monitor.sendError(sc, msg);
        verify(this.response).sendError(sc, msg);
    }

    @Test
    public void shouldRecordSendRedirect() throws Exception {
        String location = "location";
        this.monitor.sendRedirect(location);
        verify(this.response).sendRedirect(location);
    }

    @Test
    public void shouldRecordSetDateHeader() throws Exception {
        String name = "name";
        long date = System.currentTimeMillis();
        this.monitor.setDateHeader(name, date);
        verify(this.response).setDateHeader(name, date);
    }

    @Test
    public void shouldRecordAddDateHeader() throws Exception {
        String name = "name";
        long date = System.currentTimeMillis();
        this.monitor.addDateHeader(name, date);
        verify(this.response).addDateHeader(name, date);
    }

    @Test
    public void shouldRecordSetHeader() throws Exception {
        String name = "name";
        String value = "value";
        this.monitor.setHeader(name, value);
        verify(this.response).setHeader(name, value);
    }

    @Test
    public void shouldRecordAddHeader() throws Exception {
        String name = "name";
        String value = "value";
        this.monitor.addHeader(name, value);
        verify(this.response).addHeader(name, value);
    }

    @Test
    public void shouldRecordSetIntHeader() throws Exception {
        String name = "name";
        int value = 400;
        this.monitor.setIntHeader(name, value);
        verify(this.response).setIntHeader(name, value);
    }

    @Test
    public void shouldRecordAddIntHeader() throws Exception {
        String name = "name";
        int value = 400;
        this.monitor.addIntHeader(name, value);
        verify(this.response).addIntHeader(name, value);
    }

    @Test
    public void shouldRecordSetStatus() throws Exception {
        int sc = 500;
        this.monitor.setStatus(sc);
        verify(this.response).setStatus(sc);
    }

    @Test
    @SuppressWarnings("deprecation")
    public void shouldRecordSetStatusWithMessage() throws Exception {
        int sc = 500;
        String sm = "message";
        this.monitor.setStatus(sc, sm);
        verify(this.response).setStatus(sc, sm);
    }

    @Test
    public void shouldRecordSetContentLength() throws Exception {
        int len = 100;
        this.monitor.setContentLength(len);
        verify(this.response).setContentLength(len);
    }

    @Test
    public void shouldRecordSetContentType() throws Exception {
        String type = "type";
        this.monitor.setContentType(type);
        verify(this.response).setContentType(type);
    }

    @Test
    public void shouldRecordSetBufferSize() throws Exception {
        int size = 100;
        this.monitor.setBufferSize(size);
        verify(this.response).setBufferSize(size);
    }

    @Test
    public void shouldRecordFlushBuffer() throws Exception {
        this.monitor.flushBuffer();
        verify(this.response).flushBuffer();
    }

    @Test
    public void shouldRecordReset() throws Exception {
        this.monitor.reset();
        verify(this.response).reset();
    }

    @Test
    public void shouldRecordResetBuffer() throws Exception {
        this.monitor.resetBuffer();
        verify(this.response).resetBuffer();
    }

    @Test
    public void shouldRecordSetLocale() throws Exception {
        Locale loc = Locale.UK;
        this.monitor.setLocale(loc);
        verify(this.response).setLocale(loc);
    }

    @Test
    public void shouldRecordWriteByte() throws Exception {
        int b = 2;
        this.monitor.write(b);
        assertThat(this.responseOutputStream.toByteArray(), is(new byte[] { 2 }));
    }

    @Test
    public void shouldRecordWriteBytes() throws Exception {
        byte[] b = { 0, 1, 2, 3 };
        this.monitor.write(b);
        assertThat(this.responseOutputStream.toByteArray(), is(b));
    }

    @Test
    public void shouldRecordWriteBytesWithOffset() throws Exception {
        byte[] b = { 0, 1, 2, 3 };
        int off = 1;
        int len = 2;
        this.monitor.write(b, off, len);
        assertThat(this.responseOutputStream.toByteArray(), is(new byte[] { 1, 2 }));
    }

    @Test
    public void shouldSupportMultipleCalls() throws Exception {
        byte[] b = { 0, 1, 2, 3 };
        this.monitor.setLocale(Locale.UK);
        this.monitor.setContentLength(4);
        this.monitor.write(b, 0, 2);
        this.monitor.write(b, 2, 2);
        verify(this.response).setLocale(Locale.UK);
        verify(this.response).setContentLength(4);
        assertThat(this.responseOutputStream.toByteArray(), is(new byte[] { 0, 1, 2, 3 }));
    }

    @Test
    public void shouldSupportEquals() throws Exception {
        ReplayableHttpServletResponseMonitor monitor1 = new ReplayableHttpServletResponseMonitorFactory().getMonitor();
        ReplayableHttpServletResponseMonitor monitor2 = new ReplayableHttpServletResponseMonitorFactory().getMonitor();
        assertThat(monitor1, is(equalTo(monitor1)));
        assertThat(monitor1, is(not(equalTo(monitor2))));
    }

    @Test
    public void shouldSupportHashCode() throws Exception {
        ReplayableHttpServletResponseMonitor monitor1 = new ReplayableHttpServletResponseMonitorFactory().getMonitor();
        ReplayableHttpServletResponseMonitor monitor2 = new ReplayableHttpServletResponseMonitorFactory().getMonitor();
        assertThat(monitor1.hashCode(), is(equalTo(monitor1.hashCode())));
        assertThat(monitor1.hashCode(), is(not(equalTo(monitor2.hashCode()))));
    }

    @Test
    public void shouldSupportToString() throws Exception {
        assertThat(this.monitor.toString(), is(notNullValue()));
    }
}
