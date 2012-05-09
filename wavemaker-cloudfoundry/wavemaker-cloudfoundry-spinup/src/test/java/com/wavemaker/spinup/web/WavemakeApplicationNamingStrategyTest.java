
package com.wavemaker.spinup.web;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import javax.servlet.ServletContext;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.wavemaker.tools.cloudfoundry.spinup.ApplicationDetails;
import com.wavemaker.tools.cloudfoundry.spinup.ApplicationNamingStrategyContext;

/**
 * Tests for {@link WavemakeApplicationNamingStrategy}.
 * 
 * @author Phillip Webb
 */
public class WavemakeApplicationNamingStrategyTest {

    @InjectMocks
    private final WavemakeApplicationNamingStrategy strategy = new WavemakeApplicationNamingStrategy();

    @Mock
    private VersionProvider versionProvider;

    @Before
    public void setup() throws Exception {
        MockitoAnnotations.initMocks(this);
        ServletContext servletContext = mock(ServletContext.class);
        given(this.versionProvider.getVersion(servletContext)).willReturn("2.0.0");
        this.strategy.setServletContext(servletContext);
    }

    @Test
    public void shouldCreateApplicationName() throws Exception {
        ApplicationNamingStrategyContext context = mock(ApplicationNamingStrategyContext.class);
        given(context.getUsername()).willReturn("user.name@somedomain.com");
        given(context.getControllerUrl()).willReturn("https://api.cloudfoundry.com");
        ApplicationDetails details = this.strategy.newApplicationDetails(context);
        assertThat(details.getName(), is(equalTo("wavemaker-studio-2_0_0")));
    }

    @Test
    public void shouldMatch() throws Exception {
        assertThat(this.strategy.isMatch(new ApplicationDetails("wavemaker-studio-1_0_0", "")), is(true));
        assertThat(this.strategy.isMatch(new ApplicationDetails("wavemaker-studio-2_0_0", "")), is(true));
        assertThat(this.strategy.isMatch(new ApplicationDetails("wavemaker-studio-3_0_0", "")), is(true));
        assertThat(this.strategy.isMatch(new ApplicationDetails("deployed", "")), is(false));
    }

    @Test
    public void shouldUpgrade() throws Exception {
        assertThat(this.strategy.isUpgradeRequired(new ApplicationDetails("wavemaker-studio-1_0_0", "")), is(true));
        assertThat(this.strategy.isUpgradeRequired(new ApplicationDetails("wavemaker-studio-2_0_0", "")), is(false));
        assertThat(this.strategy.isUpgradeRequired(new ApplicationDetails("wavemaker-studio-3_0_0", "")), is(true));
    }
}