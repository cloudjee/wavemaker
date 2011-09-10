/*
 *  Copyright (C) 2009 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.server.nonbean;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.json.type.TypeState;
import com.wavemaker.runtime.server.nonbean.types.FooArg1TypeDefinition;
import com.wavemaker.runtime.server.nonbean.types.FooArg2TypeDefinition;
import com.wavemaker.runtime.server.nonbean.types.FooArg3TypeDefinition;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class NonBeanTypeFactory implements TypeState {
    
    public static final String FOO_ARG_1 = "fooArg1Type";
    public static final String FOO_ARG_2 = "fooArg2Type";
    public static final String FOO_ARG_3 = "fooArg3Type";

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeState#addType(com.wavemaker.json.type.TypeDefinition)
     */
    public void addType(TypeDefinition typeDefinition) {
        // not used
    }

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeState#getType(java.lang.String)
     */
    public TypeDefinition getType(String typeName) {
        
        if (FOO_ARG_1.equals(typeName)) {
            return new FooArg1TypeDefinition();
        } else if (FOO_ARG_2.equals(typeName)) {
            return new FooArg2TypeDefinition();
        } else if (FOO_ARG_3.equals(typeName)) {
            return new FooArg3TypeDefinition();
        } else {
            throw new WMRuntimeException("unknown type name: "+typeName);
        }
    }

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeState#isTypeKnown(java.lang.String)
     */
    public boolean isTypeKnown(String typeName) {
        
        try {
            getType(typeName);
            return true;
        } catch (WMRuntimeException e) {
            return false;
        }
    }
}