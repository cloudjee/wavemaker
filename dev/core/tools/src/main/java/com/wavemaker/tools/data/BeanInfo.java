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

package com.wavemaker.tools.data;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class BeanInfo extends TypeInfo {

    private final Map<String, String> properties = new LinkedHashMap<String, String>();

    public BeanInfo(String fqName) {
        super(fqName);
    }

    public void addProperty(String name, String type) {
        this.properties.put(name, type);
    }

    public Map<String, String> getProperties() {
        return this.properties;
    }

}
