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

import com.wavemaker.tools.cloudfoundry.spinup.authentication.LoginCredentials;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecret;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;

/**
 * Service that can be used to deploy, start and transfer a {@link SharedSecret} to a particular cloud foundry
 * application. This service is split into two distinct methods to help guard against cloud foundry timeouts.
 * {@link #login(SharedSecret, LoginCredentials)} is a short running operation used to provide access.
 * {@link #start(SharedSecret, String, TransportToken)} is a potentially long running operation that will deploy and
 * start the spun up application.
 * 
 * @see DefaultSpinupService
 * @author Phillip Webb
 */
public interface SpinupService {

    /**
     * Returns the domain that the service is working against. This value can be written in cookies.
     * 
     * @return the domain
     */
    String getDomain();

    /**
     * Login the user to cloud foundry and return a transport token for storage. This method should return quick enough
     * not to cause any cloud foundry timeout issues.
     * 
     * @param secret the shared secret
     * @param credentials the login credentials of the user
     * @return a transport token
     * @throw InvalidLoginCredentialsException if the login credentials are not valid
     */
    TransportToken login(SharedSecret secret, LoginCredentials credentials) throws InvalidLoginCredentialsException;

    /**
     * Start and transfer the {@link SharedSecret} to to a particular cloud foundry application. This method may be long
     * running and care should be taken to guard against cloud foundry timeouts.
     * 
     * @param secret the shared secret
     * @param username the username of the person performing the operation
     * @param transportToken the transport token used for authentication
     * @return the URL of the started application
     */
    String start(SharedSecret secret, String username, TransportToken transportToken);

}
