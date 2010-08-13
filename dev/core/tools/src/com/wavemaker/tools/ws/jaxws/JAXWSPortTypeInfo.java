/*
 *  Copyright (C) 2009-2010 WaveMaker Software, Inc.
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
/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.wavemaker.tools.ws.jaxws;

import java.util.Set;

import com.wavemaker.tools.ws.wsdl.PortTypeInfo;

public class JAXWSPortTypeInfo {

    private PortTypeInfo portTypeInfo;
    
    private String seiClassName;
    
    private String pkg;
    
    private boolean isSeiClassNameModified;
    
    protected JAXWSPortTypeInfo(PortTypeInfo portTypeInfo, String seiClassName,
            String pkg, boolean isSeiClassNameModified) {
        this.portTypeInfo = portTypeInfo;
        this.seiClassName = seiClassName;
        this.pkg = pkg;
        this.isSeiClassNameModified = isSeiClassNameModified;
    }
    
    public String getName() {
        return portTypeInfo.getName();
    }

    public String getPortName() {
        return portTypeInfo.getPortName();
    }

    public Set<String> getOperationNames() {
        return portTypeInfo.getOperationMap().keySet();
    }

    /**
     * Returns the JAXWS generated service (@WebService) class name.  The
     * package is omitted.
     * 
     * @return The generated service class name.
     */
    public String getSeiClassName() {
        return seiClassName;
    }

    public String getSeiFQClassName() {
        return pkg + "." + getSeiClassName();
    }

    /**
     * If the SEI class name was modified because of name collision.
     */
    public boolean isSeiClassNameModified() {
        return isSeiClassNameModified;
    }
    
    public <T> T getProperty(String name, Class<T> cls) {
        return portTypeInfo.getProperty(name, cls);
    }
    
    public void setProperty(String name, Object v) {
        portTypeInfo.setProperty(name, v);
    }
}
