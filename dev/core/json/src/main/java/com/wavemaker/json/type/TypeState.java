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

package com.wavemaker.json.type;

/**
 * Holds the state of current types, and knows how to discover new types (associated with the individual type of this
 * TypeState).
 * 
 * @author Matt Small
 */
public interface TypeState {

    /**
     * Get the type specified by typeName. If it's in the list of known types, return the known version, else use an
     * implementation-specific method to try to get the TypeDefinition.
     * 
     * @param typeName The unique type name.
     * @return The corresponding TypeDefinition.
     */
    public TypeDefinition getType(String typeName);

    /**
     * Checks to see if the specified type is known by this TypeState.
     * 
     * @param typeName The type to find.
     * @return True iff the type is known by this TypeState.
     */
    public boolean isTypeKnown(String typeName);

    /**
     * Add the type to the list of types known by this TypeState.
     * 
     * @param typeDefinition The TypeDefinition to add.
     */
    public void addType(TypeDefinition typeDefinition);
}