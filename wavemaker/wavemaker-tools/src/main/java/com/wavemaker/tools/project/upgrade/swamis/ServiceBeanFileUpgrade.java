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

package com.wavemaker.tools.project.upgrade.swamis;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

import org.apache.commons.lang.StringUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.util.DesignTimeUtils;

/**
 * Create separate bean files for all services that don't already have them.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class ServiceBeanFileUpgrade implements UpgradeTask {

    private static final JAXBContext definitionsContext;

    static {
        try {
            definitionsContext = JAXBContext.newInstance("com.wavemaker.tools.service.definitions");
        } catch (JAXBException e) {
            throw new WMRuntimeException(e);
        }
    }

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        DesignServiceManager dsm = DesignTimeUtils.getDesignServiceManager(project);
        List<String> touchedProjects = new ArrayList<String>();

        for (Service service : dsm.getServices()) {
            if (service.getSpringFile() == null) {
                // create the service bean file
                File serviceBeanFile = dsm.getServiceBeanXmlFile(service.getId());
                if (!serviceBeanFile.exists()) {
                    try {
                        DesignServiceManager.generateSpringServiceConfig(service.getId(), service.getClazz(),
                            dsm.getDesignServiceType(service.getType()), serviceBeanFile, project);
                    } catch (JAXBException e) {
                        throw new WMRuntimeException(e);
                    } catch (IOException e) {
                        throw new WMRuntimeException(e);
                    }

                }

                // edit the servicedef
                File serviceDefFile = dsm.getServiceDefXmlFile(service.getId());
                service.setSpringFile(serviceBeanFile.getName());

                Marshaller marshaller;
                try {
                    marshaller = definitionsContext.createMarshaller();
                    marshaller.setProperty("jaxb.formatted.output", true);
                    Writer writer = serviceDefFile.getContent().asWriter();
                    try {
                        marshaller.marshal(service, writer);
                    } finally {
                        writer.close();
                    }
                } catch (Exception e) {
                    throw new WMRuntimeException(e);
                }

                // finally, add this to the list of modified services
                touchedProjects.add(service.getId());
            }
        }

        if (!touchedProjects.isEmpty()) {
            upgradeInfo.addVerbose("Converted bean definitions to a separate file for services: " + StringUtils.join(touchedProjects, ", "));
        }
    }
}