/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

/*
 * @copyright (c) ${year} ActiveGrid, Inc.
 * @license   ASL 2.0  http://apache.org/licenses/LICENSE-2.0
 */

package com.wavemaker.runtime.data;

import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.events.ServletEventListener;

/**
 * @author Simon Toens
 */
public class DataServiceServletEventListener implements ServletEventListener {

    @Override
    public void startRequest(ServiceWire serviceWire) {
        // DataServiceManager mgr = getDataServiceManager(service);
        // if (DataServiceLoggers.eventLogger.isInfoEnabled()) {
        // log("startRequest", "start request transaction", mgr);
        // }
        // mgr.begin();
    }

    @Override
    public void endRequest(ServiceWire serviceWire) {
        // DataServiceManager mgr = getDataServiceManager(service);
        // if (DataServiceLoggers.eventLogger.isInfoEnabled()) {
        // log("endRequest", "end request transaction", mgr);
        // }
        // mgr.commit();
    }

    // private void log(String event, String msg, DataServiceManager mgr) {
    // DataServiceLoggers.eventLogger
    // .info(event + " " + mgr.getMetaData().getName() + " - " + msg);
    // }
    //
    // private DataServiceManager getDataServiceManager(Object service) {
    // return ((DataServiceManagerAccess)service).getDataServiceManager();
    // }

}
