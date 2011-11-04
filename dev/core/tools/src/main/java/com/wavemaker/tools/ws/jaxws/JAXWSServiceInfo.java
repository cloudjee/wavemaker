/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.ws.jaxws;

import java.util.List;

import com.wavemaker.tools.ws.CodeGenUtils;
import com.wavemaker.tools.ws.wsdl.ServiceInfo;

/**
 * @author Frankie Fu
 */
public class JAXWSServiceInfo {

    private final ServiceInfo serviceInfo;

    private final String pkg;

    private final List<JAXWSPortTypeInfo> portTypeInfoList;

    public JAXWSServiceInfo(ServiceInfo serviceInfo, String pkg, List<JAXWSPortTypeInfo> portTypeInfoList) {
        this.serviceInfo = serviceInfo;
        this.pkg = pkg;
        this.portTypeInfoList = portTypeInfoList;
    }

    public String getName() {
        return this.serviceInfo.getName();
    }

    /**
     * Returns the JAXWS generated service client (@WebServiceClient) class name. The package is omitted.
     * 
     * @return The generated service client class name.
     */
    public String getServiceClientClassName() {
        return CodeGenUtils.toClassName(this.serviceInfo.getName()) + "Client";
    }

    public String getServiceClientFQClassName() {
        return this.pkg + "." + getServiceClientClassName();
    }

    public List<JAXWSPortTypeInfo> getPortTypeInfoList() {
        return this.portTypeInfoList;
    }

    public <T> T getProperty(String name, Class<T> cls) {
        return this.serviceInfo.getProperty(name, cls);
    }
}
