package com.wavemaker.studio.timeout.monitor;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

/**
 * Callback interface used for monitoring a {@link HttpServletResponse}.
 * 
 * @see MonitoredHttpServletResponseWrapper
 * 
 * @author Phillip Webb
 */
public interface HttpServletResponseMonitor {

	/**
	 * Empty implementation.
	 */
	public static final HttpServletResponseMonitor NONE = new HttpServletResponseMonitor() {

		public void write(byte[] b, int off, int len) {
		}

		public void write(byte[] b) {
		}

		public void write(int b) {
		}

		public void setStatus(int sc, String sm) {
		}

		public void setStatus(int sc) {
		}

		public void setLocale(Locale loc) {
		}

		public void setIntHeader(String name, int value) {
		}

		public void setHeader(String name, String value) {
		}

		public void setDateHeader(String name, long date) {
		}

		public void setContentType(String type) {
		}

		public void setContentLength(int len) {
		}

		public void setBufferSize(int size) {
		}

		public void sendRedirect(String location) throws IOException {
		}

		public void sendError(int sc) throws IOException {
		}

		public void sendError(int sc, String msg) throws IOException {
		}

		public void resetBuffer() {
		}

		public void reset() {
		}

		public void flushBuffer() throws IOException {
		}

		public void addIntHeader(String name, int value) {
		}

		public void addHeader(String name, String value) {
		}

		public void addDateHeader(String name, long date) {
		}

		public void addCookie(Cookie cookie) {
		}
	};

	/**
	 * Monitor a call to the {@link HttpServletResponse#addCookie(Cookie)} method.
	 * @param cookie the cookie
	 */
	void addCookie(Cookie cookie);

	/**
	 * Monitor a call to the {@link HttpServletResponse#sendError(int, String)} method.
	 * 
	 * @param sc the status code
	 * @param msg the message
	 * @throws IOException
	 */
	void sendError(int sc, String msg) throws IOException;

	/**
	 * Monitor a call to the {@link HttpServletResponse#sendError(int)} method.
	 * @param sc the status code
	 * @throws IOException
	 */
	void sendError(int sc) throws IOException;

	/**
	 * Monitor a call to the {@link HttpServletResponse#sendRedirect(String)} method.
	 * @param location the redirect location
	 * @throws IOException
	 */
	void sendRedirect(String location) throws IOException;

	/**
	 * Monitor a call to the {@link HttpServletResponse#setDateHeader(String, long)} method.
	 * @param name the name of the header to set
	 * @param date the assigned date value
	 */
	void setDateHeader(String name, long date);

	/**
	 * Monitor a call to the {@link HttpServletResponse#addDateHeader(String, long)} method.
	 * @param name the name of the header to set
	 * @param date the assigned date value
	 */
	void addDateHeader(String name, long date);

	/**
	 * Monitor a call to the {@link HttpServletResponse#setHeader(String, String)} method.
	 * @param name the name of the header to set
	 * @param value the header value
	 */
	void setHeader(String name, String value);

	/**
	 * Monitor a call to the {@link HttpServletResponse#addHeader(String, String)} method.
	 * @param name the name of the header to set
	 * @param value the header value
	 */
	void addHeader(String name, String value);

	/**
	 * Monitor a call to the {@link HttpServletResponse#setIntHeader(String, int)} method.
	 * @param name the name of the header to set
	 * @param value the header value
	 */
	void setIntHeader(String name, int value);

	/**
	 * Monitor a call to the {@link HttpServletResponse#addIntHeader(String, int)} method.
	 * @param name the name of the header to set
	 * @param value the header value
	 */
	void addIntHeader(String name, int value);

	/**
	 * Monitor a call to the {@link HttpServletResponse#setStatus(int)} method.
	 * @param sc the status code
	 */
	void setStatus(int sc);

	/**
	 * Monitor a call to the {@link HttpServletResponse#setStatus(int, String)} method.
	 * @param sc the status code
	 * @param sm the statis message
	 */
	void setStatus(int sc, String sm);

	/**
	 * Monitor a call to the {@link HttpServletResponse#setContentLength(int)} method.
	 * @param len the content length
	 */
	void setContentLength(int len);

	/**
	 * Monitor a call to the {@link HttpServletResponse#setContentType(String)} method.
	 * @param type the content type
	 */
	void setContentType(String type);

	/**
	 * Monitor a call to the {@link HttpServletResponse#setBufferSize(int)} method.
	 * @param size the buffer size
	 */
	void setBufferSize(int size);

	/**
	 * Monitor a call to the {@link HttpServletResponse#flushBuffer()} method.
	 * @throws IOException
	 */
	void flushBuffer() throws IOException;

	/**
	 * Monitor a call to the {@link HttpServletResponse#reset()} method.
	 */
	void reset();

	/**
	 * Monitor a call to the {@link HttpServletResponse#resetBuffer()} method.
	 */
	void resetBuffer();

	/**
	 * Monitor a call to the {@link HttpServletResponse#setLocale(Locale)} method.
	 * @param loc the locale
	 */
	void setLocale(Locale loc);

	/**
	 * Monitor a call to the {@link HttpServletResponse#getOutputStream()} {@link ServletOutputStream#write(int)
	 * write(int)} method.
	 * @param b the byte to write
	 */
	void write(int b);

	/**
	 * Monitor a call to the {@link HttpServletResponse#getOutputStream()} {@link ServletOutputStream#write(byte[])
	 * write(byte[])} method.
	 * @param b the byte array to write
	 */
	void write(byte[] b);

	/**
	 * Monitor a call to the {@link HttpServletResponse#getOutputStream()}
	 * {@link ServletOutputStream#write(byte[], int, int) write(byte[], int, int)} method and
	 * {@link HttpServletResponse#getWriter()} method.
	 * @param b the bytes
	 * @param off the offset
	 * @param len the length
	 */
	void write(byte[] b, int off, int len);
}
