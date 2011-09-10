/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.data.spring;

import java.io.File;
import java.util.Arrays;

import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.data.DataServiceDefinition;
import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.util.QueryRunner;
import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;
import com.wavemaker.tools.spring.SpringServiceDefinitionWrapper;

/**
 * @author Simon Toens
 * @version $Rev:22685 $ - $Date:2008-05-30 16:19:36 -0700 (Fri, 30 May 2008) $
 * 
 */
public class SpringService {

    private SpringService() {
    }

    public static DeprecatedServiceDefinition initialize(File cfg) {

        return initialize(new FileSystemResource(cfg));

    }

    public static DeprecatedServiceDefinition initialize(String cfg) {

        return initialize(new ClassPathResource(cfg));

    }

    public static DeprecatedServiceDefinition initialize(Resource r) {

        return getDataServiceDefinition(initAppCtx(r));
    }

    public static QueryRunner initQueryRunner(File cfg) {

        return initQueryRunner(initAppCtx(new FileSystemResource(cfg)));

    }

    public static QueryRunner initQueryRunner(String cfg) {

        Resource r = new ClassPathResource(cfg);

        return initQueryRunner(initAppCtx(r));
    }

    private static QueryRunner initQueryRunner(GenericApplicationContext ctx) {

        return new QueryRunner(getDataServiceManager(ctx));

    }

    private static DeprecatedServiceDefinition getDataServiceDefinition(
            GenericApplicationContext ctx) {

        DataServiceManager mgr = getDataServiceManager(ctx);

        DataServiceDefinition def = new DataServiceDefinition(mgr.getMetaData());

        return new SpringServiceDefinitionWrapper(def, ctx);
    }

    private static DataServiceManager getDataServiceManager(
            GenericApplicationContext ctx) {

        DataServiceManager mgr = null;

        try {
            String[] beanNames = ctx.getBeanNamesForType(
                    DataServiceManager.class, true, false);
            if (null==beanNames || 1!=beanNames.length) {
                throw new WMRuntimeException(
                        com.wavemaker.common.Resource.NO_DATA_SERVICE_MGR_BEAN_FOUND,
                        Arrays.toString(beanNames));
            }
            
            mgr = (DataServiceManager) ctx.getBean(beanNames[0]);
        } catch (RuntimeException ex) {
            try {
                ctx.close();
            } catch (Exception ignore) {
            }
            throw ex;
        }

        return new SpringDataServiceManagerWrapper(mgr, ctx);
    }

    private static GenericApplicationContext initAppCtx(Resource r) {
        
        ClassPathResource servicetypes = new ClassPathResource("servicetypes.xml");

        GenericApplicationContext ctx = new GenericApplicationContext();
        
        XmlBeanDefinitionReader xmlReader = new XmlBeanDefinitionReader(ctx);

        xmlReader.setValidationMode(XmlBeanDefinitionReader.VALIDATION_NONE);

        xmlReader.loadBeanDefinitions(servicetypes);
        xmlReader.loadBeanDefinitions(r);

        ctx.refresh();

        return ctx;
    }
}
