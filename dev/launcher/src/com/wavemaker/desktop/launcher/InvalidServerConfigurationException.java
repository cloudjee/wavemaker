/*
 * Copyright (C) 2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 

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
