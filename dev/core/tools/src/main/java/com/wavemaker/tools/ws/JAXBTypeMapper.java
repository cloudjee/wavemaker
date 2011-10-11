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

package com.wavemaker.tools.ws;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.namespace.QName;

import org.springframework.core.io.Resource;
import org.w3c.dom.Element;

import com.sun.tools.xjc.api.Mapping;
import com.sun.tools.xjc.api.S2JJAXBModel;
import com.sun.tools.xjc.api.TypeAndAnnotation;
import com.sun.tools.xjc.model.CBuiltinLeafInfo;
import com.sun.tools.xjc.model.CClassInfo;
import com.sun.tools.xjc.model.CElementPropertyInfo;
import com.sun.tools.xjc.model.CPropertyInfo;
import com.sun.tools.xjc.model.CTypeInfo;
import com.sun.tools.xjc.model.Model;
import com.sun.tools.xjc.model.nav.NType;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.ws.wsdl.TypeMapper;
import com.wavemaker.tools.ws.wsdl.WSDL;
import com.wavemaker.tools.ws.wsdl.WSDL.WebServiceType;

/**
 * JAXB specific type mappings.
 * 
 * @author Frankie Fu
 * @author Jeremy Grelle
 */
public class JAXBTypeMapper implements TypeMapper {

    public static final Map<QName, String> builtinTypeMap;

    static {
        builtinTypeMap = new HashMap<QName, String>();
        Map<NType, CBuiltinLeafInfo> leaves = CBuiltinLeafInfo.LEAVES;
        Collection<CBuiltinLeafInfo> builtinTypes = leaves.values();
        for (CBuiltinLeafInfo builtinType : builtinTypes) {
            builtinTypeMap.put(builtinType.getTypeName(), builtinType.getType().fullName());
        }
    }

    private final S2JJAXBModel jaxbModel;

    private final Map<QName, String> jaxbMappings;

    public JAXBTypeMapper(WSDL wsdl) throws GenerationException {
        this(wsdl, new ArrayList<Resource>());
    }

    public JAXBTypeMapper(WSDL wsdl, List<Resource> bindingFiles) throws GenerationException {
        this(wsdl.getSchemas(), bindingFiles, wsdl.getPackageName(), wsdl.getAuxiliaryClasses(), wsdl.getWebServiceType());
    }

    public JAXBTypeMapper(Map<String, Element> schemas, List<Resource> bindingFiles, String packageName, Set<String> auxiliaryClasses,
        WebServiceType type) throws GenerationException {
        this.jaxbModel = XJCCompiler.createSchemaModel(schemas, bindingFiles, packageName, auxiliaryClasses, type);
        this.jaxbMappings = getMappings();
    }

    public S2JJAXBModel getJAXBModel() {
        return this.jaxbModel;
    }

    @Override
    public String getJavaType(QName schemaType, boolean isElement) {
        String javaType = null;
        if (this.jaxbModel != null) {
            // SimpleTypes or ComplexTypes or any builtin types
            TypeAndAnnotation jt = this.jaxbModel.getJavaType(schemaType);
            if (jt == null || isElement) {
                // Element
                Mapping mapping = this.jaxbModel.get(schemaType);
                if (mapping == null) {
                    javaType = this.jaxbMappings.get(schemaType);
                } else {
                    jt = mapping.getType();
                }
            }
            if (jt != null) {
                javaType = jt.getTypeClass().fullName();
            }
        } else {
            javaType = builtinTypeMap.get(schemaType);
        }
        return javaType;
    }

    @Override
    public String toPropertyName(String name) {
        return CodeGenUtils.toPropertyName(name);
    }

    @Override
    public boolean isSimpleType(QName qname) {
        TypeAndAnnotation javaType = this.jaxbModel.getJavaType(qname);
        if (javaType == null) {
            javaType = this.jaxbModel.get(qname).getType();
        }
        if (javaType.getTypeClass().isPrimitive()) {
            return true;
        } else {
            return builtinTypeMap.containsValue(javaType.getTypeClass().fullName());
        }
    }

    protected Model getInternalModel() {
        if (this.jaxbModel == null) {
            return null;
        }
        try {
            Field field = this.jaxbModel.getClass().getDeclaredField("model");
            field.setAccessible(true);
            Model model = (Model) field.get(this.jaxbModel);
            return model;
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
    }

    private Map<QName, String> getMappings() {
        Map<QName, String> mappings = new HashMap<QName, String>();
        Model internalModel = getInternalModel();
        if (internalModel != null) {
            for (CClassInfo ci : internalModel.beans().values()) {
                QName qname = ci.getElementName();
                if (qname == null) {
                    qname = ci.getTypeName();
                }
                if (qname != null) {
                    mappings.put(qname, ci.getName());
                }
            }
        }
        return mappings;
    }

    @Override
    public List<ElementType> getAllTypes(String serviceId) {
        List<ElementType> allTypes = new ArrayList<ElementType>();
        Model internalModel = getInternalModel();
        if (internalModel != null) {
            for (CClassInfo ci : internalModel.beans().values()) {
                ElementType type = new ElementType(ci.shortName, ci.fullName());
                List<ElementType> properties = getPropertyTypes(ci);
                // if the type extends from a base type, get those properties
                // from the base type as well.
                CClassInfo baseci = ci;
                while ((baseci = baseci.getBaseClass()) != null) {
                    properties.addAll(getPropertyTypes(baseci));
                }
                type.setProperties(properties);

                allTypes.add(type);
            }
        }
        return allTypes;
    }

    @Override
    public List<ElementType> getAllTypes(String serviceId, String username, String password) { // salesforce
        return null;
    }

    private List<ElementType> getPropertyTypes(CClassInfo ci) {
        List<ElementType> properties = new ArrayList<ElementType>();
        for (CPropertyInfo prop : ci.getProperties()) {
            Collection<? extends CTypeInfo> ref = prop.ref();
            String propJavaType = null;
            if (prop instanceof CElementPropertyInfo && ((CElementPropertyInfo) prop).getSchemaType() != null) {
                propJavaType = getJavaType(((CElementPropertyInfo) prop).getSchemaType(), true);
            } else {
                for (CTypeInfo ct : ref) {
                    propJavaType = ct.getType().fullName();
                }
            }
            ElementType propType = new ElementType(toPropertyName(prop.getName(true)), propJavaType, prop.isCollection());
            properties.add(propType);
        }
        return properties;
    }

}
