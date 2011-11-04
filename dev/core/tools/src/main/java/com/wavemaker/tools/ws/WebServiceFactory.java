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

package com.wavemaker.tools.ws;

import java.io.IOException;

import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;
import com.wavemaker.runtime.ws.util.Constants;
import com.wavemaker.tools.pws.PwsRestServiceGeneratorBeanFactory;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.ServiceDefinitionFactory;
import com.wavemaker.tools.service.ServiceGeneratorFactory;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.ServiceGenerator;
import com.wavemaker.tools.ws.wsdl.WSDL;
import com.wavemaker.tools.ws.wsdl.WSDLException;
import com.wavemaker.tools.ws.wsdl.WSDLManager;

/**
 * 
 * @author Frankie Fu
 * @author Jeremy Grelle
 */
public class WebServiceFactory implements ServiceDefinitionFactory, ServiceGeneratorFactory {

    public DeprecatedServiceDefinition getServiceDefinition(Resource f) {
        return getServiceDefinition(f, null, null);
    }

    @Override
    public DeprecatedServiceDefinition getServiceDefinition(Resource f, String serviceId, DesignServiceManager serviceMgr) {
        if (f.getFilename().endsWith(Constants.WSDL_EXT)) {
            try {
                return WSDLManager.processWSDL(f.getURL().toString(), serviceId);
            } catch (WSDLException e) {
                throw new WMRuntimeException(e);
            } catch (IOException e) {
                throw new WMRuntimeException(e);
            }
        }
        return null;
    }

    @Override
    public ServiceGenerator getServiceGenerator(GenerationConfiguration cfg) {
        if (cfg.getServiceDefinition() instanceof WSDL) {
            WSDL wsdl = (WSDL) cfg.getServiceDefinition();
            WSDL.WebServiceType serviceType = wsdl.getWebServiceType();
            if (serviceType == WSDL.WebServiceType.SOAP) {
                return new SOAPServiceGenerator(cfg);
            } else if (serviceType == WSDL.WebServiceType.REST) {
                String partnerName = cfg.getPartnerName();
                if (partnerName == null || partnerName.length() == 0) {
                    return new RESTServiceGenerator(cfg);
                } else {
                    PwsRestServiceGeneratorBeanFactory factory = (PwsRestServiceGeneratorBeanFactory) RuntimeAccess.getInstance().getSpringBean(
                        "pwsRestServiceGeneratorBeanFactory");
                    ServiceGenerator restServiceGenerator = factory.getPwsRestServiceGenerator(partnerName);
                    restServiceGenerator.init(cfg);
                    return restServiceGenerator;
                }
            }
        }
        return null;
    }
}
