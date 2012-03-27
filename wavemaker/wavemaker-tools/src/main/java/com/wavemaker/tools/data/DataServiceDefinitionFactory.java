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

package com.wavemaker.tools.data;

import org.springframework.core.io.Resource;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.data.ExternalDataModelConfig;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.tools.data.salesforce.SalesForceDataServiceGenerator;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.ServiceDefinitionFactory;
import com.wavemaker.tools.service.ServiceFile;
import com.wavemaker.tools.service.ServiceGeneratorFactory;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.ServiceGenerator;

public class DataServiceDefinitionFactory implements ServiceDefinitionFactory, ServiceGeneratorFactory {

    private final StudioFileSystem fileSystem;

    public DataServiceDefinitionFactory() {
        this.fileSystem = (StudioFileSystem) RuntimeAccess.getInstance().getSpringBean("fileSystem");
    }

    public DataServiceDefinitionFactory(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    @Override
    public ServiceDefinition getServiceDefinition(ServiceFile serviceFile, String serviceId, DesignServiceManager serviceMgr) {
        return initServiceDefinition(serviceFile.asResource(), serviceId, serviceMgr);
    }

    @Override
    public ServiceGenerator getServiceGenerator(GenerationConfiguration cfg) {

        ServiceDefinition def = cfg.getServiceDefinition();

        if (def instanceof DataServiceDefinition) {
            if (def.getServiceId().equals(CommonConstants.SALESFORCE_SERVICE)) {
                return new SalesForceDataServiceGenerator(cfg);
            } else {
                return new DataServiceGenerator(cfg);
            }
        }
        return null;
    }

    private ServiceDefinition initServiceDefinition(Resource f, String serviceId, DesignServiceManager serviceMgr) {

        if (!f.getFilename().endsWith(".xml")) {
            return null;
        }
        DataServiceDefinition rtn = null;

        try {
            ExternalDataModelConfig externalConfig = new DesignExternalDataModelConfig(serviceId, serviceMgr);

            rtn = new DataServiceDefinition(serviceId, externalConfig, serviceMgr, f);

            if (!rtn.getDataModelConfiguration().isKnownConfiguration() && !serviceId.equals(CommonConstants.SALESFORCE_SERVICE)) {
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
