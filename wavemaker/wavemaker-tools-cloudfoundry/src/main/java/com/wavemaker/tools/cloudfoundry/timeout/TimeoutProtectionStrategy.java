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

import javax.servlet.http.HttpServletResponse;

import com.wavemaker.tools.cloudfoundry.timeout.monitor.HttpServletResponseMonitorFactory;

/**
 * Strategy used by {@link TimeoutProtectionFilter} in order to protect against Cloud Foundry timeouts.
 * 
 * @author Phillip Webb
 */
public interface TimeoutProtectionStrategy {

    /**
     * Get the {@link HttpServletResponseMonitorFactory} that should be used to provide timeout protection for the given
     * <tt>request</tt>.
     * 
     * @param request the request to protect
     * @return a {@link HttpServletResponseMonitorFactory} that should be used with the filtered
     */
    HttpServletResponseMonitorFactory handleRequest(TimeoutProtectionHttpRequest request);

    /**
     * Called after the initial response has been written in order to perform any cleanup. This method will be called
     * regardless of any exceptions.
     * 
     * @param request the initial request
     * @param monitorFactory the monitor returned from {@link #handleRequest(TimeoutProtectionHttpRequest)}
     */
    void afterRequest(TimeoutProtectionHttpRequest request, HttpServletResponseMonitorFactory monitorFactory);

    /**
     * Handle any poll requests from the client.
     * 
     * @param request the poll request
     * @param response the poll response
     * @throws IOException
     */
    void handlePoll(TimeoutProtectionHttpRequest request, HttpServletResponse response) throws IOException;

}
