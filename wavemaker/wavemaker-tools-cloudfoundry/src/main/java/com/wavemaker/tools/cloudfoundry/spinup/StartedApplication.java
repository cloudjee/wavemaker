
package com.wavemaker.tools.cloudfoundry.spinup;

import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;

/**
 * A started application returned from the {@link SpinupService}. Generally clients will need to store the transport
 * token as a cookie before redirecting to the application URL.
 * 
 * @author Phillip Webb
 */
public interface StartedApplication {

    /**
     * Returns the transport token that should be passed to the running application. Generally cookies are the
     * recommended method of transferring the transport token.
     * 
     * @return the transport token
     */
    TransportToken getTransportToken();

    /**
     * Returns the URL of the spun up application.
     * 
     * @return the application URL
     */
    String getApplicationUrl();

    /**
     * Returns the domain of the spun up application in a form that can be used with a cookie.
     * 
     * @return the domain or <tt>null</tt>.
     */
    String getDomain();

}
