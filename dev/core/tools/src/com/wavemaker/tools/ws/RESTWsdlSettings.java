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
package com.wavemaker.tools.ws;

import java.util.List;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class RESTWsdlSettings {

    private String serviceName;

    private String operationName;

    private List<RESTInputParam> inputs;

    private String parameterizedUrl;

    private String outputType;

    private String xmlSchemaText;

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getOperationName() {
        return operationName;
    }

    public void setOperationName(String operationName) {
        this.operationName = operationName;
    }

    public List<RESTInputParam> getInputs() {
        return inputs;
    }

    public void setInputs(List<RESTInputParam> inputs) {
        this.inputs = inputs;
    }

    public String getParameterizedUrl() {
        return parameterizedUrl;
    }

    public void setParameterizedUrl(String parameterizedUrl) {
        this.parameterizedUrl = parameterizedUrl;
    }

    public String getOutputType() {
        return outputType;
    }

    public void setOutputType(String outputType) {
        this.outputType = outputType;
    }

    public String getXmlSchemaText() {
        return xmlSchemaText;
    }

    public void setXmlSchemaText(String xmlSchemaText) {
        this.xmlSchemaText = xmlSchemaText;
    }

}
