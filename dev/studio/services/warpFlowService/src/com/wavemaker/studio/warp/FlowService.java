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
 
package com.wavemaker.studio.warp;

import com.wavemaker.runtime.ws.HTTPBindingSupport;
import com.wavemaker.runtime.service.annotations.HideFromClient;
//import com.wavemaker.json.JSONArray;
//import com.wavemaker.json.JSONObject;

import javax.xml.namespace.QName;
import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Login service class for Asteria Flow Designer Server
 */
public class FlowService {

    private LoginService warpLoginService;

    public String listProjects(String host, String port, String userName, String password) throws Exception {
        String sessionId = warpLoginService.logIn(host, port, userName, password);

        return listProjects(host, port, sessionId);
    }

    /*public JSONArray listProjects(String host, String port) throws Exception {
        String sessionId = warpLoginService.acquireSessionId();

        return listProjects(host, port, sessionId);
    }*/

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

        org.json.JSONObject returnObj = new org.json.JSONObject(result);

        org.json.JSONObject resultObj = (org.json.JSONObject)returnObj.get("result");

        org.json.JSONObject listObj = (org.json.JSONObject)resultObj.get("list");

        org.json.JSONArray projList;
        if (listObj.isNull("project")) {
            return "[]";
        } else {
            projList = (org.json.JSONArray)listObj.get("project");
        }

        //return convertOrgArrayToWm(projList);
        return projList.toString();
    }

    public String listFlows(String host, String port, String projectName, String userName, String password)
            throws Exception {
        String sessionId = warpLoginService.logIn(host, port, userName, password);

        return listFlows(host, port, projectName, sessionId);
    }

    /*public JSONArray listFlows(String host, String port, String projectName) throws Exception {
        String sessionId = warpLoginService.acquireSessionId();

        return listFlows(host, port, projectName, sessionId);
    }*/

    public String listFlows(String host, String port, String projectName, String sessionId) throws Exception {
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

        org.json.JSONObject returnObj = new org.json.JSONObject(result);

        //If an error is encountered and the error code is "NotFound", it may be a case that the project has not been
        //compiled yet.  Simply skip the project in that case.
        if (!returnObj.isNull("error")) {
            org.json.JSONObject errorObj = (org.json.JSONObject)returnObj.get("error");
            String code = (String)errorObj.get("code");
            if (code.equals("NotFound")) {
                throw new WarpException(code, code);
            }
        }

        org.json.JSONObject resultObj = (org.json.JSONObject)returnObj.get("result");

        org.json.JSONObject listObj = (org.json.JSONObject)resultObj.get("list");

        org.json.JSONArray flowList;
        if (listObj.isNull("flow")) {
            return "[]";
        } else {
            flowList = (org.json.JSONArray)listObj.get("flow");
        }

        //return convertOrgArrayToWm(flowList);
        return flowList.toString();
    }

    public String listAllFlows(String host, String port, String userName, String password) throws Exception {
        String sessionId = warpLoginService.logIn(host, port, userName, password);

        return listAllFlows(host, port, sessionId);
    }

    /*public JSONArray listAllFlows(String host, String port) throws Exception {
        String sessionId = warpLoginService.acquireSessionId();

        return listAllFlows(host, port, sessionId);
    }*/

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
                org.json.JSONObject projFlows = new org.json.JSONObject();
                projFlows.put("project", proj);
                projFlows.put("flows", flowList);
                rtn.put(projFlows);
            }
        }

        return rtn.toString();
    }

    @HideFromClient
    public void setWarpLoginService(LoginService loginService) {
        this.warpLoginService = loginService;
    }

    /*private JSONArray convertOrgArrayToWm(Object list) throws Exception {
        org.json.JSONArray arr = (org.json.JSONArray)list;
        JSONArray array = new JSONArray();
        for (int i=0; i<arr.length(); i++) {
            Object o = arr.get(i);
            if (o.getClass().equals(org.json.JSONArray.class)) {
                o = convertOrgArrayToWm(o);
            } else if (o.getClass().equals(org.json.JSONObject.class)) {
                o = convertOrgObjectToWm(o);
            }

            array.add(o);
        }

        return array;
    }

    private JSONObject convertOrgObjectToWm(Object obj1) throws Exception {
        org.json.JSONObject obj = (org.json.JSONObject)obj1;
        Iterator it = obj.keys();
        JSONObject rtn = new JSONObject();
        while (it.hasNext()) {
            String key = (String)it.next();
            Object o = obj.get(key);
            if (o.getClass().equals(org.json.JSONArray.class)) {
                o = convertOrgArrayToWm(o);
            } else if (o.getClass().equals(org.json.JSONObject.class)) {
                o = convertOrgObjectToWm(o);
            }

            rtn.put(key, o);
        }

        return rtn;
    }*/
}
