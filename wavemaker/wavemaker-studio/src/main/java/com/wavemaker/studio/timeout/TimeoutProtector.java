
package com.wavemaker.studio.timeout;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import com.wavemaker.studio.timeout.monitor.HttpServletResponseMonitorFactory;

/**
 * Strategy used by {@link TimeoutProtectionFilter} in order to protect against Cloud Foundry timeouts.
 * 
 * @author Phillip Webb
 */
public interface TimeoutProtector {

    /**
     * Get the {@link HttpServletResponseMonitorFactory} that should be used to provide timeout protection for the given
     * <tt>request</tt>.
     * 
     * @param request the request to protect
     * @return a {@link HttpServletResponseMonitorFactory} that should be used with the filtered
     */
    HttpServletResponseMonitorFactory getMonitorFactory(TimeoutProtectionHttpRequest request);

    /**
     * Called after the initial response has been written in order to perform any cleanup. This method will be called
     * regardless of any exceptions.
     * 
     * @param request the initial request
     * @param monitor the monitor returned from {@link #getMonitorFactory(TimeoutProtectionHttpRequest)}
     */
    void cleanup(TimeoutProtectionHttpRequest request, HttpServletResponseMonitorFactory monitor);

    void handlePoll(TimeoutProtectionHttpRequest request, HttpServletResponse response) throws IOException;

}
