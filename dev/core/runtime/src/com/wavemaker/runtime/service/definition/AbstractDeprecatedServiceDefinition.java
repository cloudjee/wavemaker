/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.runtime.service.definition;

import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.service.ElementType;

/**
 * An abstract ReflectServiceDefinition with the new methods implemented,
 * to help aid in the transition.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public abstract class AbstractDeprecatedServiceDefinition implements
        DeprecatedServiceDefinition {

    @SuppressWarnings("deprecation")
    public List<ServiceOperation> getServiceOperations() {

        List<String> operationNames = getOperationNames();
        List<ServiceOperation> ret = new ArrayList<ServiceOperation>(operationNames.size());
        
        for(String operationName: operationNames) {
            ServiceOperation so = new ServiceOperation();
            so.setName(operationName);
            ret.add(so);
            
            if (null!=getOutputType(operationName)) {
                so.setReturnType(getOutputType(operationName).toFieldDefinition());
            }
            
            List<FieldDefinition> fdPT = new ArrayList<FieldDefinition>();
            so.setParameterTypes(fdPT);
            if (null != getInputTypes(operationName)) {
                List<ElementType> parameterTypes = getInputTypes(operationName);

                for (ElementType et : parameterTypes) {
                    fdPT.add(et.toFieldDefinition());
                }
            }
        }
        
        return ret;
    }
    
    @SuppressWarnings("deprecation")
    public List<TypeDefinition> getLocalTypes() {
        
        List<ElementType> types = getTypes();
        List<TypeDefinition> ret = new ArrayList<TypeDefinition>(types.size());
        
        for (ElementType type: types) {
            FieldDefinition fd = type.toFieldDefinition();
            if (null!=fd.getTypeDefinition()) {
                ret.add(fd.getTypeDefinition());
            }
        }
        
        return ret;
    }

    @SuppressWarnings("deprecation")
    public List<TypeDefinition> getLocalTypes(String username, String password) { //salesforce

        List<ElementType> types = getTypes(username, password);
        List<TypeDefinition> ret = new ArrayList<TypeDefinition>(types.size());

        for (ElementType type: types) {
            FieldDefinition fd = type.toFieldDefinition();
            if (null!=fd.getTypeDefinition()) {
                ret.add(fd.getTypeDefinition());
            }
        }

        return ret;
    }

    public List<ElementType> getTypes(String username, String password) { //xxx
        return null;
    }

    public String getPartnerName() {
        return null;
    }
}