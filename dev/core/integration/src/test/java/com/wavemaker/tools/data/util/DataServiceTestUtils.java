/*
 *  Copyright (C) 2008-2009 WaveMaker Software, Inc.
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

package com.wavemaker.tools.data.util;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Properties;

import org.springframework.jndi.JndiObjectFactoryBean;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.data.DataServiceTestConstants;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.tools.data.DataServiceSpringConfiguration;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.util.AntUtils;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 * 
 */
public class DataServiceTestUtils {

    public static Properties loadSakilaConnectionProperties() {
        File serviceRoot = null;
        try {
            serviceRoot = DataServiceTestUtils.setupSakilaConfiguration().getParentFile();
            File props = new File(serviceRoot, "mysql_sakila.properties");
            return DataServiceUtils.loadDBProperties(props);
        } catch (IOException ex) {
            throw new AssertionError(ex);
        } finally {
            try {
                IOUtils.deleteRecursive(serviceRoot);
            } catch (IOException ex) {
                throw new AssertionError(ex);
            }
        }
    }

    public static File setupSakilaConfiguration() throws IOException {

        return setupSakilaConfiguration(IOUtils.createTempDirectory());

    }

    public static File setupSakilaConfiguration(File rootDir) throws IOException {

        File sakila = ClassLoaderUtils.getClasspathFile("sakila.jar").getFile();
        AntUtils.unjar(sakila, rootDir);

        File serviceCfg = new File(rootDir, DataServiceTestConstants.SAKILA_SPRING_CFG);

        return serviceCfg;
    }

    public static void verifyJNDIDataSource(String serviceId, DesignServiceManager designMgr, String jndiName) {
        String rootPath = DesignServiceManager.getRuntimeRelativeDir(serviceId);
        String cfgFile = com.wavemaker.tools.data.util.DataServiceUtils.getCfgFileName(serviceId);
        DataServiceSpringConfiguration springConfig = new DataServiceSpringConfiguration(designMgr.getProjectManager().getCurrentProject(), rootPath,
            cfgFile, serviceId);
        if (!springConfig.isKnownConfiguration()) {
            throw new AssertionError("Expected known configuration");
        }
        List<Bean> l = springConfig.getBeansByType(JndiObjectFactoryBean.class);
        verifyJNDIDataSource(l, jndiName);
    }

    public static void verifyJNDIDataSource(Beans beans, String jndiName) {
        verifyJNDIDataSource(beans.getBeansByType(JndiObjectFactoryBean.class), jndiName);
    }

    private static void verifyJNDIDataSource(List<Bean> l, String jndiName) {
        if (l.size() != 1) {
            throw new AssertionError("Expected one bean; beans: " + l);
        }
        if (!jndiName.equals(l.iterator().next().getProperty(DataServiceSpringConfiguration.JNDI_NAME_PROPERTY).getValue())) {
            throw new AssertionError("Expected jndi name to be " + jndiName);
        }
    }

    private DataServiceTestUtils() {
        throw new UnsupportedOperationException();
    }
}
