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
package com.wavemaker.runtime.service.definition;

import java.util.List;

import com.wavemaker.json.type.FieldDefinition;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class ServiceOperation {

    private List<FieldDefinition> parameterTypes;
    private FieldDefinition returnType;
    private String name;
    
    public List<FieldDefinition> getParameterTypes() {
        return parameterTypes;
    }
    public void setParameterTypes(List<FieldDefinition> parameterTypes) {
        this.parameterTypes = parameterTypes;
    }
    public FieldDefinition getReturnType() {
        return returnType;
    }
    public void setReturnType(FieldDefinition returnType) {
        this.returnType = returnType;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}