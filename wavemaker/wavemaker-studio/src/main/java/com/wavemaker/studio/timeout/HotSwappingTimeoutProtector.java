
package com.wavemaker.studio.timeout;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.util.Assert;

import com.wavemaker.studio.timeout.monitor.DuplicatingHttpServletResponseMonitorFactory;
import com.wavemaker.studio.timeout.monitor.HttpServletResponseMonitor;
import com.wavemaker.studio.timeout.monitor.HttpServletResponseMonitorFactory;

/**
 * {@link TimeoutProtector} that works by hot-swapping the original request with the subsequent poll request. Requests
 * that take longer than the {@link #setPollThreshold(long) poll threshold} to respond will be protected. The poll
 * threshold should therefore be set to a value slightly lower than the expected gateway timeout. NOTE: once the poll
 * threshold has been reached the original response will block until a poll occurs. This ensures that none of the
 * response data is lost but can cause a response to take slightly longer to respond than would otherwise be the case.
 * The {@link #setFailTimeout(long)} method should be used to the timeout that will protect against requests that never
 * receive a poll (for example due to network failure). The {@link #setPollTimeout(long)} method can be used to set the
 * long-poll time for the poll request. This value should obviously be less than the gateway timeout.
 * 
 * @author Phillip Webb
 */
public class HotSwappingTimeoutProtector implements TimeoutProtector {

    private long pollTimeout = TimeUnit.SECONDS.toMillis(6);

    private long pollThreshold = TimeUnit.SECONDS.toMillis(14);

    private long failTimeout = TimeUnit.SECONDS.toMillis(30);

    private RequestCoordinators requestCoordinators = new RequestCoordinators();

    @Override
    public HttpServletResponseMonitorFactory getMonitorFactory(final TimeoutProtectionHttpRequest request) {
        final long startTime = System.currentTimeMillis();
        return new HttpServletResponseMonitorFactory<HttpServletResponseMonitor>() {

            @Override
            public HttpServletResponseMonitor getMonitor() {
                if (HotSwappingTimeoutProtector.this.pollThreshold != 0
                    && System.currentTimeMillis() - startTime < HotSwappingTimeoutProtector.this.pollThreshold) {
                    return null;
                }
                RequestCoordinator requestCoordinator = HotSwappingTimeoutProtector.this.requestCoordinators.get(request);
                HttpServletResponse pollResponse;
                synchronized (requestCoordinator) {
                    pollResponse = requestCoordinator.consumePollResponse();
                }
                if (pollResponse == null) {
                    try {
                        requestCoordinator.awaitPollResponse(HotSwappingTimeoutProtector.this.failTimeout);
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
    public void cleanup(TimeoutProtectionHttpRequest request, HttpServletResponseMonitorFactory monitor) {
        RequestCoordinator requestCoordinator = this.requestCoordinators.get(request);
        requestCoordinator.cleanup();
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
            requestCoordinator.awaitPollReponseConsumed(this.pollTimeout);
        } catch (InterruptedException e) {
        }
        synchronized (requestCoordinator) {
            if (requestCoordinator.isPollResponseConsumed()) {
                try {
                    requestCoordinator.awaitCleanup(this.failTimeout);
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

    public void setFailTimeout(long failTimeout) {
        this.failTimeout = failTimeout;
    }

    public void setPollThreshold(long pollThreshold) {
        this.pollThreshold = pollThreshold;
    }

    public void setPollTimeout(long pollTimeout) {
        this.pollTimeout = pollTimeout;
    }

    protected void setRequestCoordinators(RequestCoordinators requestCoordinators) {
        this.requestCoordinators = requestCoordinators;
    }

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

    protected static class RequestCoordinator {

        private HttpServletResponse pollResponse;

        private volatile boolean pollResponseConsumed;

        private final CountDownLatch pollResponseLatch = new CountDownLatch(1);

        private final CountDownLatch pollResponseConsumedLatch = new CountDownLatch(1);

        private final CountDownLatch cleanupLatch = new CountDownLatch(1);

        public void setPollResponse(HttpServletResponse pollResponse) {
            Assert.state(!this.pollResponseConsumed, "Unable to set an already consumed poll response");
            this.pollResponse = pollResponse;
            this.pollResponseLatch.countDown();
        }

        public void clearPollResponse() {
            Assert.state(!this.pollResponseConsumed, "Unable to clear an already consumed poll response");
            this.pollResponse = null;
        }

        public HttpServletResponse consumePollResponse() {
            if (this.pollResponse != null) {
                this.pollResponseConsumed = true;
                this.pollResponseConsumedLatch.countDown();
            }
            return this.pollResponse;
        }

        public boolean isPollResponseConsumed() {
            return this.pollResponseConsumed;
        }

        public void awaitPollResponse(long timeout) throws InterruptedException {
            this.pollResponseLatch.await(timeout, TimeUnit.MILLISECONDS);
        }

        public void awaitPollReponseConsumed(long timeout) throws InterruptedException {
            this.pollResponseConsumedLatch.await(timeout, TimeUnit.MILLISECONDS);
        }

        public void awaitCleanup(long timeout) throws InterruptedException {
            this.cleanupLatch.await(timeout, TimeUnit.MICROSECONDS);
        }

        public void cleanup() {
            this.cleanupLatch.countDown();
        }
    }
}
