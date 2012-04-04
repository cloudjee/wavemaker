
package com.wavemaker.tools.cloudfoundry.timeout.monitor;

/**
 * Factory used to create {@link HttpServletResponseMonitor}s.
 * 
 * @see HttpServletResponseMonitor
 * @see MonitoredHttpServletResponseWrapper
 * 
 * @author Phillip Webb
 */
public interface HttpServletResponseMonitorFactory {

    /**
     * Return a new {@link HttpServletResponseMonitor} instance or <tt>null</tt> if monitoring is not required.
     * 
     * @return A {@link HttpServletResponseMonitor}.
     */
    HttpServletResponseMonitor getMonitor();

}
