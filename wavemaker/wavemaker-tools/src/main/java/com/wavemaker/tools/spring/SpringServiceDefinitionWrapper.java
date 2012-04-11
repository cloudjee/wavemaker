/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.spring;

import java.util.List;

import org.springframework.context.support.GenericApplicationContext;

import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.pws.IPwsServiceModifier;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceOperation;
import com.wavemaker.runtime.ws.RESTInputParam;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 */
public class SpringServiceDefinitionWrapper implements DeprecatedServiceDefinition {

    private final DeprecatedServiceDefinition delegate;

    private final GenericApplicationContext ctx;

    public SpringServiceDefinitionWrapper(DeprecatedServiceDefinition delegate, GenericApplicationContext ctx) {
        this.delegate = delegate;
        this.ctx = ctx;
    }

    @Override
    public void dispose() {
        try {
            this.delegate.dispose();
        } finally {
            this.ctx.close();
        }
    }

    @Override
    @Deprecated
    public List<String> getEventNotifiers() {
        return this.delegate.getEventNotifiers();
    }

    @Override
    @Deprecated
    public List<ElementType> getInputTypes(String operationName) {
        return this.delegate.getInputTypes(operationName);
    }

    @Override
    @Deprecated
    public List<String> getOperationNames() {
        return this.delegate.getOperationNames();
    }

    @Override
    @Deprecated
    public ElementType getOutputType(String operationName) {
        return this.delegate.getOutputType(operationName);
    }

    @Override
    public List<ServiceOperation> getServiceOperations() {
        return this.delegate.getServiceOperations();
    }

    @Override
    public String getPackageName() {
        return this.delegate.getPackageName();
    }

    @Override
    public String getRuntimeConfiguration() {
        return this.delegate.getRuntimeConfiguration();
    }

    @Override
    public String getServiceClass() {
        return this.delegate.getServiceClass();
    }

    @Override
    public String getServiceId() {
        return this.delegate.getServiceId();
    }

    @Override
    public ServiceType getServiceType() {
        return this.delegate.getServiceType();
    }

    @Override
    @SuppressWarnings("deprecation")
    public List<ElementType> getTypes() {
        return this.delegate.getTypes();
    }

    @Override
    public List<ElementType> getTypes(String username, String password) { // salesforce
        return null;
    }

    @Override
    public List<TypeDefinition> getLocalTypes() {
        return this.delegate.getLocalTypes();
    }

    @Override
    public List<TypeDefinition> getLocalTypes(String username, String password) {
        return this.delegate.getLocalTypes(username, password);
    }

    public ServiceDefinition unwrap() {
        return this.delegate;
    }

    @Override
    public boolean isLiveDataService() {
        return this.delegate.isLiveDataService();
    }

    @Override
    public String getPartnerName() {
        return null;
    }

    @Override
    public List<ElementType> getInputTypesNoCaseShift(String operationName) {
        return null;
    }

    @Override
    public List<ServiceOperation> getServiceOperations(IPwsServiceModifier serviceModifier) {
        return this.delegate.getServiceOperations();
    }

    @Override
    public List<RESTInputParam> getInputParams(String operationName) {
        return null;
    }

    @Override
    public String getOperationType(String operationName) {
        return null;
    }
}
