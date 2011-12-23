/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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
 * one:many map. Has all required Map methods, but doesn't implement Map because of slight signature mismatches.
 * 
 * Collections returned by this Map are read only.
 * 
 * @author Simon Toens
 */
public class OneToManyMap<K, V> {

    private final Map<K, Set<V>> m = new HashMap<K, Set<V>>();

    public V put(K key, V value) {

        Set<V> l = this.m.get(key);
        if (l == null) {
            l = new HashSet<V>();
            this.m.put(key, l);
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
        return this.m.get(key);
    }

    public void clear() {
        this.m.clear();
    }

    public boolean containsKey(Object key) {
        return this.m.containsKey(key);
    }

    public boolean containsValue(Object value) {
        return getValues().contains(value);
    }

    public void removeValue(Object key, Object value) {
        Collection<?> c = this.m.get(key);
        if (c != null) {
            c.remove(value);
        }
    }

    public Set<Map.Entry<K, Set<V>>> entrySet() {
        return Collections.unmodifiableSet(this.m.entrySet());
    }

    public boolean isEmpty() {
        return this.m.isEmpty();
    }

    public Set<K> keySet() {
        return Collections.unmodifiableSet(this.m.keySet());
    }

    public void putAll(Map<? extends K, ? extends V> t) {
        for (Map.Entry<? extends K, ? extends V> e : t.entrySet()) {
            put(e.getKey(), e.getValue());
        }
    }

    public Object remove(Object key) {
        return this.m.remove(key);
    }

    public int size() {
        return this.m.size();
    }

    public Collection<V> values() {
        return Collections.unmodifiableCollection(getValues());
    }

    private Collection<V> getValues() {
        Collection<V> rtn = new HashSet<V>();
        for (Set<V> s : this.m.values()) {
            rtn.addAll(s);
        }
        return rtn;
    }

}
