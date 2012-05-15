
package com.wavemaker.tools.cloudfoundry.timeout.monitor;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Locale;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

/**
 * Tests for {@link ReplayableHttpServletResponseMonitorFactory}.
 * 
 * @author Phillip Webb
 */
public class ReplayableHttpServletResponseMonitorFactoryTest {

    private ReplayableHttpServletResponseMonitor monitor;

    @Mock
    private HttpServletResponse response;

    private final ByteArrayOutputStream responseOutputStream = new ByteArrayOutputStream();

    @Before
    public void setup() throws IOException {
        this.monitor = new ReplayableHttpServletResponseMonitorFactory().getMonitor();
        MockitoAnnotations.initMocks(this);
        ServletOutputStream servletOutputStream = new ServletOutputStream() {

            @Override
            public void write(int b) throws IOException {
                ReplayableHttpServletResponseMonitorFactoryTest.this.responseOutputStream.write(b);
            }
        };
        given(this.response.getOutputStream()).willReturn(servletOutputStream);
    }

    @Test
    public void shouldRecordAddCookie() throws Exception {
        Cookie cookie = mock(Cookie.class);
        this.monitor.addCookie(cookie);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).addCookie(cookie);
    }

    @Test
    public void shouldRecordSendError() throws Exception {
        int sc = 500;
        this.monitor.sendError(sc);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).sendError(sc);
    }

    @Test
    public void shouldRecordSendErrorWithMessage() throws Exception {
        int sc = 500;
        String msg = "Message";
        this.monitor.sendError(sc, msg);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).sendError(sc, msg);
    }

    @Test
    public void shouldRecordSendRedirect() throws Exception {
        String location = "location";
        this.monitor.sendRedirect(location);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).sendRedirect(location);
    }

    @Test
    public void shouldRecordSetDateHeader() throws Exception {
        String name = "name";
        long date = System.currentTimeMillis();
        this.monitor.setDateHeader(name, date);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).setDateHeader(name, date);
    }

    @Test
    public void shouldRecordAddDateHeader() throws Exception {
        String name = "name";
        long date = System.currentTimeMillis();
        this.monitor.addDateHeader(name, date);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).addDateHeader(name, date);
    }

    @Test
    public void shouldRecordSetHeader() throws Exception {
        String name = "name";
        String value = "value";
        this.monitor.setHeader(name, value);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).setHeader(name, value);
    }

    @Test
    public void shouldRecordAddHeader() throws Exception {
        String name = "name";
        String value = "value";
        this.monitor.addHeader(name, value);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).addHeader(name, value);
    }

    @Test
    public void shouldRecordSetIntHeader() throws Exception {
        String name = "name";
        int value = 400;
        this.monitor.setIntHeader(name, value);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).setIntHeader(name, value);
    }

    @Test
    public void shouldRecordAddIntHeader() throws Exception {
        String name = "name";
        int value = 400;
        this.monitor.addIntHeader(name, value);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).addIntHeader(name, value);
    }

    @Test
    public void shouldRecordSetStatus() throws Exception {
        int sc = 500;
        this.monitor.setStatus(sc);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).setStatus(sc);
    }

    @Test
    @SuppressWarnings("deprecation")
    public void shouldRecordSetStatusWithMessage() throws Exception {
        int sc = 500;
        String sm = "message";
        this.monitor.setStatus(sc, sm);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).setStatus(sc, sm);
    }

    @Test
    public void shouldRecordSetContentLength() throws Exception {
        int len = 100;
        this.monitor.setContentLength(len);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).setContentLength(len);
    }

    @Test
    public void shouldRecordSetContentType() throws Exception {
        String type = "type";
        this.monitor.setContentType(type);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).setContentType(type);
    }

    @Test
    public void shouldRecordSetBufferSize() throws Exception {
        int size = 100;
        this.monitor.setBufferSize(size);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).setBufferSize(size);
    }

    @Test
    public void shouldRecordFlushBuffer() throws Exception {
        this.monitor.flushBuffer();
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).flushBuffer();
    }

    @Test
    public void shouldRecordReset() throws Exception {
        this.monitor.reset();
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).reset();
    }

    @Test
    public void shouldRecordResetBuffer() throws Exception {
        this.monitor.resetBuffer();
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).resetBuffer();
    }

    @Test
    public void shouldRecordSetLocale() throws Exception {
        Locale loc = Locale.UK;
        this.monitor.setLocale(loc);
        this.monitor.getReplayableResponse().replay(this.response);
        verify(this.response).setLocale(loc);
    }

    @Test
    public void shouldRecordWriteByte() throws Exception {
        int b = 2;
        this.monitor.write(b);
        this.monitor.getReplayableResponse().replay(this.response);
        assertThat(this.responseOutputStream.toByteArray(), is(new byte[] { 2 }));
    }

    @Test
    public void shouldRecordWriteBytes() throws Exception {
        byte[] b = { 0, 1, 2, 3 };
        this.monitor.write(b);
        this.monitor.getReplayableResponse().replay(this.response);
        assertThat(this.responseOutputStream.toByteArray(), is(b));
    }

    @Test
    public void shouldRecordWriteBytesWithOffset() throws Exception {
        byte[] b = { 0, 1, 2, 3 };
        int off = 1;
        int len = 2;
        this.monitor.write(b, off, len);
        this.monitor.getReplayableResponse().replay(this.response);
        assertThat(this.responseOutputStream.toByteArray(), is(new byte[] { 1, 2 }));
    }

    @Test
    public void shouldSupportMultipleCalls() throws Exception {
        byte[] b = { 0, 1, 2, 3 };
        this.monitor.setLocale(Locale.UK);
        this.monitor.setContentLength(4);
        this.monitor.write(b, 0, 2);
        this.monitor.write(b, 2, 2);
        this.monitor.getReplayableResponse().replay(this.response);
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

    @Test
    public void shouldHaveSerialiazableResponse() throws Exception {
        byte[] b = { 0, 1, 2, 3 };
        this.monitor.write(b);
        ReplayableHttpServletResponse r = this.monitor.getReplayableResponse();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteArrayOutputStream);
        objectOutputStream.writeObject(r);
        ObjectInputStream objectInputStream = new ObjectInputStream(new ByteArrayInputStream(byteArrayOutputStream.toByteArray()));
        r = (ReplayableHttpServletResponse) objectInputStream.readObject();
        r.replay(this.response);
        assertThat(this.responseOutputStream.toByteArray(), is(b));
    }
}
