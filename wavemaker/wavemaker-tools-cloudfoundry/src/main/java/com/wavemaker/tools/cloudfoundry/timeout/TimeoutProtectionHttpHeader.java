
package com.wavemaker.tools.cloudfoundry.timeout;

/**
 * HTTP Headers used to indicate that a HTTP request should be protected against timeouts.
 * 
 * @see TimeoutProtectionFilter
 * @author Phillip Webb
 */
public class TimeoutProtectionHttpHeader {

    /**
     * Header for an initial request that supports timeout protection.
     */
    public static final String INITIAL_REQUEST = "X-CloudFoundry-Timeout-Protection-Initial-Request";

    /**
     * Header for a poll request.
     */
    public static final String POLL = "X-CloudFoundry-Timeout-Protection-Poll";

}
