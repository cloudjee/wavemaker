
package com.wavemaker.spinup.authentication;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

import java.util.HashMap;
import java.util.Map;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

/**
 * Tests for {@link SharedSecretPropagation}.
 * 
 * @author Phillip Webb
 */
public class SharedSecretPropagationTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private SharedSecretPropagation propagation;

    @Mock
    private CloudFoundryClient client;

    @Mock
    private CloudApplication application;

    @Captor
    private ArgumentCaptor<Map<String, String>> envCaptor;

    private final SharedSecret secret = SharedSecret.fromBytes(new byte[] { 0x00, 0x01, 0x02 });

    private final String applicationName = "applicationName";

    private final Map<String, String> applicationEnv = new HashMap<String, String>();

    private final Map<String, String> systemEnv = new HashMap<String, String>();

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        given(this.application.getName()).willReturn(this.applicationName);
        given(this.application.getEnvAsMap()).willReturn(this.applicationEnv);
        this.propagation = new SharedSecretPropagationWithMockEnv();
    }

    @Test
    public void shouldNeedClient() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Client must not be null");
        this.propagation.sendTo(null, this.secret, this.application);
    }

    @Test
    public void shouldSendToApplicationByName() throws Exception {
        this.propagation = spy(this.propagation);
        given(this.client.getApplication(this.applicationName)).willReturn(this.application);
        this.propagation.sendTo(this.client, this.secret, this.applicationName);
        verify(this.propagation).sendTo(this.client, this.secret, this.application);
    }

    @Test
    public void shouldSendToApplication() throws Exception {
        this.propagation.sendTo(this.client, this.secret, this.application);
        verify(this.client).updateApplicationEnv(eq(this.applicationName), this.envCaptor.capture());
        assertThat(this.envCaptor.getValue().get(SharedSecretPropagation.ENV_KEY), is("000102"));
    }

    @Test
    public void shouldSendToApplicationAndRetainEnvs() throws Exception {
        this.applicationEnv.put("example", "test");
        this.propagation.sendTo(this.client, this.secret, this.application);
        verify(this.client).updateApplicationEnv(eq(this.applicationName), this.envCaptor.capture());
        assertThat(this.envCaptor.getValue().get("example"), is("test"));
    }

    @Test
    public void shouldSkipSendToApplicationIfEnvAlreadyContained() throws Exception {
        this.applicationEnv.put(SharedSecretPropagation.ENV_KEY, "000102");
        this.propagation.sendTo(this.client, this.secret, this.application);
        verify(this.client, never()).updateApplicationEnv(anyString(), this.envCaptor.capture());
    }

    @Test
    public void shouldGetForSelf() throws Exception {
        this.systemEnv.put(SharedSecretPropagation.ENV_KEY, "000102");
        SharedSecret selfSecret = this.propagation.getForSelf();
        assertThat(selfSecret.getBytes(), is(equalTo(this.secret.getBytes())));
    }

    @Test
    public void shouldThrowIfCantGetForSelf() throws Exception {
        this.thrown.expect(IllegalStateException.class);
        this.propagation.getForSelf();
    }

    private class SharedSecretPropagationWithMockEnv extends SharedSecretPropagation {

        @Override
        protected String getEnv(String name) {
            return SharedSecretPropagationTest.this.systemEnv.get(name);
        }
    }
}
