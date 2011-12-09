
package com.wavemaker.spinup.web;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
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

import com.wavemaker.spinup.InvalidLoginCredentialsException;
import com.wavemaker.spinup.SpinupService;
import com.wavemaker.spinup.authentication.SharedSecret;
import com.wavemaker.spinup.authentication.SharedSecretPropagation;
import com.wavemaker.spinup.authentication.TransportToken;

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

    private SpinupService spinupService;

    private SharedSecretPropagation secretPropagation;

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
            return new ModelAndView("redirect:/start");
        } catch (InvalidLoginCredentialsException e) {
            // On invalid login redirect with a message in flash scope
            RequestContextUtils.getOutputFlashMap(request).put("message", "Unable to login, please check your credentials");
            return new ModelAndView("redirect:/login");
        }
    }

    /**
     * The screen that starts the deployment and waits until it completes. This screen opens a suspended connection to
     * {@link #deploymentStaus()} before triggering {@link #startDeployment()}.
     */
    public void start() {
    }

    public void deploymentStaus() {
    }

    public void startDeployment() {

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
