
package com.wavemaker.tools.cloudfoundry.timeout.monitor;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.Writer;
import java.util.Locale;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.springframework.util.Assert;
import org.springframework.web.util.WebUtils;

/**
 * A {@link HttpServletResponseWrapper wrapper} that can be used to {@link HttpServletResponseMonitor monitor} a
 * {@link HttpServletResponse}. All outgoing data is passed to the monitor as well as to the wrapped response. The
 * monitor is lazily created on the first suitable response invocation using the specified
 * {@link HttpServletResponseMonitorFactory}.
 * 
 * @see HttpServletResponseMonitor
 * 
 * @author Phillip Webb
 */
public class MonitoredHttpServletResponseWrapper extends HttpServletResponseWrapper {

    private final HttpServletResponseMonitorFactory monitorFactory;

    /**
     * The lazily loaded monitor (use {@link #getMonitor()}.
     */
    private HttpServletResponseMonitor monitor;

    /**
     * Create a new {@link MonitoredHttpServletResponseWrapper} instance.
     * 
     * @param response the response to wrap.
     * @param monitorFactory a factory used to create the monitor as required. This factory will be called once only for
     *        the duration of the response and as late as possible.
     */
    public MonitoredHttpServletResponseWrapper(HttpServletResponse response, HttpServletResponseMonitorFactory monitorFactory) {
        super(response);
        Assert.notNull(monitorFactory, "MonitorFactory must not be null");
        this.monitorFactory = monitorFactory;
    }

    protected HttpServletResponseMonitor getMonitor() {
        if (this.monitor == null) {
            this.monitor = this.monitorFactory.getMonitor();
        }
        if (this.monitor == null) {
            this.monitor = HttpServletResponseMonitor.NONE;
        }
        return this.monitor;
    }

    @Override
    public void addCookie(Cookie cookie) {
        super.addCookie(cookie);
        getMonitor().addCookie(cookie);
    }

    @Override
    public void sendError(int sc, String msg) throws IOException {
        super.sendError(sc, msg);
        getMonitor().sendError(sc, msg);
    }

    @Override
    public void sendError(int sc) throws IOException {
        super.sendError(sc);
        getMonitor().sendError(sc);
    }

    @Override
    public void sendRedirect(String location) throws IOException {
        super.sendRedirect(location);
        getMonitor().sendRedirect(location);
    }

    @Override
    public void setDateHeader(String name, long date) {
        super.setDateHeader(name, date);
        getMonitor().setDateHeader(name, date);
    }

    @Override
    public void addDateHeader(String name, long date) {
        super.addDateHeader(name, date);
        getMonitor().addDateHeader(name, date);
    }

    @Override
    public void setHeader(String name, String value) {
        super.setHeader(name, value);
        getMonitor().setHeader(name, value);
    }

    @Override
    public void addHeader(String name, String value) {
        super.addHeader(name, value);
        getMonitor().addHeader(name, value);
    }

    @Override
    public void setIntHeader(String name, int value) {
        super.setIntHeader(name, value);
        getMonitor().setIntHeader(name, value);
    }

    @Override
    public void addIntHeader(String name, int value) {
        super.addIntHeader(name, value);
        getMonitor().addIntHeader(name, value);
    }

    @Override
    public void setStatus(int sc) {
        super.setStatus(sc);
        getMonitor().setStatus(sc);
    }

    @Override
    public void setStatus(int sc, String sm) {
        super.setStatus(sc, sm);
        getMonitor().setStatus(sc, sm);
    }

    @Override
    public void setContentLength(int len) {
        super.setContentLength(len);
        getMonitor().setContentLength(len);
    }

    @Override
    public void setContentType(String type) {
        super.setContentType(type);
        getMonitor().setContentType(type);
    }

    @Override
    public void setBufferSize(int size) {
        super.setBufferSize(size);
        getMonitor().setBufferSize(size);
    }

    @Override
    public void flushBuffer() throws IOException {
        super.flushBuffer();
        getMonitor().flushBuffer();
    }

    @Override
    public void reset() {
        super.reset();
        getMonitor().reset();
    }

    @Override
    public void resetBuffer() {
        super.resetBuffer();
        getMonitor().resetBuffer();
    }

    @Override
    public void setLocale(Locale loc) {
        super.setLocale(loc);
        getMonitor().setLocale(loc);
    }

    @Override
    public PrintWriter getWriter() throws IOException {
        String characterEncoding = getCharacterEncoding();
        if (characterEncoding == null) {
            characterEncoding = WebUtils.DEFAULT_CHARACTER_ENCODING;
        }
        Writer out = new OutputStreamWriter(getOutputStream(), characterEncoding);
        return new PrintWriter(out, true);
    }

    @Override
    public ServletOutputStream getOutputStream() throws IOException {
        return new RecordingServletOutputStream(super.getOutputStream());
    }

    private class RecordingServletOutputStream extends ServletOutputStream {

        private final ServletOutputStream outputStream;

        public RecordingServletOutputStream(ServletOutputStream outputStream) {
            this.outputStream = outputStream;
        }

        @Override
        public void write(int b) throws IOException {
            this.outputStream.write(b);
            getMonitor().write(b);
        }

        @Override
        public void write(byte[] b) throws IOException {
            this.outputStream.write(b);
            getMonitor().write(b);
        }

        @Override
        public void write(byte[] b, int off, int len) throws IOException {
            this.outputStream.write(b, off, len);
            getMonitor().write(b, off, len);
        }
    }

}
