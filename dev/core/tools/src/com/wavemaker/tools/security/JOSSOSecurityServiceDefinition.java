/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.security;

import com.wavemaker.runtime.security.JOSSOSecurityService;
import com.wavemaker.tools.javaservice.JavaServiceDefinition;

/**
 * Service definition for JOSSOSecurityService.
 * 
 * @author Ed Callahan
 * @version $Rev: 26762 $ - $Date: 2009-06-23 10:54:57 -0700 (Wed, 23 June 2009) $
 * 
 */
public class JOSSOSecurityServiceDefinition extends JavaServiceDefinition {

    public static final String DEFAULT_SERVICE_ID = "securityServiceJOSSO";
    
    public JOSSOSecurityServiceDefinition(String serviceId) {
        super(JOSSOSecurityService.class, serviceId);
    }

}
