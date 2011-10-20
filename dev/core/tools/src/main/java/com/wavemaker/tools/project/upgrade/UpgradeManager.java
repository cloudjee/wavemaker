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

package com.wavemaker.tools.project.upgrade;

import java.io.IOException;
import java.util.List;
import java.util.Map.Entry;
import java.util.SortedMap;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.io.Resource;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.config.ConfigurationStore;
import com.wavemaker.tools.project.AbstractDeploymentManager;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.Project;

/**
 * The upgrade manager. Provides methods to upgrade projects to the current version.
 * 
 * @author small
 * @author Jeremy Grelle
 * 
 */
public class UpgradeManager implements InitializingBean {

    /** Logger for this class and subclasses */
    protected final Logger logger = Logger.getLogger(getClass());

    protected static final String STUDIO_VERSION_KEY = "StudioVersion";

    /**
     * Perform the upgrades; this will run through the list of potential upgrades iteratively until the project is at
     * the current version.
     * 
     * @param project The project to upgrade.
     * @return A String containing any information regarding the upgrades. This may be passed back to the user as
     *         information. If no upgrades were performed, this will be null.
     */
    public UpgradeInfo doUpgrades(Project project) {

        double projectVersion = project.getProjectVersion();
        double projectMaxVersion = getCurrentVersion();

        if (projectVersion > projectMaxVersion) {
            throw new WMRuntimeException(MessageResource.PROJECT_NEWER_THAN_STUDIO, project.getProjectName(), projectVersion, projectMaxVersion);
        } else if (projectVersion < projectMaxVersion) {
            UpgradeInfo ret = new UpgradeInfo();

            try {
                Resource exportFile = project.getProjectRoot().createRelative(
                    AbstractDeploymentManager.EXPORT_DIR_DEFAULT + project.getProjectName() + "-upgrade-" + projectVersion + ".zip");
                this.deploymentManager.exportProject(exportFile.getURI().toString());
                ret.setBackupExportFile(exportFile);
            } catch (IOException ex) {
                throw new WMRuntimeException(ex);
            }

            this.deploymentManager.testRunClean();

            for (Entry<Double, List<UpgradeTask>> entry : getUpgrades().entrySet()) {

                if (entry.getKey() <= projectVersion) {
                    continue;
                }

                ret.setVersion(entry.getKey());

                for (UpgradeTask task : entry.getValue()) {
                    this.logger.debug("Running upgrade task " + task + " on project " + project);
                    task.doUpgrade(project, ret);
                }

                project.setProjectVersion(entry.getKey());
            }

            return ret;
        } else {
            return null;
        }
    }

    /**
     * Get the current version, according to the UpgradeManager configuration.
     * 
     * @return The current version.
     */
    public double getCurrentVersion() {

        return getUpgrades().lastKey();
    }

    /*
     * (non-Javadoc)
     * 
     * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet()
     */
    @Override
    public void afterPropertiesSet() {

        doStudioUpgrade();
    }

    /**
     * If needed, upgrade the studio. Checks the registry for STUDIO_VERSION_KEY; if not present or if it's older than
     * the configured studio upgrades, do those upgrades.
     */
    public void doStudioUpgrade() {

        double studioVersion = getStudioVersion();
        double studioMaxVersion = this.studioUpgrades.lastKey();

        if (studioVersion > studioMaxVersion) {
            this.logger.error("Configured studio version (" + studioVersion + ") is older than currently running version (" + studioMaxVersion
                + "); have you downgraded your studio?");
        } else if (studioVersion < studioMaxVersion) {
            UpgradeInfo ret = new UpgradeInfo();

            for (Entry<Double, List<StudioUpgradeTask>> entry : getStudioUpgrades().entrySet()) {

                if (entry.getKey() <= studioVersion) {
                    continue;
                }

                ret.setVersion(entry.getKey());

                for (StudioUpgradeTask task : entry.getValue()) {
                    task.doUpgrade(ret);
                }

                // update the stored version
                setStudioVersion(entry.getKey());
            }

            for (String version : ret.getMessages().keySet()) {
                for (String message : ret.getMessages().get(version)) {
                    this.logger.warn("Upgraded to " + version + ": " + message);
                }
            }
        }
    }

    public static double getStudioVersion() {
        String prefString = ConfigurationStore.getPreference(UpgradeManager.class, STUDIO_VERSION_KEY, "0.0");
        return Double.parseDouble(prefString);
    }

    public static void setStudioVersion(double version) {
        ConfigurationStore.setPreference(UpgradeManager.class, STUDIO_VERSION_KEY, "" + version);
    }

    // bean properties
    private SortedMap<Double, List<UpgradeTask>> upgrades;

    private SortedMap<Double, List<StudioUpgradeTask>> studioUpgrades;

    private DeploymentManager deploymentManager;

    public SortedMap<Double, List<UpgradeTask>> getUpgrades() {
        return this.upgrades;
    }

    public void setUpgrades(SortedMap<Double, List<UpgradeTask>> upgrades) {
        this.upgrades = upgrades;
    }

    public DeploymentManager getDeploymentManager() {
        return this.deploymentManager;
    }

    public void setDeploymentManager(DeploymentManager deploymentManager) {
        this.deploymentManager = deploymentManager;
    }

    public SortedMap<Double, List<StudioUpgradeTask>> getStudioUpgrades() {
        return this.studioUpgrades;
    }

    public void setStudioUpgrades(SortedMap<Double, List<StudioUpgradeTask>> studioUpgrades) {
        this.studioUpgrades = studioUpgrades;
    }
}