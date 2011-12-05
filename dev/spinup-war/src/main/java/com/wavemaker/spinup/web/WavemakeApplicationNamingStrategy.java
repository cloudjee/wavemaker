
package com.wavemaker.spinup.web;

import org.cloudfoundry.spinup.ApplicationDetails;
import org.cloudfoundry.spinup.ApplicationNamingStrategy;
import org.springframework.stereotype.Component;

/**
 * {@link ApplicationNamingStrategy} for WaveMaker.
 */
@Component
public class WavemakeApplicationNamingStrategy implements ApplicationNamingStrategy {

    private static final String APPLICATION_NAME = "wavemaker-studio2";

    @Override
    public boolean isMatch(ApplicationDetails applicationDetails) {
        if (true) {
            return false;
        }
        return APPLICATION_NAME.equalsIgnoreCase(applicationDetails.getName());
    }

    @Override
    public ApplicationDetails newApplicationDetails(String controllerUrl) {
        String url = controllerUrl;
        url = url.replace("https", "http");
        url = url.replace("api.", "pwwmtest."); // FIXME name app
        return new ApplicationDetails(APPLICATION_NAME, url);
    }
}
