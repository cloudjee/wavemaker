
package com.wavemaker.tools.cloudfoundry.spinup;

/**
 * Context object used by {@link ApplicationNamingStrategy}.
 * 
 * @author Phillip Webb
 */
public interface ApplicationNamingStrategyContext {

    /**
     * Returns the cloud foundry controller URL
     * 
     * @return the controller URL
     */
    String getControllerUrl();

    /**
     * Returns the username of the cloud foundry user
     * 
     * @return the username
     */
    String getUsername();

    /**
     * Returns the attempt number that is being made.
     * 
     * @return the attempt number
     */
    int getAttemptNumber();
}
