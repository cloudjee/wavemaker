/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

import java.util.Collection;

import com.wavemaker.common.util.ObjectAccess;
import com.wavemaker.common.util.OneToManyMap;
import com.wavemaker.json.PropertyFilter;
import com.wavemaker.runtime.data.DataPropertyFilter;

/**
 * @author Simon Toens
 */
public class DesignDataPropertyFilter extends DataPropertyFilter implements PropertyFilter {

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
        addFilteredProperty(EntityInfo.class, "columnsMap", this.filterProps);
        addFilteredProperty(EntityInfo.class, "id", this.filterProps);
        addFilteredProperty(EntityInfo.class, "properties", this.filterProps);
        addFilteredProperty(EntityInfo.class, "propertiesMap", this.filterProps);
        addFilteredProperty(EntityInfo.class, "propertyNames", this.filterProps);
        addFilteredProperty(EntityInfo.class, "relatedProperties", this.filterProps);

        addFilteredProperty(ColumnInfo.class, "length", this.nullFilterProps);
        addFilteredProperty(ColumnInfo.class, "precision", this.nullFilterProps);
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
        Collection<String> c = this.filterProps.get(source.getClass());
        return c != null && c.contains(name);
    }

    private boolean checkNullFilterProps(Object source, String name) {
        Collection<String> c = this.nullFilterProps.get(source.getClass());
        return c != null && c.contains(name);
    }

    private void addFilteredProperty(Class<?> clazz, String propertyName, OneToManyMap<Class<?>, String> m) {
        if (!this.objectAccess.hasProperty(clazz, propertyName)) {
            throw new AssertionError("property " + propertyName + " doesn't exist on " + clazz.getName());
        }
        m.put(clazz, propertyName);
    }

}
