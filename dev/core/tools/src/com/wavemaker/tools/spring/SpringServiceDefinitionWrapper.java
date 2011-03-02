/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.spring;

import java.util.List;

import org.springframework.context.support.GenericApplicationContext;

import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceOperation;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class SpringServiceDefinitionWrapper implements DeprecatedServiceDefinition {

    private final DeprecatedServiceDefinition delegate;
    private final GenericApplicationContext ctx;

    public SpringServiceDefinitionWrapper(DeprecatedServiceDefinition delegate,
            GenericApplicationContext ctx) {
        this.delegate = delegate;
        this.ctx = ctx;
    }

    public void dispose() {
        try {
            delegate.dispose();
        } finally {
            ctx.close();
        }
    }

    @Deprecated
    public List<String> getEventNotifiers() {
        return delegate.getEventNotifiers();
    }

    @Deprecated
    public List<ElementType> getInputTypes(String operationName) {
        return delegate.getInputTypes(operationName);
    }

    @Deprecated
    public List<String> getOperationNames() {
        return delegate.getOperationNames();
    }

    @Deprecated
    public ElementType getOutputType(String operationName) {
        return delegate.getOutputType(operationName);
    }
    
    public List<ServiceOperation> getServiceOperations() {
        return delegate.getServiceOperations();
    }

    public String getPackageName() {
        return delegate.getPackageName();
    }

    public String getRuntimeConfiguration() {
        return delegate.getRuntimeConfiguration();
    }

    public String getServiceClass() {
        return delegate.getServiceClass();
    }

    public String getServiceId() {
        return delegate.getServiceId();
    }

    public ServiceType getServiceType() {
        return delegate.getServiceType();
    }

    @SuppressWarnings("deprecation")
    public List<ElementType> getTypes() {
        return delegate.getTypes();
    }

    @SuppressWarnings("deprecation")
    public List<ElementType> getTypes(String username, String password) { //salesforce
        return null;
    }
    
    public List<TypeDefinition> getLocalTypes() {
        return delegate.getLocalTypes();
    }

    public List<TypeDefinition> getLocalTypes(String username, String password) {
        return delegate.getLocalTypes(username, password);
    }
    
    public ServiceDefinition unwrap() {
        return delegate;
    }

    public boolean isLiveDataService() {
        return delegate.isLiveDataService();
    }
}
