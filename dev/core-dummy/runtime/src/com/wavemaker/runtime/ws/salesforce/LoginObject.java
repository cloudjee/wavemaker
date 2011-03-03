package com.wavemaker.runtime.ws.salesforce;

import com.wavemaker.runtime.ws.salesforce.gen.*;

public class LoginObject {

    public String logIn(String userName, String password) throws Exception {
        return null;
    }

    public String logOut() throws Exception {
        return null;
    }

    /*public SessionHeader getSessionHeader() throws Exception {
        return null;
    }*/

    public SforceService getSforceService() throws Exception {
        System.out.println("\n*** SalesForce interface is not avaliable in this package ***\n");
        return null;
    }

    public void setSforceService(SforceService svc) {
        System.out.println("\n*** SalesForce interface is not avaliable in this package ***\n");
    }
}
