/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.pws;

/**
 * This interface provides methods to log in/out to/from partner web service sites. It also defines methods to manage
 * session and relevant information.
 * 
 * @author Seung Lee
 */
public interface IPwsLoginManager {

    /**
     * Logs in to partner web service site
     * 
     * @param serviceName the service name
     * @return the session id or equivalence
     * @throws Exception if the login fails
     */
    String logIn(String serviceName) throws Exception;

    /**
     * Logs in to partner web service site
     * 
     * @param loginInfo the object of <tt>PwsLoginInfo</tt> containing information such as host, posrt, user name and
     *        password
     * @return the session id or equivalence
     * @throws Exception if the login fails
     */
    String logIn(PwsLoginInfo loginInfo) throws Exception;

    /**
     * Logs out from the current connection to a partner web service
     * 
     * @param host the host name for the web sevice
     * @param port the port number for the web sevice
     * @param sessionId the session id
     * @return the session id that is deactivated as a result of the logout
     * @throws Exception if the login fails
     */
    String logOut(String host, String port, String sessionId) throws Exception;

    /**
     * Returns the login information object of the current session
     * 
     * @return the object of <tt>PwsLoginInfo</tt> containing information such as host, posrt, user name and password
     */
    PwsLoginInfo getPwsLoginInfo();

    /**
     * Returns the current session id
     * 
     * @return the session id
     */
    String getSessionId();

    /**
     * Sets the partner name of the current session
     * 
     * @param partnerName the partner name
     */
    void setPartnerName(String partnerName);

    /**
     * Returns the partner name of the current session
     * 
     * @return the partner name
     */
    public String getPartnerName();
}
