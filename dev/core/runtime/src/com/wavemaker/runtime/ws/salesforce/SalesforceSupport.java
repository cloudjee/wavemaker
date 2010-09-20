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
package com.wavemaker.runtime.ws.salesforce;

import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONObject;
import com.wavemaker.runtime.data.util.QueryHandler;
import com.wavemaker.runtime.ws.salesforce.gen.*;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.common.util.TypeConversionUtils;
//import com.wavemaker.tools.ws.salesforce.gen.*;
//import com.sforce.soap.enterprise.salesforceservice.*;
//import com.sforce.services.LoginService;

import java.util.*;
import java.lang.reflect.Method;

/**
 * Helper class for Salesforce.
 * 
 * @author slee
 */
public class SalesforceSupport {

    private static final String[] SYS_MAINT_FIELDS =
            {"CreatedBy", "CreatedById", "CreatedDate", "LastModifiedBy", "LastModifiedById", "LastModifiedDate",
             "SystemModstamp", "IsDeleted", "FieldsToNulls"};

    private static final String[] OPTIONAL_FIELDS =
            {"ActivityHistories", "Attachments", "Events", "FeedSubscriptionsForEntity", "Histories", "LastActivityDate",
             "Notes", "NotesAndAttachments", "OpenActivities", "Owner", "OwnerId", "ProcessInstances", "ProcessSteps",
             "Tasks"};

    private static Map<String, List<FieldType>> fieldsMap = null;

    private LoginService loginSvcBean = (LoginService) RuntimeAccess.getInstance().getSpringBean("sfLoginService");

    public JSONObject getPickLists(String objClassName, JSONObject fieldAndValuePairs) throws Exception {
        JSONObject carrier = new JSONObject();
        String objName = getSalesforceObjName(objClassName);

        Set<Map.Entry<String, Object>> entries = fieldAndValuePairs.entrySet();
        
        for (Map.Entry e : entries) {
            String fieldName = (String)e.getKey();
            if (carrier.containsKey(fieldName)) continue;

            FieldType field = getField(objName, fieldName);

            //for boolean, we don't need to get the pick list.  boolean is only needed as controller.
            if (field.getType().value().equals("boolean")) continue;

            JSONObject result = getPickList(objName, field, fieldAndValuePairs, carrier);
            carrier.put(fieldName, result);
        }

        return carrier;
    }

    public JSONObject getPickList(String objName, FieldType currentField, JSONObject fieldAndValuePairs, JSONObject carrier) throws Exception {

        List<FieldType> fields = getFields(objName);

        Map<String, FieldType> fieldMap = new HashMap<String, FieldType>();

        for (FieldType fld: fields) {
            fieldMap.put(fld.getName(), fld);
        }

        //FieldType field = getField(objName, fieldName, fields);
        List<FieldType> controlPath = getControlPath(currentField, fieldMap, null);

        //if no controller fields are found, get the pick list for the current field and return.
        if (controlPath == null) {
            List<PicklistEntryType> picklistValues = currentField.getPicklistValues();
            if (picklistValues != null && picklistValues.size() > 0)
                return prepareJSONObject(picklistValues, fieldAndValuePairs, currentField);
            else
                return null;
        }

        Collections.reverse(controlPath);

        if (carrier == null) carrier = new JSONObject();

        JSONObject plist = null;
        for (int i = 0; i < controlPath.size(); i++) {
            FieldType fld = controlPath.get(i);

            if (fld.getType().value().equals("boolean")) continue;
            if (carrier.containsKey(downShiftFirstChar(fld.getName()))) continue;
            
            FieldType controller;

            //the first field does not have any controller
            controller = i == 0 ? null : controlPath.get(i-1);
            plist = getRestrictedPickList(objName, fld, controller, fieldAndValuePairs);

            //do not add the last entry to carrier bcz it will be added in the caller (getPiclLists)
            if (i < controlPath.size()-1) carrier.put(downShiftFirstChar(currentField.getName()), plist);
        }

        return plist;
    }

    private void setupFields(String objName) throws Exception {
        DescribeSObject parameters = new DescribeSObject();
        parameters.setSObjectType(getSalesforceObjName(objName));
        String result = loginSvcBean.logIn("sammysm@wavemaker.com", "Silver99Surfer");
        SessionHeader sessionHeader = LoginService.getSessionHeader();
        SforceService service= LoginService.getSforceService();

        DescribeSObjectResponse dresponse = service.describeSObject(parameters, sessionHeader, null, null, null);
        List<FieldType> flds = dresponse.getResult().getFields();
        List<FieldType> fields = null;

        if (flds != null && flds.size() > 0) {
            fields = new ArrayList<FieldType>();
            for (FieldType fld: flds) {
                if (isSystemMaintained(fld.getName()) || isOptional(fld.getName())) continue;
                fields.add(fld);
            }
        }

        if (fieldsMap == null) fieldsMap = new HashMap<String, List<FieldType>>();
        fieldsMap.put(objName, fields);
    }

    private List<FieldType> getFields(String objName) throws Exception{
        List<FieldType> fields;
        if (fieldsMap == null) {
            setupFields(objName);
            fields = fieldsMap.get(objName);
        } else {
            fields = fieldsMap.get(objName);
            if (fields == null) {
                setupFields(objName);
                fields = fieldsMap.get(objName);
            }
        }

        return fields;
    }

    public static String getSalesforceObjName(String name) {
        int pos = name.lastIndexOf(".");
        if (pos > 0)
            name = name.substring(pos+1);

        pos = name.lastIndexOf("Type");
        if (pos > 0) {
            name = name.substring(0, pos);
            if (name.substring(pos-1).equals("C")) { //custom object
                name = name.substring(0, pos-1) + "__C";    
            }
        }

        return name;
    }

    public List<Object> executeQuery(Map<String, Class<?>> types, Object... input) {

        List<Object> rtn;

        try {
            Query parameters = new Query();
            String qry = buildQueryString(types, input);
            parameters.setQueryString(qry);

            List<String> fieldList = getFieldList((String)input[0]);

            QueryOptions qo = new QueryOptions();
            int len = input.length;
            PagingOptions po = (PagingOptions)input[len-1];
            Long psize = po.getMaxResults();
            long firstrec = po.getFirstResult();
            qo.setBatchSize(psize.intValue());

            String result = loginSvcBean.logIn("sammysm@wavemaker.com", "Silver99Surfer");
            SessionHeader sessionHeader = LoginService.getSessionHeader();
            SforceService service= LoginService.getSforceService();
            QueryResponse response = service.query(parameters, sessionHeader, null, qo, null, null);

            List<SObjectType> sobjs = response.getResult().getRecords();

            if (sobjs == null || sobjs.size() == 0) return null;

            long lastrec = psize > sobjs.size() - firstrec ? sobjs.size() : psize + firstrec;

            rtn = new ArrayList<Object>();
            for (long k=firstrec; k<lastrec; k++) {
                int ik = (new Long(k).intValue());
                SObjectType sobj = sobjs.get(ik);
                List<Object> values = new ArrayList<Object>();
                for (String fieldName : fieldList) {
                    for (int i=0; i<sobj.getAnies().size(); i++) {
                        String fname = sobj.getAnies().get(i).getLocalName();
                        if (fieldName.equals(fname)) {
                            Object val = sobj.getAnies().get(i).getFirstChild().getNodeValue();
                            values.add(val);
                            break;
                        }
                    }
                }
                rtn.add(values);
            }
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }

        return rtn;
    }

    private String buildQueryString(Map<String, Class<?>> types, Object...input) {
        if (input.length < 3) return (String)input[0];

        String qry = (String)input[0];
        boolean isField = true;
        String field = null;
        for (int i=1; i<input.length-1; i++) {
            if (isField) {
                field = (String)input[i];
                isField = false;
            } else {
                Class<?> type = types.get(field);
                String val = TypeConversionUtils.getValueString(type, (String)input[i]);
                qry = qry.replace(":"+field, val);
                isField = true;
            }
        }

        return qry;       
    }

    private static List<String> getFieldList(String qry) {
        List<String> words = QueryHandler.parseSQL(qry);

        List<String> fields = null;

        boolean inSelect = false;
        if (words != null && words.size() > 3) {
            fields = new ArrayList<String>();
            for (String word : words) {               
                if (word.equalsIgnoreCase("select")) {
                    inSelect = true;
                } else if (word.equalsIgnoreCase("from")) {
                    break;
                } else if (inSelect && !word.equals(",")) {
                    fields.add(word);
                }
            }
        }

        return fields;
    }

    private String downShiftFirstChar(String val) {
        val = val.substring(0, 1).toLowerCase() + val.substring(1);

        return val;
    }

    //Find the control field of the current field. Find the next control field of the control field just found.
    //Repeat this until there is no more control field found. Store control fields in an array list.
    private List<FieldType> getControlPath(FieldType field, Map<String, FieldType> fieldMap, List<FieldType> list) {
        Boolean dependent = field.getDependentPicklist();
        if (dependent == null || !dependent) return list;

        FieldType controller = fieldMap.get(field.getControllerName());

        if (controller == null) return list;

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

    private JSONObject getRestrictedPickList(String objName, FieldType currentField, FieldType controller,
                                           JSONObject fieldAndValuePairs) throws Exception {

        // helper class to decode a "validFor" bitset
        class Bitset {
            byte[] data;

            public Bitset(byte[] data) {
                this.data = data == null ? new byte[0] : data;
            }

            public boolean testBit(int n) {
                return (data[n >> 3] & (0x80 >> n % 8)) != 0;
            }

            public int size() {
                return data.length * 8;
            }
        }

        List<PicklistEntryType> picklistValues = currentField.getPicklistValues();

        if (picklistValues ==null || picklistValues.size() == 0) return null;

        //picklist is not dependent on a controller.

        if (controller == null)
            return prepareJSONObject(picklistValues, fieldAndValuePairs, currentField);

        //picklist is dependent on a controller.

        List<FieldType> fields = getFields(objName);

        if (fields == null) return null;

        List<PicklistEntryType> validValues = new ArrayList<PicklistEntryType>();

        String controlValue = (String)fieldAndValuePairs.get(downShiftFirstChar(controller.getName()));
        if (controlValue == null) controlValue = getDefaultControlValue(controller);

        for (PicklistEntryType picklistValue: picklistValues) {
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
                if ((validFor.testBit(1) && "true".equals(controlValue)) ||
                    (validFor.testBit(0) && "false".equals(controlValue))) {
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
        } else { //the field type is picklist
            List<PicklistEntryType> picklistValues = controller.getPicklistValues();
            for (PicklistEntryType entry : picklistValues) {
                if (entry.isDefaultValue()) {
                    rtn = entry.getValue();
                    break;
                }
            }

            //if no default value is flagged, choose the first entry as the default.
            if (rtn == null) rtn = picklistValues.get(0).getValue();
        }

        return rtn;
    }

    private JSONObject prepareJSONObject(List<PicklistEntryType> picklistValues, JSONObject fieldAndValuePairs,
                                         FieldType currentField) {
        JSONObject rtn;
        JSONArray valArray;

        rtn = new JSONObject();
        valArray = new JSONArray();
        JSONObject defaultObj = null;
        for (PicklistEntryType picklistValue: picklistValues) {
            JSONObject obj = new JSONObject();
            obj.put("name", picklistValue.getLabel());
            obj.put("dataValue", picklistValue.getValue());
            valArray.add(obj);
            if (picklistValue.isDefaultValue()) defaultObj = obj;
        }

        rtn.put("options", valArray);
        if (defaultObj == null) defaultObj = (JSONObject)valArray.get(0);
        rtn.put("default", defaultObj);

        // Because the current field's picklist values have been reset and because it can be used as a controller for
        // other picklist, "fieldAndValuePairs" must be updated with the default value of the current picklist values.
        String defaultValue = defaultObj == null ?
                picklistValues.get(0).getValue() : (String)defaultObj.get("dataValue");
        fieldAndValuePairs.put(downShiftFirstChar(currentField.getName()), defaultValue);

        return rtn;
    }
}
