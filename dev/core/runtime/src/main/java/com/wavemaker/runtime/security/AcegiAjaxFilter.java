/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.acegisecurity.AuthenticationException;
import org.acegisecurity.ui.AbstractProcessingFilter;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filter to support Acegi's Ajax based login.
 * 
 * @author Frankie Fu
 */
public class AcegiAjaxFilter extends OncePerRequestFilter {

    private static final String ACEGI_AJAX_LOGIN_REQUEST_PARAM = "acegiAjaxLogin";

    private static final String SUCCESS_URL = "url";

    private static final String FAILURE_ERROR_MESSAGE = "error";

    private static final String FAILURE_INDICATOR = "login_error=1";

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain)
        throws ServletException, IOException {

        HttpServletRequest request = httpServletRequest;
        HttpServletResponse response = httpServletResponse;

        if (!isAjaxRequest(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        RedirectResponseWrapper redirectResponseWrapper = new RedirectResponseWrapper(response);

        filterChain.doFilter(request, redirectResponseWrapper);

        if (redirectResponseWrapper.getRedirect() != null) {
            request.setCharacterEncoding("UTF-8");
            response.setContentType("text/plain;charset=utf-8");

            response.setHeader("Cache-Control", "no-cache");
            response.setDateHeader("Expires", 0);
            response.setHeader("Pragma", "no-cache");

            String redirectURL = redirectResponseWrapper.getRedirect();

            String jsonContent;
            if (redirectURL.indexOf(FAILURE_INDICATOR) == -1) {
                jsonContent = "{\"" + SUCCESS_URL + "\":\"" + redirectURL + "\"}";
            } else {
                String errorMsg = ((AuthenticationException) request.getSession().getAttribute(
                    AbstractProcessingFilter.ACEGI_SECURITY_LAST_EXCEPTION_KEY)).getMessage();
                jsonContent = "{\"" + FAILURE_ERROR_MESSAGE + "\":\"" + errorMsg + "\"}";
            }
            response.getOutputStream().write(jsonContent.getBytes());
        }
    }

    private boolean isAjaxRequest(HttpServletRequest request) {
        return request.getParameter(ACEGI_AJAX_LOGIN_REQUEST_PARAM) != null;
    }
}
