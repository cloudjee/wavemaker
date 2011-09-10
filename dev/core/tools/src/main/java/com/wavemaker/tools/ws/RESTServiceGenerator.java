/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.ws;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.wsdl.Operation;

import org.w3c.dom.Element;
import org.apache.commons.io.FileUtils;

import com.sun.codemodel.*;
import com.sun.tools.xjc.api.S2JJAXBModel;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.ws.RESTService;
import com.wavemaker.runtime.ws.infoteria.InfoteriaRESTService;
import com.wavemaker.runtime.ws.util.Constants;
import com.wavemaker.runtime.ws.util.WebServiceUtils;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.ws.wsdl.PortTypeInfo;
import com.wavemaker.tools.ws.wsdl.ServiceInfo;
import com.wavemaker.tools.ws.wsdl.SchemaElementType;
import com.wavemaker.tools.ws.wsdl.WSDL;
import com.wavemaker.common.util.StringUtils;

/**
 * This class generates REST service stubs.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class RESTServiceGenerator extends WebServiceGenerator {

    private JFieldVar parameterizedURIVar;

    private JFieldVar restServiceVar;
    
    private JVar inputMapVar;
    
    private ServiceInfo serviceInfo;

    public RESTServiceGenerator() {}
    
    public RESTServiceGenerator(GenerationConfiguration configuration) {
        //super(configuration);
        
        // each REST service should has one and only one ServiceInfo
        //serviceInfo = wsdl.getServiceInfoList().get(0);
        this.init(configuration);
    }

    public void init(GenerationConfiguration configuration) {
        super.init(configuration);
        serviceInfo = wsdl.getServiceInfoList().get(0);
    }

    @Override
    protected void preGeneration() throws GenerationException {
        super.preGeneration();

        // compile schema and generate JAXB Java files
        List<String> wsdlFilePaths = new ArrayList<String>();
        wsdlFilePaths.add(wsdl.getURI());
        List<String> jaxbBindingFilePaths = new ArrayList<String>();
        for (File jaxbBindingFile : jaxbBindingFiles) {
            jaxbBindingFilePaths.add(jaxbBindingFile.getPath());
        }
        S2JJAXBModel model = ((JAXBTypeMapper) wsdl.getTypeMapper()).getJAXBModel();
        if (model != null) {
            XJCCompiler.generate(model, configuration.getOutputDirectory());
            afterClassGeneration(jaxbBindingFilePaths.get(0));
        }
    }

    //Extend this class and override this method if generated java classes need to be customized.
    protected void afterClassGeneration(String path) throws GenerationException {
    }

    @Override
    protected void preGenerateClassBody(JDefinedClass cls)
            throws GenerationException {
        super.preGenerateClassBody(cls);
        
        // [RESULT]
        // private String parameterizedURI = <parameterizedURI>;
        parameterizedURIVar = cls.field(JMod.PRIVATE, codeModel
                .ref(String.class), "parameterizedURI", JExpr.lit(wsdl
                .getEndpointLocation()));

        restServiceVar = defineRestServiceVariable(cls, codeModel);
    }

    protected JFieldVar defineRestServiceVariable(JDefinedClass cls, JCodeModel codeModel) {
        // [RESULT]
        // private RESTService restService;
        JFieldVar var = cls.field(JMod.PRIVATE, codeModel
                .ref(RESTService.class), "restService");

        return var;
    }

    @Override
    protected void generateDefaultConstructorBody(JBlock body)
            throws GenerationException {
        JFieldVar serviceQNameVar = serviceInfo.getProperty(
                SERVICE_QNAME_VAR_PROP_NAME, JFieldVar.class);

        // [RESULT]
        // restService = new RESTService(serviceId, serviceQName, parameterizedURI);
        JInvocation invocation = defineServiceInvocation(codeModel);
        invocation.arg(serviceIdVar);
        invocation.arg(serviceQNameVar);
        invocation.arg(parameterizedURIVar);
        body.assign(restServiceVar, invocation);
    }

    protected JInvocation defineServiceInvocation(JCodeModel codeModel) {
        JInvocation invocation = JExpr._new(codeModel.ref(RESTService.class));
        return invocation;
    }

    @Override
    protected void generateOperationMethodBody(JMethod method, JBlock body,
            String operationName, Map<String, JType> inputJTypeMap, ElementType outputType1, //salesforce
            JType outputJType, Integer overloadCount) throws GenerationException {
        super.generateOperationMethodBody(method, body, operationName,
                inputJTypeMap, outputType1, outputJType, overloadCount);

        // [RESULT]
        // Map<String,Object> inputMap = new HashMap<String,Object>();
        inputMapVar = body.decl(parseType("java.util.Map<String,Object>"),
                "inputMap", JExpr._new(parseType("java.util.HashMap<String,Object>")));

        for (String paramName : inputJTypeMap.keySet()) {
            // [RESULT]
            // inputMap.put("<paramName>", <paramName>);
            JInvocation invocation = inputMapVar.invoke("put");
            invocation.arg(JExpr.lit(paramName));
            invocation.arg(JExpr.ref(paramName));
            body.add(invocation);
        }

        body = addExtraInputParameters(body, serviceInfo, wsdl, operationName);

        ElementType type = wsdl.getOutputType(operationName);
        ElementType outputType = getAdjustedOutputType(type);

        if (wsdl.getHttpRequestMethod() != null) {
            // [RESULT]
            // restService.setHttpRequestMethod(<httpRequestMethod>);
            JInvocation setHttpRequestInvoke = restServiceVar.invoke("setHttpRequestMethod");
            setHttpRequestInvoke.arg(wsdl.getHttpRequestMethod().name());
            body.add(setHttpRequestInvoke);
        }
        
        // [RESULT]
        // restService.setBindingProperties(bindingProperties);
        JInvocation setBindingInvoke = restServiceVar.invoke("setBindingProperties");
        setBindingInvoke.arg(bindingPropertiesVar);
        body.add(setBindingInvoke);

        JInvocation invocation = restServiceVar.invoke("invoke");
        invocation.arg(inputMapVar);
        
        InvokeParams params = extraceInvokeParams(operationName);
        if (params != null) {
            if (params.getMethod() == null) {
                invocation.arg(JExpr._null());
            } else {
                invocation.arg(params.getMethod());
            }
            if (params.getContentType() == null) {
                invocation.arg(JExpr._null());
            } else {
                invocation.arg(params.getContentType());
            }
            if (params.getEndpoint() == null) {
                invocation.arg(JExpr._null());
            } else {
                invocation.arg(params.getEndpoint());
            }
        }
        
        if (outputType == null) {
            // [RESULT]
            // restService.invoke(inputMap, Void.class);
            invocation.arg(codeModel.ref("Void").dotclass());
            body.add(invocation);
        } else {
            String javaType1 = getOutputJavaType(outputType);
            String javaType = outputJType.name();
            // [RESULT]
            // <outputType> result = restService.invoke(inputMap, <outputType>);
            invocation.arg(codeModel.ref(javaType1).dotclass());
            invocation = addExtraInputArgsInMethodInvocation(invocation, wsdl, operationName);
            JVar var = body.decl(codeModel.ref(javaType), "result",
                invocation);

            // [RESULT]
            // return ((<outputType>) result);
            body._return(JExpr.cast(codeModel.ref(javaType), var));
        }
    }

    protected JBlock addExtraInputParameters(JBlock body, ServiceInfo serviceInfo, WSDL wsdl, String operationName) {
        return body;
    }

    protected JBlock addInputParameters(JBlock body, Map<String, String> paramMap, boolean isRef) {
        for (Map.Entry<String, String> entry : paramMap.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            JInvocation invocation = inputMapVar.invoke("put");
            invocation.arg(JExpr.lit(key));
            if (isRef)
                invocation.arg(JExpr.ref(value));
            else
                invocation.arg(JExpr.lit(value));
            body.add(invocation);
        }

        return body;
    }
    
    private InvokeParams extraceInvokeParams(String operationName) {
        PortTypeInfo portTypeInfo = serviceInfo.getPortTypeInfoList().get(0);
        Operation op = portTypeInfo.getOperationMap().get(operationName);
        InvokeParams params = null;
        if (op != null) {
            Element element = op.getDocumentationElement();
            if (element != null && element.getFirstChild() != null) {
                String doc = element.getFirstChild().getTextContent();
                params = new InvokeParams(doc);
            }
        }
        return params;
    }
    
    private static class InvokeParams {
        
        private String method;

        private String contentType;

        private String endpoint;
        
        public InvokeParams(String s) {
            s = s.trim();
            String[] args = s.split(" ");
            if (args != null) {
                switch (args.length) {
                    case 3:
                        endpoint = args[2];
                    case 2:
                        contentType = args[1];
                    case 1:
                        method = args[0];
                }
            }
        }

        public String getMethod() {
            return method;
        }

        public String getContentType() {
            return contentType;
        }

        public String getEndpoint() {
            return endpoint;
        }
    }

    /**
     * Implement this method if the output type of the service invocation method, which is originated from WSDL,
     * needs to be customized for any reason.
     *
     * @param invocation the java code object for method invocation
     * @param wsdl the WSDL object
     * @return the java code object for method invocation
     */
    protected JInvocation addExtraInputArgsInMethodInvocation(JInvocation invocation, WSDL wsdl, String operName) {
        return invocation;
    }
}
