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
package com.wavemaker.tools.ws.salesforce;

import java.io.File;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.namespace.QName;

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
import com.wavemaker.common.CommonConstants;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.ws.wsdl.TypeMapper;
import com.wavemaker.tools.ws.wsdl.WSDL;
import com.wavemaker.tools.ws.wsdl.WSDL.WebServiceType;
import com.wavemaker.tools.ws.salesforce.SalesforceHelper;
import com.wavemaker.tools.ws.JAXBTypeMapper;
import com.wavemaker.json.type.OperationEnumeration;

/**
 * JAXB specific type mappings for SalesForce.
 * 
 * @author slee
 */
public class JAXBTypeMapper_SF extends JAXBTypeMapper {
    
    public JAXBTypeMapper_SF(WSDL wsdl) throws GenerationException {
        super(wsdl, new ArrayList<File>());
    }

    public JAXBTypeMapper_SF(WSDL wsdl, List<File> bindingFiles)
            throws GenerationException {
        super(wsdl.getSchemas(), bindingFiles, wsdl.getPackageName(),
                wsdl.getAuxiliaryClasses(), wsdl.getWebServiceType());
    }

    public JAXBTypeMapper_SF(Map<String, Element> schemas,
            List<File> bindingFiles, String packageName,
            Set<String> auxiliaryClasses, WebServiceType type)
            throws GenerationException {
        super(schemas, bindingFiles, packageName, auxiliaryClasses, type);
    }
    
    public synchronized List<ElementType> getAllTypes (String serviceId, String username, String password) {
        List<ElementType> allTypes = new ArrayList<ElementType>();
        Model internalModel = getInternalModel();
        SalesforceHelper helper = null; //salesforce
        if (internalModel != null) {
            for (CClassInfo ci : internalModel.beans().values()) {
                ElementType type = new ElementType(ci.shortName, ci.fullName());
                if (serviceId.equals(CommonConstants.SALESFORCE_SERVICE)) { //salesforce
                    if (!SalesforceHelper.isSystemObject(ci.shortName))
                        type.setSupportsQuickData(true);
                }
                try {
                    helper = new SalesforceHelper(ci.shortName, serviceId, username, password); //salesforce
                } catch (Exception e) {
                    e.printStackTrace();
                }
                List<ElementType> properties = getPropertyTypes(ci, serviceId, helper);
                // if the type extends from a base type, get those properties
                // from the base type as well.
                CClassInfo baseci = ci;
                while ((baseci = baseci.getBaseClass()) != null) {
                    properties.addAll(getPropertyTypes(baseci, serviceId, helper));
                }
                type.setProperties(properties);

                allTypes.add(type);
            }
            if (helper != null) SalesforceHelper.setSessionHeader(null); //salesforce
        }
        return allTypes;
    }

    private List<ElementType> getPropertyTypes(CClassInfo ci, String serviceId, SalesforceHelper sfHelper) {
        List<ElementType> properties = new ArrayList<ElementType>();
        for (CPropertyInfo prop : ci.getProperties()) {
            if (serviceId.equals(CommonConstants.SALESFORCE_SERVICE)) {
                if (sfHelper.skipElement(prop.getName(true), serviceId)) continue; //salesforce
            }
            Collection<? extends CTypeInfo> ref = prop.ref();
            String propJavaType = null;
            if (prop instanceof CElementPropertyInfo
                    && ((CElementPropertyInfo) prop).getSchemaType() != null) {
                propJavaType = getJavaType(((CElementPropertyInfo) prop)
                        .getSchemaType(), true);
            } else {
                for (CTypeInfo ct : ref) {
                    propJavaType = ct.getType().fullName();
                }
            }
            ElementType propType = new ElementType(
                    toPropertyName(prop.getName(true)), 
                    propJavaType, prop.isCollection());

            propType = sfHelper.setElementTypeProperties(propType, serviceId);  //salesforce
            properties.add(propType);
        }
        return properties;
    }

}
