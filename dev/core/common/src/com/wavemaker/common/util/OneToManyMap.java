/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.common.util;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * one:many map.  Has all required Map methods, but doesn't
 * implement Map because of slight signature mismatches.
 * 
 * Collections returned by this Map are read only.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class OneToManyMap<K, V> {

    private final Map<K, Set<V>> m;

    public OneToManyMap() {
        this(HashMap.class);
    }

    /**
     * Specify the underlying Map implementation.
     * 
     * @param mapType
     */
    @SuppressWarnings("unchecked")
    public OneToManyMap(Class<?> mapType) {
        m = CastUtils.cast((Map) ClassUtils.newInstance(mapType));
    }

    public V put(K key, V value) {

        Set<V> l = m.get(key);
        if (l == null) {
            l = new HashSet<V>();
            m.put(key, l);
        }
        V rtn = null;
        if (l.contains(value)) {
            rtn = value;
        } else {
            l.add(value);
        }
        return rtn;
    }

    public Collection<V> get(Object key) {
        return m.get(key);
    }

    public void clear() {
        m.clear();
    }

    public boolean containsKey(Object key) {
        return m.containsKey(key);
    }

    public boolean containsValue(Object value) {
        return getValues().contains(value);
    }

    public void removeValue(Object key, Object value) {
        Collection<?> c = m.get(key);
        if (c != null) {
            c.remove(value);
        }
    }

    public Set<Map.Entry<K, Set<V>>> entrySet() {
        return Collections.unmodifiableSet(m.entrySet());
    }

    public boolean isEmpty() {
        return m.isEmpty();
    }

    public Set<K> keySet() {
        return Collections.unmodifiableSet(m.keySet());
    }

    public void putAll(Map<? extends K, ? extends V> t) {
        for (Map.Entry<? extends K, ? extends V> e : t.entrySet()) {
            put(e.getKey(), e.getValue());
        }
    }

    public Object remove(Object key) {
        return m.remove(key);
    }

    public int size() {
        return m.size();
    }

    public Collection<V> values() {
        return Collections.unmodifiableCollection(getValues());
    }
    
    private Collection<V> getValues() {
        Collection<V> rtn = new HashSet<V>();
        for (Set<V> s : m.values()) {
            rtn.addAll(s);
        }
        return rtn;
    }
     
}
