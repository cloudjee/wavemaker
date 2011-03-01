/*
 *  Copyright (C) 2009-2011 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.service;

import com.wavemaker.json.type.FieldDefinition;

/**
 * This is an optional return type for services which would like to indicate
 * their return type (instead of using ServiceType-specific methods to discover
 * it).  This is
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TypedServiceReturn {
    
    public TypedServiceReturn() {
        
    }
    
    public TypedServiceReturn(Object returnValue, FieldDefinition returnType) {
        this();
        setReturnValue(returnValue);
        setReturnType(returnType);
    }

    /**
     * The return value.
     */
    private Object returnValue;
    
    /**
     * The type of the return.
     */
    private FieldDefinition returnType;
    
    public Object getReturnValue() {
        return returnValue;
    }
    public void setReturnValue(Object returnValue) {
        this.returnValue = returnValue;
    }
    public FieldDefinition getReturnType() {
        return returnType;
    }
    public void setReturnType(FieldDefinition returnType) {
        this.returnType = returnType;
    }
    
    @Override
    public String toString() {
        return "value "+getReturnValue()+" of type "+getReturnType();
    }
}