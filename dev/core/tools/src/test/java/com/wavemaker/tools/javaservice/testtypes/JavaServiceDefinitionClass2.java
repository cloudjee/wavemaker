/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
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
package com.wavemaker.tools.javaservice.testtypes;

import com.wavemaker.json.type.GenericFieldDefinition;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.service.LiveDataService;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.runtime.service.PropertyOptions;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.runtime.service.response.LiveDataServiceResponse;
import com.wavemaker.tools.javaservice.JavaService_BeanClass;

/**
 * @author small
 * @version $Rev$ - $Date:2008-05-30 14:45:46 -0700 (Fri, 30 May 2008) $
 */
public class JavaServiceDefinitionClass2 implements LiveDataService {

    public TypedServiceReturn read(TypeDefinition type,
            Object instance, PropertyOptions propertyOptions,
            PagingOptions pagingOptions) {
        
        int i=0;
        LiveDataServiceResponse ret = new LiveDataServiceResponse();
        ret.setResult(i);
        
        TypedServiceReturn tsr = new TypedServiceReturn();
        tsr.setReturnValue(ret);
        tsr.setReturnType(new GenericFieldDefinition(type));
        
        return tsr;
    }

    public void delete(Object objectToDelete) {
    }

    public Object insert(Object objectToInsert) {
        return null;
    }

    public Object update(Object objectToUpdate) {
        return null;
    }
    
    // use something from a clean classloader
    public JavaService_BeanClass getBean() {
        return null;
    }
}
