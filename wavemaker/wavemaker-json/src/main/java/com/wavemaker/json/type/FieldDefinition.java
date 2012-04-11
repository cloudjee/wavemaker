/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.json.type;

import java.util.List;

/**
 * Provide definitions for individual fields. Each field contains a type, information on it's array dimensions, as well
 * as metadata describing the values that may be placed there (for instance, if null is allowed).
 * 
 * @author Matt Small
 */
public interface FieldDefinition {

    /**
     * Get the TypeDefinition associated with this field. This can be null if there is no specified type (for instance,
     * if the field is of type Object, or if it's an untyped generic list List&lt;?&gt;).
     * 
     * @return The TypeDefinition for this field.
     */
    public TypeDefinition getTypeDefinition();

    /**
     * Return the dimensions of this FieldDefinition. This number should match the number of dimensions in the return
     * from {@link #getArrayTypes()}.
     * 
     * @return The number of dimensions.
     */
    public int getDimensions();

    /**
     * Get the list of array types, in order. For instance, if this field is a multi-dimensional array declared like
     * this: List<String[]>, this method would return ListTypeDefinitions in this order: [List, String[]].
     * 
     * The number of dimensions of this list should match those returned by {@link #getDimensions()}.
     * 
     * @return The list of array types.
     */
    public List<ListTypeDefinition> getArrayTypes();

    /**
     * True iff this field allows null values.
     * 
     * @return True if this field allows null values.
     */
    public boolean isAllowNull();

    /**
     * Sub type for Salesforce.
     * 
     * @return Sub type.
     */
    public String getSubType(); // salesforce

    /**
     * Get the list of operations this field is required for. See the
     * {@link com.wavemaker.runtime.service.LiveDataService} API for more information.
     * 
     * @return The list of operations this field is required for.
     */
    public List<OperationEnumeration> getRequire();

    /**
     * Get the list of operations this field cannot be changed during. See the
     * {@link com.wavemaker.runtime.service.LiveDataService} API for more information.
     * 
     * @return The list of operations this field cannot be changed during.
     */
    public List<OperationEnumeration> getNoChange();

    /**
     * Get the list of operations this field must be excluded from. See the
     * {@link com.wavemaker.runtime.service.LiveDataService} API for more information.
     * 
     * @return The list of operations this field must be excluded from.
     */
    public List<OperationEnumeration> getExclude();

    /**
     * Retrieves an (optional) name associated with this field. When known, this should always be set.
     * 
     * @return The name for this field, or null if there is no name.
     */
    public String getName();
}