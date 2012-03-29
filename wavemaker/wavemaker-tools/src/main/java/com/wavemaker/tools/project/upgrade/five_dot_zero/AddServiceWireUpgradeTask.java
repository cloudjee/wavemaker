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

package com.wavemaker.tools.project.upgrade.five_dot_zero;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBException;

import org.apache.commons.lang.StringUtils;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectUtils;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.util.DesignTimeUtils;

/**
 * Adds ServiceWire information to the spring bean definitions of all services defined in the current project.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class AddServiceWireUpgradeTask implements UpgradeTask {

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        DesignServiceManager dsm = DesignTimeUtils.getDesignServiceManager(project);

        // build, so we have access to all the classes
        try {
            dsm.getDeploymentManager().build();

            upgradeServices(dsm, project, upgradeInfo);
        } finally {
            dsm.getDeploymentManager().cleanBuild();
        }
    }

    /**
     * Actually do the upgrade.
     */
    private void upgradeServices(DesignServiceManager dsm, Project project, UpgradeInfo upgradeInfo) {

        List<String> touchedServices = new ArrayList<String>();
        ClassLoader cl = ProjectUtils.getClassLoaderForProject(project);

        for (Service service : dsm.getServices()) {
            // ignore runtimeService
            if (DesignServiceManager.RUNTIME_SERVICE_ID.equals(service.getId())) {
                continue;
            }

            if (service.getSpringFile() == null) {
                throw new WMRuntimeException(MessageResource.ADD_SRV_UPGRADE_NO_SPRING_FILE, project.getProjectName());
            }

            try {
                File springFile = dsm.getServiceRuntimeFolder(service.getId()).getFile(service.getSpringFile());
                if (!springFile.exists()) {
                    DesignServiceManager.generateSpringServiceConfig(service.getId(), service.getClazz(),
                        dsm.getDesignServiceType(service.getType()), springFile, project);
                    continue;
                }

                Beans beans = SpringConfigSupport.readBeans(springFile);

                boolean foundServiceWire = false;
                for (Bean bean : beans.getBeanList()) {
                    if (bean.getClazz() != null) {
                        Class<?> klass = cl.loadClass(bean.getClazz());
                        Class<?> serviceWireClass = cl.loadClass(ServiceWire.class.getName());
                        if (serviceWireClass.isAssignableFrom(klass)) {
                            foundServiceWire = true;
                            break;
                        }
                    }
                }

                if (!foundServiceWire) {
                    Bean serviceWireBean = DesignServiceManager.generateServiceWireBean(dsm.getDesignServiceType(service.getType()), service.getId());
                    beans.addBean(serviceWireBean);
                    SpringConfigSupport.writeBeans(beans, springFile);
                    touchedServices.add(service.getId());
                }
            } catch (JAXBException e) {
                throw new WMRuntimeException(e);
            } catch (IOException e) {
                throw new WMRuntimeException(e);
            } catch (ClassNotFoundException e) {
                throw new WMRuntimeException(e);
            }
        }

        if (!touchedServices.isEmpty()) {
            upgradeInfo.addMessage("New ServiceWire added to services: " + StringUtils.join(touchedServices, ", "));
        }
    }
}
