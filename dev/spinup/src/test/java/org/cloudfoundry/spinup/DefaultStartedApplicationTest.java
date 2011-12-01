
package org.cloudfoundry.spinup;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.cloudfoundry.spinup.authentication.TransportToken;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

/**
 * Tests for {@link DefaultStartedApplication}.
 * 
 * @author Phillip Webb
 */
public class DefaultStartedApplicationTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private final TransportToken transportToken = new TransportToken(new byte[] { 0 }, new byte[] { 1 });

    private final String applicationUrl = "http://localhost";

    @Test
    public void shouldNeedTransportToken() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("TransportToken must not be null");
        new DefaultStartedApplication(null, this.applicationUrl);
    }

    @Test
    public void shouldNeedApplicationURL() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("ApplicationUrl must not be null");
        new DefaultStartedApplication(this.transportToken, null);
    }

    @Test
    public void shouldGetTokenAndUrl() throws Exception {
        DefaultStartedApplication application = new DefaultStartedApplication(this.transportToken, this.applicationUrl);
        assertThat(application.getTransportToken(), is(equalTo(this.transportToken)));
        assertThat(application.getApplicationUrl(), is(equalTo(this.applicationUrl)));
    }

}
