/**
 * 
 */
package com.wavemaker.tools.cloudmgr.rackspace.cloudservers;

/**
 * @author lvaughn
 *
 */
public class ServersInvalidNameException extends ServersException {
	/**
	 * 
	 */
	private static final long serialVersionUID = -9043382616400647532L;

	public ServersInvalidNameException(String name) {
		super("Invalid name: " + name, null, null);
	}
	
}
