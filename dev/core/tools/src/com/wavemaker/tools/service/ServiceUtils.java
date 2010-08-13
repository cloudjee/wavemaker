/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.service;

import java.io.File;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.ServiceGenerator;

/**
 * @author Simon Toens
 * 
 */
public class ServiceUtils {

    private static final ServiceFactoryManager factoryManager = ServiceFactoryManager
            .getInstance();

    public static DeprecatedServiceDefinition getServiceDefinition(File f,
            String serviceId, DesignServiceManager serviceMgr) {

        if (f == null) {
            throw new IllegalArgumentException("File cannot be null");
        }

        // ugly cast, but like Simon mentions below, this is basically just
        // used by dataservice. --small
        DeprecatedServiceDefinition rtn = (DeprecatedServiceDefinition) factoryManager.getServiceDefinition(f, serviceId, serviceMgr);

        /*
         * XXX allow any non-service files to pass through. simon: this is a bit
         * overdesigned anyway, since at this time only data services use this
         * infrastructure
         * 
         * if (rtn == null) { throw new
         * WMRuntimeException(Resource.UNKNOWN_SERVICE_DEFINITION, f
         * .getAbsolutePath()); }
         */

        return rtn;

    }

    public static ServiceGenerator getServiceGenerator(
            GenerationConfiguration cfg) {

        if (cfg.getServiceDefinition() == null) {
            throw new IllegalArgumentException(
                    "ServiceDefinition cannot be null");
        }

        ServiceGenerator rtn = factoryManager.getServiceGenerator(cfg);

        if (rtn == null) {
            throw new WMRuntimeException(Resource.NO_SERVICE_GENERATOR, cfg
                    .getServiceDefinition().getServiceId());
        }

        return rtn;

    }

    private ServiceUtils() {
    }

}
