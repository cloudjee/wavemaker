
package com.wavemaker.tools.packager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.wavemaker.runtime.data.DataServiceType;
import com.wavemaker.tools.data.DataModelDeploymentConfiguration;
import com.wavemaker.tools.deployment.DeploymentDB;
import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.deployment.ServiceDeployment;
import com.wavemaker.tools.deployment.ServiceDeploymentManager;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.virtual.VirtualFolder;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.util.DesignTimeUtils;

public class WarEarPackager implements Packager {

    private final List<ServiceDeployment> serviceDeployments = new ArrayList<ServiceDeployment>(1);

    public WarEarPackager() {
        // FIXME hack service deployments should be injected
        this.serviceDeployments.add(new DataModelDeploymentConfiguration());
    }

    @Override
    @SuppressWarnings("unchecked")
    public <P extends Package> P createPackage(Project project, DeploymentInfo deploymentInfo, Class<P> packageClass) {
        if (WarPackage.class.equals(packageClass)) {
            return (P) createWar(project, deploymentInfo);
        }
        if (EarPackage.class.equals(packageClass)) {
            return (P) createEar(project, deploymentInfo);
        }
        return null;
    }

    private EarPackage createEar(Project project, DeploymentInfo deploymentInfo) {
        return null; // FIXME
    }

    private WarPackage createWar(Project project, DeploymentInfo deploymentInfo) {
        VirtualFolder stagingArea = createStagingArea(project);
        prepareDataServices(project, deploymentInfo, stagingArea);
        return null; // FIXME
    }

    private VirtualFolder createStagingArea(Project project) {
        VirtualFolder stagingArea = new VirtualFolder();
        project.getRootFolder().copyContentsTo(stagingArea);
        return stagingArea;
    }

    private void prepareDataServices(Project project, DeploymentInfo deploymentInfo, Folder stagingArea) {
        Map<String, String> databaseProperties = getAllDatabaseProperties(deploymentInfo);
        DesignServiceManager designServiceManager = DesignTimeUtils.getDSMForProjectRoot(stagingArea);
        for (Service service : designServiceManager.getServices()) {
            if (service.getType().equals(DataServiceType.TYPE_NAME)) {
                storeProperties(project, databaseProperties);
                Map<String, String> serviceProperties = getServiceProperties(databaseProperties, service.getId());
                for (int i = 0; i < this.serviceDeployments.size(); i++) {
                    ServiceDeployment serviceDeployment = this.serviceDeployments.get(i);
                    serviceDeployment.prepare(service.getId(), serviceProperties, designServiceManager, i + i);
                }
            }
        }
    }

    private Map<String, String> getAllDatabaseProperties(DeploymentInfo deploymentInfo) {
        Map<String, String> databaseProperties = new HashMap<String, String>();
        for (DeploymentDB deploymentDatabase : deploymentInfo.getDatabases()) {
            databaseProperties.putAll(deploymentDatabase.asProperties());
        }
        return databaseProperties;
    }

    // FIXME why? does not seem to be read ever!
    private void storeProperties(Project project, Map<String, String> databaseProperties) {
        project.clearProperties(ServiceDeploymentManager.class);
        for (Map.Entry<String, String> e : databaseProperties.entrySet()) {
            project.setProperty(ServiceDeploymentManager.class, e.getKey(), e.getValue());
        }
    }

    private Map<String, String> getServiceProperties(Map<String, String> properties, String serviceName) {
        Map<String, String> serviceProperties = new HashMap<String, String>();
        String propertyPrefix = serviceName + ProjectConstants.PROP_SEP;
        for (Map.Entry<String, String> property : properties.entrySet()) {
            String propertyName = property.getKey();
            String propertyValue = property.getValue();
            if (propertyName.startsWith(propertyPrefix)) {
                String servicePropertyName = propertyName.substring(propertyPrefix.length());
                serviceProperties.put(servicePropertyName, propertyValue);
            }
        }
        return serviceProperties;
    }
}
