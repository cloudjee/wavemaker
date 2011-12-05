
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
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.support.RequestContextUtils;

import com.wavemaker.spinup.InvalidLoginCredentialsException;
import com.wavemaker.spinup.SpinupService;
import com.wavemaker.spinup.StartedApplication;
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

    @RequestMapping(value = "/start", method = RequestMethod.GET)
    public void start() {
    }

    @RequestMapping(value = "/start", method = RequestMethod.POST)
    public ModelAndView processSubmit(@Valid LoginCredentialsBean credentials, BindingResult result, SessionStatus sessionStatus,
        HttpServletRequest request, HttpServletResponse response) {
        if (result.hasErrors()) {
            return new ModelAndView();
        }
        try {
            StartedApplication startedApplication = this.spinupService.start(getSecret(request), credentials);
            Cookie cookie = new Cookie(COOKIE_NAME, startedApplication.getTransportToken().encode());
            cookie.setDomain(".pwebb.cloudfoundry.me");
            response.addCookie(cookie);
            return new ModelAndView("redirect:" + startedApplication.getApplicationUrl());
        } catch (InvalidLoginCredentialsException e) {
            RequestContextUtils.getOutputFlashMap(request).put("message", "Unable to login, please check your credentials");
            return new ModelAndView("redirect:/start");
        }
    }

    // FIXME this should be removed befor GA
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
