package com.wavemaker.runtime.security;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.util.UrlUtils;

public class WMHashAwareRedirectStrategy extends DefaultRedirectStrategy{

	protected final Logger logger = Logger.getLogger(WMHashAwareRedirectStrategy.class);
	
	private boolean contextRelative;
	
	@Override
	public void sendRedirect(HttpServletRequest request,
			HttpServletResponse response, String url) throws IOException {
		String redirectUrl = calculateRedirectUrl(request.getContextPath(), url);
        redirectUrl = response.encodeRedirectURL(redirectUrl);
        redirectUrl = getHashAwareRedirectUrl(request,redirectUrl);
        if (logger.isDebugEnabled()) {
            logger.debug("Redirecting to '" + redirectUrl + "'");
        }

        response.sendRedirect(redirectUrl);
	}
	
	public String getHashAwareRedirectUrl(HttpServletRequest request,String redirectUrl){
		String hash = request.getParameter("hash");
        if(hash != null){
        	redirectUrl = redirectUrl.concat(hash);
        }
        return redirectUrl;
	}
	
	 private String calculateRedirectUrl(String contextPath, String url) {
	        if (!UrlUtils.isAbsoluteUrl(url)) {
	            if (contextRelative) {
	                return url;
	            } else {
	                return contextPath + url;
	            }
	        }

	        // Full URL, including http(s)://

	        if (!contextRelative) {
	            return url;
	        }

	        // Calculate the relative URL from the fully qualified URL, minus the scheme and base context.
	        url = url.substring(url.indexOf("://") + 3); // strip off scheme
	        url = url.substring(url.indexOf(contextPath) + contextPath.length());

	        if (url.length() > 1 && url.charAt(0) == '/') {
	            url = url.substring(1);
	        }

	        return url;
	    }

	    /**
	     * If <tt>true</tt>, causes any redirection URLs to be calculated minus the protocol
	     * and context path (defaults to <tt>false</tt>).
	     */
	    public void setContextRelative(boolean useRelativeContext) {
	        this.contextRelative = useRelativeContext;
	    }

}
