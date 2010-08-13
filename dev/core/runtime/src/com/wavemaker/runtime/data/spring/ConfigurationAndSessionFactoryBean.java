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
package com.wavemaker.runtime.data.spring;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.springframework.orm.hibernate3.LocalSessionFactoryBean;
import org.springframework.beans.BeanUtils;
import com.wavemaker.runtime.WMAppContext;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class ConfigurationAndSessionFactoryBean extends LocalSessionFactoryBean {

    private String name = null;
    private Class configurationExtClass = ConfigurationExt.class;
    public static String projectName;
    
    @SuppressWarnings("unchecked")
    @Override
    public void setConfigurationClass(Class configurationClass) {
        throw new IllegalArgumentException(
                "Cannot customize configuration class");
    }

    @Override
    public Configuration newConfiguration() {
        if (name == null) {
            throw new IllegalStateException(
                    "name must be set before creating new Configuration");
        }

        Configuration rtn;
        WMAppContext wmApp = WMAppContext.getInstance();
        if (wmApp != null && wmApp.isMultiTenant()) {
            rtn = (ConfigurationExt)BeanUtils.instantiateClass(this.configurationExtClass);
        } else {
            rtn = super.newConfiguration();
        }
        ConfigurationRegistry.getInstance().register(name, rtn);
        return rtn;
    }

    @Override
    protected SessionFactory buildSessionFactory() throws Exception {
        SessionFactory rtn = super.buildSessionFactory();
        ConfigurationRegistry.getInstance().register(name, rtn);
        return rtn;
    }

    @Override
    public void destroy() {
        ConfigurationRegistry.getInstance().remove(name);
        super.destroy();
    }

    public void setName(String name) {
        this.name = name;
    }
}
