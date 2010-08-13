/**
 * 
 */
package com.wavemaker.desktop.launcher;

/**
 * @author rj
 *
 */
public class InvalidServerConfigurationException extends Exception {

	// Constants
	private static final long serialVersionUID = 155181345858558693L;
	public static enum Parameter{
		SERIVCE_PORT, SHUTDOWN_PORT
	};

	// Variables
	//members
	protected Parameter parameter;

	/** Construction\Destruction */
	public InvalidServerConfigurationException(Parameter parameter, String message)
	{
		super(message);
		this.parameter = parameter;
	}
	public InvalidServerConfigurationException(Parameter parameter, String message, Throwable cause)
	{
		super(message, cause);
	}

	/** Instance Methods */
	public Parameter getParameter() {
		return parameter;
	}
}
