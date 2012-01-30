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

package com.wavemaker.tools.data.upgrade;

import java.io.File;
import java.io.IOException;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.data.DataServiceType;
import com.wavemaker.tools.data.DataModelConfiguration;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.util.DesignTimeUtils;
import org.springframework.core.io.FileSystemResource;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 */
public abstract class BaseDataUpgradeTask implements UpgradeTask {

    private DesignServiceManager mgr = null;

    protected DesignServiceManager getDesignServiceManager() {
        if (this.mgr == null) {
            throw new IllegalStateException("mgr cannot be null");
        }
        return this.mgr;
    }

    protected File getCfgFile(String serviceId) {
        try {
            return new File(this.mgr.getServiceRuntimeDirectory(serviceId).getFile(), DataServiceUtils.getCfgFileName(serviceId));
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    protected DataModelConfiguration getDataModelConfiguration(Service service) {
        //Todo: cftempfix
        return new DataModelConfiguration(new FileSystemResource(getCfgFile(service.getId())));
    }

    protected abstract void upgrade(Service service);

    protected String getUpgradeMsg() {
        return null;
    }

    @Override
    public final void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        this.mgr = DesignTimeUtils.getDSMForProjectRoot(project.getProjectRoot());

        for (Service service : this.mgr.getServices()) {
            if (0 == DataServiceType.TYPE_NAME.compareTo(service.getType())) {
                upgrade(service);
            }
        }

        String msg = getUpgradeMsg();

        if (msg != null) {
            upgradeInfo.addVerbose(msg);
        }
    }
}
