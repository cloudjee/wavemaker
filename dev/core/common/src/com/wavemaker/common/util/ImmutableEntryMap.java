/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
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
package com.wavemaker.common.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Attempting to override an existing Entry throws an IllegalStateException.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class ImmutableEntryMap<K, V> extends HashMap<K, V> implements Map<K, V> {

    private static final long serialVersionUID = 6377256648563139903L;

    @Override
    public V put(K key, V value) {
        if (containsKey(key)) {
            throw new IllegalStateException("Entry for key \"" + key
                    + "\" already exists");
        }
        return super.put(key, value);
    }

}
