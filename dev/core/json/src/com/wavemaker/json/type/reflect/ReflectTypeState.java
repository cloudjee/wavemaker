/*
 *  Copyright (C) 2009-2010 WaveMaker Software, Inc.
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
package com.wavemaker.json.type.reflect;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.beanutils.PropertyUtilsBean;
import org.springframework.util.ClassUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.json.type.TypeState;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class ReflectTypeState implements TypeState {
    
    private final Map<String, TypeDefinition> knownTypes = new HashMap<String, TypeDefinition>();
    private final PropertyUtilsBean propertyUtilsBean = new PropertyUtilsBean();

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeState#addType(com.wavemaker.json.type.TypeDefinition)
     */
    public void addType(TypeDefinition typeDefinition) {
        knownTypes.put(typeDefinition.getTypeName(), typeDefinition);
    }

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeState#getType(java.lang.String)
     */
    public TypeDefinition getType(String typeName) {
        
        if (knownTypes.containsKey(typeName)) {
            return knownTypes.get(typeName);
        } else {
            try {
                TypeDefinition td = ReflectTypeUtils.getTypeDefinition(
                        ClassUtils.forName(typeName), this, false);
                addType(td);
                return td;
            } catch (ClassNotFoundException e) {
                throw new WMRuntimeException(e);
            } catch (LinkageError e) {
                throw new WMRuntimeException(e);
            }
        }
    }

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeState#isTypeKnown(java.lang.String)
     */
    public boolean isTypeKnown(String typeName) {
        
        return knownTypes.containsKey(typeName);
    }
    


    public PropertyUtilsBean getPropertyUtilsBean() {
        return propertyUtilsBean;
    }
    
    public Map<String, TypeDefinition> getKnownTypes() {
        return this.knownTypes;
    }
}