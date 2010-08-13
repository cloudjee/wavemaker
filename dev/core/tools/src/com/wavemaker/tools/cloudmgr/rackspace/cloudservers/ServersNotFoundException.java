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
public class ServersNotFoundException extends ServersException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 111718445621236026L;

	/**
	 * @param message
	 * @param httpHeaders
	 * @param httpStatusLine
	 */
	public ServersNotFoundException(String message, Header[] httpHeaders,
			StatusLine httpStatusLine) {
		super(message, httpHeaders, httpStatusLine);
	}

}
