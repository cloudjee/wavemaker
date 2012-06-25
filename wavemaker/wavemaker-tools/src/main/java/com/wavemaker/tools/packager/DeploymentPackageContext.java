
package com.wavemaker.tools.packager;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.util.Assert;

import com.wavemaker.tools.deployment.DeploymentDB;
import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.service.definitions.Service;

/**
 * Adapter class to convert {@link DeploymentInfo} to a {@link PackagerContext}.
 * 
 * @author Phillip Webb
 */
public class DeploymentPackageContext implements PackagerContext {

    // FIXME move to deploy

    private final Map<String, String> databaseProperties;

    public DeploymentPackageContext(DeploymentInfo deploymentInfo) {
        Assert.notNull(deploymentInfo, "DeploymentInfo must not be null");
        this.databaseProperties = getAllDatabaseProperties(deploymentInfo);
    }

    private Map<String, String> getAllDatabaseProperties(DeploymentInfo deploymentInfo) {
        Map<String, String> databaseProperties = new HashMap<String, String>();
        for (DeploymentDB deploymentDatabase : deploymentInfo.getDatabases()) {
            databaseProperties.putAll(deploymentDatabase.asProperties());
        }
        return databaseProperties;
    }

    @Override
    public Map<String, String> getServiceProperties(Service service) {
        if (service == null) {
            return Collections.emptyMap();
        }
        Map<String, String> serviceProperties = new HashMap<String, String>();
        String propertyPrefix = service.getId() + ProjectConstants.PROP_SEP;
        for (Map.Entry<String, String> property : this.databaseProperties.entrySet()) {
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
