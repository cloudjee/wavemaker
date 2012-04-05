
package com.wavemaker.tools.cloudfoundry.timeout;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

import org.springframework.util.Assert;

import com.wavemaker.tools.cloudfoundry.timeout.monitor.HttpServletResponseMonitorFactory;
import com.wavemaker.tools.cloudfoundry.timeout.monitor.MonitoredHttpServletResponseWrapper;

/**
 * Servlet {@link Filter} that can be used in conjunction with client side JavaScript to transparently protect against
 * CloudFoundry gateway timeout errors. The filter works on the assumption that the client will handle gateway timeouts
 * by switching to long polling. For DOJO compatible JavaScript see <tt>cloudfoundry-timeout.js</tt>.
 * <p>
 * This filter can support a number of different {@link TimeoutProtectionStrategy strategies} including
 * {@link HotSwappingTimeoutProtectionStrategy hot swapping} and {@link ReplayingTimeoutProtectionStrategy replay}.
 * 
 * @author Phillip Webb
 */
public class TimeoutProtectionFilter implements Filter {

    private TimeoutProtectionStrategy strategy;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        Assert.state(this.strategy != null, "Please set the TimeoutProtectionStrategy");

        TimeoutProtectionHttpRequest timeoutProtectionRequest = TimeoutProtectionHttpRequest.get(request);

        if (timeoutProtectionRequest == null) {
            chain.doFilter(request, response);
            return;
        }

        if (timeoutProtectionRequest.getType() == TimeoutProtectionHttpRequest.Type.POLL) {
            this.strategy.handlePoll(timeoutProtectionRequest, (HttpServletResponse) response);
            return;
        }

        doFilter(timeoutProtectionRequest, (HttpServletResponse) response, chain);
    }

    private void doFilter(TimeoutProtectionHttpRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletResponseMonitorFactory monitor = this.strategy.handleRequest(request);
        try {
            MonitoredHttpServletResponseWrapper monitoredHttpResponse = new MonitoredHttpServletResponseWrapper(response, monitor);
            chain.doFilter(request.getServletRequest(), monitoredHttpResponse);
        } finally {
            this.strategy.afterRequest(request, monitor);
        }
    }

    public void setProtector(TimeoutProtectionStrategy protector) {
        this.strategy = protector;
    }
}
