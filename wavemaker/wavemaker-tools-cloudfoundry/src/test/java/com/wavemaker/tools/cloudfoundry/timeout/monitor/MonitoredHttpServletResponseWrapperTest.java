
package com.wavemaker.tools.cloudfoundry.timeout.monitor;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Locale;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

/**
 * Tests for {@link MonitoredHttpServletResponseWrapper}.
 * 
 * @author Phillip Webb
 */
public class MonitoredHttpServletResponseWrapperTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private MonitoredHttpServletResponseWrapper wrapper;

    @Mock
    private HttpServletResponse response;

    @Mock
    private ServletOutputStream responseStream;

    @Mock
    private HttpServletResponseMonitor monitor;

    @Before
    public void setup() throws IOException {
        MockitoAnnotations.initMocks(this);
        this.wrapper = new MonitoredHttpServletResponseWrapper(this.response, new HttpServletResponseMonitorFactory() {

            @Override
            public HttpServletResponseMonitor getMonitor() {
                return MonitoredHttpServletResponseWrapperTest.this.monitor;
            }
        });
        given(this.response.getOutputStream()).willReturn(this.responseStream);
    }

    @Test
    public void shouldNeedMonitorFactory() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("MonitorFactory must not be null");
        new MonitoredHttpServletResponseWrapper(this.response, null);
    }

    @Test
    public void shouldCallMonitorFactoryOnlyOnce() throws Exception {
        HttpServletResponseMonitorFactory monitorFactory = mock(HttpServletResponseMonitorFactory.class);
        given(monitorFactory.getMonitor()).willReturn(this.monitor);
        this.wrapper = new MonitoredHttpServletResponseWrapper(this.response, monitorFactory);
        this.wrapper.sendError(500);
        this.wrapper.sendRedirect("location");
        verify(monitorFactory, times(1)).getMonitor();
    }

    @Test
    public void shouldAcceptNullMonitorFactoryResult() throws Exception {
        HttpServletResponseMonitorFactory monitorFactory = mock(HttpServletResponseMonitorFactory.class);
        given(monitorFactory.getMonitor()).willReturn(null);
        int sc = 500;
        this.wrapper = new MonitoredHttpServletResponseWrapper(this.response, monitorFactory);
        this.wrapper.sendError(sc);
        verify(this.response).sendError(500);
        verifyZeroInteractions(this.monitor);
    }

    @Test
    public void shouldCallMonitorFactoryAsLateAsPossible() throws Exception {
        HttpServletResponseMonitorFactory monitorFactory = mock(HttpServletResponseMonitorFactory.class);
        given(monitorFactory.getMonitor()).willReturn(this.monitor);
        given(this.response.getBufferSize()).willReturn(100);
        this.wrapper = new MonitoredHttpServletResponseWrapper(this.response, monitorFactory);
        // Initial creation should have zero interaction
        verifyZeroInteractions(monitorFactory);
        // Gets should not cause interactions
        this.wrapper.getBufferSize();
        verifyZeroInteractions(monitorFactory);
        // Only monitored methods
        this.wrapper.sendError(500);
        verify(monitorFactory, times(1)).getMonitor();
    }

    @Test
    public void shouldDelegateAndMonitorAddCookie() throws Exception {
        Cookie cookie = mock(Cookie.class);
        this.wrapper.addCookie(cookie);
        verify(this.response).addCookie(cookie);
        verify(this.monitor).addCookie(cookie);
    }

    @Test
    public void shouldDelegateAndMonitorSendError() throws Exception {
        int sc = 500;
        this.wrapper.sendError(sc);
        verify(this.response).sendError(sc);
        verify(this.monitor).sendError(sc);
    }

    @Test
    public void shouldDelegateAndMonitorSendErrorWithMessage() throws Exception {
        int sc = 500;
        String msg = "Message";
        this.wrapper.sendError(sc, msg);
        verify(this.response).sendError(sc, msg);
        verify(this.monitor).sendError(sc, msg);
    }

    @Test
    public void shouldDelegateAndMonitorSendRedirect() throws Exception {
        String location = "location";
        this.wrapper.sendRedirect(location);
        verify(this.response).sendRedirect(location);
        verify(this.monitor).sendRedirect(location);
    }

    @Test
    public void shouldDelegateAndMonitorSetDateHeader() throws Exception {
        String name = "name";
        long date = System.currentTimeMillis();
        this.wrapper.setDateHeader(name, date);
        verify(this.response).setDateHeader(name, date);
        verify(this.monitor, never()).setDateHeader(name, date);
        this.wrapper.setStatus(200);
        verify(this.monitor).setDateHeader(name, date);
    }

    @Test
    public void shouldDelegateAndMonitorAddDateHeader() throws Exception {
        String name = "name";
        long date = System.currentTimeMillis();
        this.wrapper.addDateHeader(name, date);
        verify(this.response).addDateHeader(name, date);
        verify(this.monitor, never()).addDateHeader(name, date);
        this.wrapper.setStatus(200);
        verify(this.monitor).addDateHeader(name, date);
    }

    @Test
    public void shouldDelegateAndMonitorSetHeader() throws Exception {
        String name = "name";
        String value = "value";
        this.wrapper.setHeader(name, value);
        verify(this.response).setHeader(name, value);
        verify(this.monitor, never()).setHeader(name, value);
        this.wrapper.setStatus(200);
        verify(this.monitor).setHeader(name, value);
    }

    @Test
    public void shouldDelegateAndMonitorAddHeader() throws Exception {
        String name = "name";
        String value = "value";
        this.wrapper.addHeader(name, value);
        verify(this.response).addHeader(name, value);
        verify(this.monitor, never()).addHeader(name, value);
        this.wrapper.setStatus(200);
        verify(this.monitor).addHeader(name, value);
    }

    @Test
    public void shouldDelegateAndMonitorSetIntHeader() throws Exception {
        String name = "name";
        int value = 400;
        this.wrapper.setIntHeader(name, value);
        verify(this.response).setIntHeader(name, value);
        verify(this.monitor, never()).setIntHeader(name, value);
        this.wrapper.setStatus(200);
        verify(this.monitor).setIntHeader(name, value);
    }

    @Test
    public void shouldDelegateAndMonitorAddIntHeader() throws Exception {
        String name = "name";
        int value = 400;
        this.wrapper.addIntHeader(name, value);
        verify(this.response).addIntHeader(name, value);
        verify(this.monitor, never()).addIntHeader(name, value);
        this.wrapper.setStatus(200);
        verify(this.monitor).addIntHeader(name, value);
    }

    @Test
    public void shouldDelegateAndMonitorSetStatus() throws Exception {
        int sc = 500;
        this.wrapper.setStatus(sc);
        verify(this.response).setStatus(sc);
        verify(this.monitor).setStatus(sc);
    }

    @Test
    @SuppressWarnings("deprecation")
    public void shouldDelegateAndMonitorSetStatusWithMessage() throws Exception {
        int sc = 500;
        String sm = "message";
        this.wrapper.setStatus(sc, sm);
        verify(this.response).setStatus(sc, sm);
        verify(this.monitor).setStatus(sc, sm);
    }

    @Test
    public void shouldDelegateAndMonitorSetContentLength() throws Exception {
        int len = 100;
        this.wrapper.setContentLength(len);
        verify(this.response).setContentLength(len);
        verify(this.monitor).setContentLength(len);
    }

    @Test
    public void shouldDelegateAndMonitorSetContentType() throws Exception {
        String type = "type";
        this.wrapper.setContentType(type);
        verify(this.response).setContentType(type);
        verify(this.monitor).setContentType(type);
    }

    @Test
    public void shouldDelegateAndMonitorSetBufferSize() throws Exception {
        int size = 100;
        this.wrapper.setBufferSize(size);
        verify(this.response).setBufferSize(size);
        verify(this.monitor).setBufferSize(size);
    }

    @Test
    public void shouldDelegateAndMonitorFlushBuffer() throws Exception {
        this.wrapper.flushBuffer();
        verify(this.response).flushBuffer();
        verify(this.monitor).flushBuffer();
    }

    @Test
    public void shouldDelegateAndMonitorReset() throws Exception {
        this.wrapper.reset();
        verify(this.response).reset();
        verify(this.monitor).reset();
    }

    @Test
    public void shouldDelegateAndMonitorResetBuffer() throws Exception {
        this.wrapper.resetBuffer();
        verify(this.response).resetBuffer();
        verify(this.monitor).resetBuffer();
    }

    @Test
    public void shouldDelegateAndMonitorSetLocale() throws Exception {
        Locale loc = Locale.UK;
        this.wrapper.setLocale(loc);
        verify(this.response).setLocale(loc);
        verify(this.monitor).setLocale(loc);
    }

    @Test
    public void shouldDelegateAndMonitorOutputStreamByte() throws Exception {
        int b = 100;
        this.wrapper.getOutputStream().write(b);
        verify(this.responseStream).write(b);
        verify(this.monitor).write(b);
    }

    @Test
    public void shouldDelegateAndMonitorOutputStreamBytes() throws Exception {
        byte[] b = { 0, 1, 2 };
        this.wrapper.getOutputStream().write(b);
        verify(this.responseStream).write(b);
        verify(this.monitor).write(b);

    }

    @Test
    public void shouldDelegateAndMonitorOutputStreamBytesWithOffset() throws Exception {
        byte[] b = { 0, 1, 2 };
        int off = 1;
        int len = 2;
        this.wrapper.getOutputStream().write(b, off, len);
        verify(this.responseStream).write(b, off, len);
        verify(this.monitor).write(b, off, len);
    }

    @Test
    @Ignore
    public void shouldDelegateAndMonitorPrintWriter() throws Exception {
        PrintWriter writer = this.wrapper.getWriter();
        writer.println("A");
        OutputStreamBytesVerifier verifier = new OutputStreamBytesVerifier();
        verifier.verify(this.responseStream, "A\n".getBytes());
    }

    private static class OutputStreamBytesVerifier {

        @Captor
        private ArgumentCaptor<Integer> off;

        @Captor
        private ArgumentCaptor<Integer> len;

        @Captor
        private ArgumentCaptor<byte[]> b;

        public OutputStreamBytesVerifier() {
            MockitoAnnotations.initMocks(this);
        }

        public void verify(OutputStream outputStream, byte[] expected) throws IOException {
            Mockito.verify(outputStream).write(this.b.capture(), this.off.capture(), this.len.capture());
            byte[] actual = new byte[this.len.getValue()];
            System.arraycopy(this.b.getValue(), this.off.getValue(), actual, 0, this.len.getValue());
            assertThat(actual, is(equalTo(expected)));
        }
    }

    // FIXME print writer test
}
