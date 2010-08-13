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
package com.wavemaker.tools.data;

import java.util.Collection;

import com.wavemaker.common.util.ObjectAccess;
import com.wavemaker.common.util.OneToManyMap;
import com.wavemaker.json.PropertyFilter;
import com.wavemaker.runtime.data.DataPropertyFilter;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class DesignDataPropertyFilter extends DataPropertyFilter implements
        PropertyFilter {

    public static DesignDataPropertyFilter getInstance() {
        return instance;
    }

    private static final DesignDataPropertyFilter instance = new DesignDataPropertyFilter();

    // always filter these
    private final OneToManyMap<Class<?>, String> filterProps = new OneToManyMap<Class<?>, String>();

    // filter these if value is null
    private final OneToManyMap<Class<?>, String> nullFilterProps = new OneToManyMap<Class<?>, String>();

    private final ObjectAccess objectAccess = ObjectAccess.getInstance();

    private DesignDataPropertyFilter() {
        super();
        addFilteredProperty(EntityInfo.class, "columnsMap", filterProps);
        addFilteredProperty(EntityInfo.class, "id", filterProps);
        addFilteredProperty(EntityInfo.class, "properties", filterProps);
        addFilteredProperty(EntityInfo.class, "propertiesMap", filterProps);
        addFilteredProperty(EntityInfo.class, "propertyNames", filterProps);
        addFilteredProperty(EntityInfo.class, "relatedProperties", filterProps);
        
        addFilteredProperty(ColumnInfo.class, "length", nullFilterProps);
        addFilteredProperty(ColumnInfo.class, "precision", nullFilterProps);
    }

    @Override
    public boolean filter(Object source, String name, Object value) {

        if (checkFilterProps(source, name)) {
            return true;
        }
        
        if (value == null && checkNullFilterProps(source, name)) {
            return true;
        }

        return super.filter(source, name, value);
    }
    
    private boolean checkFilterProps(Object source, String name) {
        Collection<String> c = filterProps.get(source.getClass());
        return c != null && c.contains(name);
    }
    
    private boolean checkNullFilterProps(Object source, String name) {
        Collection<String> c = nullFilterProps.get(source.getClass());
        return c != null && c.contains(name);
    }
    
    private void addFilteredProperty(Class<?> clazz, String propertyName,
            OneToManyMap<Class<?>, String> m) {
        if (!objectAccess.hasProperty(clazz, propertyName)) {
            throw new AssertionError("property " + propertyName
                    + " doesn't exist on " + clazz.getName());
        }
        m.put(clazz, propertyName);
    }

}
