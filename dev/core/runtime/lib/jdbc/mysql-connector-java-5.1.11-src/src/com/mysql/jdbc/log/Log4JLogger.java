/*
 Copyright  2002-2004 MySQL AB, 2008 Sun Microsystems

 This program is free software; you can redistribute it and/or modify
 it under the terms of version 2 of the GNU General Public License as 
 published by the Free Software Foundation.

 There are special exceptions to the terms and conditions of the GPL 
 as it is applied to this software. View the full text of the 
 exception in file EXCEPTIONS-CONNECTOR-J in the directory of this 
 software distribution.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the Free Software
 Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA



 */
package com.mysql.jdbc.log;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;

/**
 * Implementation of log interface for Apache Log4j
 * 
 * @author Mark Matthews
 */
public class Log4JLogger implements Log {

	private Logger logger;

	public Log4JLogger(String instanceName) {
		this.logger = Logger.getLogger(instanceName);
	}

	
	public boolean isDebugEnabled() {
		return this.logger.isDebugEnabled();
	}

	
	public boolean isErrorEnabled() {
		return this.logger.isEnabledFor(Level.ERROR);
	}

	
	public boolean isFatalEnabled() {
		return this.logger.isEnabledFor(Level.FATAL);
	}

	
	public boolean isInfoEnabled() {
		return this.logger.isInfoEnabled();
	}

	
	public boolean isTraceEnabled() {
		return this.logger.isDebugEnabled();
	}

	
	public boolean isWarnEnabled() {
		return this.logger.isEnabledFor(Level.WARN);
	}

	
	public void logDebug(Object msg) {
		this.logger.debug(LogUtils.expandProfilerEventIfNecessary(LogUtils
				.expandProfilerEventIfNecessary(msg)));
	}

	
	public void logDebug(Object msg, Throwable thrown) {
		this.logger.debug(LogUtils.expandProfilerEventIfNecessary(msg), thrown);
	}

	
	public void logError(Object msg) {
		this.logger.error(LogUtils.expandProfilerEventIfNecessary(msg));
	}

	
	public void logError(Object msg, Throwable thrown) {
		this.logger.error(LogUtils.expandProfilerEventIfNecessary(msg), thrown);
	}

	
	public void logFatal(Object msg) {
		this.logger.fatal(LogUtils.expandProfilerEventIfNecessary(msg));
	}

	
	public void logFatal(Object msg, Throwable thrown) {
		this.logger.fatal(LogUtils.expandProfilerEventIfNecessary(msg), thrown);
	}

	
	public void logInfo(Object msg) {
		this.logger.info(LogUtils.expandProfilerEventIfNecessary(msg));
	}

	
	public void logInfo(Object msg, Throwable thrown) {
		this.logger.info(LogUtils.expandProfilerEventIfNecessary(msg), thrown);
	}

	
	public void logTrace(Object msg) {
		this.logger.debug(LogUtils.expandProfilerEventIfNecessary(msg));
	}

	
	public void logTrace(Object msg, Throwable thrown) {
		this.logger.debug(LogUtils.expandProfilerEventIfNecessary(msg), thrown);
	}

	
	public void logWarn(Object msg) {
		this.logger.warn(LogUtils.expandProfilerEventIfNecessary(msg));
	}

	
	public void logWarn(Object msg, Throwable thrown) {
		this.logger.warn(LogUtils.expandProfilerEventIfNecessary(msg), thrown);
	}
}
