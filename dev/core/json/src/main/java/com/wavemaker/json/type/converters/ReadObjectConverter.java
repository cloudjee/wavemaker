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

package com.wavemaker.json.type.converters;

import com.wavemaker.json.JSON;
import com.wavemaker.json.type.TypeDefinition;

/**
 * Provides an interface for TypeDefinitions wishing to provide type conversions in the readObject (JSON String -&gt;
 * Java or de-serialization) direction.
 * 
 * @author Matt Small
 */
public interface ReadObjectConverter extends TypeDefinition {

    /**
     * Perform the transformation, in a JSON String -&gt; Java direction (de-serialization).
     * 
     * @param input The input Object, whose value is to be transformed (the value in the tree with the indicated root,
     *        at the indicated path). This is often a JSON type, or a primitive Java type (although not necessarily of
     *        the correct type represented by this TypeDefinition). Note that this may be null.
     * @param root The root of the Object tree being transformed (usually, this is a {@link JSON} type.)
     * @param path The beanutils-formatted path to the current value within the object tree indicated by root.
     * @return The new value to be set at the path indicated by path.
     */
    public Object readObject(Object input, Object root, String path);
}