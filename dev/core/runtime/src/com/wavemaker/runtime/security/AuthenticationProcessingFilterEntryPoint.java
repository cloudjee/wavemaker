/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.runtime.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.acegisecurity.AuthenticationException;

/**
 * This allows passing the query string from the original URL to the login URL.
 * This is required since in debug mode, "debug" is added to the query string of
 * the app URL (e.g. http://localhost:8080/app1/?debug) and we want to have
 * login URL to be loaded in debug mode as well. (e.g.
 * http://localhost:8080/app1/login.html?debug)
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class AuthenticationProcessingFilterEntryPoint extends
        org.acegisecurity.ui.webapp.AuthenticationProcessingFilterEntryPoint {

    protected String determineUrlToUseForThisRequest(
            HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) {
        String loginFormUrl = getLoginFormUrl();
        String queryString = request.getQueryString();
        if (queryString == null || queryString.length() == 0) {
            return loginFormUrl;
        } else {
            return loginFormUrl + "?" + queryString;
        }
    }
}
