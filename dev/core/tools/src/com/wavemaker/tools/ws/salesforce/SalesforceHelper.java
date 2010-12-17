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

import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.ws.salesforce.SalesforceSupport;
import com.wavemaker.runtime.ws.salesforce.gen.*;
import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.service.definitions.Operation;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.json.type.OperationEnumeration;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.Source;
import javax.xml.transform.Result;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.dom.DOMSource;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import javax.xml.bind.JAXBException;
import java.util.*;
import java.io.File;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;

/**
 * Helper class for Salesforce.
 * 
 * @author slee
 */
public class SalesforceHelper {

    private static final String RECORD_ID = "Id";

    private static final String SF_SERVICE_NAME = "salesforceService";

    private static List<OperationEnumeration> NO_CHANGE_OPERATIONS =  //xxx-s
        new ArrayList<OperationEnumeration>(3);
    static {
        NO_CHANGE_OPERATIONS.add(OperationEnumeration.delete);
        NO_CHANGE_OPERATIONS.add(OperationEnumeration.read);
        NO_CHANGE_OPERATIONS.add(OperationEnumeration.update);
    }

    private static List<OperationEnumeration> REQUIRED_OPERATIONS =
        new ArrayList<OperationEnumeration>(1);
    static {
        REQUIRED_OPERATIONS.add(OperationEnumeration.delete);
        REQUIRED_OPERATIONS.add(OperationEnumeration.read);
        REQUIRED_OPERATIONS.add(OperationEnumeration.update);
    }

    private static List<OperationEnumeration> EXCLUDE_OPERATIONS =
        new ArrayList<OperationEnumeration>(1);
    static {
        EXCLUDE_OPERATIONS.add(OperationEnumeration.insert);
    } //xxx-e

    private static SessionHeader sessionHeader = null;
    private List<FieldType> fields = null;

    public SalesforceHelper(String objName, String serviceId) throws Exception {

        if (!serviceId.equals(SF_SERVICE_NAME)) return;

        SforceService service = (SforceService) RuntimeAccess.getInstance().getSpringBean(
            "sfServiceBean");

        if (sessionHeader == null) {
            //String userId = "community@wavemaker.com";
            //String passWord = "WMsurf!ng";
            String userId = "sammysm@wavemaker.com";
            String passWord = "Silver88Surfer";
            Login parameters = new Login();
            parameters.setUsername(userId);
            parameters.setPassword(passWord);
            LoginResponse response = service.login(parameters, new LoginScopeHeader(), null);

            BindingProperties bindingProperties = new BindingProperties();
            bindingProperties.setEndpointAddress(response.getResult().getServerUrl());
            service.setBindingProperties(bindingProperties);
            String sessionId = response.getResult().getSessionId();

            sessionHeader = new SessionHeader();
            sessionHeader.setSessionId(sessionId);
        }
        
        DescribeSObject parameters = new DescribeSObject();
        parameters.setSObjectType(SalesforceSupport.getSalesforceObjName(objName));
        try {
            DescribeSObjectResponse dresponse = service.describeSObject(parameters, sessionHeader, null, null, null);
            fields = dresponse.getResult().getFields();
        } catch (Exception e) {
            //e.printStackTrace();
        }         
    }
   
    public ElementType setElementTypeProperties(ElementType type, String serviceId) { //xxx
        if (!serviceId.equals(SF_SERVICE_NAME) || fields == null || fields.size() == 0) return type;

        if (SalesforceHelper.isPrimaryKey(type.getName(), serviceId)) {
            type.setNoChange(NO_CHANGE_OPERATIONS);
            type.setRequire(REQUIRED_OPERATIONS);
            type.setExclude(EXCLUDE_OPERATIONS);
        }

        FieldType myField = getField(fields, type.getName());

        if (myField == null) return type;

        type.setAllowNull(myField.isNillable());

        String subType = myField.getType().value();
        type.setSubType(subType);

        return type;
    }

    private FieldType getField(List<FieldType> fields, String fieldName) {
        if (fields == null) return null;

        FieldType myField = null;
        for (FieldType field : fields) {
            if (fieldName.equalsIgnoreCase(buildFieldName(field.getName()))) {
                myField = field;
                break;
            }
        }

        return myField;
    }

    private String buildFieldName(String fname) {
        return fname.replaceAll("_", "");
    }

    public static boolean isPrimaryKey(String field, String serviceId) {
        if (!serviceId.equals(SF_SERVICE_NAME)) return false;

        if (field.equalsIgnoreCase(RECORD_ID))
            return true;
        else
            return false;
    }

    public static boolean skipElement(DataObject.Element et, String serviceId) {
        if (!serviceId.equals(SF_SERVICE_NAME)) return false;
        
        return (SalesforceSupport.isSystemMaintained(et.getName()) || SalesforceSupport.isOptional(et.getName()));
    }

    public boolean skipElement(String field, String serviceId) {
        if (!serviceId.equals(SF_SERVICE_NAME)) return false;

        return (SalesforceSupport.isSystemMaintained(field) || isReferenceType(field) || SalesforceSupport.isOptional(field));
    }

    private boolean isReferenceType(String field) {
        FieldType myField = getField(fields, field);

        if (myField != null && "reference".equals(myField.getType().value()))
            return true;
        else
            return false;
    }

    public static void setSessionHeader(SessionHeader hdr) {
        sessionHeader = hdr;    
    }

    //remove system maintained fields from servicedef.xml
    public static void modifyServiceDefinition(File serviceDefFile) {

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = factory.newDocumentBuilder();
            Document doc = docBuilder.parse(serviceDefFile);

            NodeList nodeList = doc.getElementsByTagName("element");

            for (int i=0; i<nodeList.getLength(); i++) {
                Node node = nodeList.item(i);
                String elemName = node.getAttributes().getNamedItem("name").getNodeValue();
                if (SalesforceSupport.isSystemMaintained(elemName) || SalesforceSupport.isOptional(elemName)) {
                    node.getParentNode().removeChild(node);
                    i--;
                }
            }

            TransformerFactory tFactory = TransformerFactory.newInstance();
			Transformer tFormer = tFactory.newTransformer();

            Source source = new DOMSource(doc);
            Result dest = new StreamResult(serviceDefFile);
            tFormer.transform(source, dest);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String getSubType(String fieldName) {
        String subType = "";
        if (fields != null) {
            for (FieldType field: fields) {
                if (fieldName.equalsIgnoreCase(field.getName())) {
                    subType = field.getType().value();
                    break;
                }
            }
        }
        
        return subType;
    }

    public static boolean isSalesForceMethod(DesignServiceManager dsm, String methodName)
        throws GenerationException {
        boolean found = false;

        try {
            File serviceDefXml = dsm.getServiceDefXml("salesforceService");
            Unmarshaller unmarshaller = dsm.getDefinitionsContext().createUnmarshaller();
            Service svc = (Service) unmarshaller.unmarshal(serviceDefXml);
            List<Operation> operations = svc.getOperation();

            Operation operation = null;
            for (Operation op : operations) {
                if (methodName.equals(op.getName())) {
                    found = true;
                    operation = op;
                    break;
                }
            }

            if (found) {
                List<Operation.Parameter> parameters = operation.getParameter();
                found = false;
                for (Operation.Parameter parm : parameters) {
                    if (parm.getTypeRef().contains("salesforceservice.SessionHeader") ||
                        parm.getTypeRef().contains("salesforceservice.Login") ||
                        parm.getTypeRef().contains("salesforceservice.Logout")) {
                        found = true;
                        break;
                    }
                }
            }
        } catch (JAXBException ex) {
            throw new GenerationException(ex);
        }

        return found;
    }
}