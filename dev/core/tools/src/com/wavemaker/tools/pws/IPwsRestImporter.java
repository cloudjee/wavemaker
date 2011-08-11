/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.pws;

import com.wavemaker.runtime.pws.PwsLoginInfo;

import java.util.List;

/**
 * This interface defines methods to render the list of available web services for a partner and a method to import the selected
 * service and operations. Partners must provide APIs that generates the list of available services. Partners must also provide relevant
 * specifications of the service APIs (different from service listing APIs mentioned above). In case of REST style web service,
 * XSD or WADL must be provided. In case of SOAP style web service, WSDL must be provided.
 *
 * @author slee
 *
 */
public interface IPwsRestImporter {

    /**
     * Generates the list of services for a partner.
     *
     * @param loginInfo the object of <code>PwsLoginInfo</code> containing information such as host, posrt, user name and
     * password
     * @return a JSON string that contains the list of services
     * @throws Exception if the request fails
     */
    String listServices(PwsLoginInfo loginInfo) throws Exception;

    /**
     * Generates the list of operations for a service.
     *
     * @param loginInfo the object of <code>PwsLoginInfo</code> containing information such as host, port number, user name and
     * password
     * @param service the service
     * @return a JSON string that contains the list of operations
     * @throws Exception if the request fails
     */
    String listOperations(PwsLoginInfo loginInfo, String service) throws Exception;

    /**
     * Generates the list of all services and operations for a partner.
     *
     * @param loginInfo the object of <code>PwsLoginInfo</code> containing information such as host, posrt, user name and
     * password
     * @return a JSON string that contains the list of all services and operations for a partner
     * @throws Exception if the request fails
     */
    String listAllOperations(PwsLoginInfo loginInfo) throws Exception;

    
    /**
     * <p>Imports partner web services for the selected service and operations. Typically the implemented logic in this method
     * first gets the service specification (<tt>XSD</tt>, <tt>WSDL</tt> or <tt>WADL</tt>) and then call <code>buildRestService</code>
     * (if <tt>XSD</tt> ) in <code>WebServiceToolsManager</code> or call <code>importWSDL</code> (if <tt>WSDL</tt> or <tt>WADL</tt>)
     * in the same class.</p>
     *
     * <p>Artifacts generated include files such as Spring bean configuration files, service definition files, java scripts
     * to store element types, service invocation Java classes, and Java classes for JAXB.</p>
     *
     * @param loginInfo the object of <code>PwsLoginInfo</code> containing information such as host, posrt, user name and
     * password
     * @param service the service name
     * @param operations selected operations
     * @return a Json string that contains the list of all services and operations for a partner
     * @throws Exception if the request fails
     */
    void importOperations(PwsLoginInfo loginInfo, String service, List<String> operations) throws Exception;

}
