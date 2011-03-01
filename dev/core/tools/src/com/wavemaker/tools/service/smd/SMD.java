/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.service.smd;

import java.util.SortedSet;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class SMD {

    private String serviceType;
    private String serviceURL;
    private SortedSet<Method> methods;
    
    public String getServiceType() {
        return serviceType;
    }
    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }
    public String getServiceURL() {
        return serviceURL;
    }
    public void setServiceURL(String serviceURL) {
        this.serviceURL = serviceURL;
    }
    public SortedSet<Method> getMethods() {
        return methods;
    }
    public void setMethods(SortedSet<Method> methods) {
        this.methods = methods;
    }
}