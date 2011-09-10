/*
 * Copyright (C) 2008 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.wavemaker.studio.project.upgrade.swamis;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.File;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.apache.commons.io.FileUtils;
import org.junit.Test;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.studio.service.TestDesignServiceManager.updateService_SD;
import com.wavemaker.studio.service.TestDesignServiceManager.updateService_SD_WebService;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.project.upgrade.swamis.ServiceBeanFileUpgrade;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestServiceBeanFileUpgrade extends StudioTestCase {
    
    JAXBContext definitionsContext;
    
    public TestServiceBeanFileUpgrade() throws JAXBException {
        super();
        definitionsContext = JAXBContext
                .newInstance("com.wavemaker.tools.service.definitions");
    }
    
    @Test public void testUpgrade() throws Exception {
        
        String projectName = "testUpgrade";
        makeProject(projectName, false);
        DesignServiceManager dsm = (DesignServiceManager) getBean("designServiceManager");
        Project project = dsm.getProjectManager().getCurrentProject();
        
        // create one service
        ServiceDefinition sd = new updateService_SD();
        dsm.defineService(sd);
        assertTrue(dsm.getServiceBeanXml(sd.getServiceId()).exists());
        
        // manually create a second, so this one won't have a spring bean def file
        String serviceId = "otherService";
        String serviceClass = "foo.bar.OtherService";
        createServiceStub(dsm, serviceId, serviceClass);
        
        File serviceBean = dsm.getServiceBeanXml(serviceId);
        assertFalse(serviceBean.exists());
        
        // run the upgrade task
        UpgradeTask ut = new ServiceBeanFileUpgrade();
        UpgradeInfo upgradeInfo = new UpgradeInfo();
        ut.doUpgrade(project, upgradeInfo);
        assertEquals("verbose was: "+upgradeInfo.getVerbose()+", messages: "+
                upgradeInfo.getMessages(),
                "Converted bean definitions to a separate file for services: otherService",
                upgradeInfo.getVerbose().get("-1.0").get(0));
        
        assertTrue(serviceBean.exists());
        assertTrue(FileUtils.readFileToString(serviceBean).contains("\""+
                serviceId+"\""));
        
        Unmarshaller unmarshaller = definitionsContext.createUnmarshaller();
        File designTimeXml = new File(
                dsm.getServiceDesigntimeDirectory(serviceId),
                DesignServiceManager.getServiceXmlRelative());
        Service servicePrime = (Service) unmarshaller.unmarshal(designTimeXml);
        assertEquals(serviceClass, servicePrime.getClazz());
        assertNotNull(servicePrime.getSpringFile());
    }

    // MAV-1813
    @Test public void testUpgradeTwoProjects() throws Exception {

        String projectName = "testUpgradeTwoProjects";
        makeProject(projectName, false);
        DesignServiceManager dsm = (DesignServiceManager) getBean("designServiceManager");
        Project project = dsm.getProjectManager().getCurrentProject();

        // create one service
        ServiceDefinition sd = new updateService_SD();
        dsm.defineService(sd);
        assertTrue(dsm.getServiceBeanXml(sd.getServiceId()).exists());
        
        // create a service with no service bean def
        String serviceId = "service";
        String serviceClass = "foo.bar.Service";
        createServiceStub(dsm, serviceId, serviceClass);
        
        File serviceBean = dsm.getServiceBeanXml(serviceId);
        assertFalse(serviceBean.exists());
        
        // create a second service with no service bean def
        String serviceId2 = "service2";
        String serviceClass2 = "foo.bar.Service";
        createServiceStub(dsm, serviceId2, serviceClass2);
        
        File serviceBean2 = dsm.getServiceBeanXml(serviceId2);
        assertFalse(serviceBean2.exists());
        
        // try to add a new service the regular way; this will fail
        ServiceDefinition sd2 = new updateService_SD_WebService();
        try {
            // create one service
            dsm.defineService(sd2);
            fail("expected error");
        } catch (WMRuntimeException e) {
            assertEquals(Resource.NO_EXTERNAL_BEAN_DEF.getId(),
                    e.getMessageId());
        }
        
        // run the upgrade task
        UpgradeTask ut = new ServiceBeanFileUpgrade();
        UpgradeInfo upgradeInfo = new UpgradeInfo();
        ut.doUpgrade(project, upgradeInfo);
        assertEquals("verbose was: "+upgradeInfo.getVerbose()+", messages: "+
                upgradeInfo.getMessages(),
                "Converted bean definitions to a separate file for services: service, service2",
                upgradeInfo.getVerbose().get("-1.0").get(0));
        
        // check service1
        assertTrue(serviceBean.exists());
        assertTrue(FileUtils.readFileToString(serviceBean).contains("\""+
                serviceId+"\""));
        
        Unmarshaller unmarshaller = definitionsContext.createUnmarshaller();
        File designTimeXml = new File(
                dsm.getServiceDesigntimeDirectory(serviceId),
                DesignServiceManager.getServiceXmlRelative());
        Service servicePrime = (Service) unmarshaller.unmarshal(designTimeXml);
        assertEquals(serviceClass, servicePrime.getClazz());
        assertNotNull(servicePrime.getSpringFile());
        
        // check service2
        assertTrue(serviceBean2.exists());
        assertTrue(FileUtils.readFileToString(serviceBean2).contains("\""+
                serviceId2+"\""));
        
        File designTimeXml2 = new File(
                dsm.getServiceDesigntimeDirectory(serviceId2),
                DesignServiceManager.getServiceXmlRelative());
        Service service2Prime = (Service) unmarshaller.unmarshal(designTimeXml2);
        assertEquals(serviceClass2, service2Prime.getClazz());
        assertNotNull(service2Prime.getSpringFile());
    }
    
    private void createServiceStub(DesignServiceManager dsm, String serviceId,
            String klass) throws JAXBException {
        
        Service service = new Service();
        service.setId(serviceId);
        service.setClazz(klass);
        service.setType("DataService");
        assertNull(service.getSpringFile());
        
        dsm.getServiceHome(serviceId).mkdir();
        dsm.getServiceDesigntimeDirectory(serviceId).mkdir();
        File designTimeXml = new File(
                dsm.getServiceDesigntimeDirectory(serviceId),
                DesignServiceManager.getServiceXmlRelative());
        assertFalse(designTimeXml.exists());
        assertTrue(designTimeXml.getParentFile().exists());
        
        Marshaller marshaller = definitionsContext.createMarshaller();
        marshaller.setProperty("jaxb.formatted.output", true);
        marshaller.marshal(service, designTimeXml);
    }
}