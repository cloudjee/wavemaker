/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.data;

import com.wavemaker.runtime.server.InternalRuntime;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.runtime.service.events.ServiceEventListener;

/**
 * @author Simon Toens
 */
public class DesignDataServiceEventListener implements ServiceEventListener {

    @Override
    public Object[] preOperation(ServiceWire serviceWire, String operationName, Object[] params) {
        return params;
    }

    @Override
    public TypedServiceReturn postOperation(ServiceWire serviceWire, String operationName, TypedServiceReturn result, Throwable th) throws Throwable {

        if (th != null) {
            throw th;
        }

        InternalRuntime irt = InternalRuntime.getInstance();
        irt.getJSONState().setPropertyFilter(DesignDataPropertyFilter.getInstance());

        return result;
    }
}
