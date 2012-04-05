
package com.wavemaker.tools.cloudfoundry.timeout.monitor;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
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
 * {@link HttpServletResponseMonitorFactory}. NOTE: header invocations will not trigger the creation of the monitor.
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

    private final HeaderCalls headerCalls = new HeaderCalls();

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
            if (this.monitor == null) {
                this.monitor = HttpServletResponseMonitor.NONE;
            }
            this.headerCalls.setMonitor(this.monitor);
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
        this.headerCalls.headerCall(HeaderCallType.SET_DATE, name, date);
    }

    @Override
    public void addDateHeader(String name, long date) {
        super.addDateHeader(name, date);
        this.headerCalls.headerCall(HeaderCallType.ADD_DATE, name, date);
    }

    @Override
    public void setHeader(String name, String value) {
        super.setHeader(name, value);
        this.headerCalls.headerCall(HeaderCallType.SET, name, value);
    }

    @Override
    public void addHeader(String name, String value) {
        super.addHeader(name, value);
        this.headerCalls.headerCall(HeaderCallType.ADD, name, value);
    }

    @Override
    public void setIntHeader(String name, int value) {
        super.setIntHeader(name, value);
        this.headerCalls.headerCall(HeaderCallType.SET_INT, name, value);
    }

    @Override
    public void addIntHeader(String name, int value) {
        super.addIntHeader(name, value);
        this.headerCalls.headerCall(HeaderCallType.ADD_INT, name, value);
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
        return new RecordingPrintWriter(getOutputStream(), characterEncoding);
    }

    @Override
    public ServletOutputStream getOutputStream() throws IOException {
        // return super.getOutputStream();
        return new RecordingServletOutputStream(super.getOutputStream());
    }

    private static enum HeaderCallType {
        ADD_INT {

            @Override
            public void invoke(HttpServletResponseMonitor monitor, String name, Object value) {
                monitor.addIntHeader(name, (Integer) value);

            }
        },
        SET_INT {

            @Override
            public void invoke(HttpServletResponseMonitor monitor, String name, Object value) {
                monitor.setIntHeader(name, (Integer) value);

            }
        },
        ADD {

            @Override
            public void invoke(HttpServletResponseMonitor monitor, String name, Object value) {
                monitor.addHeader(name, (String) value);
            }
        },
        SET {

            @Override
            public void invoke(HttpServletResponseMonitor monitor, String name, Object value) {
                monitor.setHeader(name, (String) value);
            }
        },
        ADD_DATE {

            @Override
            public void invoke(HttpServletResponseMonitor monitor, String name, Object value) {
                monitor.addDateHeader(name, (Long) value);

            }
        },
        SET_DATE {

            @Override
            public void invoke(HttpServletResponseMonitor monitor, String name, Object value) {
                monitor.setDateHeader(name, (Long) value);
            }
        };

        public abstract void invoke(HttpServletResponseMonitor monitor, String name, Object value);
    };

    private static class HeaderCalls {

        private HttpServletResponseMonitor monitor;

        private List<HeaderCall> calls;

        public void setMonitor(HttpServletResponseMonitor monitor) {
            this.monitor = monitor;
            if (this.calls != null) {
                for (HeaderCall call : this.calls) {
                    call.invoke(monitor);
                }
            }
        }

        public void headerCall(HeaderCallType type, String name, Object value) {
            if (this.monitor != null) {
                type.invoke(this.monitor, name, value);
            } else {
                if (this.calls == null) {
                    this.calls = new ArrayList<HeaderCall>();
                }
                this.calls.add(new HeaderCall(type, name, value));
            }
        }
    }

    private static class HeaderCall {

        private final HeaderCallType type;

        private final String name;

        private final Object value;

        public HeaderCall(HeaderCallType type, String name, Object value) {
            this.type = type;
            this.name = name;
            this.value = value;
        }

        public void invoke(HttpServletResponseMonitor monitor) {
            this.type.invoke(monitor, this.name, this.value);
        }
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

    private static class RecordingPrintWriter extends PrintWriter {

        private final OutputStream outputStream;

        private final Charset charset;

        private final char[] lineSeparator;

        private boolean error;

        public RecordingPrintWriter(OutputStream stream, String characterEncoding) throws FileNotFoundException {
            super(stream);
            this.outputStream = stream;
            this.charset = Charset.forName(characterEncoding);
            this.lineSeparator = java.security.AccessController.doPrivileged(new sun.security.action.GetPropertyAction("line.separator")).toCharArray();
        }

        @Override
        protected Object clone() throws CloneNotSupportedException {
            throw new CloneNotSupportedException();
        }

        @Override
        public boolean checkError() {
            flush();
            return this.error;
        }

        @Override
        public void flush() {
            if (!this.error) {
                try {
                    this.outputStream.flush();
                } catch (IOException e) {
                    this.error = true;
                }
            }
        }

        @Override
        public void close() {
            try {
                this.outputStream.close();
            } catch (IOException ex) {
            }
            this.error = false;
        }

        @Override
        public void print(boolean b) {
            write(b ? "true" : "false");
        }

        @Override
        public void print(char c) {
            write(c);
        }

        @Override
        public void print(int i) {
            write(String.valueOf(i));
        }

        @Override
        public void print(long l) {
            write(String.valueOf(l));
        }

        @Override
        public void print(float f) {
            write(String.valueOf(f));
        }

        @Override
        public void print(double d) {
            write(String.valueOf(d));
        }

        @Override
        public void print(char s[]) {
            write(s);
        }

        @Override
        public void print(String s) {
            write(String.valueOf(s));
        }

        @Override
        public void print(Object obj) {
            write(String.valueOf(obj));
        }

        @Override
        public void println(boolean b) {
            print(b);
            println();
        }

        @Override
        public void println(char c) {
            print(c);
            println();
        }

        @Override
        public void println(int i) {
            print(i);
            println();
        }

        @Override
        public void println(long l) {
            print(l);
            println();
        }

        @Override
        public void println(float f) {
            print(f);
            println();
        }

        @Override
        public void println(double d) {
            print(d);
            println();
        }

        @Override
        public void println(char c[]) {
            print(c);
            println();
        }

        @Override
        public void println(String s) {
            print(s);
            println();
        }

        @Override
        public void println(Object o) {
            print(o);
            println();
        }

        @Override
        public void println() {
            write(this.lineSeparator);
        }

        @Override
        public void write(int c) {
            if (!this.error) {
                try {
                    this.outputStream.write(c);
                } catch (IOException e) {
                    this.error = true;
                }
            }
        }

        @Override
        public void write(char buf[]) {
            write(buf, 0, buf.length);
        }

        @Override
        public void write(char buf[], int off, int len) {
            write(new String(buf, off, len));
        }

        @Override
        public void write(String s) {
            write(s, 0, s.length());
        }

        @Override
        public void write(String s, int off, int len) {
            if (!this.error) {
                try {
                    this.outputStream.write(s.getBytes(this.charset), off, len);
                } catch (IOException e) {
                    this.error = true;
                }
            }
        }

    }
}
