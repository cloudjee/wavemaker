/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.cloudfoundry.timeout.monitor;


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
