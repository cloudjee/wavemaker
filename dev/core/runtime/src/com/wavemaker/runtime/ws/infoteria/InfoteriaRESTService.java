/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.runtime.ws.infoteria;

import java.util.Map;
import javax.xml.namespace.QName;

import com.wavemaker.runtime.ws.RESTService;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.RuntimeAccess;

/**
 * This class overrides some methods i  RESTService for infoteria
 * 
 * @author slee
 * 
 */
public class InfoteriaRESTService extends RESTService {

    /**
     * Constructs a REST style Web service.
     * 
     * @param serviceId
     *                The service ID.
     * @param serviceQName
     *                The Qualified name of the service in the WSDL service
     *                description.
     * @param parameterizedURI
     *                The parameterized URI used to call the REST service.
     */
    public InfoteriaRESTService(String serviceId, QName serviceQName,
            String parameterizedURI) {
        this(serviceId, serviceQName, parameterizedURI, null);
    }

    /**
     * Constucts a REST style Web service.
     * 
     * @param serviceId
     *            The service ID.
     * @param serviceQName
     *            The Qualified name of the service in the WSDL service
     *            description.
     * @param parameterizedURI
     *            The parameterized URI used to call the REST service.
     * @param bindingProperties
     *            The optional properties for the HTTP binding. For example,
     *            this could contain the HTTP Basic Auth username and password.
     *            This param could be null.
     * 
     */
    public InfoteriaRESTService(String serviceId, QName serviceQName,
            String parameterizedURI, BindingProperties bindingProperties) {
        super(serviceId, serviceQName, parameterizedURI, bindingProperties);
    }

    public <T extends Object> T invoke(Map<String, Object> inputs,
            Class<T> responseType) {
        return invoke(inputs, null, null, null, responseType);
    }

    public <T extends Object> T invoke(Map<String, Object> inputs,
            String method, String contentType, String endpoint,
            Class<T> responseType) {

        String sessionId = (String)inputs.get("sessionid");
        String proj = (String)inputs.get("project");

        try {
            if (sessionId == null || sessionId.length() == 0) {
                AutoLoginService svc = (AutoLoginService)RuntimeAccess.getInstance().getSpringBean("infoteriaAutoLoginSvc");
                sessionId = svc.logIn(proj);
                inputs.put("sessionid", sessionId);
            }
        } catch (Exception ex) {
            throw new WarpException(ex);
        }

        try {
            return super.invoke(inputs, method, contentType, endpoint, responseType);
        } catch (WarpException ex) {
            String reason = ex.getReason();
            if (reason.equals(WarpHelper.WARP_ERROR_AUTH)) {
                try {
                    AutoLoginService svc = (AutoLoginService)RuntimeAccess.getInstance().getSpringBean("infoteriaAutoLoginSvc");
                    sessionId = svc.logIn(proj);
                    inputs.put("sessionid", sessionId);
                    return super.invoke(inputs, method, contentType, endpoint, responseType);
                } catch (Exception ex1) {
                    throw new WarpException(ex1);
                }
            } else {
                throw ex;
            }
        }
    }

}
