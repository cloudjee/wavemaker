/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.runtime.data.util;

import com.wavemaker.common.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * DataService logging convenience methods. 
 *
 * @author Simon Toens
 */
public class LoggingUtils {

    private static final Log defaultLogger = 
	LogFactory.getLog("com.wavemaker.runtime.data");

    private LoggingUtils() {}


    /**
     * Log error when it is impossible to roll back the current tx.
     */
    public static void logCannotRollbackTx(Throwable th) {
	logCannotRollbackTx(defaultLogger, th);
    }

    public static void logCannotRollbackTx(String loggerName, Throwable th) {
	logCannotRollbackTx(LogFactory.getLog(loggerName), th);
    }

    public static void logCannotRollbackTx(Log logger, Throwable th) {
	logger.error(Resource.CANNOT_ROLLBACK_TX.getMessage(), th);
    }


}
