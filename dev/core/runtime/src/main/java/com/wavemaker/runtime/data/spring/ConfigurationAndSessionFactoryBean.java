/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.data.spring;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.springframework.orm.hibernate3.LocalSessionFactoryBean;
import org.springframework.util.Assert;

import com.wavemaker.runtime.WMAppContext;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 */
public class ConfigurationAndSessionFactoryBean extends LocalSessionFactoryBean {

    private String name = null;

    @Override
    public void afterPropertiesSet() throws Exception {
        setConfigurationClass(getDefaultConfigurationClass());
        super.afterPropertiesSet();
    }

    @Override
    public Configuration newConfiguration() {
        if (this.name == null) {
            throw new IllegalStateException("name must be set before creating new Configuration");
        }

        Configuration configuration = super.newConfiguration();
        Assert.isAssignable(this.getDefaultConfigurationClass(), configuration.getClass(), "Type of Hibernate Configuration "
            + "object is incorrect for the current studio environment.  Expected a subclass of " + this.getDefaultConfigurationClass() + " but was "
            + configuration.getClass());
        ConfigurationRegistry.getInstance().register(this.name, configuration);
        return configuration;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    protected void afterSessionFactoryCreation() throws Exception {
        SessionFactory sessionFactory = getSessionFactory();
        ConfigurationRegistry.getInstance().register(this.name, sessionFactory);
    }

    @Override
    protected void beforeSessionFactoryDestruction() {
        ConfigurationRegistry.getInstance().remove(this.name);
    }

    private Class<? extends Configuration> getDefaultConfigurationClass() {
        WMAppContext wmApp = WMAppContext.getInstance();
        if (wmApp != null && wmApp.isMultiTenant()) {
            return ConfigurationExt.class;
        } else {
            return Configuration.class;
        }
    }
}
