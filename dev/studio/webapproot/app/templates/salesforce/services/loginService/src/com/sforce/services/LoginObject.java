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
