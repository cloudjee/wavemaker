/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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
 * @author Frankie Fu
 */
public class PortTypeInfo extends GenericInfo {

    private final PortType portType;

    private Port port;

    private Service service;

    private String targetNamespace;

    private final Map<String, Operation> operationMap = new TreeMap<String, Operation>();

    protected PortTypeInfo(PortType portType) {
        this.portType = portType;

        for (Operation op : CastUtils.cast(portType.getOperations(), Operation.class)) {
            this.operationMap.put(CodeGenUtils.toJavaMethodName(op.getName()), op);
        }
    }

    public QName getQName() {
        return this.portType.getQName();
    }

    public String getName() {
        return getQName().getLocalPart();
    }

    public String getClassName() {
        return CodeGenUtils.toClassName(getName());
    }

    public String getPortName() {
        return this.port.getName();
    }

    public Map<String, Operation> getOperationMap() {
        return this.operationMap;
    }

    public String getSoapAddress() {
        if (this.port != null) {
            SoapAddress soapAddress = WSDLUtils.getSoapAddress(this.port);
            if (soapAddress != null) {
                return soapAddress.getLocationURI();
            }
        }
        return null;
    }

    protected String getTargetNamespace() {
        return this.targetNamespace;
    }

    protected void setTargetNamespace(String ns) {
        this.targetNamespace = ns;
    }

    protected void setPort(Port port) {
        this.port = port;
    }

    protected Service getService() {
        return this.service;
    }

    protected void setService(Service service) {
        this.service = service;
    }
}
