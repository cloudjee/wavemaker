/**
 * 
 */
package com.wavemaker.tools.cloudmgr.rackspace.cloudservers;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.StatusLine;

/**
 * @author lvaughn
 *
 */
@SuppressWarnings("serial")
public class ServersServerNotEmptyException extends ServersException {
	/**
	 * @param message
	 * @param httpHeaders
	 * @param httpStatusLine
	 */
	public ServersServerNotEmptyException(String message,
			Header[] httpHeaders, StatusLine httpStatusLine) {
		super(message, httpHeaders, httpStatusLine);
	}
	
}
