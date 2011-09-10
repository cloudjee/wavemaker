/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.service.types;

import com.wavemaker.common.NotYetImplementedException;
import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.common.util.Tuple.Three;
import com.wavemaker.json.ValueTransformer;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.GenericFieldDefinition;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.json.type.TypeState;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TypeValueTransformer implements ValueTransformer {

    /* (non-Javadoc)
     * @see com.wavemaker.json.ValueTransformer#transformToJSON(java.lang.Object, com.wavemaker.json.type.FieldDefinition, int, java.lang.Object, java.lang.String, com.wavemaker.json.type.TypeState)
     */
    public Three<Object, FieldDefinition, Integer> transformToJSON(
            Object input, FieldDefinition fieldDefinition, int arrayLevel,
            Object root, String path, TypeState typeState) {

        if (arrayLevel != fieldDefinition.getDimensions()) {
            return null;
        } else if (input instanceof Type) {
            TypeDefinition td;
            if (input instanceof ComplexType) {
                td = typeState.getType(ComplexType.class.getName());
            } else if (input instanceof PrimitiveType) {
                td = typeState.getType(PrimitiveType.class.getName());
            } else {
                throw new WMRuntimeException(Resource.UNKNOWN_TYPE_OF_TYPE,
                        input, input.getClass());
            }

            GenericFieldDefinition fd = new GenericFieldDefinition();
            fd.setTypeDefinition(td);

            return new Tuple.Three<Object, FieldDefinition, Integer>(input, fd,
                    arrayLevel);
        } else {
            return null;
        }
    }

    /* (non-Javadoc)
     * @see com.wavemaker.json.ValueTransformer#transformToJava(java.lang.Object, com.wavemaker.json.type.FieldDefinition, int, java.lang.Object, java.lang.String, com.wavemaker.json.type.TypeState)
     */
    public Three<Object, FieldDefinition, Integer> transformToJava(
            Object input, FieldDefinition fieldDefinition, int arrayLevel,
            Object root, String path, TypeState typeState) {
        throw new NotYetImplementedException();
    }
}