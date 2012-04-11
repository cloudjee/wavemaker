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

package com.wavemaker.runtime.service;

import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.service.response.LiveDataServiceResponse;

/**
 * This interface defines a LiveData/CRUD service. These services must provide standard CRUD operations (Create, Read,
 * Update, Delete) to the client.
 * 
 * @author Matt Small
 */
public interface LiveDataService {

    /**
     * LiveData interface's read() operation. This should read data from the object 'o' (if not null) or from a type
     * specified from type (if o is null), according to the rules found in propertyOptions and returning results
     * according to pagingOptions.
     * 
     * @param type The type of data to be returned (ignored if argument o is not null, and this will be the same as
     *        o.getClass()).
     * @param o The object to read parameters based on (takes precedence over type).
     * @param propertyOptions Specifies what properties to load.
     * @param pagingOptions Specifies how much to load.
     * @return There are several choices for return types:
     *         <ul>
     *         <li>An instance of {@link TypedServiceReturn}, containing a {@link LiveDataServiceResponse} object with
     *         paging or other information.</li>
     *         <li>An instance of {@link TypedServiceReturn}, containing the raw Object to be returned to the client
     *         with no paging information.</li>
     *         </ul>
     *         In either of those cases, the type information is optional, but recommended. If type information is
     *         included, it must be from the root of the type tree. If a {@link LiveDataServiceResponse} is being
     *         returned, the type information must contain those fields.
     * @throws Exception
     */
    TypedServiceReturn read(TypeDefinition type, Object o, PropertyOptions propertyOptions, PagingOptions pagingOptions) throws Exception;

    /**
     * Update the parameter, and return the same object (may be updated as a result of the update operation).
     * 
     * @param o The object to update.
     * @return The updated object (this may be changed as the result of the update).
     * @throws Exception
     */
    Object update(Object o) throws Exception;

    /**
     * Insert the object, and return the same object (which may be updated as a result of the insert operation).
     * 
     * @param o The object to insert.
     * @return The object, after insertion; this may have been changed as a result of the update.
     * @throws Exception
     */
    Object insert(Object o) throws Exception;

    /**
     * Delete the object.
     * 
     * @param o The object to delete.
     * @throws Exception
     */
    void delete(Object o) throws Exception;
}