/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.service.types;

import java.util.List;

import com.wavemaker.json.type.OperationEnumeration;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class Field {

    private String type;
    private boolean isList;
    
    /**
     * Data the user must provide; this must be present in any valid
     * ComplexType, in any operation.  The client shouldn't invoke server
     * operations until the user has filled in all required fields.
     */
    private boolean required;
    
    /**
     * List of operations that this field must be present for (must be included
     * in any ComplexTypes sent to the server).
     */
    private List<OperationEnumeration> include;
    
    /**
     * List of operations this field must not be changed for (must be the same
     * as the version sent by the server when it's sent to the server).
     */
    private List<OperationEnumeration> noChange;
    
    /**
     * List of operations this field must not be present for (must not be sent
     * to the server).
     */
    private List<OperationEnumeration> exclude;

    /**
     * the order the field appears in the relevant table.
     */
    private int fieldOrder;
    
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public boolean isIsList() {
        return isList;
    }
    public void setIsList(boolean isList) {
        this.isList = isList;
    }
    public boolean isRequired() {
        return required;
    }
    public void setRequired(boolean required) {
        this.required = required;
    }
    public List<OperationEnumeration> getInclude() {
        return include;
    }
    public void setInclude(List<OperationEnumeration> include) {
        this.include = include;
    }
    public List<OperationEnumeration> getNoChange() {
        return noChange;
    }
    public void setNoChange(List<OperationEnumeration> noChange) {
        this.noChange = noChange;
    }
    public List<OperationEnumeration> getExclude() {
        return exclude;
    }
    public void setExclude(List<OperationEnumeration> exclude) {
        this.exclude = exclude;
    }

    public int getFieldOrder() {
        return fieldOrder;
    }
    public void setFieldOrder(int fieldOrder) {
        this.fieldOrder = fieldOrder;
    }
}