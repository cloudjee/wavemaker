
package com.wavemaker.spinup.web;

import org.springframework.stereotype.Component;

import com.wavemaker.tools.cloudfoundry.spinup.ApplicationNamingStrategy;
import com.wavemaker.tools.cloudfoundry.spinup.UsernameWithRandomApplicationNamingStrategy;

/**
 * {@link ApplicationNamingStrategy} for WaveMaker.
 */
@Component
public class WavemakeApplicationNamingStrategy extends UsernameWithRandomApplicationNamingStrategy {

    private static final String APPLICATION_NAME = "wavemaker-studio";

    public WavemakeApplicationNamingStrategy() {
        super(APPLICATION_NAME);
    }
}
