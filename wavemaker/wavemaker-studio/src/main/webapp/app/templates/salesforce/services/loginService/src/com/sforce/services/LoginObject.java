/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

package com.sforce.services;

import com.sforce.soap.enterprise.salesforceservice.*;
import com.wavemaker.runtime.ws.BindingProperties;

public class LoginObject {

    private SforceService service;

    private SessionHeader sessionHeader = null;

    public String logIn(String userName, String password) throws Exception {
        if (sessionHeader != null) return "You are already logged in";

        Login parameters = new Login();
        parameters.setUsername(userName);
        parameters.setPassword(password);
        LoginResponse response = service.login(parameters, new LoginScopeHeader());

        BindingProperties bindingProperties = new BindingProperties();
        bindingProperties.setEndpointAddress(response.getResult().getServerUrl());
        service.setBindingProperties(bindingProperties);
        String sessionId = response.getResult().getSessionId();

        sessionHeader = new SessionHeader();
        sessionHeader.setSessionId(sessionId);

        return "Logged in successfully";
    }

    public String logOut() throws Exception {
        Logout parameters = new Logout();
        if (sessionHeader != null) {
            LogoutResponse response = service.logout(parameters, sessionHeader);
            sessionHeader = null;
        } else {
            return "You are not logged in yet";
        }

        return "Logged out";
    }

    public SessionHeader getSessionHeader() throws Exception {
        if (sessionHeader == null) {
            throw new Exception("You must log in first");
        }
        return sessionHeader;
    }

    public SforceService getSforceService() throws Exception {
        if (service == null) {
            throw new Exception("You must log in first");
        }
        return service;
    }

    public void setSforceService(SforceService svc) {
        service = svc;
    }
}
