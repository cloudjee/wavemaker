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

import com.wavemaker.common.MessageResource;
import com.wavemaker.runtime.data.ExternalDataModelConfig;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Operation;

/**
 * @author Simon Toens
 */
public class DesignExternalDataModelConfig implements ExternalDataModelConfig {

    private final String serviceId;

    private final DesignServiceManager serviceMgr;

    public DesignExternalDataModelConfig(String serviceId, DesignServiceManager serviceMgr) {
        this.serviceId = serviceId;
        this.serviceMgr = serviceMgr;
    }

    @Override
    public boolean returnsSingleResult(String operationName) {

        Operation.Return rtn = getReturn(operationName);

        if (rtn == null) {
            return false;
        }

        return !rtn.isIsList();
    }

    @Override
    public String getServiceClass() {
        return this.serviceMgr.getService(this.serviceId).getClazz();
    }

    @Override
    public String getOutputType(String operationName) {

        Operation.Return rtn = getReturn(operationName);

        if (rtn == null) {
            return null;
        }

        return rtn.getTypeRef();

    }

    private Operation.Return getReturn(String operationName) {

        Operation o = this.serviceMgr.getOperation(this.serviceId, operationName);

        if (o == null) {
            throw new ConfigurationException(MessageResource.OPERATION_NOT_FOUND, this.serviceId, operationName,
                this.serviceMgr.getOperationNames(this.serviceId));
        }

        return o.getReturn();
    }

}
