
package com.wavemaker.tools.cloudfoundry.timeout;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.lessThan;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.util.ReflectionUtils;

import com.wavemaker.tools.cloudfoundry.timeout.HotSwappingTimeoutProtectionStrategy.RequestCoordinator;
import com.wavemaker.tools.cloudfoundry.timeout.HotSwappingTimeoutProtectionStrategy.RequestCoordinators;
import com.wavemaker.tools.cloudfoundry.timeout.monitor.HttpServletResponseMonitor;
import com.wavemaker.tools.cloudfoundry.timeout.monitor.HttpServletResponseMonitorFactory;

/**
 * Tests for {@link HotSwappingTimeoutProtectionStrategy}.
 * 
 * @author Phillip Webb
 */
public class HotSwappingTimeoutProtectionStrategyTest {

    private static final String UUID = "xxxx-xxxx-xxxx-xxxx";

    private static final long FAIL_TIMEOUT = 100;

    private static final long LONG_POLL_TIME = 200;

    private static final long THRESHOLD = 300;

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private final HotSwappingTimeoutProtectionStrategy strategy = new HotSwappingTimeoutProtectionStrategy();

    @Mock
    private TimeoutProtectionHttpRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private RequestCoordinators requestCoordinators;

    @Mock
    private RequestCoordinator requestCoordinator;

    private final RequestCoordinator realRequestCoordinator = new RequestCoordinator();

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.strategy.setRequestCoordinators(this.requestCoordinators);
        this.strategy.setThreshold(THRESHOLD);
        this.strategy.setFailTimeout(FAIL_TIMEOUT);
        this.strategy.setLongPollTime(LONG_POLL_TIME);
        given(this.requestCoordinators.get(this.request)).willReturn(this.requestCoordinator);
        given(this.request.getUid()).willReturn(UUID);
    }

    @Test
    public void shouldNotUseMonitorIfUnderThreshold() throws Exception {
        this.strategy.setThreshold(100);
        HttpServletResponseMonitorFactory monitorFactory = this.strategy.handleRequest(this.request);
        HttpServletResponseMonitor monitor = monitorFactory.getMonitor();
        assertThat(monitor, is(nullValue()));
    }

    @Test
    public void shouldMonitorIfOverThreshold() throws Exception {
        this.strategy.setThreshold(100);
        given(this.requestCoordinator.consumePollResponse()).willReturn(this.response);
        HttpServletResponseMonitorFactory monitorFactory = this.strategy.handleRequest(this.request);
        Thread.sleep(150);
        HttpServletResponseMonitor monitor = monitorFactory.getMonitor();
        assertThat(monitor, is(not(nullValue())));
    }

    @Test
    public void shouldConsumePollResponseIfAlreadyAvailble() throws Exception {
        this.strategy.setThreshold(0);
        given(this.requestCoordinator.consumePollResponse()).willReturn(this.response);
        HttpServletResponseMonitorFactory monitorFactory = this.strategy.handleRequest(this.request);
        HttpServletResponseMonitor monitor = monitorFactory.getMonitor();
        assertThat(monitor, is(not(nullValue())));
    }

    @Test
    public void shouldAwaitPollResponse() throws Exception {
        this.strategy.setThreshold(0);
        given(this.requestCoordinator.consumePollResponse()).willReturn(null, this.response);
        HttpServletResponseMonitorFactory monitorFactory = this.strategy.handleRequest(this.request);
        HttpServletResponseMonitor monitor = monitorFactory.getMonitor();
        assertThat(monitor, is(not(nullValue())));
        verify(this.requestCoordinator).awaitPollResponse(FAIL_TIMEOUT);
    }

    @Test
    public void shouldTimeoutAwaitingPollResponse() throws Exception {
        this.strategy.setThreshold(0);
        given(this.requestCoordinator.consumePollResponse()).willReturn(null);
        willThrow(new InterruptedException()).given(this.requestCoordinator).awaitPollResponse(FAIL_TIMEOUT);
        HttpServletResponseMonitorFactory monitorFactory = this.strategy.handleRequest(this.request);
        this.thrown.expect(IllegalStateException.class);
        this.thrown.expectMessage("Timeout waiting for poll");
        monitorFactory.getMonitor();
    }

    @Test
    public void shouldDeleteUnconsumedPollResponse() throws Exception {
        HttpServletResponseMonitorFactory monitorFactory = mock(HttpServletResponseMonitorFactory.class);
        given(this.requestCoordinator.isPollResponseConsumed()).willReturn(false);
        this.strategy.afterRequest(this.request, monitorFactory);
        verify(this.requestCoordinator).finish();
        verify(this.requestCoordinators).delete(this.request);
    }

    @Test
    public void shouldHandleUnconsumedPoll() throws Exception {
        given(this.requestCoordinator.isPollResponseConsumed()).willReturn(false);
        this.strategy.handlePoll(this.request, this.response);
        verify(this.requestCoordinator).clearPollResponse();
        verify(this.response).setHeader(TimeoutProtectionHttpHeader.POLL, UUID);
        verify(this.response).setStatus(204);
    }

    @Test
    public void shouldHandleConsumedPollResponse() throws Exception {
        given(this.requestCoordinator.isPollResponseConsumed()).willReturn(true);
        this.strategy.handlePoll(this.request, this.response);
        verify(this.requestCoordinator).awaitFinish(FAIL_TIMEOUT);
        verify(this.requestCoordinators).delete(this.request);
    }

    @Test
    public void shouldHandleInterruptedWaitingForPollResponseConsumed() throws Exception {
        willThrow(new InterruptedException()).given(this.requestCoordinator).awaitPollReponseConsumed(LONG_POLL_TIME);
        given(this.requestCoordinator.isPollResponseConsumed()).willReturn(false);
        this.strategy.handlePoll(this.request, this.response);
        verify(this.requestCoordinator).clearPollResponse();
        verify(this.response).setHeader(TimeoutProtectionHttpHeader.POLL, UUID);
        verify(this.response).setStatus(204);
    }

    @Test
    public void shouldHandleInterruptedWatingForAfterRequest() throws Exception {
        given(this.requestCoordinator.isPollResponseConsumed()).willReturn(true);
        willThrow(new InterruptedException()).given(this.requestCoordinator).awaitFinish(FAIL_TIMEOUT);
        try {
            this.strategy.handlePoll(this.request, this.response);
            fail("Did not throw");
        } catch (IllegalStateException e) {
            // Expected
            assertThat(e.getMessage(), is("Timeout waiting for cleanup"));
        }
        verify(this.requestCoordinators).delete(this.request);
    }

    @Test
    public void shouldGetRequestCoordinator() throws Exception {
        RequestCoordinators requestCoordinators = new RequestCoordinators();
        RequestCoordinator initial = requestCoordinators.get(this.request);
        RequestCoordinator subsequent = requestCoordinators.get(this.request);
        assertThat(initial, is(sameInstance(subsequent)));
    }

    @Test
    public void shouldDeleteRequestCoordinator() throws Exception {
        RequestCoordinators requestCoordinators = new RequestCoordinators();
        RequestCoordinator initial = requestCoordinators.get(this.request);
        requestCoordinators.delete(this.request);
        RequestCoordinator subsequent = requestCoordinators.get(this.request);
        assertThat(initial, is(not(sameInstance(subsequent))));
    }

    @Test
    public void shouldCoordinateSetPollResponseBeforeAwait() throws Exception {
        this.realRequestCoordinator.setPollResponse(this.response);
        ThreadAssertion assertion = expectResponseWithin(0, 500, new Call() {

            @Override
            public void call() throws Exception {
                HotSwappingTimeoutProtectionStrategyTest.this.realRequestCoordinator.awaitPollResponse(1000);
            }
        });
        assertion.verify();
    }

    @Test
    public void shouldCoordinateSetPollResponseAfterAwait() throws Exception {
        ThreadAssertion assertion = expectResponseWithin(150, 500, new Call() {

            @Override
            public void call() throws Exception {
                HotSwappingTimeoutProtectionStrategyTest.this.realRequestCoordinator.awaitPollResponse(1000);
            }
        });
        Thread.sleep(200);
        this.realRequestCoordinator.setPollResponse(this.response);
        assertion.verify();
    }

    @Test
    public void shouldCoordinateConsumePollResponseBeforeAwait() throws Exception {
        this.realRequestCoordinator.setPollResponse(this.response);
        this.realRequestCoordinator.consumePollResponse();
        ThreadAssertion assertion = expectResponseWithin(0, 500, new Call() {

            @Override
            public void call() throws Exception {
                HotSwappingTimeoutProtectionStrategyTest.this.realRequestCoordinator.awaitPollReponseConsumed(1000);
            }
        });
        assertion.verify();
    }

    @Test
    public void shouldCoordinateConsumePollResponseAfterAwait() throws Exception {
        this.realRequestCoordinator.setPollResponse(this.response);
        ThreadAssertion assertion = expectResponseWithin(50, 500, new Call() {

            @Override
            public void call() throws Exception {
                HotSwappingTimeoutProtectionStrategyTest.this.realRequestCoordinator.awaitPollReponseConsumed(1000);
            }
        });
        Thread.sleep(100);
        this.realRequestCoordinator.consumePollResponse();
        assertion.verify();
    }

    @Test
    public void shouldCoordinateCleanupBeforeAwait() throws Exception {
        this.realRequestCoordinator.finish();
        ThreadAssertion assertion = expectResponseWithin(0, 500, new Call() {

            @Override
            public void call() throws Exception {
                HotSwappingTimeoutProtectionStrategyTest.this.realRequestCoordinator.awaitFinish(1000);
            }
        });
        assertion.verify();
    }

    @Test
    public void shouldCoordinateCleanupAfterAwait() throws Exception {
        ThreadAssertion assertion = expectResponseWithin(50, 500, new Call() {

            @Override
            public void call() throws Exception {
                HotSwappingTimeoutProtectionStrategyTest.this.realRequestCoordinator.awaitFinish(1000);
            }
        });
        Thread.sleep(100);
        this.realRequestCoordinator.finish();
        assertion.verify();
    }

    @Test
    public void shouldCoordinateIsPollResponseConsumed() throws Exception {
        assertThat(this.realRequestCoordinator.isPollResponseConsumed(), is(false));

        // Consume without set
        this.realRequestCoordinator.consumePollResponse();
        assertThat(this.realRequestCoordinator.isPollResponseConsumed(), is(false));

        this.realRequestCoordinator.setPollResponse(this.response);
        assertThat(this.realRequestCoordinator.isPollResponseConsumed(), is(false));
        this.realRequestCoordinator.consumePollResponse();
        assertThat(this.realRequestCoordinator.isPollResponseConsumed(), is(true));
    }

    @Test
    public void shouldCoordinateClearPollResponse() throws Exception {
        this.realRequestCoordinator.setPollResponse(this.response);
        this.realRequestCoordinator.clearPollResponse();
        assertThat(this.realRequestCoordinator.consumePollResponse(), is(nullValue()));
    }

    @Test
    public void shouldNotCoordinateClearPollResponseIfConsumed() throws Exception {
        this.realRequestCoordinator.setPollResponse(this.response);
        assertThat(this.realRequestCoordinator.consumePollResponse(), is(this.response));
        this.thrown.expect(IllegalStateException.class);
        this.thrown.expectMessage("Unable to clear an already consumed poll response");
        this.realRequestCoordinator.clearPollResponse();
    }

    private ThreadAssertion expectResponseWithin(long min, long max, Call call) {
        return new RunWithinTimeThreadAssertion(min, max, call);
    }

    private static interface Call {

        public void call() throws Exception;
    }

    private static interface ThreadAssertion {

        public void verify() throws Exception;
    }

    private static class RunWithinTimeThreadAssertion implements ThreadAssertion {

        private final long min;

        private final long max;

        private final Thread thread;

        private long runTime;

        private Throwable exception;

        public RunWithinTimeThreadAssertion(final long min, final long max, final Call call) {
            this.min = min;
            this.max = max;
            this.thread = new Thread() {

                @Override
                public void run() {
                    try {
                        long startTime = System.currentTimeMillis();
                        call.call();
                        RunWithinTimeThreadAssertion.this.runTime = System.currentTimeMillis() - startTime;
                    } catch (Throwable e) {
                        RunWithinTimeThreadAssertion.this.exception = e;
                    }

                }
            };
            this.thread.start();
        }

        @Override
        public void verify() throws Exception {
            this.thread.join();
            if (this.exception != null) {
                ReflectionUtils.rethrowRuntimeException(this.exception);
            }
            assertThat(this.runTime, is(greaterThanOrEqualTo(this.min)));
            assertThat(this.runTime, is(lessThan(this.max)));
        }
    }
}
