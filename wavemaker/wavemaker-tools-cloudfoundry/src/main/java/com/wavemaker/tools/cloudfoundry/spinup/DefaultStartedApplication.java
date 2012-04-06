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

package com.wavemaker.tools.cloudfoundry.spinup;

import org.springframework.util.Assert;

import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;

/**
 * Default implementation of {@link StartedApplication}.
 * 
 * @author Phillip Webb
 */
public class DefaultStartedApplication implements StartedApplication {

    private final TransportToken transportToken;

    private final String applicationUrl;

    private final String domain;

    /**
     * Create a new {@link DefaultStartedApplication} implementation.
     * 
     * @param transportToken the transport token
     * @param applicationUrl the redirect URL
     */
    public DefaultStartedApplication(TransportToken transportToken, String applicationUrl, String domain) {
        Assert.notNull(transportToken, "TransportToken must not be null");
        Assert.notNull(applicationUrl, "ApplicationUrl must not be null");
        this.transportToken = transportToken;
        this.applicationUrl = applicationUrl;
        this.domain = domain;
    }

    @Override
    public TransportToken getTransportToken() {
        return this.transportToken;
    }

    @Override
    public String getApplicationUrl() {
        return this.applicationUrl;
    }

    @Override
    public String getDomain() {
        return this.domain;
    }
}
