
package com.wavemaker.tools.cloudfoundry.spinup;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Matchers.isA;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.Collections;
import java.util.List;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudApplication.AppState;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.client.lib.CloudFoundryException;
import org.cloudfoundry.client.lib.CloudService;
import org.cloudfoundry.client.lib.archive.ApplicationArchive;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;

import com.wavemaker.tools.cloudfoundry.spinup.authentication.AuthenticationToken;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.LoginCredentials;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecret;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecretPropagation;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;

/**
 * Tests for {@link DefaultSpinupService}.
 * 
 * @author Phillip Webb
 */
public class DefaultSpinupServiceTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private static final String APPLICATION_NAME = "application-name";

    private static final String CONTROLLER_URL = "http://api.cloudfoundry.com";

    private static final String APPLICATION_URL = "http://application.cloudfoundry.com";

    @Mock
    private CloudFoundryClient cloudFoundryClient;

    @Mock
    private ApplicationArchive archive;

    @Mock
    private ApplicationArchiveFactory archiveFactory;

    @Mock
    private ApplicationNamingStrategy namingStrategy;

    @Mock
    private SharedSecret secret;

    @Mock
    private LoginCredentials credentials;

    @Mock
    private CloudApplication application;

    @Mock
    private SharedSecretPropagation propagation;

    private final String authenticationToken = "auth-token";

    private final TransportToken transportToken = new TransportToken(new byte[] { 0 }, new byte[] { 1 });

    private final ApplicationDetails applicationDetails = new ApplicationDetails(APPLICATION_NAME, APPLICATION_URL);

    @InjectMocks
    private final DefaultSpinupService service = new DefaultSpinupService() {

        @Override
        protected CloudFoundryClient getCloudFoundryClient(LoginCredentials credentials) {
            return DefaultSpinupServiceTest.this.cloudFoundryClient;
        };

        @Override
        protected CloudFoundryClient getCloudFoundryClient(AuthenticationToken token) {
            return DefaultSpinupServiceTest.this.cloudFoundryClient;
        };
    };

    @Before
    public void setup() throws Exception {
        MockitoAnnotations.initMocks(this);
        this.service.setControllerUrl(CONTROLLER_URL);
        given(this.cloudFoundryClient.login()).willReturn(this.authenticationToken);
        given(this.cloudFoundryClient.getDefaultApplicationMemory(anyString())).willReturn(512);
        given(this.secret.encrypt(eq(new AuthenticationToken(this.authenticationToken)))).willReturn(this.transportToken);
        given(this.archiveFactory.getArchive()).willReturn(this.archive);
        given(this.application.getState()).willReturn(AppState.STARTED);
    }

    @Test
    public void shouldDeployStartAndPropagateNewApplication() throws Exception {
        given(this.namingStrategy.isMatch(isA(ApplicationDetails.class))).willReturn(false);
        given(this.namingStrategy.newApplicationDetails(isA(ApplicationNamingStrategyContext.class))).willReturn(this.applicationDetails);
        given(this.cloudFoundryClient.getApplication(APPLICATION_NAME)).willReturn(this.application);
        TransportToken token = this.service.login(this.secret, this.credentials);
        String url = this.service.start(this.secret, this.credentials.getUsername(), token);
        verify(this.cloudFoundryClient).uploadApplication(APPLICATION_NAME, this.archive);
        verify(this.cloudFoundryClient).createApplication(APPLICATION_NAME, CloudApplication.SPRING, 512, Collections.singletonList(APPLICATION_URL),
            null, false);
        verify(this.propagation).sendTo(this.cloudFoundryClient, this.secret, APPLICATION_NAME);
        verify(this.cloudFoundryClient).restartApplication(APPLICATION_NAME);
        assertThat(url, is(equalTo(APPLICATION_URL)));
        assertThat(this.transportToken, is(this.transportToken));
    }

    @Test
    public void shouldNotReployIfAlreadyDeployed() throws Exception {
        CloudApplication deployedApplication = mock(CloudApplication.class);
        given(deployedApplication.getName()).willReturn(APPLICATION_NAME);
        given(deployedApplication.getUris()).willReturn(Collections.singletonList(APPLICATION_URL));
        given(deployedApplication.getState()).willReturn(AppState.STARTED);
        List<CloudApplication> applications = Collections.singletonList(deployedApplication);
        given(this.cloudFoundryClient.getApplications()).willReturn(applications);
        given(this.cloudFoundryClient.getApplication(APPLICATION_NAME)).willReturn(deployedApplication);
        given(this.namingStrategy.isMatch(isA(ApplicationDetails.class))).willReturn(true);
        TransportToken token = this.service.login(this.secret, this.credentials);
        String url = this.service.start(this.secret, this.credentials.getUsername(), token);
        verify(this.cloudFoundryClient).login();
        verify(this.cloudFoundryClient).getApplications();
        verify(this.propagation).sendTo(this.cloudFoundryClient, this.secret, APPLICATION_NAME);
        verify(this.cloudFoundryClient).restartApplication(APPLICATION_NAME);
        assertThat(url, is(equalTo(APPLICATION_URL)));
        assertThat(token, is(this.transportToken));
    }

    @Test
    public void shouldUpgrade() throws Exception {
        CloudApplication deployedApplication = mock(CloudApplication.class);
        given(deployedApplication.getName()).willReturn("application-name-old");
        given(deployedApplication.getUris()).willReturn(Collections.singletonList(APPLICATION_URL));
        given(deployedApplication.getState()).willReturn(AppState.STARTED);
        List<CloudApplication> applications = Collections.singletonList(deployedApplication);
        given(this.cloudFoundryClient.getApplications()).willReturn(applications);
        given(this.cloudFoundryClient.getApplication("application-name-old")).willReturn(deployedApplication);
        given(this.cloudFoundryClient.getApplication(APPLICATION_NAME)).willReturn(this.application);
        given(this.namingStrategy.isMatch(isA(ApplicationDetails.class))).willReturn(true);
        given(this.namingStrategy.isUpgradeRequired(isA(ApplicationDetails.class))).willReturn(true);
        given(this.namingStrategy.newApplicationDetails(isA(ApplicationNamingStrategyContext.class))).willReturn(this.applicationDetails);
        TransportToken token = this.service.login(this.secret, this.credentials);
        String url = this.service.start(this.secret, this.credentials.getUsername(), token);
        verify(this.cloudFoundryClient).deleteApplication("application-name-old");
        verify(this.cloudFoundryClient).uploadApplication(APPLICATION_NAME, this.archive);
        verify(this.cloudFoundryClient).createApplication(APPLICATION_NAME, CloudApplication.SPRING, 512, Collections.singletonList(APPLICATION_URL),
            null, false);
        verify(this.propagation).sendTo(this.cloudFoundryClient, this.secret, APPLICATION_NAME);
        verify(this.cloudFoundryClient).restartApplication(APPLICATION_NAME);
        assertThat(url, is(equalTo(APPLICATION_URL)));
        assertThat(this.transportToken, is(this.transportToken));
    }

    @Test
    public void shouldThrowInvalidCredentialsOnHttpStatusError() throws Exception {
        given(this.cloudFoundryClient.login()).willThrow(new CloudFoundryException(HttpStatus.FORBIDDEN));
        this.thrown.expect(InvalidLoginCredentialsException.class);
        this.service.login(this.secret, this.credentials);
    }

    @Test
    public void shouldCallNamerAgainOnUrlClash() throws Exception {
        given(this.cloudFoundryClient.getApplication(APPLICATION_NAME)).willReturn(this.application);
        given(this.namingStrategy.isMatch(isA(ApplicationDetails.class))).willReturn(false);
        given(this.namingStrategy.newApplicationDetails(isA(ApplicationNamingStrategyContext.class))).willReturn(this.applicationDetails);
        willThrow(new CloudFoundryException(HttpStatus.BAD_REQUEST)).willNothing().given(this.cloudFoundryClient).createApplication(APPLICATION_NAME,
            CloudApplication.SPRING, 512, Collections.singletonList(APPLICATION_URL), null, false);
        TransportToken token = this.service.login(this.secret, this.credentials);
        this.service.start(this.secret, this.credentials.getUsername(), token);
        verify(this.namingStrategy, times(2)).newApplicationDetails(isA(ApplicationNamingStrategyContext.class));
    }

    @Test
    public void shouldFailAfterTooManyNamerCalls() throws Exception {
        given(this.cloudFoundryClient.getApplication(APPLICATION_NAME)).willReturn(this.application);
        given(this.namingStrategy.isMatch(isA(ApplicationDetails.class))).willReturn(false);
        given(this.namingStrategy.newApplicationDetails(isA(ApplicationNamingStrategyContext.class))).willReturn(this.applicationDetails);
        willThrow(new CloudFoundryException(HttpStatus.BAD_REQUEST)).given(this.cloudFoundryClient).createApplication(APPLICATION_NAME,
            CloudApplication.SPRING, 512, Collections.singletonList(APPLICATION_URL), null, false);
        try {
            TransportToken token = this.service.login(this.secret, this.credentials);
            this.service.start(this.secret, this.credentials.getUsername(), token);
            fail("Did not throw");
        } catch (CloudFoundryException e) {
            assertThat(e.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        }
        verify(this.namingStrategy, times(5)).newApplicationDetails(isA(ApplicationNamingStrategyContext.class));
    }

    @Test
    public void shouldGetDomain() throws Exception {
        assertThat(this.service.getDomain(), is(".cloudfoundry.com"));
    }

    @Test
    public void shouldCreateService() throws Exception {
        CloudService cloudService = new CloudService();
        cloudService.setName("test");
        cloudService.setType("test");
        List<CloudService> cloudServices = Collections.singletonList(cloudService);
        this.service.setServices(cloudServices);

        given(this.cloudFoundryClient.getApplication(APPLICATION_NAME)).willReturn(this.application);
        given(this.namingStrategy.isMatch(isA(ApplicationDetails.class))).willReturn(false);
        given(this.namingStrategy.newApplicationDetails(isA(ApplicationNamingStrategyContext.class))).willReturn(this.applicationDetails);

        this.service.start(this.secret, this.credentials.getUsername(), this.transportToken);
        verify(this.cloudFoundryClient).createService(cloudService);
    }

    @Test
    public void shouldNotReplaceExistingService() throws Exception {
        CloudService cloudService = new CloudService();
        cloudService.setName("test");
        cloudService.setType("test");
        List<CloudService> cloudServices = Collections.singletonList(cloudService);
        this.service.setServices(cloudServices);
        given(this.cloudFoundryClient.getServices()).willReturn(cloudServices);
        given(this.cloudFoundryClient.getApplication(APPLICATION_NAME)).willReturn(this.application);
        given(this.namingStrategy.isMatch(isA(ApplicationDetails.class))).willReturn(false);
        given(this.namingStrategy.newApplicationDetails(isA(ApplicationNamingStrategyContext.class))).willReturn(this.applicationDetails);

        this.service.start(this.secret, this.credentials.getUsername(), this.transportToken);
        verify(this.cloudFoundryClient, never()).createService(cloudService);
    }

}
