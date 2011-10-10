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

package com.wavemaker.json;

import com.wavemaker.common.util.Tuple;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.TypeState;

/**
 * Provides a mechanism for end-users to transform values before they are serialized or de-serialized. These transforms
 * run before any type conversion is performed, so the end type can be changed here as well.
 * 
 * For instance, a templating ValueTransformer could change a value of "$foo" to "bar" or to the number 12.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public interface ValueTransformer {

    /**
     * Perform the transformation, in a JSON String -&gt; Java direction (deserialization).
     * 
     * @param input The input Object, whose value is to be transformed (the value in the tree with the indicated root,
     *        at the indicated path).
     * @param fieldDefinition The FieldDefinition indicating the expected type of input (if the transform is from JSON
     *        to Java) or the current type of input (if the transform is from Java to JSON).
     * @param arrayLevel The current arrayLevel (if this is equal to the number of dimensions in the fieldDefinition,
     *        this is the raw type of the array.
     * @param root The root of the Object tree being transformed (usually, this is a {@link JSON} type.)
     * @param path The beanutils-formatted path to the current value within the object tree indicated by root.
     * @param typeState The current typeState.
     * @return The new value to be set at the path indicated by path, the fieldDefinition and the arrayLevel, or null if
     *         no transform was performed.
     */
    public Tuple.Three<Object, FieldDefinition, Integer> transformToJava(Object input, FieldDefinition fieldDefinition, int arrayLevel, Object root,
        String path, TypeState typeState);

    /**
     * Perform the transformation, in a Java -&gt; JSON String (serialization).
     * 
     * @param input The input Object, whose value is to be transformed (the value in the tree with the indicated root,
     *        at the indicated path).
     * @param fieldDefinition The FieldDefinition indicating the current type. of input (if the transform is from Java
     *        to JSON).
     * @param arrayLevel The current arrayLevel (if this is equal to the number of dimensions in the fieldDefinition,
     *        this is the raw type of the array.
     * @param root The root of the Object tree being transformed.
     * @param path The beanutils-formatted path to the current value within the object tree indicated by root.
     * @param typeState The current typeState.
     * @return The new value to be set at the path indicated by path, the fieldDefinition and the arrayLevel, or null if
     *         no transform was performed.
     */
    public Tuple.Three<Object, FieldDefinition, Integer> transformToJSON(Object input, FieldDefinition fieldDefinition, int arrayLevel, Object root,
        String path, TypeState typeState);
}
