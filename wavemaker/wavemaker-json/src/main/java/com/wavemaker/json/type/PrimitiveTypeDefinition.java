/*
 *  Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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

import java.io.IOException;
import java.io.Writer;

import com.wavemaker.json.JSONMarshaller;

/**
 * A TypeDefinition representing primitive types, such as String, int, and enum classes. Any individual values are
 * considered primitives.
 * 
 * @author Matt Small
 */
public interface PrimitiveTypeDefinition extends TypeDefinition {

    /**
     * Transform the object (of this PrimitiveType) into its JSON representation.
     * 
     * @see JSONMarshaller#marshal(Writer, Object) may be handy for serializing the objects.
     * 
     * @param writer The writer to write the transformation output to.
     * @param obj The object to transform.
     */
    public void toJson(Writer writer, Object obj) throws IOException;
}