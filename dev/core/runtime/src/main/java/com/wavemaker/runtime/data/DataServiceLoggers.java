/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.runtime.data;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class DataServiceLoggers {

    private DataServiceLoggers() {
    }

    public static final Log taskLogger = LogFactory.getLog("com.wavemaker.runtime.data.work");

    public static final Log transactionLogger = LogFactory.getLog("com.wavemaker.runtime.data.tx");

    public static final Log eventLogger = LogFactory.getLog("com.wavemaker.runtime.data.event");

    public static final Log metaDataLogger = LogFactory.getLog("com.wavemaker.data.metadata");

    public static final Log connectionLogger = LogFactory.getLog("com.wavemaker.data.connection");

    public static final Log fileControllerLogger = LogFactory.getLog("com.wavemaker.runtime.fileController");

}
