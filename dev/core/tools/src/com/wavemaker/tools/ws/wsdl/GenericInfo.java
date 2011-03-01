/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.ws.wsdl;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public abstract class GenericInfo {

    private AtomicReference<Map<String, Object>> propertyMap = new AtomicReference<Map<String, Object>>();

    public Object getProperty(String name) {
        if (null == propertyMap.get()) {
            return null;
        }
        return propertyMap.get().get(name);
    }

    public <T> T getProperty(String name, Class<T> cls) {
        return cls.cast(getProperty(name));
    }

    public void setProperty(String name, Object v) {
        if (null == propertyMap.get()) {
            propertyMap.compareAndSet(null,
                    new ConcurrentHashMap<String, Object>(4));
        }
        if (v == null) {
            propertyMap.get().remove(name);
        } else {
            propertyMap.get().put(name, v);
        }
    }

}
