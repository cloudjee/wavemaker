
package com.wavemaker.tools.cloudfoundry.timeout.monitor;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

/**
 * A recording of a {@link HttpServletResponse} that can be replayed.
 * 
 * @author Phillip Webb
 */
public interface ReplayableHttpServletResponse {

    /**
     * Replay the all events monitored so far to the specified <tt>response</tt>.
     * 
     * @param response the response used to replay the events
     * @throws IOException
     */
    void replay(HttpServletResponse response) throws IOException;

}
