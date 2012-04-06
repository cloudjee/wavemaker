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
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.util.Assert;

import com.wavemaker.tools.cloudfoundry.timeout.monitor.HttpServletResponseMonitorFactory;
import com.wavemaker.tools.cloudfoundry.timeout.monitor.ReplayableHttpServletResponseMonitor;
import com.wavemaker.tools.cloudfoundry.timeout.monitor.ReplayableHttpServletResponseMonitorFactory;

/**
 * {@link TimeoutProtectionStrategy} that works by recording the original request such that it can be replayed to a
 * subsequent poll request. Requests that take longer than the {@link #setThreshold(long) threshold} to respond will be
 * recorded. The threshold should therefore be set to a value slightly lower than the expected gateway timeout. The
 * {@link #setFailTimeout(long)} method should be used to the timeout that will protect against requests that never
 * receive a poll (for example due to network failure). The {@link #setLongPollTime(long)} method can be used to set the
 * long-poll time for the poll request. This value should obviously be less than the gateway timeout.
 * <p>
 * This strategy consumes more memory than {@link HotSwappingTimeoutProtectionStrategy} but does not require that
 * timeouts only occur.
 * 
 * @author Phillip Webb
 */
public class ReplayingTimeoutProtectionStrategy implements TimeoutProtectionStrategy {

    private long threshold = TimeUnit.SECONDS.toMillis(14);

    private long longPollTime = TimeUnit.SECONDS.toMillis(6);

    private long failTimeout = TimeUnit.SECONDS.toMillis(30);

    private final Map<String, MonitorFactory> completedRequests = new HashMap<String, MonitorFactory>();

    protected final Map<String, MonitorFactory> getCompletedRequests() {
        return this.completedRequests;
    }

    @Override
    public HttpServletResponseMonitorFactory handleRequest(final TimeoutProtectionHttpRequest request) {
        return new MonitorFactory();
    }

    @Override
    public void afterRequest(TimeoutProtectionHttpRequest request, HttpServletResponseMonitorFactory monitorFactory) {
        afterRequest(request, (MonitorFactory) monitorFactory);
    }

    private void afterRequest(TimeoutProtectionHttpRequest request, MonitorFactory monitorFactory) {
        if (monitorFactory.wasMonitored()) {
            synchronized (this.completedRequests) {
                purgeUnpolledRequests();
                this.completedRequests.put(request.getUid(), monitorFactory);
                this.completedRequests.notifyAll();
            }
        }
    }

    /**
     * Cleanup any started monitors that may have never received a poll. This can happen if the client is closed after a
     * timeout but before a poll.
     */
    private void purgeUnpolledRequests() {
        Iterator<Map.Entry<String, MonitorFactory>> iterator = this.completedRequests.entrySet().iterator();
        while (iterator.hasNext()) {
            if (iterator.next().getValue().isPurgable(this.threshold + this.failTimeout)) {
                iterator.remove();
            }
        }
    }

    @Override
    public void handlePoll(TimeoutProtectionHttpRequest request, HttpServletResponse response) throws IOException {
        String uid = request.getUid();
        long startTime = System.currentTimeMillis();
        do {
            MonitorFactory completedRequest;
            synchronized (this.completedRequests) {
                if (!this.completedRequests.containsKey(uid)) {
                    try {
                        this.completedRequests.wait(this.longPollTime);
                    } catch (InterruptedException e) {
                    }
                }
                completedRequest = this.completedRequests.remove(uid);
            }
            if (completedRequest != null) {
                completedRequest.replay(response);
                return;
            }
        } while (System.currentTimeMillis() - startTime < this.longPollTime);
        response.setHeader(TimeoutProtectionHttpHeader.POLL, uid);
        response.setStatus(HttpStatus.NO_CONTENT.value());
    }

    /**
     * Set the threshold that must be passed before timeout protection will be used
     * 
     * @param threshold the threshold in milliseconds
     */
    public void setThreshold(long threshold) {
        this.threshold = threshold;
    }

    /**
     * Set the maximum amount of time that a single long poll request can take.
     * 
     * @param longPollTime the long poll time in milliseconds
     */
    public void setLongPollTime(long longPollTime) {
        this.longPollTime = longPollTime;
    }

    /**
     * Set the amount of time before a request is considered failed.
     * 
     * @param failTimeout
     */
    public void setFailTimeout(long failTimeout) {
        this.failTimeout = failTimeout;
    }

    /**
     * The {@link HttpServletResponseMonitorFactory} used internally.
     */
    private class MonitorFactory implements HttpServletResponseMonitorFactory {

        private final long startTime;

        private ReplayableHttpServletResponseMonitor monitor;

        public MonitorFactory() {
            this.startTime = System.currentTimeMillis();
        }

        public boolean wasMonitored() {
            return this.monitor != null;
        }

        public void replay(HttpServletResponse response) throws IOException {
            Assert.state(wasMonitored(), "Request was not monitored, no poll expected");
            this.monitor.getReplayableResponse().replay(response);
        }

        @Override
        public ReplayableHttpServletResponseMonitor getMonitor() {
            long pollThreshold = ReplayingTimeoutProtectionStrategy.this.threshold;
            if (pollThreshold == 0 || System.currentTimeMillis() - this.startTime >= pollThreshold) {
                this.monitor = new ReplayableHttpServletResponseMonitorFactory().getMonitor();
            }
            return this.monitor;
        }

        public boolean isPurgable(long timeout) {
            return System.currentTimeMillis() - this.startTime > timeout;
        }
    }
}
