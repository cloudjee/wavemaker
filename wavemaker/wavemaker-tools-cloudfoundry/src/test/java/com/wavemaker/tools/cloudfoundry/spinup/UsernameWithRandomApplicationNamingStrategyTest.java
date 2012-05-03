
package com.wavemaker.tools.cloudfoundry.spinup;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import org.junit.Test;

import com.wavemaker.tools.cloudfoundry.spinup.util.HexString;

/**
 * Tests for {@link UsernameWithRandomApplicationNamingStrategy}.
 * 
 * @author Phillip Webb
 */
public class UsernameWithRandomApplicationNamingStrategyTest {

    private final UsernameWithRandomApplicationNamingStrategy strategy = new UsernameWithRandomApplicationNamingStrategy() {

        @Override
        protected String getApplicationName() {
            return "appname";
        };
    };

    @Test
    public void shouldGenerateUrlFromUsernameAndRandomNumber() throws Exception {
        ApplicationNamingStrategyContext context = newContext("user.name@somedomain.com");
        ApplicationDetails details1 = this.strategy.newApplicationDetails(context);
        ApplicationDetails details2 = this.strategy.newApplicationDetails(context);
        assertThat(details1.getUrl(), startsWith("http://username"));
        assertThat(details2.getUrl(), startsWith("http://username"));
        assertThat(details1.getUrl(), is(not(equalTo(details2.getUrl()))));
    }

    @Test
    public void shouldRemoveInvalidUsernameCharsFromURL() throws Exception {
        ApplicationNamingStrategyContext context = newContext("a!$-_(&z@somedomain.co.uk");
        ApplicationDetails details = this.strategy.newApplicationDetails(context);
        assertThat(details.getUrl(), startsWith("http://a-z"));
    }

    @Test
    public void shouldLimitLengthOfUsernameInUrl() throws Exception {
        String username = HexString.toString(new byte[64]);
        assertThat(username.length(), is(greaterThan(64)));
        ApplicationNamingStrategyContext context = newContext(username + "@somedomain.com");
        ApplicationDetails details = this.strategy.newApplicationDetails(context);
        assertThat(details.getUrl().length(), is("http://.cloudfoundry.com".length() + 64));
    }

    @Test
    public void shouldCreateApplicationName() throws Exception {
        ApplicationNamingStrategyContext context = newContext("user.name@somedomain.com");
        ApplicationDetails details = this.strategy.newApplicationDetails(context);
        assertThat(details.getName(), is(equalTo("appname")));
    }

    private ApplicationNamingStrategyContext newContext(String username) {
        ApplicationNamingStrategyContext context = mock(ApplicationNamingStrategyContext.class);
        given(context.getUsername()).willReturn(username);
        given(context.getControllerUrl()).willReturn("https://api.cloudfoundry.com");
        return context;
    }
}
