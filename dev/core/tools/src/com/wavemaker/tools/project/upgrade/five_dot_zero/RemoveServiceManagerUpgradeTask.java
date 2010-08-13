/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.project.upgrade.five_dot_zero;

import java.io.File;
import java.io.IOException;

import javax.xml.bind.JAXBException;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.service.ConfigurationCompiler;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Beans;

/**
 * Removes the serviceManager bean definition from the individual project.  This
 * is now defined at the top-level, in managers.xml.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public class RemoveServiceManagerUpgradeTask implements UpgradeTask {

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        File managersXml = ConfigurationCompiler.getRuntimeManagersXml(project);
        try {
            Beans beans = SpringConfigSupport.readBeans(managersXml, project);
            
            if (null!=beans.getBeanById(ConfigurationCompiler.SERVICE_MANAGER_BEAN_ID)) {
                beans.removeBeanById(ConfigurationCompiler.SERVICE_MANAGER_BEAN_ID);
                SpringConfigSupport.writeBeans(beans, managersXml, project);
                
                upgradeInfo.addMessage("Removed servicesManager from "+
                        ConfigurationCompiler.RUNTIME_SERVICES);
            }
        } catch (JAXBException e) {
            throw new WMRuntimeException(e);
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }
}
