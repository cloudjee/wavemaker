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
package com.wavemaker.tools.ws.salesforce;

import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.ws.salesforce.SalesforceSupport;
import com.wavemaker.runtime.ws.salesforce.gen.*;
import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.service.definitions.Operation;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.json.type.OperationEnumeration;
import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.Source;
import javax.xml.transform.Result;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.dom.DOMSource;
import javax.xml.bind.Unmarshaller;
import javax.xml.bind.JAXBException;
import java.util.*;
import java.io.*;

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

    private static final String[] SYSTEM_OBJECTS =
    {
            "AllOrNoneHeader",
            "AllowFieldTruncationHeader",
            "ApexClassType",
            "ApexComponentType",
            "ApexLogType",
            "ApexPageType",
            "ApexTriggerType",
            "ApiFaultType",
            "ApiQueryFaultType",
            "AsyncApexJobType",
            "ChildRelationshipType",
            "Create",
            "CreateResponse",
            "CronTriggerType",
            "DebuggingHeader",
            "DebuggingInfo",
            "Delete",
            "DeleteResponse",
            "DeleteResultType",
            "DeletedRecordType",
            "DescribeDataCategoryGroupResultType",
            "DescribeDataCategoryGroupStructureResultType",
            "DescribeDataCategoryGroupStructures",
            "DataCategoryGroupSobjectTypePairType",
            "DescribeDataCategoryGroupStructuresResponse",
            "DescribeDataCategoryGroups",
            "DescribeDataCategoryGroupsResponse",
            "DescribeGlobal",
            "DescribeGlobalResponse",
            "DescribeGlobalResultType",
            "DescribeGlobalSObjectResultType",
            "DescribeLayout",
            "DescribeLayoutButtonSectionType",
            "DescribeLayoutButtonType",
            "DescribeLayoutComponentType",
            "DescribeLayoutItemType",
            "DescribeLayoutResponse",
            "DescribeLayoutResultType",
            "DescribeLayoutRowType",
            "DescribeLayoutSectionType",
            "DescribeLayoutType",
            "DescribeSObject",
            "DescribeSObjectResponse",
            "DescribeSObjectResultType",
            "DescribeSObjects",
            "DescribeSObjectsResponse",
            "DescribeSoftphoneLayout",
            "DescribeSoftphoneLayoutCallTypeType",
            "DescribeSoftphoneLayoutInfoFieldType",
            "DescribeSoftphoneLayoutItemType",
            "DescribeSoftphoneLayoutResponse",
            "DescribeSoftphoneLayoutResultType",
            "DescribeSoftphoneLayoutSectionType",
            "DescribeSoftphoneScreenPopOptionType",
            "DescribeTabSetResultType",
            "DescribeTabType",
            "DescribeTabs",
            "DescribeTabsResponse",
            "DisableFeedTrackingHeader",
            "ErrorType",
            "FieldType",
            "GetDeleted",
            "GetDeletedResponse",
            "GetDeletedResultType",
            "GetServerTimestamp",
            "GetServerTimestampResponse",
            "GetServerTimestampResultType",
            "GetUpdated",
            "GetUpdatedResponse",
            "GetUpdatedResultType",
            "GetUserInfo",
            "GetUserInfoResponse",
            "GetUserInfoResultType",
            "InvalidFieldFault",
            "InvalidIdFault",
            "InvalidNewPasswordFault",
            "InvalidQueryLocatorFault",
            "InvalidSObjectFault",
            "InvalidateSessions",
            "InvalidateSessionsResponse",
            "InvalidateSessionsResultType",
            "Login",
            "LoginFault",
            "LoginResponse",
            "LoginResultType",
            "LoginScopeHeader",
            "Logout",
            "LogoutResponse",
            "MalformedQueryFault",
            "MalformedSearchFault",
            "MassEmailMessageType",
            "Merge",
            "MergeRequestType",
            "MergeResponse",
            "MergeResultType",
            "MruHeader",
            "QueryAll",
            "QueryAllResponse",
            "QueryMore",
            "QueryMoreResponse",
            "QueryOptions",
            "QueryResponse",
            "QueryResultType",
            "QueueSobjectType",
            "RecordTypeInfoType",
            "RecordTypeMappingType",
            "RecordTypeType",
            "RelatedListColumnType",
            "RelatedListSortType",
            "RelatedListType",
            "ReportFeedType",
            "ReportType",
            "ResetPassword",
            "ResetPasswordResponse",
            "ResetPasswordResultType",
            "Retrieve",
            "RetrieveResponse",
            "SObjectType",
            "SaveResultType",
            "ScontrolType",
            "Search",
            "SearchRecordType",
            "SearchResponse",
            "SearchResultType",
            "SendEmail",
            "SendEmailErrorType",
            "SendEmailResultType",
            "SessionHeader",
            "SetPassword",
            "SetPasswordResponse",
            "SetPasswordResultType",
            "SingleEmailMessageType",
            "Undelete",
            "UndeleteResponse",
            "UndeleteResultType",
            "UnexpectedErrorFault",
            "Update",
            "UpdateResponse",
            "Upsert",
            "UpsertResponse",
            "UpsertResultType",
            "UserTerritoryDeleteHeader",
            "PagingOptions"
    };

    private static List<OperationEnumeration> NO_CHANGE_OPERATIONS =
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
    }

    private static SessionHeader sessionHeader = null;
    private List<FieldType> fields = null;

    public SalesforceHelper(String objName, String serviceId, String username, String password)
            throws Exception {

        if (!serviceId.equals(CommonConstants.SALESFORCE_SERVICE)) return;

        SforceService service = (SforceService) RuntimeAccess.getInstance().getSpringBean(
            "sfServiceBean");

        if (sessionHeader == null) {
            //String userId = "community@wavemaker.com";
            //String passWord = "WMsurf!ng";
            //String userId = "sammysm@wavemaker.com";
            //String passWord = "Silver77Surfer";
            Login parameters = new Login();
            parameters.setUsername(username);
            parameters.setPassword(password);
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
   
    public ElementType setElementTypeProperties(ElementType type, String serviceId) {
        if (!serviceId.equals(CommonConstants.SALESFORCE_SERVICE) || fields == null || fields.size() == 0) return type;

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
        if (!serviceId.equals(CommonConstants.SALESFORCE_SERVICE)) return false;

        if (field.equalsIgnoreCase(RECORD_ID))
            return true;
        else
            return false;
    }

    public static boolean skipElement(DataObject.Element et, String serviceId) {
        if (!serviceId.equals(CommonConstants.SALESFORCE_SERVICE)) return false;
        
        return (SalesforceSupport.isSystemMaintained(et.getName()) || SalesforceSupport.isOptional(et.getName()));
    }

    public boolean skipElement(String field, String serviceId) {
        if (!serviceId.equals(CommonConstants.SALESFORCE_SERVICE)) return false;

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
            File serviceDefXml = dsm.getServiceDefXml(CommonConstants.SALESFORCE_SERVICE);
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

    public static void setupSalesforceSrc(ProjectManager mgr, String username, String password,
                                          DesignServiceManager svcMgr) {
        File destf;
        try {
            File srcf = new File(mgr.getStudioConfiguration().getStudioWebAppRootFile(),
                    "app/templates/salesforce");

            //File destf = new File(mgr.getCurrentProject().getProjectRoot(), "services");
            destf = mgr.getCurrentProject().getProjectRoot();

            IOUtils.copy(srcf, destf);
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new WMRuntimeException(e);
        }

        Properties p = new Properties();
        p.put(DataServiceConstants.DB_USERNAME.substring(1), username);
        p.put(DataServiceConstants.DB_PASS.substring(1), password);

        p = DataServiceUtils.addServiceName(p, CommonConstants.SALESFORCE_SERVICE);
        File destdir = new File(destf.getAbsolutePath() + "/services/" + CommonConstants.SALESFORCE_SERVICE + "/src");

        DataServiceUtils.writeProperties(p, destdir, CommonConstants.SALESFORCE_SERVICE);
    }

    public static boolean isSystemObject(String objectShortName) {
        for (String obj : SYSTEM_OBJECTS) {
            if (obj.equals(objectShortName)) return true;
        }

        return false;       
    }
}