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

package com.wavemaker.tools.project.upgrade.swamis;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

import org.apache.commons.lang.StringUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.util.DesignTimeUtils;

/**
 * Create separate bean files for all services that don't already have them.
 * 
 * @author small
 * @version $Rev:22689 $ - $Date:2008-05-30 16:49:03 -0700 (Fri, 30 May 2008) $
 *
 */
public class ServiceBeanFileUpgrade implements UpgradeTask {

    private static final JAXBContext definitionsContext;
    
    static {
        try {
            definitionsContext = JAXBContext
                    .newInstance("com.wavemaker.tools.service.definitions");
        } catch (JAXBException e) {
            throw new WMRuntimeException(e);
        }
    }

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        
        DesignServiceManager dsm = DesignTimeUtils.getDSMForProjectRoot(
                project.getProjectRoot());
        List<String> touchedProjects = new ArrayList<String>();

        for (Service service: dsm.getServices()) {
            if (null == service.getSpringFile()) {
                // create the service bean file
                File serviceBeanFile = dsm.getServiceBeanXml(service.getId());
                if (!serviceBeanFile.getParentFile().exists()) {
                    serviceBeanFile.getParentFile().mkdir();
                }
                if (!serviceBeanFile.exists()) {
                    try {
                        DesignServiceManager
                                .generateSpringServiceConfig(service.getId(),
                                        service.getClazz(),
                                        dsm.getDesignServiceType(service.getType()),
                                        serviceBeanFile, project);
                    } catch (JAXBException e) {
                        throw new WMRuntimeException(e);
                    } catch (IOException e) {
                        throw new WMRuntimeException(e);
                    }
                    
                }
                
                // edit the servicedef
                File serviceDefFile = dsm.getServiceDefXml(service.getId());
                service.setSpringFile(serviceBeanFile.getName());
                
                Marshaller marshaller;
                try {
                    marshaller = definitionsContext.createMarshaller();
                    marshaller.setProperty("jaxb.formatted.output", true);
                    marshaller.marshal(service, serviceDefFile);
                } catch (JAXBException e) {
                    throw new WMRuntimeException(e);
                }
                
                // finally, add this to the list of modified services
                touchedProjects.add(service.getId());
            }
        }
        
        if (!touchedProjects.isEmpty()) {
            upgradeInfo.addVerbose("Converted bean definitions to a separate file for services: "+
                    StringUtils.join(touchedProjects, ", "));
        }
    }
}