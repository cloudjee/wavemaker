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
 
package com.sforce;

import java.util.*;
import java.lang.reflect.Method;
import java.io.InputStream;

import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.json.JSONObject;
import com.wavemaker.runtime.service.LiveDataService;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.runtime.service.PropertyOptions;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.runtime.service.response.LiveDataServiceResponse;
import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.Input;
import com.wavemaker.runtime.data.QueryInfo;
import com.wavemaker.runtime.data.parser.HbmQueryParser;
import com.wavemaker.runtime.data.util.QueryRunner;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.ws.salesforce.SalesforceSupport;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.WMRuntimeException;
import com.sforce.services.LoginService;
import com.sforce.soap.enterprise.salesforceservice.*;

import org.apache.commons.io.IOUtils;

@SuppressWarnings("unchecked")
public class LiveDataServiceImpl_SF extends SalesforceQueries implements LiveDataService
{
    private DataServiceManager dsMgr;
    
    public Object insert(Object o) throws Exception {
        Create parameters = new Create();
        List<SObjectType> arg = new ArrayList<SObjectType>();
        SObjectType obj = (SObjectType)o;
        arg.add(obj);
        parameters.setSObjects(arg);

        obj.setId(null);

        SessionHeader sessionHeader = LoginService.getSessionHeader();

        CreateResponse response = create(parameters, sessionHeader, null, null, null, null, null, null, null, null);

        SaveResultType result = response.getResults().get(0);

        if (!result.isSuccess())
            throw new Exception("Error encountered: " + result.getErrors().get(0).getMessage());

        return obj;
    }

    public CreateResponse create(Create parameters,
								com.sforce.soap.enterprise.salesforceservice.SessionHeader sessionHeader,
								com.sforce.soap.enterprise.salesforceservice.AssignmentRuleHeader assignmentRuleHeader,
								com.sforce.soap.enterprise.salesforceservice.MruHeader mruHeader,
								com.sforce.soap.enterprise.salesforceservice.AllowFieldTruncationHeader allowFieldTruncationHeader,
								com.sforce.soap.enterprise.salesforceservice.DisableFeedTrackingHeader disableFeedTrackingHeader,
                                com.sforce.soap.enterprise.salesforceservice.AllOrNoneHeader allOrNoneHeader,
                                com.sforce.soap.enterprise.salesforceservice.DebuggingHeader debuggingHeader,
								com.sforce.soap.enterprise.salesforceservice.PackageVersionHeader packageVersionHeader,
								com.sforce.soap.enterprise.salesforceservice.EmailHeader emailHeader)
        throws Exception
    {
        return null;
    }

    public TypedServiceReturn read(TypeDefinition rootType, Object o, PropertyOptions propertyOptions, PagingOptions pagingOptions)
            throws Exception {

        String objType = SalesforceSupport.getSalesforceObjName(rootType.getShortName());

        Query parameters = new Query();
        String qry = getQueryString(objType);
        parameters.setQueryString(qry);

        QueryOptions qo = new QueryOptions();
        //qo.setBatchSize(20); //TODO: Batch size does not really work.  Maybe, need to count records instead.

        SessionHeader sessionHeader = LoginService.getSessionHeader();
        QueryResponse response = query(parameters, sessionHeader, qo, null, null);

        List<SObjectType> sobjs = response.getResult().getRecords();

        LiveDataServiceResponse rep = new LiveDataServiceResponse();

        rep.setResult(sobjs);

        TypedServiceReturn tsr = new TypedServiceReturn();
        tsr.setReturnValue(rep);

        return tsr;
    }

    public QueryResponse query(Query parameters, com.sforce.soap.enterprise.salesforceservice.SessionHeader sessionHeader, com.sforce.soap.enterprise.salesforceservice.QueryOptions queryOptions, com.sforce.soap.enterprise.salesforceservice.MruHeader mruHeader, com.sforce.soap.enterprise.salesforceservice.PackageVersionHeader packageVersionHeader)
        throws Exception
    {
       return null;
    }

    public Object update(Object o) throws Exception {
        Update parameters = new Update();
        List<SObjectType> arg = new ArrayList<SObjectType>();
        SObjectType obj = (SObjectType)o;

        SessionHeader sessionHeader = LoginService.getSessionHeader();

        obj = prepareObject(sessionHeader, "update", obj);

        arg.add(obj);
        parameters.setSObjects(arg);

        UpdateResponse response = update(parameters, sessionHeader, null, null, null, null, null, null, null, null);

        SaveResultType result = response.getResults().get(0);

        if (!result.isSuccess())
            throw new Exception("Error encountered: " + result.getErrors().get(0).getMessage());

        return obj;
    }



    public UpdateResponse update(Update parameters,
                                 com.sforce.soap.enterprise.salesforceservice.SessionHeader sessionHeader,
                                 com.sforce.soap.enterprise.salesforceservice.AssignmentRuleHeader assignmentRuleHeader,
                                 com.sforce.soap.enterprise.salesforceservice.MruHeader mruHeader,
                                 com.sforce.soap.enterprise.salesforceservice.AllowFieldTruncationHeader allowFieldTruncationHeader,
                                 com.sforce.soap.enterprise.salesforceservice.DisableFeedTrackingHeader disableFeedTrackingHeader,
                                 com.sforce.soap.enterprise.salesforceservice.AllOrNoneHeader allOrNoneHeader,
                                 com.sforce.soap.enterprise.salesforceservice.DebuggingHeader debuggingHeader,
                                 com.sforce.soap.enterprise.salesforceservice.PackageVersionHeader packageVersionHeader,
                                 com.sforce.soap.enterprise.salesforceservice.EmailHeader emailHeader)
        throws Exception
    {
        return null;
    }

    public void delete(Object o) throws Exception {
        Delete parameters = new Delete();
        List<String> arg = new ArrayList<String>();
        SObjectType obj = (SObjectType)o;
        arg.add(obj.getId());
        parameters.setIds(arg);

        SessionHeader sessionHeader = LoginService.getSessionHeader();
        DeleteResponse response = delete(parameters, sessionHeader, null, null, null, null, null, null, null);

        DeleteResultType result = response.getResults().get(0);

        if (!result.isSuccess())
            throw new Exception("Error encountered: " + result.getErrors().get(0).getMessage());

    }

    public DeleteResponse delete(Delete parameters,
                                 com.sforce.soap.enterprise.salesforceservice.SessionHeader sessionHeader,
                                 com.sforce.soap.enterprise.salesforceservice.PackageVersionHeader packageVersionHeader,
                                 UserTerritoryDeleteHeader userTerritoryDeleteHeader,
                                 com.sforce.soap.enterprise.salesforceservice.EmailHeader emailHeader,
                                 com.sforce.soap.enterprise.salesforceservice.AllowFieldTruncationHeader allowFieldTruncationHeader,
                                 com.sforce.soap.enterprise.salesforceservice.DisableFeedTrackingHeader disableFeedTrackingHeader,
                                 com.sforce.soap.enterprise.salesforceservice.AllOrNoneHeader allOrNoneHeader,
                                 com.sforce.soap.enterprise.salesforceservice.DebuggingHeader debuggingHeader)
        throws Exception
    {
        return null;
    }

    public DescribeSObjectResponse describeSObject(DescribeSObject parameters,
                                                   com.sforce.soap.enterprise.salesforceservice.SessionHeader sessionHeader,
                                                   com.sforce.soap.enterprise.salesforceservice.PackageVersionHeader packageVersionHeader,
                                                   com.sforce.soap.enterprise.salesforceservice.LocaleOptions localeOptions)
        throws Exception
    {
        return null;
    }

    @HideFromClient
    public void setDataServiceManager(DataServiceManager mgr) {
        this.dsMgr = mgr;
    }

    public Object runQuery(String dataModelName, String query, Input[] inputs,
            String values, Long maxResults) {

        QueryRunner queryRunner = new QueryRunner(dsMgr);

        if (inputs != null)
            setBindParameters(queryRunner, inputs, values, false);

        queryRunner.setMaxResults(maxResults);

        Object rtn = null;

        try {
            rtn = queryRunner.run(query, false);
        } catch (Throwable th) {
            throw DataServiceUtils.unwrap(th);
        } finally {
            queryRunner.dispose();
        }

        return rtn;
    }

    public Object runNamedQuery(String dataModelName, String queryName, Class cls, Object ... values) {

        QueryRunner queryRunner = new QueryRunner(dsMgr);

        String query = null;
        if (values != null) {
            query = setBindParameters(queryRunner, queryName, values); //xxx put back
        }

        List<JSONObject> result = null;

        try {
            result = (List<JSONObject>)queryRunner.run(query, true);
        } catch (Throwable th) {
            throw DataServiceUtils.unwrap(th);
        } finally {
            queryRunner.dispose();
        }

        return SalesforceSupport.convertToQueryReturnType(cls, result);
    }

    private SObjectType prepareObject(SessionHeader header, String action, SObjectType obj) throws Exception {
        Class cls = obj.getClass();
        String objType = SalesforceSupport.getSalesforceObjName(cls.getSimpleName());

        DescribeSObject parameters = new DescribeSObject();
        parameters.setSObjectType(objType);
        DescribeSObjectResponse dresponse = describeSObject(parameters, header, null, null);
        List<FieldType> fields = dresponse.getResult().getFields();

        for (FieldType field : fields) {
            if (field.getName().equals("Id")) continue;
            if ((!field.isUpdateable() && action.equals("update")) ||
                (!field.isCreateable() && action.equals("insert"))) {
                Method method = this.getMethod(cls, field);
                method.invoke(obj,  new Object[] {null});
            }
        }

        return obj;
    }

    private Method getMethod(Class clazz, FieldType field) throws Exception {
        FieldTypeType t = field.getType();
        Method method;
        String methodName = "set" + field.getName();

        if (t == FieldTypeType.DOUBLE) {
            try {
                method = clazz.getMethod(methodName, new Class<?>[]{Double.class});
            } catch (NoSuchMethodException ne) {
                method = clazz.getSuperclass().getMethod(methodName, new Class<?>[]{Double.class});
            }
        } else if (t == FieldTypeType.INT) {
            try {
                method = clazz.getMethod(methodName, new Class<?>[]{Integer.class});
            } catch (NoSuchMethodException ne) {
                method = clazz.getSuperclass().getMethod(methodName, new Class<?>[]{Integer.class});
            }
        } else if (t == FieldTypeType.BOOLEAN) {
            try {
                method = clazz.getMethod(methodName, new Class<?>[]{Boolean.class});
            } catch (NoSuchMethodException ne) {
                method = clazz.getSuperclass().getMethod(methodName, new Class<?>[]{Boolean.class});
            }
        } else if (t == FieldTypeType.DATETIME || t == FieldTypeType.DATE || t == FieldTypeType.TIME) {
            try {
                method = clazz.getMethod(methodName, new Class<?>[]{Date.class});
            } catch (NoSuchMethodException ne) {
                method = clazz.getSuperclass().getMethod(methodName, new Class<?>[]{Date.class});
            }
        } else if (t == FieldTypeType.BASE_64) {
            try {
                method = clazz.getMethod(methodName, new Class<?>[]{byte[].class});
            } catch (NoSuchMethodException ne) {
                method = clazz.getSuperclass().getMethod(methodName, new Class<?>[]{byte[].class});
            }
        } else {
            try {
                method = clazz.getMethod(methodName, new Class<?>[]{String.class});
            } catch (NoSuchMethodException ne) {
                method = clazz.getSuperclass().getMethod(methodName, new Class<?>[]{String.class});
            }
        }

        return method;
    }

    private String getQueryString(String objectType) throws Exception {
        String[] fields = getObjectFields(objectType);
        String expression = "select ";
        for (String field : fields) {
            expression = expression + field + ", ";
        }

        int len = expression.length();
        expression = expression.substring(0, len - 2);

        expression = expression + " from " + objectType;

        return expression;
    }

    private String[] getObjectFields(String objectType) throws Exception {
        DescribeSObject parameters = new DescribeSObject();
        parameters.setSObjectType(objectType);
        SessionHeader sessionHeader = LoginService.getSessionHeader();
        DescribeSObjectResponse response = describeSObject(parameters, sessionHeader, null, null);

        List<FieldType> fields = response.getResult().getFields();

        String[] rtn = new String[fields.size()];

        int i = 0;
        for (FieldType field : fields) {
            rtn[i] = field.getName();
            i++;
        }

        return rtn;
    }

    private void setBindParameters(QueryRunner queryRunner,
                                   Input[] inputs, String values,
                                   boolean includeNullValues)
    {
        List<String> names = new ArrayList<String>(inputs.length);
        List<String> types = new ArrayList<String>(inputs.length);
        List<Boolean> isList = new ArrayList<Boolean>(inputs.length);

        for (int i = 0; i < inputs.length; i++) {
            names.add(inputs[i].getParamName());
            types.add(inputs[i].getParamType());
            isList.add(inputs[i].getList());
        }

        if (includeNullValues || !ObjectUtils.isNullOrEmpty(values)) {
            queryRunner.addBindParameters(names, types, values, isList);
        }
    }

    private String setBindParameters(QueryRunner queryRunner,
                                   String queryName,
                                   Object... valueObjs)
    {
        String name = "com/sforce/queries/sforce-queries.xml";
        InputStream is = this.getClass().getClassLoader().getResourceAsStream(name);

        HbmQueryParser p;
        try {
            String s = IOUtils.toString(is);
            p = new HbmQueryParser(s);
            p.initAll();
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }

        QueryInfo qi = p.getQueries().get(queryName);

        Input[] inputs = qi.getInputs();

        List<String> names = null;
        List<String> types = null;
        List<Boolean> isList = null;
        StringBuffer sb = null;
        if (inputs != null && inputs.length > 0 && valueObjs != null && valueObjs.length > 0) {
            names = new ArrayList<String>(inputs.length);
            types = new ArrayList<String>(inputs.length);
            isList = new ArrayList<Boolean>(inputs.length);
            sb = new StringBuffer();

            for (int i = 0; i < inputs.length; i++) {
                names.add(inputs[i].getParamName());
                types.add(inputs[i].getParamType());
                isList.add(inputs[i].getList());
                if (inputs[i].getList()) {
                    List<Object> vals = (List<Object>)valueObjs[i];
                    sb = sb.append("[");
                    for (Object val : vals) {
                        sb.append(val.toString());
                        sb.append(", ");
                    }
                    sb.setLength(sb.length() - 2);
                    sb.append("], ");
                } else {
                    sb.append(valueObjs[i].toString());
                    sb.append(", ");
                }
            }
            sb.setLength(sb.length() - 2);
            queryRunner.addBindParameters(names, types, sb.toString(), isList);
        }

        return qi.getQuery();
    }
}
