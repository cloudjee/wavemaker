
package com.wavemaker.tools.cloudfoundry;

/**
 * Strategy interface used to name deployed applications.
 * 
 * @author Phillip Webb
 */
public interface ApplicationNamingStrategy {

    /**
     * Determine if the specified application details are a match for this strategy.
     * 
     * @param applicationDetails the application details
     * @return <tt>true</tt> if the application details are a match
     */
    boolean isMatch(ApplicationDetails applicationDetails);

    /**
     * Create new application details named correctly.
     * 
     * @param context Context that can be used to obtain relevant details
     * @return the application details
     */
    ApplicationDetails newApplicationDetails(ApplicationNamingStrategyContext context);

}
