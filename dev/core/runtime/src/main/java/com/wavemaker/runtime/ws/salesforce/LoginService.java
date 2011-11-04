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

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.ws.salesforce.gen.SessionHeader;
import com.wavemaker.runtime.ws.salesforce.gen.SforceService;

/**
 * This is a client-facing service class. All public methods will be exposed to the client. Their return values and
 * parameters will be passed to the client or taken from the client, respectively. This will be a singleton instance,
 * shared between all requests.
 * 
 * To log, call the superclass method log(LOG_LEVEL, String) or log(LOG_LEVEL, String, Exception). LOG_LEVEL is one of
 * FATAL, ERROR, WARN, INFO and DEBUG to modify your log level. For info on these levels, look for tomcat/log4j
 * documentation
 */
public class LoginService {

    /*
     * Pass in one of FATAL, ERROR, WARN, INFO and DEBUG to modify your log level; recommend changing this to FATAL or
     * ERROR before deploying. For info on these levels, look for tomcat/log4j documentation
     */

    public String logIn(String userName, String password) throws Exception {
        String result;

        LoginObject bean = (LoginObject) RuntimeAccess.getInstance().getSpringBean("sfLoginObject");
        SforceService svc = (SforceService) RuntimeAccess.getInstance().getSpringBean("sfServiceBean");
        bean.setSforceService(svc);

        try {
            result = bean.logIn(userName, password);
        } catch (Exception ex) {
            // log(ERROR, "Login failed", ex);
            ex.printStackTrace();
            throw ex;
        }

        return result;
    }

    public String logOut() throws Exception {
        LoginObject bean = (LoginObject) RuntimeAccess.getInstance().getSpringBean("sfLoginObject");
        return bean.logOut();
    }

    public static SessionHeader getSessionHeader() throws Exception {
        LoginObject bean = (LoginObject) RuntimeAccess.getInstance().getSpringBean("sfLoginObject");
        return bean.getSessionHeader();
    }

    public static SforceService getSforceService() throws Exception {
        LoginObject bean = (LoginObject) RuntimeAccess.getInstance().getSpringBean("sfLoginObject");
        return bean.getSforceService();
    }

}
