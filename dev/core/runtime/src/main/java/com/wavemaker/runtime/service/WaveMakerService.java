/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.InternalRuntime;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.events.ServiceEventNotifier;

/**
 * @author Ed Callahan
 */
@ExposeToClient
public class WaveMakerService {

    private TypeManager typeManager;

    private ServiceManager serviceManager;

    private ServiceEventNotifier serviceEventNotifier;

    private InternalRuntime internalRuntime;

    private RuntimeAccess runtimeAccess;

    public String getLocalHostIP() {
        return SystemUtils.getIP();
    }

    public String getSessionId() {
        return RuntimeAccess.getInstance().getSession().getId();
    }

    public DownloadResponse echo(String contents, String contentType, String fileName) {
        InputStream is;
        try {
            is = new ByteArrayInputStream(contents.getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            throw new WMRuntimeException(e);
        }
        return new DownloadResponse(is, contentType, fileName);
    }

    /**
     * Get the service. If serviceName is not null or "", use the serviceName. If not, use the owning service of
     * typeName.
     * 
     * @param serviceName The serviceName (can be null or "") of the desired service..
     * @param typeName The typeName (only used if serviceName is null or "") owned by the desired service.
     * @return The service bean object.
     * @throws WMRuntimeException if no appropriate service can be found.
     */
    public ServiceWire getServiceWire(String serviceName, String typeName) {
        ServiceWire serviceWire = null;
        Exception enclosedException = null;

        if (serviceName != null && 0 != serviceName.length()) {
            serviceWire = this.serviceManager.getServiceWire(serviceName);
        } else {
            try {
                String serviceId = this.typeManager.getServiceIdForType(typeName);
                serviceWire = this.serviceManager.getServiceWire(serviceId);
            } catch (TypeNotFoundException e) {
                enclosedException = e;
            } catch (WMRuntimeException e2) {
                enclosedException = e2;
            }
        }

        if (serviceWire == null && enclosedException == null) {
            throw new WMRuntimeException(MessageResource.NO_SERVICE_FROM_ID_TYPE, serviceName, typeName);
        } else if (serviceWire == null) {
            throw new WMRuntimeException(MessageResource.NO_SERVICE_FROM_ID_TYPE, enclosedException, serviceName, typeName);
        }

        return serviceWire;
    }

    public TypeManager getTypeManager() {
        return this.typeManager;
    }

    public void setTypeManager(TypeManager typeManager) {
        this.typeManager = typeManager;
    }

    public ServiceManager getServiceManager() {
        return this.serviceManager;
    }

    public void setServiceManager(ServiceManager serviceManager) {
        this.serviceManager = serviceManager;
    }

    public ServiceEventNotifier getServiceEventNotifier() {
        return this.serviceEventNotifier;
    }

    public void setServiceEventNotifier(ServiceEventNotifier serviceEventNotifier) {
        this.serviceEventNotifier = serviceEventNotifier;
    }

    public InternalRuntime getInternalRuntime() {
        return this.internalRuntime;
    }

    public void setInternalRuntime(InternalRuntime internalRuntime) {
        this.internalRuntime = internalRuntime;
    }

    public RuntimeAccess getRuntimeAccess() {
        return this.runtimeAccess;
    }

    public void setRuntimeAccess(RuntimeAccess runtimeAccess) {
        this.runtimeAccess = runtimeAccess;
    }
}