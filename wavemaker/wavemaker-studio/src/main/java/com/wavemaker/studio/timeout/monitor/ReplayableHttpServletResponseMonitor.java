package com.wavemaker.studio.timeout.monitor;

import javax.servlet.http.HttpServletResponse;

/**
 * A {@link HttpServletResponseMonitor} that records all monitored evens such that they can be
 * {@link ReplayableHttpServletResponse#replay(HttpServletResponse) replayed} to another {@link HttpServletResponse}.
 * 
 * @author Phillip Webb
 */
public interface ReplayableHttpServletResponseMonitor extends HttpServletResponseMonitor {

	/**
	 * Returns the replayable response.
	 * @return the replayable response.
	 */
	ReplayableHttpServletResponse getReplayableResponse();

}
