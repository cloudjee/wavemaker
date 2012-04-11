/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
