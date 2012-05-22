/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.spinup.web;

import java.util.Hashtable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;

import com.wavemaker.tools.cloudfoundry.spinup.InvalidLoginCredentialsException;
import com.wavemaker.tools.cloudfoundry.spinup.SpinupService;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecret;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;

/**
 * Web {@link Controller} for spinning up wavemaker.
 * 
 * @author Phillip Webb
 */
public class SpinupController {

    private static final String SHARED_SECRET_ATTRIBUTE_NAME = SpinupController.class.getName() + ".SECRET";

    private static final String COOKIE_NAME = "wavemaker_authentication_token";
    private static final String STUDIO_URL = "studio_url";
	private static final String DOMAIN = "domain";

    private SpinupService spinupService;


    /**
     * Postback method from the login form. Will either re-direct back to the form (in the case of errors) or redirect
     * to start the spinup process.
     * 
     * @param credentials User credentials
     * @param request the HTTP request
     * @param response the HTTP response
     * @return the response (either a redirect to the form or a redirect to the spinup process)
     */
    public Hashtable<String, String> processLogin(LoginCredentialsBean credentials, HttpServletRequest request,
        HttpServletResponse response) throws InvalidLoginCredentialsException {
			Hashtable<String, String> responseHash = new Hashtable<String, String>();
            SharedSecret secret = getSecret(request);
            TransportToken transportToken = this.spinupService.login(secret, credentials);
            String url = performSpinup(credentials, secret, transportToken, response);
			System.out.println("Studio started deployed to " + url);
			
			responseHash.put(STUDIO_URL, url);
			responseHash.put(COOKIE_NAME, transportToken.encode());
			responseHash.put(DOMAIN, this.spinupService.getDomain()); 
			
			return responseHash;
    }

    private String performSpinup(LoginCredentialsBean credentials, SharedSecret secret, TransportToken transportToken, HttpServletResponse response) {
        String url = SpinupController.this.spinupService.start(secret, credentials.getUsername(), transportToken);
        // Give CloudFoundry some time to start
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
        }
        //url = url + "?debug"; 
        return url;
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
