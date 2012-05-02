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
     * Determine if a matched application requires an upgrade. This method should only be called if
     * {@link #isMatch(ApplicationDetails)} returns <tt>true</tt>.
     * 
     * @param applicationDetails the application details
     * @return if the upgrade is required
     */
    boolean isUpgradeRequired(ApplicationDetails applicationDetails);

    /**
     * Create new application details named correctly.
     * 
     * @param context Context that can be used to obtain relevant details
     * @return the application details
     */
    ApplicationDetails newApplicationDetails(ApplicationNamingStrategyContext context);
}
