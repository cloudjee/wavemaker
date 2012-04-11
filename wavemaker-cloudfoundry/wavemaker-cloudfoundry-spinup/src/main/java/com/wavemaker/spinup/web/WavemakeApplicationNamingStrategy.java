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

package com.wavemaker.spinup.web;

import org.springframework.stereotype.Component;

import com.wavemaker.tools.cloudfoundry.spinup.ApplicationNamingStrategy;
import com.wavemaker.tools.cloudfoundry.spinup.UsernameWithRandomApplicationNamingStrategy;

/**
 * {@link ApplicationNamingStrategy} for WaveMaker.
 */
@Component
public class WavemakeApplicationNamingStrategy extends UsernameWithRandomApplicationNamingStrategy {

    private static final String APPLICATION_NAME = "wavemaker-studio";

    public WavemakeApplicationNamingStrategy() {
        super(APPLICATION_NAME);
    }
}
