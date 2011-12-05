
package com.wavemaker.spinup.web;

import org.springframework.stereotype.Component;

import com.wavemaker.spinup.ApplicationDetails;
import com.wavemaker.spinup.ApplicationNamingStrategy;

/**
 * {@link ApplicationNamingStrategy} for WaveMaker.
 */
@Component
public class WavemakeApplicationNamingStrategy implements ApplicationNamingStrategy {

    private static final String APPLICATION_NAME = "wavemaker-studio";

    @Override
    public boolean isMatch(ApplicationDetails applicationDetails) {
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
