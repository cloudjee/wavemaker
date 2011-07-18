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
import com.wavemaker.runtime.ws.util.Constants;

import javax.xml.namespace.QName;

import org.json.JSONObject;

/**
 * Login service class for Asteria Flow Designer Server
 */
public class LoginService {

    public String logIn(String host, String port, String userName, String password, String domain)
            throws Exception {
        String result;
        String sessionId;

        String endPointAddress = "http://" + host + ":" + port + "/flow-rest/auth/login.json";
        String postData = "user=" + domain + userName + "&password=" + password;
        QName thisQName = new QName(endPointAddress, "asteriaServer");

        result = HTTPBindingSupport.getResponseObject(thisQName, thisQName, endPointAddress, HTTPBindingSupport.HTTPRequestMethod.POST,
                    Constants.MIME_TYPE_FORM, postData, String.class, null);

        JSONObject returnObj = new JSONObject(result);

        JSONObject sessionObj = (JSONObject)returnObj.get("result");
        String status = (String)sessionObj.get("status");
        if (status.equals("true")) {
            sessionId = (String)sessionObj.get("id");
        } else {
            throw new Exception("Login falied");
        }

        return sessionId;
    }

    //This method logs out the user/password passed in and returns the session id that is invalidated.
    public String logOut(String host, String port, String sessId) throws Exception {
        String result;
        String oldSessionId;

        if (sessId == null) {
            throw new Exception("Null session id is passed.");
        }

        String endPointAddress = "http://" + host + ":" + port + "/flow-rest/auth/logout.json";
        String postData = "sessionid=" + sessId;
        QName thisQName = new QName(endPointAddress, "asteriaServer");

        result = HTTPBindingSupport.getResponseObject(thisQName, thisQName, endPointAddress, HTTPBindingSupport.HTTPRequestMethod.POST,
                    Constants.MIME_TYPE_FORM, postData, String.class, null);

        JSONObject returnObj = new JSONObject(result);

        JSONObject sessionObj = (JSONObject)returnObj.get("result");
        String status = (String)sessionObj.get("status");
        if (status.equals("true")) {
            //sessionId = null;
            oldSessionId = (String)sessionObj.get("id");
        } else {
            throw new Exception("Logout falied.");
        }

        return oldSessionId;
    }
}
