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
