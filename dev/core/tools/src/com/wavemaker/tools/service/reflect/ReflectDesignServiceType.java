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

package com.wavemaker.tools.service.reflect;

import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;
import com.wavemaker.tools.service.DesignServiceType;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public abstract class ReflectDesignServiceType implements DesignServiceType {

    /* (non-Javadoc)
     * @see com.wavemaker.tools.service.DesignServiceType#getServiceWire()
     */
    public Class<? extends ServiceWire> getServiceWire() {
        return ReflectServiceWire.class;
    }

    /* (non-Javadoc)
     * @see com.wavemaker.tools.service.DesignServiceType#getServiceType()
     */
    public String getServiceType() {
        return this.serviceType;
    }
    
    // bean properties
    private String serviceType;

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }
}