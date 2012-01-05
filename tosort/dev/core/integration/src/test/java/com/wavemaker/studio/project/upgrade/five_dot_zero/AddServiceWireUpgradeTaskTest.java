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

package com.wavemaker.studio.project.upgrade.five_dot_zero;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;

import com.wavemaker.runtime.data.DataServiceType;
import com.wavemaker.runtime.javaservice.JavaServiceType;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.definition.AbstractDeprecatedServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.runtime.ws.WebServiceType;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.project.upgrade.five_dot_zero.AddServiceWireUpgradeTask;
import com.wavemaker.tools.service.DesignServiceManager;

/**
 * @author small
 * @author Jeremy Grelle
 * 
 */
public class TestAddServiceWireUpgradeTask extends StudioTestCase {

    @Test
    public void testBasicUpgrade() throws Exception {

        String projectName = "testBasicUpgrade";

        makeProject(projectName, false);
        DesignServiceManager dsm = (DesignServiceManager) getBean("designServiceManager");
        Project project = dsm.getProjectManager().getCurrentProject();

        // create services
        ServiceDefinition javaSD = createJavaService();
        dsm.defineService(javaSD);

        ServiceDefinition webSD = createWebService();
        dsm.defineService(webSD);

        ServiceDefinition dataSD = createDataService();
        dsm.defineService(dataSD);

        ServiceDefinition javaSD2 = createJavaService2();
        dsm.defineService(javaSD2);

        // copy those spring files (complete with service wires) out
        File tempSDDir = new File(project.getProjectRoot().getFile(), "tempSD");
        tempSDDir.mkdir();
        File expectedJavaSD = new File(tempSDDir, "javaSD.xml");
        File expectedWebSD = new File(tempSDDir, "webSD.xml");
        File expectedDataSD = new File(tempSDDir, "dataSD.xml");
        File expectedJavaSD2 = new File(tempSDDir, "javaSD2.xml");
        FileUtils.copyFile(dsm.getServiceBeanXml(javaSD.getServiceId()).getFile(), expectedJavaSD);
        FileUtils.copyFile(dsm.getServiceBeanXml(webSD.getServiceId()).getFile(), expectedWebSD);
        FileUtils.copyFile(dsm.getServiceBeanXml(dataSD.getServiceId()).getFile(), expectedDataSD);
        FileUtils.copyFile(dsm.getServiceBeanXml(javaSD2.getServiceId()).getFile(), expectedJavaSD2);

        // copy in spring xml files without ServiceWires
        File cpr = new ClassPathResource("com/wavemaker/studio/project/upgrade/five_dot_zero").getFile();
        assertTrue(cpr.exists());

        FileUtils.copyFile(new File(cpr, "addservicewireupgrade.files/input/javaSD.xml"), dsm.getServiceBeanXml(javaSD.getServiceId()).getFile());
        FileUtils.copyFile(new File(cpr, "addservicewireupgrade.files/input/webSD.xml"), dsm.getServiceBeanXml(webSD.getServiceId()).getFile());
        FileUtils.copyFile(new File(cpr, "addservicewireupgrade.files/input/dataSD.xml"), dsm.getServiceBeanXml(dataSD.getServiceId()).getFile());

        UpgradeTask ut = new AddServiceWireUpgradeTask();
        UpgradeInfo info = new UpgradeInfo();
        ut.doUpgrade(project, info);

        assertEquals(FileUtils.readFileToString(expectedJavaSD), FileUtils.readFileToString(dsm.getServiceBeanXml(javaSD.getServiceId()).getFile()));
        assertEquals(FileUtils.readFileToString(expectedWebSD), FileUtils.readFileToString(dsm.getServiceBeanXml(webSD.getServiceId()).getFile()));
        assertEquals(FileUtils.readFileToString(expectedDataSD), FileUtils.readFileToString(dsm.getServiceBeanXml(dataSD.getServiceId()).getFile()));
        assertEquals(FileUtils.readFileToString(expectedJavaSD2), FileUtils.readFileToString(dsm.getServiceBeanXml(javaSD2.getServiceId()).getFile()));

        assertEquals("New ServiceWire added to services: " + dataSD.getServiceId() + ", " + javaSD.getServiceId() + ", " + webSD.getServiceId(),
            info.getMessages().get(info.getMessages().keySet().iterator().next()).get(0));
    }

    @Test
    public void testSpringXmlAlternateLocation() throws Exception {

        String projectName = "testSpringXmlAlternateLocation";

        makeProject(projectName, false);
        DesignServiceManager dsm = (DesignServiceManager) getBean("designServiceManager");
        Project project = dsm.getProjectManager().getCurrentProject();

        // create services
        ServiceDefinition javaSD = createJavaServiceAlternateSpring();
        dsm.defineService(javaSD);

        File regularSpringXml = dsm.getServiceBeanXml(javaSD.getServiceId()).getFile();
        assertFalse("regular spring: " + regularSpringXml, regularSpringXml.exists());

        File abnormalSpringXml = new File(dsm.getServiceRuntimeDirectory(javaSD.getServiceId()).getFile(), javaSD.getRuntimeConfiguration());
        assertFalse("abnormal spring: " + abnormalSpringXml, abnormalSpringXml.exists());

        File cpr = new ClassPathResource("com/wavemaker/studio/project/upgrade/five_dot_zero").getFile();
        assertTrue(cpr.exists());
        FileUtils.copyFile(new File(cpr, "addservicewireupgrade.files/input/javaSD.xml"), abnormalSpringXml);
        assertFalse(FileUtils.readFileToString(abnormalSpringXml).contains("ServiceWire"));

        UpgradeTask ut = new AddServiceWireUpgradeTask();
        UpgradeInfo info = new UpgradeInfo();
        ut.doUpgrade(project, info);

        assertFalse(regularSpringXml.exists());
        assertTrue(FileUtils.readFileToString(abnormalSpringXml).contains("ServiceWire"));
    }

    @Test
    public void testUpgradeTaskPresent() throws Exception {

        boolean foundTask = false;

        UpgradeManager um = (UpgradeManager) getBean("upgradeManager");

        outer: for (List<UpgradeTask> uts : um.getUpgrades().values()) {
            for (UpgradeTask ut : uts) {
                if (ut instanceof AddServiceWireUpgradeTask) {
                    foundTask = true;
                    break outer;
                }
            }
        }

        assertTrue(foundTask);
    }

    protected static ServiceDefinition createJavaService() throws Exception {

        ServiceDefinition sd = new AbstractTestServiceDefinition() {

            @Override
            public String getServiceId() {
                return "javaService";
            }

            @Override
            public ServiceType getServiceType() {
                return new JavaServiceType();
            }
        };

        return sd;
    }

    protected static ServiceDefinition createWebService() throws Exception {

        ServiceDefinition sd = new AbstractTestServiceDefinition() {

            @Override
            public String getServiceId() {
                return "webService";
            }

            @Override
            public ServiceType getServiceType() {
                return new WebServiceType();
            }
        };

        return sd;
    }

    protected static ServiceDefinition createDataService() throws Exception {

        ServiceDefinition sd = new AbstractTestServiceDefinition() {

            @Override
            public String getServiceId() {
                return "dataService";
            }

            @Override
            public ServiceType getServiceType() {
                return new DataServiceType();
            }
        };

        return sd;
    }

    protected static ServiceDefinition createJavaService2() throws Exception {

        ServiceDefinition sd = new AbstractTestServiceDefinition() {

            @Override
            public String getServiceId() {
                return "javaService2";
            }

            @Override
            public ServiceType getServiceType() {
                return new JavaServiceType();
            }
        };

        return sd;
    }

    protected static ServiceDefinition createJavaServiceAlternateSpring() throws Exception {

        ServiceDefinition sd = new AbstractTestServiceDefinition() {

            @Override
            public String getServiceId() {
                return "javaService";
            }

            @Override
            public ServiceType getServiceType() {
                return new JavaServiceType();
            }

            @Override
            public String getRuntimeConfiguration() {
                return "com/wm/foo.spring.xml";
            }
        };

        return sd;
    }

    protected static class AbstractTestServiceDefinition extends AbstractDeprecatedServiceDefinition {

        @Override
        public void dispose() {
        }

        @Override
        public List<String> getEventNotifiers() {
            return new ArrayList<String>();
        }

        @Override
        public List<ElementType> getInputTypes(String operationName) {
            return new ArrayList<ElementType>();
        }

        @Override
        public List<String> getOperationNames() {
            return new ArrayList<String>();
        }

        @Override
        public ElementType getOutputType(String operationName) {
            return null;
        }

        @Override
        public String getPackageName() {
            return null;
        }

        @Override
        public String getRuntimeConfiguration() {
            return null;
        }

        @Override
        public String getServiceClass() {
            return null;
        }

        @Override
        public String getServiceId() {
            return null;
        }

        @Override
        public ServiceType getServiceType() {
            return null;
        }

        @Override
        public List<ElementType> getTypes() {
            return new ArrayList<ElementType>();
        }

        @Override
        public boolean isLiveDataService() {
            return false;
        }

        @Override
        public String getOperationType(String operationName) {
            return null;
        }
    }
}
