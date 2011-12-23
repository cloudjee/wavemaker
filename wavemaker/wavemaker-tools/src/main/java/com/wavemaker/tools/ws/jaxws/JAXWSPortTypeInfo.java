/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

import java.util.Set;

import com.wavemaker.tools.ws.wsdl.PortTypeInfo;

public class JAXWSPortTypeInfo {

    private final PortTypeInfo portTypeInfo;

    private final String seiClassName;

    private final String pkg;

    private final boolean isSeiClassNameModified;

    protected JAXWSPortTypeInfo(PortTypeInfo portTypeInfo, String seiClassName, String pkg, boolean isSeiClassNameModified) {
        this.portTypeInfo = portTypeInfo;
        this.seiClassName = seiClassName;
        this.pkg = pkg;
        this.isSeiClassNameModified = isSeiClassNameModified;
    }

    public String getName() {
        return this.portTypeInfo.getName();
    }

    public String getPortName() {
        return this.portTypeInfo.getPortName();
    }

    public Set<String> getOperationNames() {
        return this.portTypeInfo.getOperationMap().keySet();
    }

    /**
     * Returns the JAXWS generated service (@WebService) class name. The package is omitted.
     * 
     * @return The generated service class name.
     */
    public String getSeiClassName() {
        return this.seiClassName;
    }

    public String getSeiFQClassName() {
        return this.pkg + "." + getSeiClassName();
    }

    /**
     * If the SEI class name was modified because of name collision.
     */
    public boolean isSeiClassNameModified() {
        return this.isSeiClassNameModified;
    }

    public <T> T getProperty(String name, Class<T> cls) {
        return this.portTypeInfo.getProperty(name, cls);
    }

    public void setProperty(String name, Object v) {
        this.portTypeInfo.setProperty(name, v);
    }
}
