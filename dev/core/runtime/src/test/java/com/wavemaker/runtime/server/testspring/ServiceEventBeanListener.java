/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.runtime.server.testspring;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.type.reflect.ReflectTypeState;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.runtime.service.events.ServiceEventListener;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;

/**
 * @author small
 * @version $Rev:22671 $ - $Date:2008-05-30 14:29:23 -0700 (Fri, 30 May 2008) $
 * 
 */
public class ServiceEventBeanListener implements ServiceEventListener {

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.wavemaker.runtime.service.events.ServiceEventListener#preOperation(com.wavemaker.runtime.service.ServiceWire,
     * java.lang.String, java.lang.Object[])
     */
    @Override
    public Object[] preOperation(ServiceWire serviceWire, String operationName, Object[] params) {

        if (operationName.equals("getValue")) {
            Long p = (Long) params[0];
            params[0] = Long.valueOf(p.longValue() + 2000);
        }

        if (!(serviceWire instanceof ReflectServiceWire)) {
            throw new WMRuntimeException("serviceWire should have been Reflect, was: " + serviceWire + "(" + serviceWire.getClass() + ")");
        }

        ReflectServiceWire rsw = (ReflectServiceWire) serviceWire;

        ServiceEventBean seb = (ServiceEventBean) rsw.getServiceBean();
        seb.increment();
        return params;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.wavemaker.runtime.service.events.ServiceEventListener#postOperation(com.wavemaker.runtime.service.ServiceWire
     * , java.lang.String, com.wavemaker.runtime.service.TypedServiceReturn, java.lang.Throwable)
     */
    @Override
    public TypedServiceReturn postOperation(ServiceWire serviceWire, String operationName, TypedServiceReturn result, Throwable throwable)
        throws Throwable {

        if (null != throwable) {
            return new TypedServiceReturn(Long.valueOf(10000), ReflectTypeUtils.getFieldDefinition(Long.class, new ReflectTypeState(), false, null));
        } else {
            if (!(serviceWire instanceof ReflectServiceWire)) {
                throw new WMRuntimeException("serviceWire should have been Reflect, was: " + serviceWire + "(" + serviceWire.getClass() + ")");
            }
            ReflectServiceWire rsw = (ReflectServiceWire) serviceWire;

            ServiceEventBean seb = (ServiceEventBean) rsw.getServiceBean();
            seb.increment();

            return new TypedServiceReturn(Long.valueOf(((Long) result.getReturnValue()).longValue() + 1000), ReflectTypeUtils.getFieldDefinition(
                Long.class, new ReflectTypeState(), false, null));
        }
    }
}