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

import java.io.File;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.core.io.ClassPathResource;

import com.wavemaker.runtime.service.RuntimeService;
import com.wavemaker.runtime.service.definition.ReflectServiceDefinition;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.studio.service.TestDesignServiceManager.testEvents_SD;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.project.upgrade.swamis.EventRefactorUpgrade;
import com.wavemaker.tools.service.ConfigurationCompiler;
import com.wavemaker.tools.service.DesignServiceManager;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestEventRefactorUpgrade extends StudioTestCase {
    
    @SuppressWarnings("deprecation")
    public void testEventUpgrade() throws Exception {

        DesignServiceManager dsm = (DesignServiceManager) getBean("designServiceManager");
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        
        makeProject("testEventUpgrade", false);
        
        ReflectServiceDefinition sd = new ServiceClass();
        sd.getEventNotifiers().add(sd.getServiceClass());
        dsm.defineService(sd);
        
        File sdXml = dsm.getServiceDefXml(sd.getServiceId());
        File beanXml = dsm.getServiceBeanXml(sd.getServiceId());
        assertTrue(beanXml.exists());
        assertTrue(sdXml.exists());
        
        File sourceServiceDef = (new ClassPathResource("com/wavemaker/studio/project/upgrade/swamis/eventrefactorupgrade/servicedef.xml")).getFile();
        FileUtils.copyFile(sourceServiceDef, sdXml);
        
        String sdXmlContents = FileUtils.readFileToString(sdXml);
        assertTrue(sdXmlContents, sdXmlContents.
                contains(sd.getEventNotifiers().get(0)));
        
        // copy in a sample project-managers.xml
        File sampleManagers = (new ClassPathResource("com/wavemaker/studio/project/upgrade/swamis/eventrefactorupgrade/project-managers.xml")).getFile();
        assertTrue(sampleManagers.exists());
        File destManagers = ConfigurationCompiler.getRuntimeManagersXml(pm.getCurrentProject());
        FileUtils.copyFile(sampleManagers, destManagers);
        
        // trigger upgrade
        UpgradeTask ut = new EventRefactorUpgrade();
        UpgradeInfo info = new UpgradeInfo();
        ut.doUpgrade(pm.getCurrentProject(), info);


        assertFalse(""+sdXml+"had event notifiers, contents:\n"+
                FileUtils.readFileToString(sdXml),
                FileUtils.readFileToString(sdXml).contains(sd.getEventNotifiers().get(0)));
        
        assertTrue(beanXml.exists());
        String beanXmlContents = FileUtils.readFileToString(beanXml);
        assertTrue("sdXml:\n"+beanXmlContents,
                beanXmlContents.contains("\""+sd.getEventNotifiers().get(0)+"\""));
        
        assertTrue(destManagers.exists());
        String managersContents = FileUtils.readFileToString(destManagers);
        assertFalse(managersContents, managersContents.contains("eventManager"));
        
        File expectedBeanDef = (new ClassPathResource("com/wavemaker/studio/project/upgrade/swamis/eventrefactorupgrade/expected_beans.xml")).getFile();
        assertTrue(expectedBeanDef.exists());
        String expectedBeanDefContents = FileUtils.readFileToString(expectedBeanDef);
        
        String shortenedBeanXmlContents = StringUtils.deleteWhitespace(beanXmlContents).replaceAll("<beans.*?>", "");
        String shortenedExpectedBeanDefContents = StringUtils.deleteWhitespace(expectedBeanDefContents).replaceAll("<beans.*?>", "");
        assertTrue("shortenedBeanXmlContents:\n"+shortenedBeanXmlContents,
                shortenedBeanXmlContents.contains("\""+sd.getEventNotifiers().get(0)+"\""));
        assertTrue("shortenedExpectedBeanDefContents:\n"+shortenedExpectedBeanDefContents,
                shortenedExpectedBeanDefContents.contains("\""+sd.getEventNotifiers().get(0)+"\""));
        assertEquals(shortenedExpectedBeanDefContents, shortenedBeanXmlContents);
    }
    
    public void testUpgradeTaskPresent() throws Exception {
        
        boolean foundTask = false;
        
        UpgradeManager um = (UpgradeManager) getBean("upgradeManager");
        
        outer: for (List<UpgradeTask> uts : um.getUpgrades().values()) {
            for (UpgradeTask ut : uts) {
                if (ut instanceof EventRefactorUpgrade) {
                    foundTask = true;
                    break outer;
                }
            }
        }
        
        assertTrue(foundTask);
    }
    
    public static class ServiceClass extends testEvents_SD {
        
        @Override
        public String getServiceClass() {
            return RuntimeService.class.getName();
        }
    }
}