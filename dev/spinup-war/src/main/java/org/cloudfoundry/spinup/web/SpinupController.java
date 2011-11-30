
package org.cloudfoundry.spinup.web;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.cloudfoundry.spinup.SpinupService;
import org.cloudfoundry.spinup.StartedApplication;
import org.cloudfoundry.spinup.authentication.SharedSecret;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/start")
@SessionAttributes("loginCredentialsBean")
public class SpinupController {

    private static final String SHARED_SECRET_ATTRIBUTE_NAME = SpinupController.class.getName() + ".SECRET";

    private final String COOKIE_NAME = "wavemaker_authentication_token";

    private SpinupService spinupService;

    @ModelAttribute("loginCredentialsBean")
    public LoginCredentialsBean createFormBean() {
        return new LoginCredentialsBean();
    }

    @RequestMapping(method = RequestMethod.GET)
    public void start() {
    }

    @RequestMapping(method = RequestMethod.POST)
    public ModelAndView processSubmit(@Valid LoginCredentialsBean credentials, BindingResult result, SessionStatus sessionStatus, WebRequest request,
        HttpServletResponse response) {

        if (result.hasErrors()) {
            return new ModelAndView();
        }

        StartedApplication startedApplication = this.spinupService.start(getSecret(request), credentials);

        Cookie cookie = new Cookie(this.COOKIE_NAME, startedApplication.getTransportToken().encode());
        response.addCookie(cookie);

        return new ModelAndView("redirect:" + startedApplication.getApplicationUrl());
    }

    private SharedSecret getSecret(WebRequest request) {
        SharedSecret secret = (SharedSecret) request.getAttribute(SHARED_SECRET_ATTRIBUTE_NAME, RequestAttributes.SCOPE_SESSION);
        if (secret == null) {
            secret = new SharedSecret();
            request.setAttribute(SHARED_SECRET_ATTRIBUTE_NAME, secret, RequestAttributes.SCOPE_SESSION);
        }
        return secret;
    }

    @Autowired
    public void setSpinupService(SpinupService spinupService) {
        this.spinupService = spinupService;
    }

}
