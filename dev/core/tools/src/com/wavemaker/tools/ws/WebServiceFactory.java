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

import java.io.File;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;
import com.wavemaker.runtime.ws.util.Constants;
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
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class WebServiceFactory implements ServiceDefinitionFactory,
        ServiceGeneratorFactory {
    
    public DeprecatedServiceDefinition getServiceDefinition(File f) {
        return getServiceDefinition(f, null, null);
    }

    public DeprecatedServiceDefinition getServiceDefinition(File f, String serviceId,
            DesignServiceManager serviceMgr) {
        if (f.getName().endsWith(Constants.WSDL_EXT)) {
            try {
                return WSDLManager.processWSDL(f.toURI().toString(), serviceId);
            } catch (WSDLException e) {
                throw new WMRuntimeException(e);
            }
        }
        return null;
    }

    public ServiceGenerator getServiceGenerator(GenerationConfiguration cfg) {
        if (cfg.getServiceDefinition() instanceof WSDL) {
            WSDL wsdl = (WSDL) cfg.getServiceDefinition();
            WSDL.WebServiceType serviceType = wsdl.getWebServiceType();
            if (serviceType == WSDL.WebServiceType.SOAP) {
                return new SOAPServiceGenerator(cfg);
            } else if (serviceType == WSDL.WebServiceType.REST) {
                return new RESTServiceGenerator(cfg);
            }
        }
        return null;
    }
}

