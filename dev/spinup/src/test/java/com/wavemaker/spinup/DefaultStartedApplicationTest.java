
package com.wavemaker.spinup;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import com.wavemaker.spinup.DefaultStartedApplication;
import com.wavemaker.spinup.authentication.TransportToken;

/**
 * Tests for {@link DefaultStartedApplication}.
 * 
 * @author Phillip Webb
 */
public class DefaultStartedApplicationTest {

    private static final String DOMAIN = "domain";

    private static final TransportToken TRANSPORT_TOKEN = new TransportToken(new byte[] { 0 }, new byte[] { 1 });

    private static final String APPLICATION_URL = "http://localhost";

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void shouldNeedTransportToken() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("TransportToken must not be null");
        new DefaultStartedApplication(null, DefaultStartedApplicationTest.APPLICATION_URL, null);
    }

    @Test
    public void shouldNeedApplicationURL() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("ApplicationUrl must not be null");
        new DefaultStartedApplication(DefaultStartedApplicationTest.TRANSPORT_TOKEN, null, null);
    }

    @Test
    public void shouldAllowNullDomain() throws Exception {
        DefaultStartedApplication application = new DefaultStartedApplication(DefaultStartedApplicationTest.TRANSPORT_TOKEN,
            DefaultStartedApplicationTest.APPLICATION_URL, null);
        assertThat(application.getDomain(), is(nullValue()));
    }

    @Test
    public void shouldGetTokenAndUrl() throws Exception {
        DefaultStartedApplication application = new DefaultStartedApplication(DefaultStartedApplicationTest.TRANSPORT_TOKEN,
            DefaultStartedApplicationTest.APPLICATION_URL, DOMAIN);
        assertThat(application.getTransportToken(), is(equalTo(DefaultStartedApplicationTest.TRANSPORT_TOKEN)));
        assertThat(application.getApplicationUrl(), is(equalTo(DefaultStartedApplicationTest.APPLICATION_URL)));
        assertThat(application.getDomain(), is(equalTo(DOMAIN)));
    }

}
