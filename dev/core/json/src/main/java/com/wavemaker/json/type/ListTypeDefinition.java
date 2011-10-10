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

package com.wavemaker.json.type;

/**
 * A TypeDefinition representing List (including Arrays and Collections) types.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public interface ListTypeDefinition extends TypeDefinition {

    /**
     * Sets or appends the value to the list (if possible, at the index specified). The list must match the type of list
     * definition. For instance, if the concrete ListTypeDefinition uses Reflection, than an array or Collection
     * instance might be allowable.
     * 
     * @param list The list to set in. This must match the type of ListTypeDefinition.
     * @param index The index to set. If the Collection type doesn't support setting values via indices, or a set
     *        operation would be beyond the bounds of the current array, this parameter may be ignored, and an append
     *        will be performed.
     * @param o The object to append.
     */
    public void add(Object list, int index, Object o);
}