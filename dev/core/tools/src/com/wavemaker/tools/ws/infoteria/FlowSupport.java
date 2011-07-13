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
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.ws.WebServiceToolsManager;
import com.wavemaker.tools.ws.RESTInputParam;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.common.util.SystemUtils;

import javax.xml.namespace.QName;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.Source;
import javax.xml.transform.Result;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.dom.DOMSource;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;
import org.w3c.dom.*;

import java.io.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Properties;

/**
 * Web service support for Asteria Flow Designer Server
 */
public class FlowSupport {

    private final String baseXsd = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<xs:schema attributeFormDefault=\"unqualified\" elementFormDefault=\"qualified\" xmlns:xs=\"http://www.w3.org/2001/XMLSchema\">\n" +
                "  <xs:element name=\"result\" type=\"resultType\"/>\n" +
                "  <xs:complexType name=\"dataType\">\n" +
                "    <xs:sequence>\n" +
                "      <xs:element type=\"recordType\" name=\"record\"/>\n" +
                "    </xs:sequence>\n" +
                "  </xs:complexType>\n" +
                "  <xs:complexType name=\"streamType\">\n" +
                "    <xs:sequence>\n" +
                "      <xs:element type=\"dataType\" name=\"data\"/>\n" +
                "    </xs:sequence>\n" +
                "  </xs:complexType>\n" +
                "  <xs:complexType name=\"resultType\">\n" +
                "    <xs:sequence>\n" +
                "      <xs:element type=\"streamType\" name=\"stream\"/>\n" +
                "      <xs:element type=\"xs:string\" name=\"id\"/>\n" +
                "    </xs:sequence>\n" +
                "  </xs:complexType>\n" +
                "  <xs:complexType name=\"recordType\">\n" +
                "    <xs:sequence>\n" +
                "    </xs:sequence>\n" +
                "  </xs:complexType>\n" +
                "</xs:schema>";

    private WebServiceToolsManager wsToolsMgr;

    private ProjectManager projectManager;

    private DesignServiceManager designServiceManager;

    private static final String WARP_HOST = ".username";
    private static final String WARP_PORT = ".password";
    private static final String WARP_USERNAME = ".username";
    private static final String WARP_PASS = ".password";

    public String listProjects(String host, String port, String sessionId) throws Exception {
        String result;

        if (sessionId == null) {
            throw new Exception("Null session id is passed.");
        }

        String endPointAddress = "http://" + host + ":" + port + "/flow-rest/project/list.json?sessionid="
                + sessionId;
        QName thisQName = new QName(endPointAddress, "asteriaServer");

        String method = "GET";

        result = HTTPBindingSupport.getResponseString(thisQName, thisQName, endPointAddress,
                HTTPBindingSupport.HTTPRequestMethod.valueOf(method), null, null);

        JSONObject returnObj = new JSONObject(result);

        JSONObject resultObj = (JSONObject)returnObj.get("result");

        JSONObject listObj = (JSONObject)resultObj.get("list");

        JSONArray projList;
        if (listObj.isNull("project")) {
            return "[]";
        } else {
            projList = (org.json.JSONArray)listObj.get("project");
        }

        //return convertOrgArrayToWm(projList);
        return projList.toString();
    }

    public String listFlows(String host, String port, String projectName, String sessionId) throws Exception {
        return getFlowList(host, port, projectName, sessionId).toString();
    }

    public JSONArray getFlowList(String host, String port, String projectName, String sessionId) throws Exception {
        String result;

        if (sessionId == null) {
            throw new Exception("Null session id is passed.");
        }

        String endPointAddress = "http://" + host + ":" + port + "/flow-rest/flow/list.json?name="
                + projectName + "&sessionid="+ sessionId;
        QName thisQName = new QName(endPointAddress, "asteriaServer");

        String method = "GET";

        result = HTTPBindingSupport.getResponseString(thisQName, thisQName, endPointAddress,
                HTTPBindingSupport.HTTPRequestMethod.valueOf(method), null, null);

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
            flowList = (JSONArray)listObj.get("flow");
        }

        return flowList;
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
    public void importFlows(String host, String port, String userName, String password, String projectName, String sessionId) throws Exception {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        DocumentBuilder docBuilder = dbf.newDocumentBuilder();
        InputStream is = new ByteArrayInputStream(baseXsd.getBytes());

        Document doc = docBuilder.parse (is);

        JSONArray flowList = getFlowList(host, port, projectName, sessionId);

        doc = completeXsd(doc, flowList);

        TransformerFactory tFactory = TransformerFactory.newInstance();
        Transformer tFormer = tFactory.newTransformer();

        Source source = new DOMSource(doc);
        ByteArrayOutputStream ost = new ByteArrayOutputStream();
        Result dest = new StreamResult(ost);
        tFormer.transform(source, dest);

        WebServiceToolsManager wstMgr = this.getWSToolsMgr();
        List<String> flowNames = getFlowNames(flowList);
        List<List<RESTInputParam>> inputParms = getInputParms(flowList);
        String url = getUrl(host, port);
        String xsd = ost.toString();

        wstMgr.buildRestService(projectName, flowNames, inputParms, url, "POST", "application/x-www-form-urlencoded",
                "result", xsd, null, true);

        createWarpPropertyFile(projectName, host, port, userName, password);
    }

    private void createWarpPropertyFile(String projectName, String host, String port, String userName, String password)
                                        throws Exception {
        Properties p = new Properties();

        p.put(projectName+WARP_HOST, host);
        p.put(projectName+WARP_PORT, port);
        p.put(projectName+WARP_USERNAME, userName);

        if (password != null && !SystemUtils.isEncrypted(password)) {
            password = SystemUtils.encrypt(password);
        }
        p.put(projectName+WARP_PASS, password);

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
            List<RESTInputParam> flowParms = new ArrayList<RESTInputParam>();

            JSONObject flow = (JSONObject)flowList.get(i);
            JSONObject args = (JSONObject)flow.get("args");
            JSONArray fields = (JSONArray)args.get("field");

            param = new RESTInputParam();
            param.setName("sessionid");
            param.setType("string");
            flowParms.add(param);

            param = new RESTInputParam();
            param.setName("project");
            param.setType("string");
            flowParms.add(param);

            param = new RESTInputParam();
            param.setName("flow");
            param.setType("string");
            flowParms.add(param);

            for (int j=0; j<fields.length(); j++) {
                JSONObject field = (JSONObject)fields.get(j);
                param = new RESTInputParam();
                param.setName((String)field.get("name"));
                param.setType((String)field.get("type"));
                flowParms.add(param);
            }

            restParms.add(flowParms);
        }

        return restParms;
    }

    private Document completeXsd(Document doc, JSONArray flowList) throws Exception {
        NodeList complexTypes = doc.getElementsByTagNameNS("*", "complexType");

        Node recordTypeNode = null;
        for(int i=0; i<complexTypes.getLength() ; i++) {
            Node nodeOp = complexTypes.item(i);
            NamedNodeMap nMap = nodeOp.getAttributes();
            for (int j=0; j<nMap.getLength(); j++) {
                Node attr = nMap.item(j);
                if (attr.getNodeName().equals("recordType")) {
                    recordTypeNode = nodeOp;
                    break;
                }
            }
        }

        if (recordTypeNode == null) {
            return doc;
        }

        Node sequenceNode = recordTypeNode.getFirstChild();

        //Now traverse the flow list and insert output fields and types into xsd

        for (int i=0; i<flowList.length(); i++) {
            List<RESTInputParam> flowParms = new ArrayList<RESTInputParam>();

            JSONObject flow = (JSONObject)flowList.get(i);
            JSONObject stream = (JSONObject)flow.get("stream");
            JSONArray fields = (JSONArray)stream.get("field");

            for (int j=0; j<fields.length(); j++) {
                JSONObject field = (JSONObject)fields.get(j);
                Element elem = doc.createElementNS("xs", "element");
                elem.setAttribute("name", (String)field.get("name"));
                elem.setAttribute("type", (String)field.get("type"));
                
                sequenceNode.appendChild(elem);
            }
        }

        return doc;
    }

    private String getUrl(String host, String port) {
        //http://infoteria:21381/flow-rest/flow/exec.xml
        String url = "http://" + host + ":" + port + "/flow-rest/exec.json";

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
