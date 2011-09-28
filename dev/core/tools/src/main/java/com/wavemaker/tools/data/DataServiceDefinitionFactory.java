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

package com.wavemaker.tools.data;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;

import org.springframework.core.io.Resource;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.data.ExternalDataModelConfig;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.tools.data.salesforce.DataServiceGenerator_SF;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.ServiceDefinitionFactory;
import com.wavemaker.tools.service.ServiceGeneratorFactory;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.ServiceGenerator;

public class DataServiceDefinitionFactory implements ServiceDefinitionFactory,
        ServiceGeneratorFactory {

    public ServiceDefinition getServiceDefinition(Resource f, String serviceId,
            DesignServiceManager serviceMgr) {

        try {
			if (f.getFile().isDirectory()) {
			    for (String s : f.getFile().list(new FilenameFilter() {
			        public boolean accept(File dir, String file) {
			            return file.endsWith(".xml");
			        }
			    })) {

			        File potential = new File(f.getFile(), s);

			        ServiceDefinition rtn = initServiceDefinition(potential,
			                serviceId, serviceMgr);
			        if (rtn != null) {
			            return rtn;
			        }
			    }
			} else {
			    return initServiceDefinition(f.getFile(), serviceId, serviceMgr);
			}
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}

        return null;
    }

    public ServiceGenerator getServiceGenerator(GenerationConfiguration cfg) {

        ServiceDefinition def = cfg.getServiceDefinition();

        if (def instanceof DataServiceDefinition) {
            if (def.getServiceId().equals(CommonConstants.SALESFORCE_SERVICE)) //salesforce
                return new DataServiceGenerator_SF(cfg);
            else
                return new DataServiceGenerator(cfg);
        }
        return null;
    }

    private ServiceDefinition initServiceDefinition(File f, String serviceId,
            DesignServiceManager serviceMgr) {

        if (!f.getName().endsWith(".xml")) {
            return null;
        }
        DataServiceDefinition rtn = null;

        try {
            ExternalDataModelConfig externalConfig = 
		new DesignExternalDataModelConfig(serviceId, serviceMgr);
            
            rtn = new DataServiceDefinition(serviceId, externalConfig,
                    serviceMgr, f);

            if (!rtn.getDataModelConfiguration().isKnownConfiguration() &&
                    !serviceId.equals(CommonConstants.SALESFORCE_SERVICE)) { //salesforce
                rtn.dispose();
                return null;
            }
        } catch (Exception ex) {
            if (rtn != null) {
                rtn.dispose();
                return null;
            }
        }

        return rtn;
    }
}
