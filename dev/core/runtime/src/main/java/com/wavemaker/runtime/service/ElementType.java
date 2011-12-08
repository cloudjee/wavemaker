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

package com.wavemaker.runtime.service;

import java.beans.PropertyDescriptor;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.commons.beanutils.PropertyUtils;
import org.springframework.util.ClassUtils;

import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.GenericFieldDefinition;
import com.wavemaker.json.type.ListTypeDefinition;
import com.wavemaker.json.type.OperationEnumeration;
import com.wavemaker.json.type.reflect.ListReflectTypeDefinition;
import com.wavemaker.json.type.reflect.ObjectReflectTypeDefinition;
import com.wavemaker.json.type.reflect.PrimitiveReflectTypeDefinition;
import com.wavemaker.json.type.reflect.ReflectTypeDefinition;
import com.wavemaker.json.type.reflect.ReflectTypeState;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;

/**
 * Used by <code>ServiceDefinition</code> representing the operation's input and output type.
 * 
 * @author Frankie Fu
 */
public class ElementType implements Cloneable {

    private String name;

    private String javaType;

    private boolean isList;

    private boolean allowNull;

    private boolean supportsQuickData;

    private String subType; // salesforce

    private List<OperationEnumeration> require = new ArrayList<OperationEnumeration>();

    private List<OperationEnumeration> noChange = new ArrayList<OperationEnumeration>();

    private List<OperationEnumeration> exclude = new ArrayList<OperationEnumeration>();

    /**
     * The service this type is in (if null, assumed to be the current service).
     */
    private String service;

    private List<ElementType> properties = new ArrayList<ElementType>();

    // - only used by dataservice services - needs to be generalized and
    // refactored so individual services can set this on types
    // and then forget about it.
    // - do we only need this for the UI? if so, can we put this logic
    // somewhere else entirely?
    private boolean isTopLevel = false;

    public ElementType(String javaType) {
        this(null, javaType);
    }

    public ElementType(Class<?> javaType) {
        this(null, javaType);
    }

    public ElementType(String name, String javaType) {
        this(name, javaType, false);
    }

    public ElementType(String name, Class<?> javaType) {
        this(name, javaType, false);
    }

    public ElementType(String name, String javaType, boolean isList) {
        this.name = name;
        this.javaType = javaType;
        this.isList = isList;
    }

    /**
     * Create an ElementType with one level of children (populated by looking at the bean properties of javaType). This
     * method should not be used recursively.
     */
    public ElementType(String name, Class<?> javaType, boolean isList) {

        this(name, javaType.getName(), isList);

        PropertyDescriptor[] pds;

        pds = PropertyUtils.getPropertyDescriptors(javaType);

        List<ElementType> elements = new ArrayList<ElementType>(pds.length);
        for (PropertyDescriptor pd : pds) {
            if (pd.getName().equals("class")) {
                continue;
            }
            if (null == pd.getReadMethod() && null == pd.getWriteMethod()) {
                continue;
            }

            Class<?> klass;
            Type type;
            if (null != pd.getReadMethod()) {
                klass = pd.getReadMethod().getReturnType();
                type = pd.getReadMethod().getGenericReturnType();
            } else {
                klass = pd.getWriteMethod().getParameterTypes()[0];
                type = pd.getWriteMethod().getGenericParameterTypes()[0];
            }

            ElementType element;
            if (klass.isArray()) {
                element = new ElementType(pd.getName(), klass.getComponentType().getName(), true);
            } else if (Collection.class.isAssignableFrom(klass) && type instanceof ParameterizedType) {
                ParameterizedType ptype = (ParameterizedType) type;
                Type aType = ptype.getActualTypeArguments()[0];
                element = new ElementType(pd.getName(), ((Class<?>) aType).getName(), true);
            } else {
                element = new ElementType(pd.getName(), klass.getName());
            }

            elements.add(element);
        }
        this.properties = elements;
    }

    public ElementType(String name, String javaType, boolean isList, List<ElementType> properties) {
        this.name = name;
        this.javaType = javaType;
        this.isList = isList;
        this.properties = properties;
    }

    public ElementType(String name, Class<?> javaType, boolean isList, List<ElementType> properties) {
        this(name, javaType.getName(), isList, properties);
    }

    /**
     * Returns the name for this type.
     * 
     * @return The name for this type.
     */
    public String getName() {
        return this.name;
    }

    /**
     * Sets the name for this type.
     * 
     * @param name The name for this type.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Returns the full name of the Java type.
     * 
     * @return Strings like "int", "java.lang.String", "java.io.File".
     */
    public String getJavaType() {
        return this.javaType;
    }

    /**
     * Sets the full name of the Java type.
     * 
     * @param javaType Strings like "int", "java.lang.String", "java.io.File".
     */
    public void setJavaType(String javaType) {
        this.javaType = javaType;
    }

    public boolean isList() {
        return this.isList;
    }

    public void setList(boolean isList) {
        this.isList = isList;
    }

    public List<ElementType> getProperties() {
        return this.properties;
    }

    public void addProperty(ElementType property) {
        this.properties.add(property);
    }

    public void setProperties(List<ElementType> properties) {
        this.properties = properties;
    }

    public String getService() {
        return this.service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public boolean isTopLevel() {
        return this.isTopLevel;
    }

    public void setTopLevel(boolean isTopLevel) {
        this.isTopLevel = isTopLevel;
    }

    public boolean isAllowNull() {
        return this.allowNull;
    }

    public void setAllowNull(boolean allowNull) {
        this.allowNull = allowNull;
    }

    public String getSubType() { // salesforce
        return this.subType;
    }

    public void setSubType(String subType) { // salesforce
        this.subType = subType;
    }

    public boolean isSupportsQuickData() {
        return this.supportsQuickData;
    }

    public void setSupportsQuickData(boolean supportsQuickData) {
        this.supportsQuickData = supportsQuickData;
    }

    @Override
    public String toString() {
        return this.javaType;
    }

    public List<OperationEnumeration> getRequire() {
        return this.require;
    }

    public void setRequire(List<OperationEnumeration> require) {
        this.require = require;
    }

    public List<OperationEnumeration> getNoChange() {
        return this.noChange;
    }

    public void setNoChange(List<OperationEnumeration> noChange) {
        this.noChange = noChange;
    }

    public List<OperationEnumeration> getExclude() {
        return this.exclude;
    }

    public void setExclude(List<OperationEnumeration> exclude) {
        this.exclude = exclude;
    }

    /**
     * Transforms this ElementType into a FieldDefinition, to make the transition easier. This uses the default
     * reflection-based TypeDefinition classes ({@link com.wavemaker.json.type.reflect}).
     * 
     * @return
     */
    public FieldDefinition toFieldDefinition() {

        GenericFieldDefinition ret = new GenericFieldDefinition();

        Class<?> klass = null;
        try {
            if (null != getJavaType()) {
                klass = ClassUtils.forName(getJavaType());
            }
        } catch (ClassNotFoundException e) {
            // ignore
        }

        if (!getProperties().isEmpty()) {
            ObjectReflectTypeDefinition ortd = new ObjectReflectTypeDefinition();

            ortd.setTypeName(getJavaType());
            for (ElementType et : getProperties()) {
                ortd.getFields().put(et.getName(), et.toFieldDefinition());
            }

            ret.setTypeDefinition(ortd);
        } else if (null != klass) {
            ret = (GenericFieldDefinition) ReflectTypeUtils.getFieldDefinition(klass, new ReflectTypeState(), false, null);
        } else {
            // for now, assume it's primitive and let it pass
            /*
             * System.out.println("Unhandled ET: "+this+" (javaType: "+
             * getJavaType()+", name: "+getName()+", properties: "+ getProperties()+")");
             */
            PrimitiveReflectTypeDefinition prtd = new PrimitiveReflectTypeDefinition();
            prtd.setTypeName(this.getJavaType());
            ret.setTypeDefinition(prtd);
        }

        if (null != ret.getTypeDefinition()) {
            ((ReflectTypeDefinition) ret.getTypeDefinition()).setLiveService(isSupportsQuickData());
            ((ReflectTypeDefinition) ret.getTypeDefinition()).setShortName(getName());
        }

        if (isList()) {
            List<ListTypeDefinition> listType = new ArrayList<ListTypeDefinition>();
            ListReflectTypeDefinition lrtd = new ListReflectTypeDefinition();
            lrtd.setKlass(List.class);
            lrtd.setTypeName(List.class.getName());
            listType.add(lrtd);
            ret.setArrayTypes(listType);
        }

        ret.setNoChange(getNoChange());
        ret.setExclude(getExclude());
        ret.setRequire(getRequire());
        ret.setName(getName());
        ret.setAllowNull(isAllowNull());
        ret.setSubType(getSubType()); // salesforce

        return ret;
    }

    @Override
    public Object clone() {
        try {
            return super.clone();
        } catch (CloneNotSupportedException ex) {
            throw new AssertionError(ex);
        }
    }
}