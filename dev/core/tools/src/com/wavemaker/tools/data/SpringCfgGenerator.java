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
package com.wavemaker.tools.data;

import java.util.Collection;
import java.util.Properties;

import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.data.util.DataServiceUtils;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class SpringCfgGenerator extends BaseDataModelSetup {

    @Override
    protected boolean customInit(Collection<String> requiredProperties) {

        checkServiceName(false, requiredProperties);
        checkDestdir(requiredProperties);
        checkPackage();
        checkClassName(requiredProperties);
        checkServiceName(true, requiredProperties);
        checkDataPackage();

        return true;
    }

    @Override
    protected void customRun() {
        getConfigurationExporter().execute();
        writeConnectionPropertiesTemplate();
    }

    @Override
    protected void customDispose() {}

    private void writeConnectionPropertiesTemplate() {
        Properties p = new Properties();

        p.setProperty(serviceName + DataServiceConstants.DB_USERNAME,
                (getUsername() == null ? "" : getUsername()));
        p.setProperty(serviceName + DataServiceConstants.DB_PASS,
                (getPassword() == null ? "" : getPassword()));
        p.setProperty(serviceName + DataServiceConstants.DB_URL,
                (getConnectionUrl() == null ? "" : getConnectionUrl()));
        p.setProperty(serviceName + DataServiceConstants.DB_DRIVER_CLASS_NAME,
                (getDriverClassName() == null ? "" : getDriverClassName()));
        p.setProperty(serviceName + DataServiceConstants.DB_DIALECT,
                (getDialect() == null ? "" : getDialect()));

        DataServiceUtils.writeProperties(p, destdir, serviceName);
    }
}
