/*
 *  Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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

/**
 * TypeDefinition representing Map types. These are a mapping from arbitrary keys to values, but the types of both the
 * keys and values are currently fixed.
 * 
 * @author Matt Small
 */
public interface MapTypeDefinition extends TypeDefinition {

    /**
     * Get the FieldDefinition for the values of this Map.
     * 
     * @return The value FieldDefinition.
     */
    public FieldDefinition getValueFieldDefinition();

    /**
     * Get the FieldDefinition for the keys of this Map.
     * 
     * @return The key FieldDefinition.
     */
    public FieldDefinition getKeyFieldDefinition();
}