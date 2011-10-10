/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.pws;

import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.runtime.service.definition.ServiceOperation;

/**
 * This interface defines methods to modify the service definition before generating the service definition file and the
 * types definition script, but after generating java classes.
 * 
 * @author slee
 * 
 */
public interface IPwsServiceModifier {

    /**
     * Gets the return type for the operation passed in. The default implementation of this method just returns the
     * default retur type defined in the Service Operation object (= so.getReturnType()). However, if needed, implement
     * this method per specific requirement.
     * 
     * @param so the service operation
     * @return an instance of FieldDefinition for the return type
     */
    public FieldDefinition getOperationReturnType(ServiceOperation so);
}
