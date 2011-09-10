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
 
package com.wavemaker.tools.ws.infoteria;

import com.wavemaker.runtime.ws.HTTPBindingSupport;
import com.wavemaker.runtime.ws.infoteria.WarpHelper;
import com.wavemaker.runtime.ws.infoteria.WarpException;
import com.wavemaker.runtime.ws.util.Constants;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.ws.WebServiceToolsManager;
import com.wavemaker.tools.ws.RESTInputParam;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.common.util.StringUtils;

import javax.xml.namespace.QName;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import java.io.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Properties;

/**
 * Web service support for Asteria Flow Designer Server
 */
public class FlowSupport {

    private final String xsdHeader =
                "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<xs:schema attributeFormDefault=\"unqualified\" elementFormDefault=\"qualified\" xmlns:xs=\"http://www.w3.org/2001/XMLSchema\">\n";
    private final String xsdBody =
                "  <xs:element name=\"operation_name_result\" type=\"operation_name_ResultType\"/>\n" +
                "  <xs:complexType name=\"operation_name_DataType\">\n" +
                "    <xs:sequence>\n" +
                "      <xs:element type=\"operation_name_RecordType\" name=\"record\" maxOccurs=\"unbounded\" minOccurs=\"0\"/>\n" +
                "    </xs:sequence>\n" +
                "  </xs:complexType>\n" +
                "  <xs:complexType name=\"operation_name_StreamType\">\n" +
                "    <xs:sequence>\n" +
                "      <xs:element type=\"operation_name_DataType\" name=\"data\"/>\n" +
                "    </xs:sequence>\n" +
                "  </xs:complexType>\n" +
                "  <xs:complexType name=\"operation_name_ResultType\">\n" +
                "    <xs:sequence>\n" +
                "      <xs:element type=\"operation_name_StreamType\" name=\"stream\"/>\n" +
                "      <xs:element type=\"xs:string\" name=\"id\"/>\n" +
                "    </xs:sequence>\n" +
                "  </xs:complexType>\n" +
                "  <xs:complexType name=\"operation_name_RecordType\">\n" +
                "    <xs:sequence>\n" +
                "      record_content_\n" +
                "    </xs:sequence>\n" +
                "  </xs:complexType>";
    private final String xsdTrailer =
                "</xs:schema>";

    private final String recElement = "<xs:element type=\"xs:elem_type_\" name=\"elem_name_\"/>";

    private enum FlowDataTypes {
        String, Integer, Double, Decimal, Boolean, DateTime, Binary
    }


    private WebServiceToolsManager wsToolsMgr;

    private ProjectManager projectManager;

    private DesignServiceManager designServiceManager;

    public String listProjects(String host, String port, String sessionId) throws Exception {
        String result;

        if (sessionId == null) {
            throw new Exception("Null session id is passed.");
        }

        String endPointAddress = "http://" + host + ":" + port + "/flow-rest/project/list.json";
        String postData = "sessionid=" + sessionId;
        QName thisQName = new QName(endPointAddress, "asteriaServer");

        result = HTTPBindingSupport.getResponseObject(thisQName, thisQName, endPointAddress, HTTPBindingSupport.HTTPRequestMethod.POST,
                    Constants.MIME_TYPE_FORM, postData, String.class, null);

        JSONObject returnObj = new JSONObject(result);

        JSONObject resultObj = (JSONObject)returnObj.get("result");

        JSONObject listObj = (JSONObject)resultObj.get("list");

        JSONArray projList;
        if (listObj.isNull("project")) {
            return "[]";
        } else {
            projList = (org.json.JSONArray)listObj.get("project");
        }

        return projList.toString();
    }

    public String listFlows(String host, String port, String projectName, String sessionId) throws Exception {
        return getFlowList(host, port, projectName, null, sessionId).toString();
    }

    public JSONArray getFlowList(String host, String port, String projectName, List<String> selectedFlows, String sessionId) throws Exception {
        String result;

        if (sessionId == null) {
            throw new Exception("Null session id is passed.");
        }

        String endPointAddress = "http://" + host + ":" + port + "/flow-rest/flow/list.json";
        String postData = "name=" + projectName + "&sessionid=" + sessionId;
        QName thisQName = new QName(endPointAddress, "asteriaServer");

        result = HTTPBindingSupport.getResponseObject(thisQName, thisQName, endPointAddress, HTTPBindingSupport.HTTPRequestMethod.POST,
                    Constants.MIME_TYPE_FORM, postData, String.class, null);

        JSONObject returnObj = new JSONObject(result);

        //If an error is encountered and the error code is "NotFound", it may be a case that the project has not been
        //compiled yet.  Simply skip the project in that case.
        if (!returnObj.isNull("error")) {
            JSONObject errorObj = (JSONObject)returnObj.get("error");
            String code = (String)errorObj.get("code");
            if (code.equals("NotFound")) {
                throw new WarpException(code, code);
            }
        }

        JSONObject resultObj = (JSONObject)returnObj.get("result");

        JSONObject listObj = (JSONObject)resultObj.get("list");

        JSONArray flowList;
        if (listObj.isNull("flow")) {
            return new JSONArray("[]");
        } else {
            flowList = convertToJSONArray(listObj.get("flow"));
        }

        if (selectedFlows != null) {
            JSONArray newFlowList = new JSONArray();
            for (int i=0; i<flowList.length(); i++) {
                Object o = flowList.get(i);
                if (inSelected(o, selectedFlows)) {
                    newFlowList.put(o);
                }
            }

            return newFlowList;
        }

        return flowList;
    }

    private boolean inSelected(Object obj, List<String> selectedFlows) throws JSONException {
        JSONObject flow = (JSONObject) obj;
        String flowName = (String)flow.get("name");
        boolean found = false;
        for (String fn : selectedFlows) {
            if (fn.equals(flowName)) {
                found = true;
                break;
            }
        }

        return found;
    }

    public static JSONArray convertToJSONArray (Object obj) {
        JSONArray rtn;
        if (obj instanceof JSONArray) {
            rtn = (JSONArray)obj;
        } else { //JSONObject
            rtn = new JSONArray();
            rtn.put(obj);
        }

        return rtn;
    }

    public String listAllFlows(String host, String port, String sessionId) throws Exception {
        JSONArray rtn = null;
        JSONArray projList = new JSONArray(listProjects(host, port, sessionId));

        if (projList != null) {
            rtn = new JSONArray();
            for (int i=0; i<projList.length(); i++) {
                JSONObject proj = (JSONObject)projList.get(i);
                JSONArray flowList;
                try {
                    String sFlowList = listFlows(host, port, (String)proj.get("name"), sessionId);
                    flowList = new JSONArray(sFlowList);
                } catch (WarpException ex) {
                    if (ex.getReason().equals("NotFound")) {
                        continue;
                    } else {
                        throw new Exception(ex.getMessage());
                    }
                }
                JSONObject projFlows = new JSONObject();
                projFlows.put("project", proj);
                projFlows.put("flows", flowList);
                rtn.put(projFlows);
            }
        }

        return rtn.toString();
    }

    //Imports Flow metadata, creates WSDL and generate service (service = project, flows = operations)
    public void importFlows(String host, String port, String userName, String password, String domain, String projectName,
                            List<String> selectedFlows, String sessionId) throws Exception {

        JSONArray flowList = getFlowList(host, port, projectName, selectedFlows, sessionId);

        WebServiceToolsManager wstMgr = this.getWSToolsMgr();
        List<String> flowNames = getFlowNames(flowList);
        List<List<RESTInputParam>> inputParms = getInputParms(flowList);
        String url = getUrl(host, port);
        String xsd = buildXsd(flowList);

        wstMgr.buildRestService(projectName, flowNames, inputParms, url, "POST", "application/x-www-form-urlencoded",
                "result", xsd, null, true);

        createWarpPropertyFile(projectName, host, port, userName, password, domain);
    }

    private String buildXsd(JSONArray flowList) throws Exception {
        StringBuffer sb = new StringBuffer(xsdHeader);

        for (int i=0; i<flowList.length(); i++) {
            JSONObject flow = (JSONObject)flowList.get(i);
            String flowXsd = completeXsd(xsdBody, flow);
            sb.append(flowXsd);
            sb.append("\n");
        }

        sb.append(xsdTrailer);

        return sb.toString();
    }

    private void createWarpPropertyFile(String projectName, String host, String port, String userName, String password,
                                        String domain) throws Exception {
        Properties p = new Properties();

        p.put(projectName + WarpHelper.WARP_HOST, host);
        p.put(projectName + WarpHelper.WARP_PORT, port);
        p.put(projectName + WarpHelper.WARP_USERNAME, userName);

        if (password != null && !SystemUtils.isEncrypted(password)) {
            password = SystemUtils.encrypt(password);
        }
        p.put(projectName + WarpHelper.WARP_PASS, password);
        p.put(projectName + WarpHelper.WARP_DOMAIN, domain);

        String comment = "Properties for " + projectName;

        File destdir = designServiceManager.getServiceRuntimeDirectory(projectName);

        File f = new File(destdir, projectName + DataServiceConstants.PROPERTIES_FILE_EXT);

        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(f);
            SystemUtils.writePropertiesFile(fos, p, comment);
        } catch (IOException ex) {
            throw new Exception(ex);
        } finally {
            try {
                fos.close();
            } catch (Exception ignore) {
            }
        }
    }

    private List<String> getFlowNames(JSONArray flowList) throws JSONException {
        List<String> flowNames = new ArrayList<String>();
        for (int i=0; i<flowList.length(); i++) {
            JSONObject flow = (JSONObject)flowList.get(i);
            flowNames.add((String)flow.get("name"));
        }

        return flowNames;
    }

    private List<List<RESTInputParam>> getInputParms(JSONArray flowList) throws JSONException {
        List<List<RESTInputParam>> restParms = new ArrayList<List<RESTInputParam>>();
        RESTInputParam param = null;

        for (int i=0; i<flowList.length(); i++) {
            List<RESTInputParam> flowParams = new ArrayList<RESTInputParam>();

            JSONObject flow = (JSONObject)flowList.get(i);
            JSONObject args = null;
            JSONArray fields = null;
            JSONArray variables = null;

            if (flow.has("args")) args = (JSONObject)flow.get("args");

            if (args != null && args.has("field")) fields = convertToJSONArray(args.get("field"));
            if (args != null && args.has("variable")) variables = convertToJSONArray(args.get("variable"));

            /*param = new RESTInputParam();
            param.setName("sessionid");
            param.setType("string");
            flowParams.add(param);

            param = new RESTInputParam();
            param.setName("project");
            param.setType("string");
            flowParams.add(param);

            param = new RESTInputParam();
            param.setName("flow");
            param.setType("string");
            flowParams.add(param);*/

            if (fields != null) {
                for (int j=0; j<fields.length(); j++) {
                    JSONObject field = (JSONObject)fields.get(j);
                    param = new RESTInputParam();
                    param.setName((String)field.get("name"));
                    String ftype = (String)field.get("type");
                    ftype = convertToSchemaType(ftype);
                    param.setType(ftype);
                    flowParams.add(param);
                }
            }

            if (variables != null) {
                for (int j=0; j<variables.length(); j++) {
                    JSONObject variable = (JSONObject)variables.get(j);
                    String paramName = (String)variable.get("name");
                    if (newParam(paramName, flowParams)) {
                        param = new RESTInputParam();
                        param.setName(paramName);
                        String ftype = (String)variable.get("type");
                        ftype = convertToSchemaType(ftype);
                        param.setType(ftype);
                        flowParams.add(param);
                    }
                }
            }

            restParms.add(flowParams);
        }

        return restParms;
    }

    private boolean newParam(String name, List<RESTInputParam> flowParms) {
        boolean rtn = true;
        for (RESTInputParam param : flowParms) {
            if (name.equals(param.getName())) {
                rtn = false;
                break;
            }
        }

        return rtn;
    }

    private static String convertToSchemaType (String type) {
        type = StringUtils.removeSpaces(type);
        String rtn;
        FlowDataTypes ftype = FlowDataTypes.valueOf(type);
        switch (ftype) {
            case String:
                rtn = "string";
                break;
            case Integer:
                rtn = "long";
                break;
            case Double:
                rtn = "double";
                break;
            case Decimal:
                rtn = "decimal";
                break;
            case Boolean:
                rtn = "boolean";
                break;
            case DateTime:
                rtn = "dateTime";
                break;
            case Binary:
                rtn = "base64Binary";
                break;
            default:
                rtn = "string";
                break;
        }

        return rtn;
    }

    private String completeXsd(String xsdBody, JSONObject flow) throws Exception {
        String flowName = (String)flow.get("name");
        xsdBody = xsdBody.replaceAll("operation_name_", flowName);

        JSONObject stream = (JSONObject)flow.get("stream");
        JSONArray fields = convertToJSONArray(stream.get("field"));

        StringBuffer sb = new StringBuffer();

        for (int j=0; j<fields.length(); j++) {
            JSONObject field = (JSONObject)fields.get(j);
            String name = (String)field.get("name");
            String type = convertToSchemaType((String)field.get("type"));
            String rec = recElement.replaceAll("elem_name_", name);
            rec = rec.replaceAll("elem_type_", type);
            if (j > 0) {
                sb.append("\n");
                sb.append("\t  ");
            }
            sb.append(rec);
        }

        xsdBody = xsdBody.replaceAll("record_content_", sb.toString());

        return xsdBody;
    }

    private String getUrl(String host, String port) {
        //http://infoteria:21381/flow-rest/flow/exec.xml
        String url = "http://" + host + ":" + port + "/flow-rest/flow/exec.xml";

        return url;
    }

    public void setProjectManager(ProjectManager projectMgr) {
        this.projectManager = projectMgr;
    }

    public void setDesignServiceManager(DesignServiceManager designServiceMgr) {
        this.designServiceManager = designServiceMgr;
    }

    private WebServiceToolsManager getWSToolsMgr() {
        if (wsToolsMgr == null) {
            if (projectManager == null) {
                SpringUtils.throwSpringNotInitializedError(ProjectManager.class);
            }
            if (designServiceManager == null) {
                SpringUtils.throwSpringNotInitializedError(DesignServiceManager.class);
            }
            wsToolsMgr = new WebServiceToolsManager(projectManager,
                    designServiceManager);
        }
        return wsToolsMgr;
    }
}
