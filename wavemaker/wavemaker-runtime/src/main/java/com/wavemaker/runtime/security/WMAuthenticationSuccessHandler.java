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
		System.out.println("********** SUCCESSS *****************");
		String redirectURL = null;
		if(!isAjaxRequest(request)){
            super.onAuthenticationSuccess(request, response, authentication);
            return;			
		}
		else{
			if(requestCache == null){
				System.out.println("Not able to get a requestCache !!!!");					
				return;
			}
			SavedRequest savedRequest = requestCache.getRequest(request, response); 
	        if (savedRequest == null) {
	        	redirectURL = getDefaultTargetUrl();
	        	System.out.println("** no saved request");
	        }
	        else{
	        	redirectURL = savedRequest.getRedirectUrl();
	        }
			
	        String targetUrlParameter = getTargetUrlParameter();
	        if (isAlwaysUseDefaultTargetUrl() || (targetUrlParameter != null && StringUtils.hasText(request.getParameter(targetUrlParameter)))) {
	        	System.out.println("have target. Remove and Super");
	            requestCache.removeRequest(request, response);
	            super.onAuthenticationSuccess(request, response, authentication);
	            return;
	        }

	        clearAuthenticationAttributes(request);

			request.setCharacterEncoding("UTF-8");
			response.setContentType("text/plain;charset=utf-8");
			response.setHeader("Cache-Control", "no-cache");
			response.setDateHeader("Expires", 0);
			response.setHeader("Pragma", "no-cache");

			// Use the DefaultSavedRequest URL
			if (redirectURL == null || redirectURL.isEmpty()){
				System.out.println("No redirectUrl, throw");
			}
			System.out.println("URL IS : " + redirectURL);
			String jsonContent = "{\"url\":\"" +  redirectURL + "\"}";
			response.getWriter().print(jsonContent);
			response.getWriter().flush();
			System.out.println("************ END SUCCESS ***************");
		}
	}

	private boolean isAjaxRequest(HttpServletRequest request) {
		return "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
	}
}

