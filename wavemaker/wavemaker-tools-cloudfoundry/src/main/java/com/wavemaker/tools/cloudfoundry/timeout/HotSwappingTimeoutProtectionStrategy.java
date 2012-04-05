
package com.wavemaker.tools.cloudfoundry.timeout;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.util.Assert;

import com.wavemaker.tools.cloudfoundry.timeout.monitor.DuplicatingHttpServletResponseMonitorFactory;
import com.wavemaker.tools.cloudfoundry.timeout.monitor.HttpServletResponseMonitor;
import com.wavemaker.tools.cloudfoundry.timeout.monitor.HttpServletResponseMonitorFactory;

/**
 * {@link TimeoutProtectionStrategy} that works by hot-swapping the original request with the subsequent poll request.
 * Requests that take longer than the {@link #setThreshold(long) threshold} to respond will be protected. The threshold
 * should therefore be set to a value slightly lower than the expected gateway timeout. NOTE: once the threshold has
 * been reached the original response will block until a poll occurs. This ensures that none of the response data is
 * lost but can cause a request to take slightly longer to respond than would otherwise be the case. The
 * {@link #setFailTimeout(long)} method should be used to the timeout that will protect against requests that never
 * receive a poll (for example due to network failure). The {@link #setLongPollTime(long)} method can be used to set the
 * long-poll time for the poll request. This value should obviously be less than the gateway timeout.
 * 
 * @author Phillip Webb
 */
public class HotSwappingTimeoutProtectionStrategy implements TimeoutProtectionStrategy {

    private long threshold = TimeUnit.SECONDS.toMillis(14);

    private long longPollTime = TimeUnit.SECONDS.toMillis(6);

    private long failTimeout = TimeUnit.SECONDS.toMillis(30);

    private RequestCoordinators requestCoordinators = new RequestCoordinators();

    @Override
    public HttpServletResponseMonitorFactory handleRequest(final TimeoutProtectionHttpRequest request) {
        final long startTime = System.currentTimeMillis();
        return new HttpServletResponseMonitorFactory() {

            @Override
            public HttpServletResponseMonitor getMonitor() {
                if (HotSwappingTimeoutProtectionStrategy.this.threshold != 0
                    && System.currentTimeMillis() - startTime < HotSwappingTimeoutProtectionStrategy.this.threshold) {
                    return null;
                }
                RequestCoordinator requestCoordinator = HotSwappingTimeoutProtectionStrategy.this.requestCoordinators.get(request);
                HttpServletResponse pollResponse;
                synchronized (requestCoordinator) {
                    pollResponse = requestCoordinator.consumePollResponse();
                }
                if (pollResponse == null) {
                    try {
                        requestCoordinator.awaitPollResponse(HotSwappingTimeoutProtectionStrategy.this.failTimeout);
                    } catch (InterruptedException e) {
                        throw new IllegalStateException("Timeout waiting for poll", e);
                    }
                    pollResponse = requestCoordinator.consumePollResponse();
                    Assert.state(pollResponse != null, "Unable to consume poll response");
                }
                return new DuplicatingHttpServletResponseMonitorFactory(pollResponse).getMonitor();
            }
        };
    }

    @Override
    public void afterRequest(TimeoutProtectionHttpRequest request, HttpServletResponseMonitorFactory monitorFactory) {
        RequestCoordinator requestCoordinator = this.requestCoordinators.get(request);
        requestCoordinator.finish();
        synchronized (requestCoordinator) {
            if (!requestCoordinator.isPollResponseConsumed()) {
                this.requestCoordinators.delete(request);
            }
        }
    }

    @Override
    public void handlePoll(TimeoutProtectionHttpRequest request, HttpServletResponse response) throws IOException {
        RequestCoordinator requestCoordinator = this.requestCoordinators.get(request);
        synchronized (requestCoordinator) {
            requestCoordinator.setPollResponse(response);
        }
        try {
            requestCoordinator.awaitPollReponseConsumed(this.longPollTime);
        } catch (InterruptedException e) {
        }
        synchronized (requestCoordinator) {
            if (requestCoordinator.isPollResponseConsumed()) {
                try {
                    requestCoordinator.awaitFinish(this.failTimeout);
                } catch (InterruptedException e) {
                    throw new IllegalStateException("Timeout waiting for cleanup");
                } finally {
                    this.requestCoordinators.delete(request);
                }
            } else {
                requestCoordinator.clearPollResponse();
                response.setHeader(TimeoutProtectionHttpHeader.POLL, request.getUid());
                response.setStatus(HttpStatus.NO_CONTENT.value());
            }
        }
    }

    protected void setRequestCoordinators(RequestCoordinators requestCoordinators) {
        this.requestCoordinators = requestCoordinators;
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
     * Maintains a map of {@link RequestCoordinator}s against {@link TimeoutProtectionHttpRequest}s.
     */
    protected static class RequestCoordinators {

        private final Map<String, RequestCoordinator> coordinators = new HashMap<String, RequestCoordinator>();

        public synchronized RequestCoordinator get(TimeoutProtectionHttpRequest request) {
            String uid = request.getUid();
            RequestCoordinator requestCoordinator = this.coordinators.get(uid);
            if (requestCoordinator == null) {
                requestCoordinator = new RequestCoordinator();
                this.coordinators.put(uid, requestCoordinator);
            }
            return requestCoordinator;
        }

        public synchronized void delete(TimeoutProtectionHttpRequest request) {
            this.coordinators.remove(request.getUid());
        }
    }

    protected static enum CoordinatedEvent {
        POLL_RESPONSE, POLL_RESPONSE_CONSUMED, FINISH
    };

    /**
     * A single coordinator used to manage access to a {@link TimeoutProtectionHttpRequest}. The coordinator object
     * should be used as the lock for synchronized blocks to prevent concurrent updates.
     */
    protected static class RequestCoordinator {

        private HttpServletResponse pollResponse;

        private volatile boolean pollResponseConsumed;

        private final Map<CoordinatedEvent, CountDownLatch> latches;

        public RequestCoordinator() {
            this.latches = new HashMap<CoordinatedEvent, CountDownLatch>();
            for (CoordinatedEvent event : CoordinatedEvent.values()) {
                this.latches.put(event, new CountDownLatch(1));
            }
        }

        public void setPollResponse(HttpServletResponse pollResponse) {
            Assert.state(!this.pollResponseConsumed, "Unable to set an already consumed poll response");
            this.pollResponse = pollResponse;
            signal(CoordinatedEvent.POLL_RESPONSE);
        }

        public void clearPollResponse() {
            Assert.state(!this.pollResponseConsumed, "Unable to clear an already consumed poll response");
            this.pollResponse = null;
        }

        public HttpServletResponse consumePollResponse() {
            if (this.pollResponse != null) {
                this.pollResponseConsumed = true;
                signal(CoordinatedEvent.POLL_RESPONSE_CONSUMED);
            }
            return this.pollResponse;
        }

        public void finish() {
            signal(CoordinatedEvent.FINISH);
        }

        public boolean isPollResponseConsumed() {
            return this.pollResponseConsumed;
        }

        public void awaitPollResponse(long timeout) throws InterruptedException {
            await(CoordinatedEvent.POLL_RESPONSE, timeout);
        }

        public void awaitPollReponseConsumed(long timeout) throws InterruptedException {
            await(CoordinatedEvent.POLL_RESPONSE_CONSUMED, timeout);
        }

        public void awaitFinish(long timeout) throws InterruptedException {
            await(CoordinatedEvent.FINISH, timeout);
        }

        private void signal(CoordinatedEvent event) {
            this.latches.get(event).countDown();
        }

        private void await(CoordinatedEvent event, long timeout) throws InterruptedException {
            this.latches.get(event).await(timeout, TimeUnit.MILLISECONDS);
        }

    }
}
