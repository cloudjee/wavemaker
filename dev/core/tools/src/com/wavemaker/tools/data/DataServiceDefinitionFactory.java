/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.data;

import java.io.File;
import java.io.FilenameFilter;

import com.wavemaker.runtime.data.ExternalDataModelConfig;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.ServiceDefinitionFactory;
import com.wavemaker.tools.service.ServiceGeneratorFactory;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.ServiceGenerator;

public class DataServiceDefinitionFactory implements ServiceDefinitionFactory,
        ServiceGeneratorFactory {

    public ServiceDefinition getServiceDefinition(File f, String serviceId,
            DesignServiceManager serviceMgr) {

        if (f.isDirectory()) {
            for (String s : f.list(new FilenameFilter() {
                public boolean accept(File dir, String file) {
                    return file.endsWith(".xml");
                }
            })) {

                File potential = new File(f, s);

                ServiceDefinition rtn = initServiceDefinition(potential,
                        serviceId, serviceMgr);
                if (rtn != null) {
                    return rtn;
                }
            }
        } else {
            return initServiceDefinition(f, serviceId, serviceMgr);
        }

        return null;
    }

    public ServiceGenerator getServiceGenerator(GenerationConfiguration cfg) {

        ServiceDefinition def = cfg.getServiceDefinition();

        if (def instanceof DataServiceDefinition) {
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

            if (!rtn.getDataModelConfiguration().isKnownConfiguration()) {
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
