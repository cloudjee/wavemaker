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
