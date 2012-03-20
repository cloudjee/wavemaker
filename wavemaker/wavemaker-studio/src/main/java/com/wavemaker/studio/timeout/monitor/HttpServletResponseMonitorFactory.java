package com.wavemaker.studio.timeout.monitor;

/**
 * Factory used to create {@link HttpServletResponseMonitor}s.
 * 
 * @param <T> The actual {@link HttpServletResponseMonitor} type created by the factory
 * 
 * @see HttpServletResponseMonitor
 * @see MonitoredHttpServletResponseWrapper
 * 
 * @author Phillip Webb
 */
public interface HttpServletResponseMonitorFactory<T extends HttpServletResponseMonitor> {

	/**
	 * Return a new {@link HttpServletResponseMonitor} instance or <tt>null</tt> if monitoring is not required.
	 * @return A {@link HttpServletResponseMonitor}.
	 */
	T getMonitor();

}
