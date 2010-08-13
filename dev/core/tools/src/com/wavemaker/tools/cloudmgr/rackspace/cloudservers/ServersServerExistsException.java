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
public class ServersServerExistsException extends ServersException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7282149064519490145L;

	/**
	 * @param message
	 * @param httpHeaders
	 * @param httpStatusLine
	 */
	public ServersServerExistsException(String message, Header[] httpHeaders,
			StatusLine httpStatusLine) {
		super(message, httpHeaders, httpStatusLine);
	}

}
