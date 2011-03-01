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
package com.wavemaker.json.type.reflect;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.type.ListTypeDefinition;

/**
 * @author small
 * @version $Rev$ - $Date$
 */
public class ListReflectTypeDefinition extends ReflectTypeDefinition implements
        ListTypeDefinition {
    
    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeDefinition#newInstance(java.lang.Object[])
     */
    @Override
    public Object newInstance(Object... args) {
        
        int length = 0;
        if (args.length==1 &&
                Integer.class.isAssignableFrom(args[0].getClass())) {
            length = (Integer) args[0];
        }
        
        if (getKlass().isInterface()) {
            if (getKlass().equals(List.class)) {
                return new ArrayList<Object>(length);
            } else if (getKlass().equals(Set.class)) {
               return new HashSet<Object>(length);
            } else if (getKlass().equals(SortedSet.class)) {
                return new TreeSet<Object>();
            } else if (getKlass().equals(Collection.class)) {
                return new ArrayList<Object>(length);
            } else {
                throw new WMRuntimeException(
                        Resource.JSON_FAILEDINSTANCE_COLLECTION, getKlass());
            }
        } else if (getKlass().isArray()) {
            Class<?> componentType = getKlass().getComponentType();
            return Array.newInstance(componentType, length);
        } else {
            throw new WMRuntimeException(Resource.JSON_UNKNOWN_COLL_OR_ARRAY,
                    getKlass());
        }
    }

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.ListTypeDefinition#set(java.lang.Object, int, java.lang.Object)
     */
    @SuppressWarnings("unchecked")
    public void add(Object list, int index, Object o) {
        
        if (list.getClass().isArray()) {
            Array.set(list, index, o);
        } else if (list instanceof List) {
            List tempList = (List) list;
            
            if (index>=tempList.size()) {
                tempList.add(o);
            } else {
                tempList.set(index, o);
            }
        } else if (list instanceof Collection) {
            ((Collection) list).add(o);
        } else {
            throw new WMRuntimeException(Resource.JSON_UNKNOWN_COLL_IN_SET,
                    list, list.getClass());
        }
    }
}