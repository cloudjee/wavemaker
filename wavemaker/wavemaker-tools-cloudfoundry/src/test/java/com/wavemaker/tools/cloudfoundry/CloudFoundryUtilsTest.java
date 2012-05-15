
package com.wavemaker.tools.cloudfoundry;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudApplication.AppState;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

/**
 * Tests for {@link CloudFoundryUtils}.
 * 
 * @author Phillip Webb
 */
public class CloudFoundryUtilsTest {

    @Mock
    private CloudFoundryClient client;

    private final String appName = "application";

    private CloudApplication updating;

    private CloudApplication startedNotRunning;

    private CloudApplication running;

    @Before
    public void setup() {
        CloudFoundryUtils.SLEEP_TIME = 100L;
        MockitoAnnotations.initMocks(this);

        this.updating = mock(CloudApplication.class);
        given(this.updating.getState()).willReturn(AppState.UPDATING);

        this.startedNotRunning = mock(CloudApplication.class);
        given(this.startedNotRunning.getState()).willReturn(AppState.STARTED);
        given(this.startedNotRunning.getInstances()).willReturn(2);
        given(this.startedNotRunning.getRunningInstances()).willReturn(1);

        this.running = mock(CloudApplication.class);
        given(this.running.getState()).willReturn(AppState.STARTED);
        given(this.running.getInstances()).willReturn(2);
        given(this.running.getRunningInstances()).willReturn(2);
    }

    @Test
    public void shouldStartApplicationAndWait() throws Exception {
        given(this.client.getApplication(this.appName)).willReturn(this.updating, this.startedNotRunning, this.running);
        long startTime = System.currentTimeMillis();
        CloudFoundryUtils.startApplicationAndWaitUntilRunning(this.client, this.appName);
        verify(this.client).startApplication(this.appName);
        assertThat(System.currentTimeMillis() - startTime, is(greaterThan(250L)));
    }

    @Test
    public void shouldRestartApplicationAndWait() throws Exception {
        given(this.client.getApplication(this.appName)).willReturn(this.updating, this.startedNotRunning, this.running);
        long startTime = System.currentTimeMillis();
        CloudFoundryUtils.restartApplicationAndWaitUntilRunning(this.client, this.appName);
        verify(this.client).restartApplication(this.appName);
        assertThat(System.currentTimeMillis() - startTime, is(greaterThan(250L)));
    }

    @Test
    public void shouldTimeout() throws Exception {
        given(this.client.getApplication(this.appName)).willReturn(this.startedNotRunning);
        long startTime = System.currentTimeMillis();
        try {
            CloudFoundryUtils.waitUntilRunning(this.client, this.appName, 300);
            fail("Did not throw");
        } catch (IllegalStateException e) {
            assertThat(e.getMessage(), is("Timeout waiting for 'application' to start"));
            assertThat(System.currentTimeMillis() - startTime, is(greaterThan(299L)));
        }
    }
}
