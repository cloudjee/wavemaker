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

import javax.xml.bind.JAXBException;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.events.EventWire;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.service.ConfigurationCompiler;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.EventNotifier;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.DefaultableBoolean;
import com.wavemaker.tools.spring.beans.Property;
import com.wavemaker.tools.util.DesignTimeUtils;

/**
 * Move event definitions to the new {@link EventWire} beans inside of the
 * service's bean definition file.  This must run after
 * @link ServiceBeanFileUpgrade}.
 * 
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class EventRefactorUpgrade implements UpgradeTask {

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        
        DesignServiceManager dsm = DesignTimeUtils.getDSMForProjectRoot(project.getProjectRoot());

        try {
            // upgrade events
            for (Service service : dsm.getServices()) {
                // ignore runtimeService
                if (DesignServiceManager.RUNTIME_SERVICE_ID.equals(service
                        .getId())) {
                    continue;
                }

                if (!service.getEventnotifier().isEmpty()) {
                    File beansFile = dsm.getServiceBeanXml(service.getId());
                    Beans beans = SpringConfigSupport.readBeans(beansFile,
                            project);
                    
                    for (EventNotifier event : service.getEventnotifier()) {
                        
                        String existingBeanId = null;
                        for (Service srvc: dsm.getServices()) {
                            if (srvc.getClazz().equals(event.getName())) {
                                existingBeanId = srvc.getId();
                            }
                        }

                        Bean eventWireBean;
                        if (null!=existingBeanId) {
                            eventWireBean = getEventWireBean(service.getId(),
                                    existingBeanId);
                        } else {
                            eventWireBean = getEventWireBean_EmbeddedNotifier(
                                    service.getId(), event.getName());
                        }
                        beans.addBean(eventWireBean);
                    }

                    service.getEventnotifier().clear();
                    dsm.defineService(service);
                    
                    SpringConfigSupport.writeBeans(beans, beansFile, project);
                }
            }
            
            // remove eventManager by regenerating project-managers.xml
            ConfigurationCompiler.generateManagers(project,
                    ConfigurationCompiler.getRuntimeManagersXml(project),
                    dsm.getServices());
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        } catch (JAXBException e) {
            throw new WMRuntimeException(e);
        }
    }
    
    public static Bean getEventWireBean(String serviceId, String eventRef) {
        
        Bean bean = new Bean();
        bean.setClazz(EventWire.class.getCanonicalName());
        bean.setLazyInit(DefaultableBoolean.TRUE);
        
        Property p = new Property();
        p.setName("eventListener");
        p.setRef(eventRef);
        bean.addProperty(p);
        
        p = new Property();
        p.setName("bean");
        p.setRef(serviceId);
        bean.addProperty(p);
        
        return bean;
    }
    
    public static Bean getEventWireBean_EmbeddedNotifier(String serviceId,
            String eventNotifierClass) {
        
        Bean bean = new Bean();
        bean.setClazz(EventWire.class.getCanonicalName());
        bean.setLazyInit(DefaultableBoolean.TRUE);
        
        Property p = new Property();
        p.setName("eventListener");
        Bean eventListenerBean = new Bean();
        eventListenerBean.setClazz(eventNotifierClass);
        p.setBean(eventListenerBean);
        bean.addProperty(p);
        
        p = new Property();
        p.setName("bean");
        p.setRef(serviceId);
        bean.addProperty(p);
        
        return bean;
    }
}