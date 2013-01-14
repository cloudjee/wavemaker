/*
 *  Copyright (C) 2013 VMware, Inc. All rights reserved.
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
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.util.StringUtils;

public class WMAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler  {

	private RequestCache requestCache = new HttpSessionRequestCache();

	private static final String SUCCESS_URL = "url";

	public WMAuthenticationSuccessHandler(){
		super();
	}


	public void onAuthenticationSuccess(HttpServletRequest request,
			HttpServletResponse response, Authentication authentication) throws IOException,
			ServletException{
		String redirectURL = null;
		SavedRequest savedRequest = null;
		if(!isAjaxRequest(request)){
			super.onAuthenticationSuccess(request, response, authentication);
			return;			
		}
		else{
			if(requestCache != null){
				savedRequest = requestCache.getRequest(request, response);
			}
			if (savedRequest == null) {
				//TODO: this is getting the base url, but not the query params
				System.out.println("** NO saved request, using Target URL");
				String queryString = request.getQueryString();
				String redirectUrl = request.getContextPath();
				redirectURL = (queryString != null) ? redirectUrl + "/" + queryString : redirectUrl ;
			}
			else{
				System.out.println("*** YES saved request, using redirect URL");
				redirectURL = savedRequest.getRedirectUrl(); 
			}

			String targetUrlParameter = getTargetUrlParameter();
			if (isAlwaysUseDefaultTargetUrl() || (targetUrlParameter != null && StringUtils.hasText(request.getParameter(targetUrlParameter)))) {
				System.out.println("have targetURL: " + targetUrlParameter + " Removing request");
				requestCache.removeRequest(request, response);
			}

			if (isAlwaysUseDefaultTargetUrl()){
				redirectURL = getDefaultTargetUrl();
			}

			clearAuthenticationAttributes(request);

			if (redirectURL == null || redirectURL.isEmpty()){
				System.out.println("No redirectUrl, throw");
				throw new IOException("Unable to determine a redirect URL");
			}
			System.out.println("redirect URL IS: " + redirectURL);

			request.setCharacterEncoding("UTF-8");
			response.setContentType("text/plain;charset=utf-8");
			response.setHeader("Cache-Control", "no-cache");
			response.setDateHeader("Expires", 0);
			response.setHeader("Pragma", "no-cache");
			String jsonContent = "{\"url\":\"" +  redirectURL + "\"}";
			response.getWriter().print(jsonContent);
			response.getWriter().flush();
		}
	}

	private boolean isAjaxRequest(HttpServletRequest request) {
		return "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
	}
}

