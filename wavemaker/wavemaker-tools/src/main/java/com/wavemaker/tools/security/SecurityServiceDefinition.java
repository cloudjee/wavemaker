/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.security;

import com.wavemaker.runtime.security.SecurityService;
import com.wavemaker.tools.javaservice.JavaServiceDefinition;

/**
 * Service definition for SecurityService.
 * 
 * @author Frankie Fu
 */
public class SecurityServiceDefinition extends JavaServiceDefinition {

    public static final String DEFAULT_SERVICE_ID = "securityService";

    public SecurityServiceDefinition(String serviceId) {
        super(SecurityService.class, serviceId);
    }

}
