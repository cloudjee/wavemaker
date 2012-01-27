
package com.wavemaker.spinup.web;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.cpr.FrameworkConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.support.RequestContextUtils;

import com.wavemaker.tools.cloudfoundry.spinup.InvalidLoginCredentialsException;
import com.wavemaker.tools.cloudfoundry.spinup.SpinupService;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecret;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecretPropagation;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;

/**
 * Web {@link Controller} for spinning up wavemaker.
 * 
 * @author Phillip Webb
 */
@Controller
@SessionAttributes("loginCredentialsBean")
public class SpinupController {

    private static final String SHARED_SECRET_ATTRIBUTE_NAME = SpinupController.class.getName() + ".SECRET";

    private static final String COOKIE_NAME = "wavemaker_authentication_token";

    // Cloud foundry has a proxy timeout of 10 seconds, we want to ensure we are less than this
    private static final long TIMEOUT = TimeUnit.SECONDS.toMillis(10);

    private SpinupService spinupService;

    private SharedSecretPropagation secretPropagation;

    private final ExecutorService executorService = Executors.newCachedThreadPool();

    @ModelAttribute("loginCredentialsBean")
    public LoginCredentialsBean createFormBean() {
        return new LoginCredentialsBean();
    }

    /**
     * Login form used to collect cloud foundry credentials.
     */
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public void loginForm() {
    }

    /**
     * Postback method from the login form. Will either re-direct back to the form (in the case of errors) or redirect
     * to start the spinup process.
     * 
     * @param credentials User credentials
     * @param bindingResult the binding result from the form
     * @param request the HTTP request
     * @param response the HTTP response
     * @return the response (either a redirect to the form or a redirect to the spinup process)
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ModelAndView processLogin(@Valid LoginCredentialsBean credentials, BindingResult bindingResult, HttpServletRequest request,
        HttpServletResponse response) {
        // If we have binding errors, re-render the page
        if (bindingResult.hasErrors()) {
            return new ModelAndView();
        }
        try {
            // Login, add the cookie and redirect to start the spinup process
            TransportToken transportToken = this.spinupService.login(getSecret(request), credentials);
            Cookie cookie = new Cookie(COOKIE_NAME, transportToken.encode());
            cookie.setDomain(this.spinupService.getDomain());
            response.addCookie(cookie);
            RequestContextUtils.getOutputFlashMap(request).put("username", credentials.getUsername());
            return new ModelAndView("redirect:/start");
        } catch (InvalidLoginCredentialsException e) {
            // On invalid login redirect with a message in flash scope
            RequestContextUtils.getOutputFlashMap(request).put("message", "Unable to login, please check your credentials");
            return new ModelAndView("redirect:/login");
        }
    }

    /**
     * The screen that starts the deployment and waits until it completes. This screen opens a suspended connection to
     * {@link #deploymentStaus} before triggering {@link #startDeployment}.
     */
    @RequestMapping(value = "/start", method = RequestMethod.GET)
    public void start() {

    }

    /**
     * Opens a suspended long-polling connection that is used to tell when deployment is complete, this is required to
     * work around cloud foundry timeouts.
     */
    @RequestMapping(value = "/deploy", method = RequestMethod.GET)
    @ResponseBody
    public void deploymentStaus(HttpServletRequest request) {
        AtmosphereResource<HttpServletRequest, HttpServletResponse> resource = getAtmosphereResource(request);
        resource.setBroadcaster(BroadcasterFactory.getDefault().lookup("test", true));
        resource.suspend(TIMEOUT, false);
    }

    /**
     * Starts the deployment, this asynchronous request returns immediately, use {@link #deploymentStaus} to track
     * progress.
     */
    @RequestMapping(value = "/deploy", method = RequestMethod.POST)
    @ResponseBody
    public void startDeployment(final HttpServletRequest request, @CookieValue(value = COOKIE_NAME, required = false) String encodedTransportToken) {
        AtmosphereResource<HttpServletRequest, HttpServletResponse> resource = getAtmosphereResource(request);
        final Broadcaster broadcaster = BroadcasterFactory.getDefault().lookup("test", true);
        final TransportToken transportToken = TransportToken.decode(encodedTransportToken);
        final SharedSecret secret = getSecret(request);
        final String username = "phil.webb@orbweaver.co.uk"; // FIXME
        this.executorService.submit(new Runnable() {

            @Override
            public void run() {
                try {
                    String url = SpinupController.this.spinupService.start(secret, username, transportToken);
                    broadcaster.broadcast(url);
                } catch (Exception e) {
                    e.printStackTrace();
                    // FIXME
                }
            }
        });
    }

    @SuppressWarnings("unchecked")
    private AtmosphereResource<HttpServletRequest, HttpServletResponse> getAtmosphereResource(HttpServletRequest request) {
        AtmosphereResource<HttpServletRequest, HttpServletResponse> resource = (AtmosphereResource<HttpServletRequest, HttpServletResponse>) request.getAttribute(FrameworkConfig.ATMOSPHERE_RESOURCE);
        Assert.state(resource != null, "Unable to locate atmosphere resource");
        return resource;
    }

    // FIXME this should be removed before GA
    @RequestMapping("/info")
    public @ResponseBody
    String info(@CookieValue(value = COOKIE_NAME, required = false) String encodedTransportToken) {
        SharedSecret sharedSecret;
        try {
            sharedSecret = this.secretPropagation.getForSelf();
        } catch (Exception e) {
            sharedSecret = null;
        }
        TransportToken token = StringUtils.hasLength(encodedTransportToken) ? TransportToken.decode(encodedTransportToken) : null;
        return sharedSecret + " " + token;
    }

    private SharedSecret getSecret(HttpServletRequest request) {
        SharedSecret secret = (SharedSecret) request.getSession().getAttribute(SHARED_SECRET_ATTRIBUTE_NAME);
        if (secret == null) {
            secret = new SharedSecret();
            request.getSession().setAttribute(SHARED_SECRET_ATTRIBUTE_NAME, secret);
        }
        return secret;
    }

    @Autowired
    public void setSpinupService(SpinupService spinupService) {
        this.spinupService = spinupService;
    }

    @Autowired
    public void setSecretPropagation(SharedSecretPropagation secretPropagation) {
        this.secretPropagation = secretPropagation;
    }

}
