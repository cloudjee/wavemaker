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
 * Copyright (C) 2007-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.ws.wsdl;

import java.util.Map;
import java.util.TreeMap;

import javax.wsdl.Operation;
import javax.wsdl.Port;
import javax.wsdl.PortType;
import javax.wsdl.Service;
import javax.xml.namespace.QName;

import com.wavemaker.common.util.CastUtils;
import com.wavemaker.tools.ws.CodeGenUtils;
import com.wavemaker.tools.ws.wsdl.WSDLUtils.SoapAddress;

/**
 * This class represents a PortType in the WSDL defintion.
 * 
 * @author ffu
 * @version $Rev: 22692 $ - $Date: 2008-05-30 16:58:02 -0700 (Fri, 30 May 2008) $
 * 
 */
public class PortTypeInfo extends GenericInfo {

    private PortType portType;

    private Port port;

    private Service service;

    private String targetNamespace;

    private Map<String, Operation> operationMap = new TreeMap<String, Operation>();

    protected PortTypeInfo(PortType portType) {
        this.portType = portType;
        
        for (Operation op : CastUtils.cast(portType.getOperations(),
                Operation.class)) {
            operationMap.put(CodeGenUtils.toJavaMethodName(op.getName()), op);
        }
    }

    public QName getQName() {
        return portType.getQName();
    }
    
    public String getName() {
        return getQName().getLocalPart();
    }

    public String getClassName() {
        return CodeGenUtils.toClassName(getName());
    }

    public String getPortName() {
        return port.getName();
    }

    public Map<String, Operation> getOperationMap() {
        return operationMap;
    }

    public String getSoapAddress() {
        if (port != null) {
            SoapAddress soapAddress = WSDLUtils.getSoapAddress(port);
            if (soapAddress != null) {
                return soapAddress.getLocationURI();
            }
        }
        return null;
    }

    protected String getTargetNamespace() {
        return targetNamespace;
    }

    protected void setTargetNamespace(String ns) {
        targetNamespace = ns;
    }

    protected void setPort(Port port) {
        this.port = port;
    }

    protected Service getService() {
        return service;
    }

    protected void setService(Service service) {
        this.service = service;
    }
}
