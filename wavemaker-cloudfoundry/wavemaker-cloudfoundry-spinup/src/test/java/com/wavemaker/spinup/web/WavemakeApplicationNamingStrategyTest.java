
package com.wavemaker.spinup.web;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import org.junit.Test;

import com.wavemaker.tools.cloudfoundry.spinup.ApplicationDetails;
import com.wavemaker.tools.cloudfoundry.spinup.ApplicationNamingStrategyContext;

/**
 * Tests for {@link WavemakeApplicationNamingStrategy}.
 * 
 * @author Phillip Webb
 */
public class WavemakeApplicationNamingStrategyTest {

    private final WavemakeApplicationNamingStrategy strategy = new WavemakeApplicationNamingStrategy();

    @Test
    public void shouldCreateApplicationName() throws Exception {
        ApplicationNamingStrategyContext context1 = mock(ApplicationNamingStrategyContext.class);
        given(context1.getUsername()).willReturn("user.name@somedomain.com");
        given(context1.getControllerUrl()).willReturn("https://api.cloudfoundry.com");
        ApplicationNamingStrategyContext context = context1;
        ApplicationDetails details = this.strategy.newApplicationDetails(context);
        assertThat(details.getName(), is(equalTo("wavemaker-studio")));
    }
}
