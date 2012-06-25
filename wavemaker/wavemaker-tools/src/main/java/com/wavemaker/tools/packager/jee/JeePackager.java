
package com.wavemaker.tools.packager.jee;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.wavemaker.runtime.data.DataServiceType;
import com.wavemaker.tools.data.DataModelDeploymentConfiguration;
import com.wavemaker.tools.deployment.ServiceDeployment;
import com.wavemaker.tools.packager.PackagedApplication;
import com.wavemaker.tools.packager.Packager;
import com.wavemaker.tools.packager.PackagerContext;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.util.DesignTimeUtils;

/**
 * {@link Packager} that can create JEE {@link WarPackagedApplication war} and {@link EarPackagedApplication ear} packages.
 * 
 * @author Phillip Webb
 */
public class JeePackager implements Packager {

    private final List<ServiceDeployment> serviceDeployments = new ArrayList<ServiceDeployment>(1);

    public JeePackager() {
        this.serviceDeployments.add(new DataModelDeploymentConfiguration());
    }

    @Override
    @SuppressWarnings("unchecked")
    public <P extends PackagedApplication> P createPackagedApplication(Project project, Class<P> packageType, PackagerContext context) {
        if (WarPackagedApplication.class.equals(packageType)) {
            return (P) createWar(project, context);
        }
        if (EarPackagedApplication.class.equals(packageType)) {
            return (P) createEar(project, context);
        }
        return null;
    }

    private EarPackagedApplication createEar(Project project, PackagerContext context) {
        return null; // FIXME replicate ant tasks
    }

    private WarPackagedApplication createWar(Project project, PackagerContext context) {
        prepareDataServices(project, context);
        return null; // FIXME replicate ant tasks
    }

    private void prepareDataServices(Project project, PackagerContext context) {
        // FIXME this is far from ideal as the DataModelDeploymentConfiguration works directly using the current project
        // and is very complex. The entire com.wavemaker.tools.data package needs review
        DesignServiceManager designServiceManager = DesignTimeUtils.getDesignServiceManager(project);
        for (Service service : designServiceManager.getServices()) {
            if (service.getType().equals(DataServiceType.TYPE_NAME)) {
                Map<String, String> serviceProperties = context.getServiceProperties(service);
                for (int i = 0; i < this.serviceDeployments.size(); i++) {
                    ServiceDeployment serviceDeployment = this.serviceDeployments.get(i);
                    serviceDeployment.prepare(service.getId(), serviceProperties, designServiceManager, i + i);
                }
            }
        }
    }
}
