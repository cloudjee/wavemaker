package com.wavemaker.runtime.ws.salesforce;

//import com.sforce.soap.enterprise.salesforceservice.SforceService;
//import com.sforce.soap.enterprise.salesforceservice.SessionHeader;
//import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.ws.salesforce.gen.SforceService;
//import com.wavemaker.runtime.ws.salesforce.gen.SessionHeader;

/**
 * This is a client-facing service class.  All
 * public methods will be exposed to the client.  Their return
 * values and parameters will be passed to the client or taken
 * from the client, respectively.  This will be a singleton
 * instance, shared between all requests. 
 * 
 * To log, call the superclass method log(LOG_LEVEL, String) or log(LOG_LEVEL, String, Exception).
 * LOG_LEVEL is one of FATAL, ERROR, WARN, INFO and DEBUG to modify your log level.
 * For info on these levels, look for tomcat/log4j documentation
 */
public class LoginService {
    /* Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;
     *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation
     */

    public String logIn(String userName, String password) throws Exception {
        System.out.println("\n*** SalesForce interface is not avaliable in this package ***\n");
        return null;
    }

    public String logOut() throws Exception {
        System.out.println("\n*** SalesForce interface is not avaliable in this package ***\n");
        return null;
    }

    public static SforceService getSforceService() throws Exception {
        System.out.println("\n*** SalesForce interface is not avaliable in this package ***\n");
        return null;
    }

}
