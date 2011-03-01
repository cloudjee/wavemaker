/*
 *  Copyright (C) 2009-2011 WaveMaker Software, Inc.
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
package com.wavemaker.json.type.converters;

import java.io.IOException;
import java.io.Writer;

import com.wavemaker.json.type.TypeDefinition;

/**
 * Provides an interface for TypeDefinitions wishing to provide type conversions
 * in the writeObject (Java -&gt; JSON String or serialization) direction.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public interface WriteObjectConverter extends TypeDefinition {

    /**
     * Perform the transformation, in a Java -&gt; JSON String (serialization).
     * The output of the transformation should be written directly to the
     * writer parameter.
     * 
     * @param input
     *            The input Object, whose value is to be transformed (the value
     *            in the tree with the indicated root, at the indicated path).
     * @param root
     *            The root of the Object tree being transformed.
     * @param path
     *            The beanutils-formatted path to the current value within the
     *            object tree indicated by root.
     * @return The new value to be set at the path indicated by path.
     */
    public void writeObject(Object input, Object root, String path,
            Writer writer) throws IOException;
}