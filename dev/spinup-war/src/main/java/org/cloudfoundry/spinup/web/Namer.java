
package org.cloudfoundry.spinup.web;

import org.cloudfoundry.spinup.deploy.ApplicationNamer;
import org.springframework.stereotype.Component;

@Component
public class Namer implements ApplicationNamer {

    private static final String NAME = "pwwmtest";

    @Override
    public boolean isMatch(String name) {
        return NAME.equals(name);
    }

    @Override
    public String createNew() {
        return NAME;
    }

}
