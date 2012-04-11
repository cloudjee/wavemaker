/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.data.upgrade;

import java.io.File;
import java.util.List;

import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.core.io.Resource;

import com.wavemaker.runtime.data.DefaultTaskManager;
import com.wavemaker.runtime.data.spring.ConfigurationAndSessionFactoryBean;
import com.wavemaker.runtime.data.spring.SpringDataServiceManager;
import com.wavemaker.runtime.data.spring.WMPropertyPlaceholderConfigurer;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.project.LocalStudioFileSystem;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.service.AbstractFileService;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.FileService;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.ConstructorArg;
import com.wavemaker.tools.spring.beans.Entry;
import com.wavemaker.tools.spring.beans.Map;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 */
public class SpringConfigurationUpgrade extends BaseDataUpgradeTask implements UpgradeTask {

    @Override
    protected void upgrade(Service service) {
        upgradeSpringConfiguration(service);
    }

    @Override
    protected String getUpgradeMsg() {
        return "Upgraded data service Spring files";
    }

    private void upgradeSpringConfiguration(Service service) {

        final String id = service.getId();

        final DesignServiceManager mgr = getDesignServiceManager();

        LocalStudioFileSystem fileSystem = new LocalStudioFileSystem();
        FileService fileService = new AbstractFileService(fileSystem) {

            @Override
            public Resource getFileServiceRoot() {
                return mgr.getServiceHome(id);
            }
        };

        File cfgFile = getCfgFile(id);

        Beans beans = DataServiceUtils.readBeans(cfgFile, fileService);

        upgradePropertyPlaceholderConfigurer(beans);
        upgradeLocalSessionFactory(beans);
        upgradeSpringDataServiceManager(beans);
        upgradeTaskManager(beans);

        String path = cfgFile.getParentFile().getName() + "/" + cfgFile.getName();
        DataServiceUtils.writeBeans(beans, fileService, path);
    }

    private void upgradePropertyPlaceholderConfigurer(Beans beans) {

        List<Bean> ppcs = beans.getBeansByType(PropertyPlaceholderConfigurer.class.getName());

        for (Bean b : ppcs) {
            b.setClazz(WMPropertyPlaceholderConfigurer.class.getName());
        }
    }

    private void upgradeLocalSessionFactory(Beans beans) {
        List<Bean> ppcs = beans.getBeansByType(DataServiceConstants.OLD_SESSION_FACTORY_CLASS_NAME);

        for (Bean b : ppcs) {
            b.setClazz(ConfigurationAndSessionFactoryBean.class.getName());
        }
    }

    private void upgradeSpringDataServiceManager(Beans beans) {
        List<Bean> ppcs = beans.getBeansByType(DataServiceConstants.OLD_SPRING_DATA_SERVICE_MANAGER_NAME);

        if (ppcs.isEmpty()) {
            // this upgrades 4.0 alpha projects
            boolean isAlphaProject = false;
            ppcs = beans.getBeansByType(SpringDataServiceManager.class.getName());
            for (Bean b : ppcs) {
                ConstructorArg arg = new ConstructorArg();
                boolean useIndividualCRUDOps = false;
                if (b.getConstructorArgs().size() > 4) {
                    arg = b.getConstructorArgs().get(4);
                    if (arg.getValueElement() != null) {
                        List<String> cl = arg.getValueElement().getContent();
                        if (!cl.isEmpty()) {
                            useIndividualCRUDOps = Boolean.valueOf(cl.get(0));
                            isAlphaProject = true;
                        }
                    }

                }

                if (isAlphaProject) {
                    b.getMetasAndConstructorArgsAndProperties().remove(arg);
                    arg = new ConstructorArg();
                    b.getMetasAndConstructorArgsAndProperties().add(arg);
                    addGenerateCRUDOps(arg, useIndividualCRUDOps);
                }
            }
        } else {
            for (Bean b : ppcs) {
                b.setClazz(SpringDataServiceManager.class.getName());
                // add new ctor arg so we generate old style individual
                // CRUD operations, for backward compat.
                ConstructorArg arg = new ConstructorArg();
                b.getMetasAndConstructorArgsAndProperties().add(arg);
                addGenerateCRUDOps(arg, true);
            }
        }
    }

    private void addGenerateCRUDOps(ConstructorArg arg, boolean value) {
        Map m = new Map();
        arg.setMap(m);
        Entry e = new Entry();
        m.getEntries().add(e);
        e.setKey(DataServiceConstants.GENERATE_OLD_STYLE_OPRS_PROPERTY);
        e.setValue(String.valueOf(value));
    }

    private void upgradeTaskManager(Beans beans) {
        List<Bean> ppcs = beans.getBeansByType(DataServiceConstants.OLD_TASK_MANAGER_NAME);

        for (Bean b : ppcs) {
            b.setClazz(DefaultTaskManager.class.getName());
        }
    }
}
