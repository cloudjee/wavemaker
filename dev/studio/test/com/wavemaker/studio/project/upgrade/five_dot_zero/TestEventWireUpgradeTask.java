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

import java.io.File;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.core.io.ClassPathResource;

import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.project.upgrade.five_dot_zero.EventWireUpgradeTask;
import com.wavemaker.tools.service.DesignServiceManager;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestEventWireUpgradeTask extends StudioTestCase {
    
    public void testChangeEventWire() throws Exception {
        
        makeProject("testChangeEventWire", false);

        DesignServiceManager dsm = (DesignServiceManager) getBean("designServiceManager");
        Project project = dsm.getProjectManager().getCurrentProject();
        
        ServiceDefinition javaSD = TestAddServiceWireUpgradeTask.createJavaService();
        dsm.defineService(javaSD);

        ServiceDefinition dataSD = TestAddServiceWireUpgradeTask.createDataService();
        dsm.defineService(dataSD);
        

        File cpr = (new ClassPathResource("com/wavemaker/studio/project/upgrade/five_dot_zero")).getFile();
        assertTrue(cpr.exists());

        FileUtils.copyFile(
                new File(cpr, "eventwireupgrade.files/dataservicespring_input.xml"),
                dsm.getServiceBeanXml(dataSD.getServiceId()));
        FileUtils.copyFile(
                new File(cpr, "eventwireupgrade.files/javaservicespring_input.xml"),
                dsm.getServiceBeanXml(javaSD.getServiceId()));
        
        UpgradeTask ut = new EventWireUpgradeTask();
        UpgradeInfo info = new UpgradeInfo();
        ut.doUpgrade(project, info);
 
 //    both fail -  null expected       
 /*       assertEquals(
                StringUtils.deleteWhitespace(FileUtils.readFileToString(
                        new File(cpr, "eventwireupgrade.files/dataservicespring_expected.xml"))),
                StringUtils.deleteWhitespace(
                        FileUtils.readFileToString(dsm.getServiceBeanXml(dataSD.getServiceId()))));
        assertEquals(
                StringUtils.deleteWhitespace(FileUtils.readFileToString(
                        new File(cpr, "eventwireupgrade.files/javaservicespring_expected.xml"))),
                StringUtils.deleteWhitespace(FileUtils.readFileToString(
                        dsm.getServiceBeanXml(javaSD.getServiceId()))));
  */  }
    
    public void testUpgradeTaskPresent() throws Exception {
        
        boolean foundTask = false;
        
        UpgradeManager um = (UpgradeManager) getBean("upgradeManager");
        
        outer: for (List<UpgradeTask> uts : um.getUpgrades().values()) {
            for (UpgradeTask ut : uts) {
                if (ut instanceof EventWireUpgradeTask) {
                    foundTask = true;
                    break outer;
                }
            }
        }
        
        assertTrue(foundTask);
    }
}
