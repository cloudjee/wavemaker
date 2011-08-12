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

package com.wavemaker.runtime.data.cloudfoundry;

import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.cloudfoundry.runtime.env.CloudEnvironment;
import org.cloudfoundry.runtime.env.MysqlServiceInfo;
import org.cloudfoundry.runtime.service.relational.MysqlServiceCreator;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.util.CollectionUtils;

import com.wavemaker.runtime.data.spring.ConfigurationAndSessionFactoryBean;

/**
 * {@link BeanFactoryPostProcessor} implementation that replaces all local MySQL datasources with services provided by
 * CloudFoundry.
 * 
 * @author Jeremy Grelle
 */
public class CloudFoundryDataServiceBeanFactoryPostProcessor implements BeanFactoryPostProcessor {

    private static final Log log = LogFactory.getLog(CloudFoundryDataServiceBeanFactoryPostProcessor.class);

    private static final String DS_BEAN_SUFFIX = "DataSource";

    private CloudEnvironment cloudEnvironment = new CloudEnvironment();

    /**
     * {@inheritDoc}
     */
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        DefaultListableBeanFactory defaultListableBeanFactory = (DefaultListableBeanFactory) beanFactory;

        if (CollectionUtils.isEmpty(cloudEnvironment.getServices())) {
            return;
        }
        processDataSources(defaultListableBeanFactory);
        processHibernateProperties(defaultListableBeanFactory);
    }

    /**
     * @param beanFactory
     */
    private void processHibernateProperties(DefaultListableBeanFactory beanFactory) {
        String[] sessionFactoryBeanNames = beanFactory.getBeanNamesForType(ConfigurationAndSessionFactoryBean.class);

        for (String sfBean : sessionFactoryBeanNames) {
            BeanDefinition beanDefinition = getBeanDefinition(beanFactory, sfBean);
            beanDefinition.setLazyInit(false);
        }
    }

    private BeanDefinition getBeanDefinition(DefaultListableBeanFactory beanFactory, String beanName) {
        if (beanName.startsWith(BeanFactory.FACTORY_BEAN_PREFIX)) {
            beanName = beanName.substring(BeanFactory.FACTORY_BEAN_PREFIX.length());
        }
        return beanFactory.getBeanDefinition(beanName);
    }

    /**
     * @param defaultListableBeanFactory
     */
    private void processDataSources(DefaultListableBeanFactory defaultListableBeanFactory) {
        String[] dataSourceBeanNames = defaultListableBeanFactory.getBeanNamesForType(DataSource.class);

        for (String dsBean : dataSourceBeanNames) {
            if (!dsBean.endsWith(DS_BEAN_SUFFIX)) {
                continue;
            }

            String serviceName = dsBean.substring(0, dsBean.indexOf(DS_BEAN_SUFFIX));

            if (!serviceExists(serviceName)) {
                boolean foundAlias = false;
                for (String alias : defaultListableBeanFactory.getAliases(dsBean)) {
                    if (serviceExists(alias)) {
                        serviceName = alias;
                        foundAlias = true;
                        break;
                    }
                }
                if (!foundAlias) {
                    log.warn("Expected to find a service with the name '" + serviceName + "' but none was found.");
                    continue;
                }
            }

            MysqlServiceInfo service = cloudEnvironment.getServiceInfo(serviceName, MysqlServiceInfo.class);
            if (service != null) {
                defaultListableBeanFactory.removeBeanDefinition(dsBean);
                MysqlServiceCreator mysqlCreationHelper = new MysqlServiceCreator(cloudEnvironment);
                DataSource cfDataSource = mysqlCreationHelper.createSingletonService().service;
                defaultListableBeanFactory.registerSingleton(dsBean, cfDataSource);
            } else {
                log.warn("Service '" + serviceName + "' found, but it is not a MySql service as expected.");
            }
        }
    }

    /**
     * @param serviceName
     * @return
     */
    private boolean serviceExists(String serviceName) {
        List<Map<String, Object>> services = cloudEnvironment.getServices();
        for (Map<String, Object> serviceProps : services) {
            if (serviceName.equals(serviceProps.get("name"))) {
                return true;
            }
        }
        return false;
    }

}
