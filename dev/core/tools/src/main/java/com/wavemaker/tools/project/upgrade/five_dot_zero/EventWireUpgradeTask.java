/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.xml.bind.JAXBException;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.events.EventWire;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.DefaultableBoolean;
import com.wavemaker.tools.spring.beans.Property;
import com.wavemaker.tools.util.DesignTimeUtils;

/**
 * Makes sure EventWires are eagerly-loaded, and changes them to reference the
 * serviceWire, not the service id.  May also change the ServiceWire to have an
 * id.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public class EventWireUpgradeTask implements UpgradeTask {

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        
        DesignServiceManager dsm = DesignTimeUtils.getDSMForProjectRoot(
                project.getProjectRoot());

        Set<Service> services = dsm.getServices();
        
        for (Service service: services) {
            // ignore runtimeService
            if (DesignServiceManager.RUNTIME_SERVICE_ID.equals(service.getId())) {
                continue;
            }
            
            File beanFile = new File(dsm.getServiceRuntimeDirectory(
                    service.getId()), service.getSpringFile());
            
            // dsm.getServiceBeanXml(service.getId());
            
            boolean changed = false;
            try {
                Beans beans = SpringConfigSupport.readBeans(beanFile, project);
                List<Bean> serviceWireBeans = beans.getBeansByType(ServiceWire.class);
                serviceWireBeans.addAll(beans.getBeansByType(ReflectServiceWire.class));
                if (serviceWireBeans.size()>1 || serviceWireBeans.isEmpty()) {
                    throw new WMRuntimeException(Resource.PROJECT_TOO_MANY_SERVICE_WIRES,
                            service.getId(), serviceWireBeans);
                }
                Bean serviceWire = serviceWireBeans.get(0);
                
                String id;
                if (null!=serviceWire.getId()) {
                    id = serviceWire.getId();
                } else {
                    changed = true;
                    
                    id = service.getId()+"ServiceWire";
                    serviceWire.setId(id);
                }
                
                for (Bean bean: beans.getBeansByType(EventWire.class)) {

                    List<Property> toRemove = new ArrayList<Property>();
                    for (Object o: bean.getMetasAndConstructorArgsAndProperties()) {
                        if (o instanceof Property) {
                            Property p = (Property) o;
                            if (p.getName().equals("bean")) {
                                toRemove.add(p);
                            }
                        }
                    }
                    for (Property p: toRemove) {
                        bean.getMetasAndConstructorArgsAndProperties().remove(p);
                        changed = true;
                    }
                    
                    if (null==bean.getProperty("serviceWire")) {
                        Property p = new Property();
                        p.setName("serviceWire");
                        p.setRef(id);
                        bean.addProperty(p);
                        
                        changed = true;
                    }
                    
                    if (bean.getLazyInit().equals(DefaultableBoolean.TRUE)) {
                        changed = true;
                        bean.setLazyInit(null);
                    }
                }
                
                if (changed) {
                    SpringConfigSupport.writeBeans(beans, beanFile, project);
                }
            } catch (JAXBException e) {
                throw new WMRuntimeException(e);
            } catch (IOException e) {
                throw new WMRuntimeException(e);
            }
        }
    }
}
