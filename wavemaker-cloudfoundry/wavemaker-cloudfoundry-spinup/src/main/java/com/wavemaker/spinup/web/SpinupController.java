
package com.wavemaker.spinup.web;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.Assert;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import com.wavemaker.tools.cloudfoundry.spinup.InvalidLoginCredentialsException;
import com.wavemaker.tools.cloudfoundry.spinup.SpinupService;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecret;
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

    private SpinupService spinupService;

    @ModelAttribute("loginCredentialsBean")
    public LoginCredentialsBean createFormBean() {
        return new LoginCredentialsBean();
    }

    @ModelAttribute
    public void ajaxAttribute(HttpServletRequest request, Model model) {
        model.addAttribute("ajaxRequest", isAjaxRequest(request));
    }

    private boolean isAjaxRequest(HttpServletRequest request) {
        return "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
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

        Assert.state(isAjaxRequest(request), "Unable to handle non AJAX post");

        // If we have binding errors, re-render the page
        if (bindingResult.hasErrors()) {
            return new ModelAndView();
        }

        try {
            // Login, add the cookie and redirect to start the spinup process
            SharedSecret secret = getSecret(request);
            TransportToken transportToken = this.spinupService.login(secret, credentials);
            String url = performSpinup(credentials, secret, transportToken, response);
            Cookie cookie = new Cookie(COOKIE_NAME, transportToken.encode());
            cookie.setDomain(this.spinupService.getDomain());
            response.addCookie(cookie);
            response.setHeader("X-Ajax-Redirect", url);
            response.setStatus(HttpStatus.NO_CONTENT.value());
            return null;
        } catch (InvalidLoginCredentialsException e) {
            // On invalid login redirect with a message in flash scope
            return new ModelAndView().addObject("message", "Unable to login, please check your credentials");
        }

    }

    private String performSpinup(LoginCredentialsBean credentials, SharedSecret secret, TransportToken transportToken, HttpServletResponse response) {
        // String url = SpinupController.this.spinupService.start(secret, credentials.getUsername(), transportToken);
        // url = url + "?debug"; // FIXME
        // return url;
        try {
            Thread.sleep(43000);
        } catch (InterruptedException e) {
        }
        return "http://www.google.com";
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
}
