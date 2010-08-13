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
package com.wavemaker.runtime.service.definition;

import java.util.List;

import com.wavemaker.runtime.service.ElementType;


/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public interface DeprecatedServiceDefinition extends ReflectServiceDefinition {

    /**
     * Returns all operation names for the service.
     * 
     * @return All operation names.
     */
    @Deprecated
    public List<String> getOperationNames();

    /**
     * Returns the input types for the specified operation.
     * 
     * @param operationName The name of the desired operation.
     * @return The list of inputs.
     */
    @Deprecated
    public List<ElementType> getInputTypes(String operationName);

    /**
     * Returns the output type for the specified operation.
     * 
     * @param operationName The name of the desired operation.
     * @return The output.
     */
    @Deprecated
    public ElementType getOutputType(String operationName);
    
    /**
     * Get all types associated with this service.
     * 
     * @return A list of types.
     */
    @Deprecated
    public List<ElementType> getTypes();
    
    /**
     * Must be called explicitly to indicate that this instance is no longer
     * used and can clean up the resources it is holding onto.  After calling
     * this method, this instance should no longer be accessed.
     */
    public void dispose();
}