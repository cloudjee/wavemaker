/*
 * Copyright (C) 2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.runtime.ws.salesforce;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.apache.commons.collections.map.MultiValueMap;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.CastUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.common.util.TypeConversionUtils;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONObject;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.data.util.QueryHandler;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.runtime.ws.salesforce.gen.DescribeGlobal;
import com.wavemaker.runtime.ws.salesforce.gen.DescribeGlobalResponse;
import com.wavemaker.runtime.ws.salesforce.gen.DescribeGlobalSObjectResultType;
import com.wavemaker.runtime.ws.salesforce.gen.DescribeSObject;
import com.wavemaker.runtime.ws.salesforce.gen.DescribeSObjectResponse;
import com.wavemaker.runtime.ws.salesforce.gen.FieldType;
import com.wavemaker.runtime.ws.salesforce.gen.PicklistEntryType;
import com.wavemaker.runtime.ws.salesforce.gen.QueryResultType;
import com.wavemaker.runtime.ws.salesforce.gen.SObjectType;
import com.wavemaker.runtime.ws.salesforce.gen.SessionHeader;
import com.wavemaker.runtime.ws.salesforce.gen.SforceService;

/**
 * Helper class for Salesforce.
 * 
 * @author slee
 */
public class SalesforceSupport {

    private static final String[] SYS_MAINT_FIELDS = { "CreatedBy", "CreatedById", "CreatedDate", "LastModifiedBy", "LastModifiedById",
        "LastModifiedDate", "SystemModstamp", "IsDeleted", "FieldsToNulls" };

    private static final String[] OPTIONAL_FIELDS = { "ActivityHistories", "Attachments", "Events", "FeedSubscriptionsForEntity", "Histories",
        "LastActivityDate", "Notes", "NotesAndAttachments", "OpenActivities", "Owner", "OwnerId", "ProcessInstances", "ProcessSteps", "Tasks" };

    private Map<String, List<FieldType>> fieldsMap = null;

    private final LoginService loginSvcBean = (LoginService) RuntimeAccess.getInstance().getSpringBean("sfLoginService");

    private int lastQryId = 0;

    private final Map<Integer, SingleQuery> queryMap = new TreeMap<Integer, SingleQuery>(); // id, single query obj

    private final MultiValueMap parentQueryMap = new MultiValueMap(); // parent id, single query obj

    private MultiValueMap resultRows; // key = row (List<Object>), value = Object(Rec ID + SObject)

    private Map<List<Object>, JSONObject> resultJsonObjs;

    Long recId;

    public JSONObject getPickLists(String objClassName, JSONObject fieldAndValuePairs) throws Exception {
        JSONObject carrier = new JSONObject();
        String objName = getSalesforceObjName(objClassName);

        Set<Map.Entry<String, Object>> entries = fieldAndValuePairs.entrySet();

        for (Map.Entry e : entries) {
            String fieldName = (String) e.getKey();
            if (carrier.containsKey(fieldName)) {
                continue;
            }

            FieldType field = getField(objName, fieldName);

            // for boolean, we don't need to get the pick list. boolean is only needed as controller.
            if (field.getType().value().equals("boolean")) {
                continue;
            }

            JSONObject result = getPickList(objName, field, fieldAndValuePairs, carrier);
            carrier.put(fieldName, result);
        }

        return carrier;
    }

    public JSONObject getPickList(String objName, FieldType currentField, JSONObject fieldAndValuePairs, JSONObject carrier) throws Exception {

        List<FieldType> fields = getFields(objName);

        Map<String, FieldType> fieldMap = new HashMap<String, FieldType>();

        for (FieldType fld : fields) {
            fieldMap.put(fld.getName(), fld);
        }

        List<FieldType> controlPath = getControlPath(currentField, fieldMap, null);

        // if no controller fields are found, get the pick list for the current field and return.
        if (controlPath == null) {
            List<PicklistEntryType> picklistValues = currentField.getPicklistValues();
            if (picklistValues != null && picklistValues.size() > 0) {
                return prepareJSONObject(picklistValues, fieldAndValuePairs, currentField);
            } else {
                return null;
            }
        }

        Collections.reverse(controlPath);

        if (carrier == null) {
            carrier = new JSONObject();
        }

        JSONObject plist = null;
        for (int i = 0; i < controlPath.size(); i++) {
            FieldType fld = controlPath.get(i);

            if (fld.getType().value().equals("boolean")) {
                continue;
            }
            if (carrier.containsKey(downShiftFirstChar(fld.getName()))) {
                continue;
            }

            FieldType controller;

            // the first field does not have any controller
            controller = i == 0 ? null : controlPath.get(i - 1);
            plist = getRestrictedPickList(objName, fld, controller, fieldAndValuePairs);

            // do not add the last entry to carrier bcz it will be added in the caller (getPiclLists)
            if (i < controlPath.size() - 1) {
                carrier.put(downShiftFirstChar(currentField.getName()), plist);
            }
        }

        return plist;
    }

    private void setupFields(String objName) throws Exception {
        DescribeSObject parameters = new DescribeSObject();
        parameters.setSObjectType(getSalesforceObjName(objName));
        this.loginSvcBean.logIn("sammysm@wavemaker.com", "Silver77Surfer");
        SessionHeader sessionHeader = LoginService.getSessionHeader();
        SforceService service = LoginService.getSforceService();

        DescribeSObjectResponse dresponse = service.describeSObject(parameters, sessionHeader, null, null, null);
        List<FieldType> flds = dresponse.getResult().getFields();
        List<FieldType> fields = null;

        if (flds != null && flds.size() > 0) {
            fields = new ArrayList<FieldType>();
            for (FieldType fld : flds) {
                if (isSystemMaintained(fld.getName()) || isOptional(fld.getName())) {
                    continue;
                }
                fields.add(fld);
            }
        }

        if (this.fieldsMap == null) {
            this.fieldsMap = new HashMap<String, List<FieldType>>();
        }
        this.fieldsMap.put(objName, fields);
    }

    private List<FieldType> getFields(String objName) throws Exception {
        List<FieldType> fields;
        if (this.fieldsMap == null) {
            setupFields(objName);
            fields = this.fieldsMap.get(objName);
        } else {
            fields = this.fieldsMap.get(objName);
            if (fields == null) {
                setupFields(objName);
                fields = this.fieldsMap.get(objName);
            }
        }

        return fields;
    }

    public static String getSalesforceObjName(String className) {
        String name = className;
        int pos = name.lastIndexOf(".");
        if (pos > 0) {
            name = name.substring(pos + 1);
        }

        pos = name.lastIndexOf("Type");
        if (pos > 0) {
            name = name.substring(0, pos);
            if (name.substring(pos - 1).equals("C")) { // custom object
                name = name.substring(0, pos - 1) + "__c";
            }
        }

        return name;
    }

    public List<List<Object>> runQuery(Map<String, Class<?>> types, Object... input) {

        executeQuery(types, "executeSforceQueryFromEditor", input);

        List<List<Object>> rtn = new ArrayList<List<Object>>();
        TreeMap<Long, List<Object>> tmap = new TreeMap<Long, List<Object>>();
        Set<Map.Entry<List<Object>, List<Tuple.Two<Long, Object>>>> entries = CastUtils.cast(this.resultRows.entrySet());
        for (Map.Entry<List<Object>, List<Tuple.Two<Long, Object>>> entry : entries) {
            List<Tuple.Two<Long, Object>> list = entry.getValue();
            tmap.put(list.get(0).v1, entry.getKey());
        }

        Set<Map.Entry<Long, List<Object>>> tmapEntries = tmap.entrySet();
        for (Map.Entry<Long, List<Object>> entry : tmapEntries) {
            rtn.add(entry.getValue());
        }

        return rtn;
    }

    public List<JSONObject> runNamedQuery(Map<String, Class<?>> types, Object... input) {

        executeQuery(types, "executeSforceQuery", input);

        List<JSONObject> rtn = new ArrayList<JSONObject>();
        TreeMap<Long, List<Object>> tmap = new TreeMap<Long, List<Object>>();
        Set<Map.Entry<List<Object>, List<Tuple.Two<Long, Object>>>> entries = CastUtils.cast(this.resultRows.entrySet());
        for (Map.Entry<List<Object>, List<Tuple.Two<Long, Object>>> entry : entries) {
            List<Tuple.Two<Long, Object>> list = entry.getValue();
            tmap.put(list.get(0).v1, entry.getKey());
        }

        Set<Map.Entry<Long, List<Object>>> tmapEntries = tmap.entrySet();
        for (Map.Entry<Long, List<Object>> entry : tmapEntries) {
            rtn.add(this.resultJsonObjs.get(entry.getValue()));
        }

        return rtn;
    }

    private void executeQuery(Map<String, Class<?>> types, String merhodName, Object... input) {

        try {
            String qry = buildQueryString(types, input);

            this.lastQryId = 0;

            splitQueries(0, qry, 0);

            int len = input.length;
            PagingOptions po = (PagingOptions) input[len - 1];
            Long psize = po.getMaxResults();
            long firstrec = po.getFirstResult();

            Class cls;
            List<SObjectType> sobjs;
            try {
                cls = Class.forName("com.sforce.SalesforceCalls");
                Object obj = cls.newInstance();
                // String mn = "executeSforceQuery";
                Method method = cls.getMethod(merhodName, new Class[] { java.lang.String.class, java.util.Map.class, java.lang.Object[].class });
                Object[] args = { qry, types, input };
                sobjs = (List<SObjectType>) method.invoke(obj, args);
            } catch (Exception e) {
                e.printStackTrace();
                return;
            }

            long lastrec;
            if (psize != null) {
                lastrec = psize > sobjs.size() - firstrec ? sobjs.size() : psize + firstrec;
            } else {
                lastrec = sobjs.size();
            }

            List<Object> row;
            JSONObject jsonVal;
            this.resultRows = new MultiValueMap();
            this.resultJsonObjs = new HashMap<List<Object>, JSONObject>();
            // resultRowJsonObjMap = new HashMap();

            this.recId = 0L;

            for (long k = firstrec; k < lastrec; k++) {
                int ik = new Long(k).intValue();
                Object sobj = sobjs.get(ik);

                SingleQuery sq = this.queryMap.get(1);
                sq.thisObjects.add(sobj);
                // row = getFieldValues(sq, sobj);
                Tuple.Two<List<Object>, JSONObject> tval = getFieldValues(sq, sobj);
                row = tval.v1;
                jsonVal = tval.v2;
                this.recId++;
                Tuple.Two<Long, Object> t = new Tuple.Two<Long, Object>(this.recId, sobj);
                this.resultRows.put(row, t);
                this.resultJsonObjs.put(row, jsonVal);
                setRowsForSubQueries(sq, sobj);
            }
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }

    }

    // pobj: the parent object
    // psq: the parent query object
    private void setRowsForSubQueries(SingleQuery psq, Object pobj) throws Exception {
        List<SingleQuery> subQueries = getSubqueries(psq);

        if (subQueries != null && subQueries.size() > 0) {
            for (SingleQuery subq : subQueries) {
                setQueryResult(subq, pobj); // set rows and thisObjects
            }

            setSiblingQueryResult(pobj, subQueries); // modify rows based on rows of the parent and other siblings

            for (SingleQuery subq : subQueries) {
                for (Object obj : subq.thisObjects) {
                    setRowsForSubQueries(subq, obj);
                }
            }
        }
    }

    private List<List<Object>> getRowsForSforceObject(Object obj) {
        List<List<Object>> rtn = new ArrayList<List<Object>>();
        Set<Map.Entry<List<Object>, List<Tuple.Two<Long, Object>>>> entries = CastUtils.cast(this.resultRows.entrySet());
        for (Map.Entry<List<Object>, List<Tuple.Two<Long, Object>>> entry : entries) {
            List<Tuple.Two<Long, Object>> list = entry.getValue();
            for (Tuple.Two<Long, Object> elem : list) {
                if (obj.equals(elem.v2)) {
                    rtn.add(entry.getKey());
                    break;
                }
            }
        }

        return rtn;
    }

    private void setSiblingQueryResult(Object pobj, List<SingleQuery> siblings) {

        List<List<Object>> parentRows = getRowsForSforceObject(pobj);

        List<List<Object>> temprows = new ArrayList<List<Object>>();

        for (List<Object> parentRow : parentRows) {
            List<List<Object>> rowsArray = new ArrayList<List<Object>>();

            List<Object> temprow = new ArrayList<Object>();
            for (Object val : parentRow) {
                temprow.add(val);
            }

            temprows.add(temprow);

            int startIndx = 0, indx = 0;

            for (SingleQuery qry : siblings) {
                startIndx = indx;
                int cfp = getCumFieldPosition(qry, siblings, 0);
                for (List<Object> trow : temprows) {

                    // Don't we need to get rows only for specific object??
                    // List<List<Object>> subqRows = qry.rows.get(pobj);
                    List<Tuple.Two<List<Object>, JSONObject>> subqRows = qry.rows.get(pobj);
                    if (subqRows != null) {
                        for (Tuple.Two<List<Object>, JSONObject> subqRow : subqRows) {
                            List<Object> rec = new ArrayList<Object>();
                            for (Object ival : trow) {
                                rec.add(ival);
                            }
                            for (Object val : subqRow.v1) {
                                rec.add(cfp, val);
                            }
                            rowsArray.add(rec);
                            indx++;
                            Collection<Object> objs = CastUtils.cast(this.resultRows.getCollection(trow));
                            this.recId++;
                            for (Object obj : objs) {
                                // recId++;
                                Tuple.Two<Long, Object> t = new Tuple.Two<Long, Object>(this.recId, obj);
                                this.resultRows.put(rec, t);
                                this.resultJsonObjs.put(rec, subqRow.v2);
                            }

                            // recId++;
                            Tuple.Two<Long, Object> t = new Tuple.Two<Long, Object>(this.recId, qry.rowObject.get(subqRow));
                            this.resultRows.put(rec, t);
                            this.resultJsonObjs.put(rec, subqRow.v2);
                        }
                        this.resultRows.remove(trow);
                        this.resultJsonObjs.remove(trow);
                    }
                }
                temprows = new ArrayList<List<Object>>();
                for (int i = startIndx; i < indx; i++) {
                    temprows.add(rowsArray.get(i));
                }
            }
        }
    }

    // Get all parent position and add them up
    private int getCumFieldPosition(SingleQuery sq, List<SingleQuery> siblings, int pos) {
        pos = traverseParentFieldPosition(sq, pos);

        // once the cum position is calculated for all parents, calculate the cum position for all preceding siblings.
        for (SingleQuery qry : siblings) {
            if (qry.equals(sq)) {
                break;
            }
            pos = pos + qry.fieldList.size() - 1;
        }

        return pos;
    }

    private int traverseParentFieldPosition(SingleQuery sq, int pos) {
        pos = pos + sq.fieldPosition;
        SingleQuery psq = this.queryMap.get(sq.parentQryId);
        if (psq != null) {
            pos = traverseParentFieldPosition(psq, pos);
        }

        return pos;
    }

    private void setQueryResult(SingleQuery sq, Object pobj) throws Exception {

        SingleQuery parentsq = this.queryMap.get(sq.parentQryId);
        Class cls = getSforceObjectClass(parentsq.objectName);

        String myObjName = getAPISforceObjectShortName(sq.objectName);
        String methodName = "get" + myObjName.substring(0, 1).toUpperCase() + myObjName.substring(1);
        Method method = cls.getMethod(methodName, new Class[] {});
        QueryResultType qryResult = (QueryResultType) method.invoke(pobj, new Object[] {});
        if (qryResult != null) {
            List<SObjectType> rsobjs = qryResult.getRecords();

            // List<List<Object>> rows = new ArrayList<List<Object>>();
            List<Tuple.Two<List<Object>, JSONObject>> rows = new ArrayList<Tuple.Two<List<Object>, JSONObject>>();
            for (SObjectType rsobj : rsobjs) {
                sq.thisObjects.add(rsobj);
                Tuple.Two<List<Object>, JSONObject> tval = getFieldValues(sq, rsobj);
                // rows.add(getFieldValues(sq, rsobj));
                rows.add(tval);
            }
            sq.rows.put(pobj, rows);
        }
    }

    private List<SingleQuery> getSubqueries(SingleQuery sq) {
        List list = (List) this.parentQueryMap.get(sq.qryId);
        return CastUtils.cast(list);
    }

    private String getSforceAPIObjectName(String objName) {

        int indx = objName.lastIndexOf(".");
        if (indx > 0) {
            objName = objName.substring(indx + 1);
        }

        objName = objName.replace("__c", "C");
        objName = objName.replace("__r", "R");

        // FeedTrackedChanges and FeedComments are exceptions
        if (objName.equals("FeedTrackedChanges")) {
            objName = "FeedTrackedChange";
        } else if (objName.equals("FeedComments")) {
            objName = "FeedComment";
        }

        return objName;
    }

    /*
     * private String getSforceObjectClassname(String objName) { objName = getSforceAPIObjectName(objName);
     * 
     * return "com.sforce.soap.enterprise.salesforceservice." + objName + "Type"; }
     */

    private Class getSforceObjectClass(String objName) throws Exception {
        String apiObjName = getSforceAPIObjectName(objName);
        Class cls;

        String className = "com.sforce.soap.enterprise.salesforceservice." + apiObjName + "Type";

        try {
            cls = Class.forName(className);
        } catch (ClassNotFoundException ex) {
            this.loginSvcBean.logIn("sammysm@wavemaker.com", "Silver77Surfer");
            SessionHeader sessionHeader = LoginService.getSessionHeader();
            SforceService service = LoginService.getSforceService();
            DescribeGlobal parameters = new DescribeGlobal();
            DescribeGlobalResponse dresponse = service.describeGlobal(parameters, sessionHeader, null, null);
            List<DescribeGlobalSObjectResultType> sObjects = dresponse.getResult().getSobjects();

            boolean found = false;
            /*
             * int len = objName.length(); if (len > 3 && (objName.substring(len-3).equalsIgnoreCase("__c") ||
             * objName.substring(len-3).equalsIgnoreCase("__r"))) { objName = objName.substring(0, len-3); }
             */
            objName = getAPISforceObjectShortName(objName);

            for (DescribeGlobalSObjectResultType obj : sObjects) {
                if (objName.equals(obj.getLabelPlural())) {
                    found = true;
                    // apiObjName = obj.getName();
                    apiObjName = getAPISforceObjectShortName(obj.getName());
                    /*
                     * if (len > 3 && (apiObjName.substring(len-3).equalsIgnoreCase("__c") ||
                     * apiObjName.substring(len-3).equalsIgnoreCase("__r"))) { apiObjName = apiObjName.substring(0,
                     * len-3); }
                     */
                }
            }

            if (!found) {
                throw new ClassNotFoundException();
            }

            /*
             * len = apiObjName.length(); if (len > 3 && (apiObjName.substring(len-3).equalsIgnoreCase("__c"))) {
             * apiObjName = apiObjName.substring(0, len-3) + "C"; }
             */

            className = "com.sforce.soap.enterprise.salesforceservice." + apiObjName + "Type";

            cls = Class.forName(className);
        }

        return cls;
    }

    // private List<Object> getFieldValues(SingleQuery sq, Object sobj) throws Exception {
    private Tuple.Two<List<Object>, JSONObject> getFieldValues(SingleQuery sq, Object sobj) throws Exception {
        Class cls = getSforceObjectClass(sq.objectName);
        List<Object> values = new ArrayList<Object>();
        JSONObject jsonValues = new JSONObject();
        for (String fld : sq.fieldList) {
            String apifld = getAPIFieldName(fld);
            String methodName = "get" + apifld.substring(0, 1).toUpperCase() + apifld.substring(1);
            Method method = cls.getMethod(methodName, new Class[] {});
            Object val = method.invoke(sobj, new Object[] {});
            if (val != null) {
                values.add(val.toString());
                jsonValues.put(fld, val);
            } else {
                values.add(null);
                jsonValues.put(fld, null);
            }
        }

        if (sq.relFieldList != null && sq.relFieldList.size() > 0) {
            Set<Map.Entry<String, List<String>>> entries = sq.relFieldList.entrySet();
            for (Map.Entry<String, List<String>> fldEntry : entries) {
                String objName = getAPISforceObjectShortName(fldEntry.getKey());
                String methodName = "get" + objName.substring(0, 1).toUpperCase() + objName.substring(1);
                Method method = cls.getMethod(methodName, new Class[] {});
                Object obj = method.invoke(sobj, new Object[] {});

                List<String> fldList = fldEntry.getValue();
                if (obj != null) {
                    Class subcls = obj.getClass();
                    for (String fld : fldList) {
                        String apifld = getAPIFieldName(fld);
                        methodName = "get" + apifld.substring(0, 1).toUpperCase() + apifld.substring(1);
                        method = subcls.getMethod(methodName, new Class[] {});
                        Object val = method.invoke(obj, new Object[] {});
                        if (val != null) {
                            values.add(val.toString());
                            jsonValues.put(fld, val);
                        } else {
                            values.add(null);
                            jsonValues.put(fld, val);
                        }
                    }
                } else { // Even though obj is null, we need to add null
                    for (String fld : fldList) {
                        values.add(null);
                        jsonValues.put(fld, null);
                    }
                }
            }
        }

        sq.rowObject.put(values, sobj);

        Tuple.Two<List<Object>, JSONObject> rtn = new Tuple.Two<List<Object>, JSONObject>(values, jsonValues);

        // return values;
        return rtn;
    }

    private void splitQueries(int parentId, String qry, int pfnum) {

        Tuple.Two<Integer, List<Tuple.Two<String, Integer>>> iqueries = getInitSubQueries(parentId, qry, pfnum);

        int pid = iqueries.v1;
        List<Tuple.Two<String, Integer>> subqueries = iqueries.v2;

        for (Tuple.Two<String, Integer> subqry : subqueries) {
            splitQueries(pid, subqry.v1, subqry.v2); // recursive call
        }
    }

    private Tuple.Two<Integer, List<Tuple.Two<String, Integer>>> getInitSubQueries(int parentId, String qry, int pfnum) {
        List<String> words = QueryHandler.parseSQL(qry);
        List<Tuple.Two<String, Integer>> qryList = new ArrayList<Tuple.Two<String, Integer>>();
        List<String> fieldList = new ArrayList<String>();
        MultiValueMap relFieldList = new MultiValueMap();
        this.lastQryId = this.lastQryId + 1;
        String objName = null;
        int depth = 0;
        int remainingOpens = 0;
        int counter = 0;
        int qryStartPos = 0;
        boolean inSubQuery = false;
        boolean inFrom = false;
        StringBuffer subQry = new StringBuffer();

        for (String word : words) {
            if (word.equalsIgnoreCase("select")) {
                if (!inSubQuery) {
                    if (depth == 0) {
                        depth++;
                    } else { // select statement of a subquery
                        qryStartPos = counter;
                        subQry.append(word);
                        subQry.append(" ");
                        inSubQuery = true;
                    }
                }
            } else if (word.equals(")")) {
                if (inSubQuery) {
                    if (remainingOpens == 0) {
                        Tuple.Two<String, Integer> elem = new Tuple.Two<String, Integer>(subQry.toString(), qryStartPos);
                        qryList.add(elem);
                        counter++;
                        subQry.setLength(0);
                        inSubQuery = false;
                    } else {
                        remainingOpens--;
                    }
                }
            } else if (word.equals("(")) {
                if (inSubQuery) {
                    remainingOpens++;
                }
            } else if (word.equalsIgnoreCase("from")) {
                if (!inSubQuery) {
                    inFrom = true;
                } else {
                    subQry.append(word);
                    subQry.append(" ");
                }
            } else {
                if (inSubQuery) {
                    subQry.append(word);
                    subQry.append(" ");
                } else {
                    if (!QueryHandler.isDelimiter(word)) {
                        if (inFrom) {
                            objName = word;
                            inFrom = false;
                            break;
                        } else {
                            int indx = word.indexOf(".");
                            if (indx < 0) {
                                fieldList.add(word);
                            } else {
                                relFieldList.put(word.substring(0, indx), word.substring(indx + 1));
                            }
                            counter++;
                        }
                    }
                }
            }
        }

        SingleQuery sq = new SingleQuery(this.lastQryId, parentId, objName, fieldList, relFieldList, pfnum);
        this.queryMap.put(this.lastQryId, sq);
        this.parentQueryMap.put(parentId, sq);

        Tuple.Two<Integer, List<Tuple.Two<String, Integer>>> rtn = new Tuple.Two<Integer, List<Tuple.Two<String, Integer>>>(this.lastQryId, qryList);

        return rtn;
    }

    class SingleQuery {

        int parentQryId;

        int qryId;

        String objectName;

        MultiValueMap relFieldList; // parent object name, field name

        List<String> fieldList;

        List<Object> thisObjects = new ArrayList<Object>();

        // Map<Object, List<List<Object>>> rows = new HashMap<Object, List<List<Object>>>();
        Map<Object, List<Tuple.Two<List<Object>, JSONObject>>> rows = new HashMap<Object, List<Tuple.Two<List<Object>, JSONObject>>>();

        Map<List<Object>, Object> rowObject = new HashMap<List<Object>, Object>();

        int fieldPosition; // position of this subquery in the immediate parent field list

        private SingleQuery(int qid, int pqid, String objname, List<String> fldlist, MultiValueMap relfldlist, int pfnum) {
            this.qryId = qid;
            this.parentQryId = pqid;
            this.objectName = objname;
            this.relFieldList = relfldlist;
            this.fieldList = fldlist;
            this.fieldPosition = pfnum;
        }

        public List<String> getQueryFields() {
            List<String> rtn = new ArrayList<String>();
            for (String fld : this.fieldList) {
                rtn.add(fld);
            }

            Set<Map.Entry<String, List<String>>> entries = this.relFieldList.entrySet();
            for (Map.Entry<String, List<String>> entry : entries) {
                List<String> relflds = entry.getValue();
                for (String fld : relflds) {
                    rtn.add(fld);
                }
            }

            return rtn;
        }
    }

    public static String getAPIFieldName(String fieldName) {
        String rtn = fieldName.replace("__c", "C");
        rtn = rtn.replace("__C", "C");
        return rtn;
    }

    public static String getAPISforceObjectShortName(String objName) {
        int indx = objName.lastIndexOf(".");
        if (indx > 0) {
            objName = objName.substring(indx + 1);
        }

        objName = objName.replace("__c", "C");
        objName = objName.replace("__r", "R");
        objName = objName.replace("__C", "C");
        objName = objName.replace("__R", "R");
        return objName;
    }

    public static String buildQueryString(Map<String, Class<?>> types, Object... input) {
        PagingOptions po = (PagingOptions) input[input.length - 1];

        Long firstResult = po.getFirstResult();
        Long maxResult = po.getMaxResults();
        if (maxResult != null) {
            maxResult = maxResult - 1L;
            if (maxResult < 0L) {
                maxResult = 0L;
            }
        }
        List<String> orderBys = po.getOrderBy();

        String qry = (String) input[0];
        if (input.length > 2) {
            boolean isField = true;
            String field = null;
            for (int i = 1; i < input.length - 1; i++) {
                if (isField) {
                    field = (String) input[i];
                    isField = false;
                } else {
                    Class<?> type = types.get(field);
                    String val = TypeConversionUtils.getValueString(type, input[i].toString());
                    qry = qry.replace(":" + field, val);
                    isField = true;
                }
            }
        }

        if (orderBys.size() > 0) {
            boolean first = true;
            qry = qry + " order by ";
            for (String orderby : orderBys) {
                if (first) {
                    qry = qry + orderby;
                    first = false;
                } else {
                    qry = qry + ", " + orderby;
                }
            }
        }

        if (maxResult != null) {
            qry = qry + " limit " + maxResult + firstResult;
        }

        return qry;
    }

    private String downShiftFirstChar(String val) {
        val = val.substring(0, 1).toLowerCase() + val.substring(1);

        return val;
    }

    // Find the control field of the current field. Find the next control field of the control field just found.
    // Repeat this until there is no more control field found. Store control fields in an array list.
    private List<FieldType> getControlPath(FieldType field, Map<String, FieldType> fieldMap, List<FieldType> list) {
        Boolean dependent = field.getDependentPicklist();
        if (dependent == null || !dependent) {
            return list;
        }

        FieldType controller = fieldMap.get(field.getControllerName());

        if (controller == null) {
            return list;
        }

        if (list == null) {
            list = new ArrayList<FieldType>();
            list.add(field);
        }
        list.add(controller);

        return getControlPath(controller, fieldMap, list);
    }

    public static boolean isSystemMaintained(String field) {
        boolean rtn = false;
        for (String name : SYS_MAINT_FIELDS) {
            if (field.equalsIgnoreCase(name)) {
                rtn = true;
                break;
            }
        }

        return rtn;
    }

    public static boolean isOptional(String field) {
        boolean rtn = false;
        for (String name : OPTIONAL_FIELDS) {
            if (field.equalsIgnoreCase(name)) {
                rtn = true;
                break;
            }
        }

        return rtn;
    }

    private FieldType getField(String objName, String fieldName) throws Exception {
        List<FieldType> fields = getFields(objName);
        for (FieldType field : fields) {
            if (field.getName().equalsIgnoreCase(fieldName)) {
                return field;
            }
        }

        throw new Exception("Undefined field " + fieldName + " in " + objName);
    }

    private JSONObject getRestrictedPickList(String objName, FieldType currentField, FieldType controller, JSONObject fieldAndValuePairs)
        throws Exception {

        // helper class to decode a "validFor" bitset
        class Bitset {

            byte[] data;

            public Bitset(byte[] data) {
                this.data = data == null ? new byte[0] : data;
            }

            public boolean testBit(int n) {
                return (this.data[n >> 3] & 0x80 >> n % 8) != 0;
            }

            public int size() {
                return this.data.length * 8;
            }
        }

        List<PicklistEntryType> picklistValues = currentField.getPicklistValues();

        if (picklistValues == null || picklistValues.size() == 0) {
            return null;
        }

        // picklist is not dependent on a controller.

        if (controller == null) {
            return prepareJSONObject(picklistValues, fieldAndValuePairs, currentField);
        }

        // picklist is dependent on a controller.

        List<FieldType> fields = getFields(objName);

        if (fields == null) {
            return null;
        }

        List<PicklistEntryType> validValues = new ArrayList<PicklistEntryType>();

        String controlValue = (String) fieldAndValuePairs.get(downShiftFirstChar(controller.getName()));
        if (controlValue == null) {
            controlValue = getDefaultControlValue(controller);
        }

        for (PicklistEntryType picklistValue : picklistValues) {
            Bitset validFor = new Bitset(picklistValue.getValidFor());
            if ("picklist".equals(controller.getType().value())) {
                // if the controller is a picklist, list all
                // controlling values for which this entry is valid
                for (int k = 0; k < validFor.size(); k++) {
                    if (validFor.testBit(k)) {
                        // if bit k is set, this entry is valid for the
                        // for the controlling entry at index k
                        String val = controller.getPicklistValues().get(k).getValue();
                        if (controlValue.equals(val)) {
                            validValues.add(picklistValue);
                            break;
                        }

                    }
                }
            } else if ("boolean".equals(controller.getType().value())) {
                // the controller is a checkbox
                // if bit 1 is set this entry is valid if the controller is checked
                // if bit 0 is set this entry is valid if the controller is unchecked
                if (validFor.testBit(1) && "true".equals(controlValue) || validFor.testBit(0) && "false".equals(controlValue)) {
                    validValues.add(picklistValue);
                }
            }
        }

        return prepareJSONObject(validValues, fieldAndValuePairs, currentField);
    }

    private String getDefaultControlValue(FieldType controller) {

        String rtn = null;

        if ("boolean".equals(controller.getType().value())) {
            rtn = "false";
        } else { // the field type is picklist
            List<PicklistEntryType> picklistValues = controller.getPicklistValues();
            for (PicklistEntryType entry : picklistValues) {
                if (entry.isDefaultValue()) {
                    rtn = entry.getValue();
                    break;
                }
            }

            // if no default value is flagged, choose the first entry as the default.
            if (rtn == null) {
                rtn = picklistValues.get(0).getValue();
            }
        }

        return rtn;
    }

    private JSONObject prepareJSONObject(List<PicklistEntryType> picklistValues, JSONObject fieldAndValuePairs, FieldType currentField) {
        JSONObject rtn;
        JSONArray valArray;

        rtn = new JSONObject();
        valArray = new JSONArray();
        JSONObject defaultObj = null;
        for (PicklistEntryType picklistValue : picklistValues) {
            JSONObject obj = new JSONObject();
            obj.put("name", picklistValue.getLabel());
            obj.put("dataValue", picklistValue.getValue());
            valArray.add(obj);
            if (picklistValue.isDefaultValue()) {
                defaultObj = obj;
            }
        }

        rtn.put("options", valArray);
        if (defaultObj == null) {
            defaultObj = (JSONObject) valArray.get(0);
        }
        rtn.put("default", defaultObj);

        // Because the current field's picklist values have been reset and because it can be used as a controller for
        // other picklist, "fieldAndValuePairs" must be updated with the default value of the current picklist values.
        String defaultValue = defaultObj == null ? picklistValues.get(0).getValue() : (String) defaultObj.get("dataValue");
        fieldAndValuePairs.put(downShiftFirstChar(currentField.getName()), defaultValue);

        return rtn;
    }

    public static Object convertToQueryReturnType(Class cls, List<JSONObject> list) {
        List<Object> rtn = new ArrayList<Object>();
        Method[] methods = cls.getMethods();
        try {
            for (JSONObject jsonObj : list) {
                Collection<Object> vals = jsonObj.values();
                int i = 0;
                Object obj = cls.newInstance();
                for (Object val : vals) {
                    Method method = getSetMethod(i, methods);
                    method.invoke(obj, val);
                    i++;
                }
                rtn.add(obj);
            }
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }
        return rtn;
    }

    private static Method getSetMethod(int i, Method[] methods) {
        String name = "setC" + i;
        Method rtn = null;
        for (Method method : methods) {
            String mn = method.getName();
            if (mn.equals(name)) {
                rtn = method;
                break;
            }
        }

        return rtn;
    }

    public List<String> getColumns(String qry) {
        List<String> rtn = new ArrayList<String>();

        splitQueries(0, qry, 0);

        Set<Map.Entry<Integer, SingleQuery>> entries = this.queryMap.entrySet();
        for (Map.Entry<Integer, SingleQuery> entry : entries) {
            SingleQuery sq = entry.getValue();
            rtn.addAll(sq.getQueryFields());
        }

        return rtn;
    }

    public List<String> getColumnTypes(String qry) throws Exception {
        List<String> rtn = new ArrayList<String>();

        splitQueries(0, qry, 0);

        Set<Map.Entry<Integer, SingleQuery>> entries = this.queryMap.entrySet();
        for (Map.Entry<Integer, SingleQuery> entry : entries) {
            SingleQuery sq = entry.getValue();
            setupFields(sq.objectName);
            String apiObjName = getSforceAPIObjectName(sq.objectName);

            org.json.JSONObject jsonObj = WMAppContext.getInstance().getTypesObject();
            org.json.JSONObject classesObj = jsonObj.getJSONObject("types");
            String className = "com.sforce.soap.enterprise.salesforceservice." + apiObjName + "Type";
            org.json.JSONObject classObj = classesObj.getJSONObject(className);
            org.json.JSONObject fieldsObj = classObj.getJSONObject("fields");

            for (String fld : sq.getQueryFields()) {
                fld = getAPIFieldName(fld);
                fld = fld.substring(0, 1).toLowerCase() + fld.substring(1);
                org.json.JSONObject fieldObj = fieldsObj.getJSONObject(fld);
                String type = fieldObj.getString("type");
                rtn.add(type);
                // FieldType ftype = getFieldInfo(sq.objectName, fld);
                // rtn.add(ftype.getType().value());
            }
        }

        return rtn;
    }
}
