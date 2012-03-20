
package com.wavemaker.studio.timeout;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

import org.springframework.util.Assert;

import com.wavemaker.studio.timeout.monitor.HttpServletResponseMonitorFactory;
import com.wavemaker.studio.timeout.monitor.MonitoredHttpServletResponseWrapper;

/**
 * Servlet {@link Filter} that can be used to transparently protect against CloudFoundry gateway timeout errors.
 * 
 * @author Phillip Webb
 */
public class TimeoutProtectionFilter implements Filter {

    private TimeoutProtector protector;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        Assert.state(this.protector != null, "Please set the TimeoutProtector");
        TimeoutProtectionHttpRequest timeoutProtectionRequest = TimeoutProtectionHttpRequest.get(request);

        if (timeoutProtectionRequest == null) {
            chain.doFilter(request, response);
            return;
        }

        if (timeoutProtectionRequest.getType() == TimeoutProtectionHttpRequest.Type.POLL) {
            this.protector.handlePoll(timeoutProtectionRequest, (HttpServletResponse) response);
            return;
        }

        doFilter(timeoutProtectionRequest, (HttpServletResponse) response, chain);

    }

    private void doFilter(TimeoutProtectionHttpRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletResponseMonitorFactory monitor = this.protector.getMonitorFactory(request);
        try {
            MonitoredHttpServletResponseWrapper monitoredHttpResponse = new MonitoredHttpServletResponseWrapper(response, monitor);
            chain.doFilter(request.getServletRequest(), monitoredHttpResponse);
        } finally {
            this.protector.cleanup(request, monitor);
        }
    }

    public void setProtector(TimeoutProtector protector) {
        this.protector = protector;
    }
}
