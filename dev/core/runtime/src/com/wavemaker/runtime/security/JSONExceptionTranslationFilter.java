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

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.acegisecurity.AuthenticationException;
import org.acegisecurity.ui.ExceptionTranslationFilter;

/**
 * Extends from the normal <code>ExceptionTranslationFilter</code>, this filter
 * will send 403 if the request is a JSON service request.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 *
 */
public class JSONExceptionTranslationFilter extends ExceptionTranslationFilter {

    /*
     * (non-Javadoc)
     * 
     * @see org.acegisecurity.ui.ExceptionTranslationFilter#sendStartAuthentication(javax.servlet.ServletRequest,
     *      javax.servlet.ServletResponse, javax.servlet.FilterChain,
     *      org.acegisecurity.AuthenticationException)
     */
    @Override
    protected void sendStartAuthentication(ServletRequest request,
            ServletResponse response, FilterChain chain,
            AuthenticationException reason) throws ServletException,
            IOException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String requestPath = httpRequest.getServletPath();
        if (requestPath != null && requestPath.endsWith(".json")) {
            SecurityService.logger.error("Access to '" + requestPath
                    + "' is denied.  Reason: " + reason.getMessage());
            
            // send 403
            ((HttpServletResponse) response).sendError(
                    HttpServletResponse.SC_FORBIDDEN, requestPath);
        } else {
            // do normal processing
            super.sendStartAuthentication(request, response, chain, reason);
        }
    }

}
