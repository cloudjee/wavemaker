
package com.wavemaker.tools.packager;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import com.wavemaker.tools.project.Project;

/**
 * Component that will create a {@link PackagedApplication} by making use of all registered {@link Packager} beans.
 * 
 * @author Phillip Webb
 */
@Component
public class Packagers {

    private List<Packager> packagers;

    public <P extends PackagedApplication> P createPackagedApplication(Project project, Class<P> packageType, PackagerContext context) {
        Assert.notNull(project, "Project must not be null");
        Assert.notNull(packageType, "PackageType must not be null");
        Assert.notNull(context, "Context must not be null");
        P rtn = null;
        for (Packager packager : this.packagers) {
            P packagedApplication = packager.createPackagedApplication(project, packageType, context);
            if (packagedApplication != null) {
                Assert.state(rtn == null, "Duplicate packagers found for " + packageType);
                rtn = packagedApplication;
            }
        }
        Assert.state(rtn != null, "Unable to find a packager for " + packageType);
        return rtn;

    }

    @Autowired
    public void setPackagers(List<Packager> packagers) {
        this.packagers = packagers;
    }
}
