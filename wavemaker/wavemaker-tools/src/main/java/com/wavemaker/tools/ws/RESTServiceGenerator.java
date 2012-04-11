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

package com.wavemaker.tools.ws;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.wsdl.Operation;

import org.springframework.core.io.Resource;
import org.w3c.dom.Element;

import com.sun.codemodel.JBlock;
import com.sun.codemodel.JCodeModel;
import com.sun.codemodel.JDefinedClass;
import com.sun.codemodel.JExpr;
import com.sun.codemodel.JFieldVar;
import com.sun.codemodel.JInvocation;
import com.sun.codemodel.JMethod;
import com.sun.codemodel.JMod;
import com.sun.codemodel.JType;
import com.sun.codemodel.JVar;
import com.sun.tools.xjc.api.S2JJAXBModel;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.ws.RESTInputParam;
import com.wavemaker.runtime.ws.RESTService;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.ws.wsdl.PortTypeInfo;
import com.wavemaker.tools.ws.wsdl.ServiceInfo;
import com.wavemaker.tools.ws.wsdl.WSDL;

/**
 * This class generates REST service stubs.
 * 
 * @author Frankie Fu
 * @author Jeremy Grelle
 */
public class RESTServiceGenerator extends WebServiceGenerator {

    private JFieldVar parameterizedURIVar;

    private JFieldVar restServiceVar;

    private JVar urlInputMapVar;

    private JVar headerInputMapVar;

    private ServiceInfo serviceInfo;

    public RESTServiceGenerator() {
    }

    public RESTServiceGenerator(GenerationConfiguration configuration) {
        // super(configuration);

        // each REST service should has one and only one ServiceInfo
        // serviceInfo = wsdl.getServiceInfoList().get(0);
        this.init(configuration);
    }

    @Override
    public void init(GenerationConfiguration configuration) {
        super.init(configuration);
        this.serviceInfo = this.wsdl.getServiceInfoList().get(0);
    }

    @Override
    protected void preGeneration() throws GenerationException {
        super.preGeneration();

        // compile schema and generate JAXB Java files
        List<String> wsdlFilePaths = new ArrayList<String>();
        wsdlFilePaths.add(this.wsdl.getURI());
        List<String> jaxbBindingFilePaths = new ArrayList<String>();
        for (Resource jaxbBindingFile : this.jaxbBindingFiles) {
            try {
                jaxbBindingFilePaths.add(jaxbBindingFile.getURI().toString());
            } catch (IOException ex) {
                throw new GenerationException(ex);
            }
        }
        S2JJAXBModel model = ((JAXBTypeMapper) this.wsdl.getTypeMapper()).getJAXBModel();
        if (model != null) {
            XJCCompiler.generate(model, this.configuration.getOutputDirectory());
            afterClassGeneration(jaxbBindingFilePaths.get(0));
        }
    }

    // Extend this class and override this method if generated java classes need
    // to be customized.
    @Override
    protected void afterClassGeneration(String path) throws GenerationException {
    }

    @Override
    protected void preGenerateClassBody(JDefinedClass cls) throws GenerationException {
        super.preGenerateClassBody(cls);

        // [RESULT]
        // private String parameterizedURI = <parameterizedURI>;
        this.parameterizedURIVar = cls.field(JMod.PRIVATE, this.codeModel.ref(String.class), "parameterizedURI",
            JExpr.lit(this.wsdl.getEndpointLocation()));

        this.restServiceVar = defineRestServiceVariable(cls, this.codeModel);
    }

    @Override
    protected JFieldVar defineRestServiceVariable(JDefinedClass cls, JCodeModel codeModel) {
        // [RESULT]
        // private RESTService restService;
        JFieldVar var = cls.field(JMod.PRIVATE, codeModel.ref(RESTService.class), "restService");

        return var;
    }

    @Override
    protected void generateDefaultConstructorBody(JBlock body) throws GenerationException {
        JFieldVar serviceQNameVar = this.serviceInfo.getProperty(SERVICE_QNAME_VAR_PROP_NAME, JFieldVar.class);

        // [RESULT]
        // restService = new RESTService(serviceId, serviceQName,
        // parameterizedURI);
        JInvocation invocation = defineServiceInvocation(this.codeModel);
        invocation.arg(this.serviceIdVar);
        invocation.arg(serviceQNameVar);
        invocation.arg(this.parameterizedURIVar);
        body.assign(this.restServiceVar, invocation);
    }

    @Override
    protected JInvocation defineServiceInvocation(JCodeModel codeModel) {
        JInvocation invocation = JExpr._new(codeModel.ref(RESTService.class));
        return invocation;
    }

    @Override
    protected void generateOperationMethodBody(JMethod method, JBlock body, String operationName, Map<String, JType> inputJTypeMap,
        ElementType outputType1, // salesforce
        JType outputJType, Integer overloadCount) throws GenerationException {
        super.generateOperationMethodBody(method, body, operationName, inputJTypeMap, outputType1, outputJType, overloadCount);

        // [RESULT]
        // Map<String,Object> urlParams = new HashMap<String,Object>();
        this.urlInputMapVar = body.decl(parseType("java.util.Map<String,Object>"), "urlParams",
            JExpr._new(parseType("java.util.HashMap<String,Object>")));
        this.headerInputMapVar = body.decl(parseType("java.util.Map<String,Object>"), "headerParams",
            JExpr._new(parseType("java.util.HashMap<String,Object>")));

        for (String paramName : inputJTypeMap.keySet()) {
            JInvocation invocation;
            if (passedInHeader(operationName, paramName)) {
                // [RESULT]
                // headerParams.put("<paramName>", <paramName>);
                invocation = this.headerInputMapVar.invoke("put");

            } else {
                // [RESULT]
                // urlParams.put("<paramName>", <paramName>);
                invocation = this.urlInputMapVar.invoke("put");
            }
            invocation.arg(JExpr.lit(paramName));
            invocation.arg(JExpr.ref(paramName));
            body.add(invocation);
        }

        body = addExtraInputParameters(body, this.serviceInfo, this.wsdl, operationName);

        ElementType type = this.wsdl.getOutputType(operationName);
        ElementType outputType = getAdjustedOutputType(type);

        if (this.wsdl.getHttpRequestMethod() != null) {
            // [RESULT]
            // restService.setHttpRequestMethod(<httpRequestMethod>);
            JInvocation setHttpRequestInvoke = this.restServiceVar.invoke("setHttpRequestMethod");
            setHttpRequestInvoke.arg(this.wsdl.getHttpRequestMethod().name());
            body.add(setHttpRequestInvoke);
        }

        // [RESULT]
        // restService.setBindingProperties(bindingProperties);
        JInvocation setBindingInvoke = this.restServiceVar.invoke("setBindingProperties");
        setBindingInvoke.arg(this.bindingPropertiesVar);
        body.add(setBindingInvoke);

        JInvocation invocation = this.restServiceVar.invoke("invoke");
        invocation.arg(this.urlInputMapVar);

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
            invocation.arg(this.codeModel.ref("Void").dotclass());
            invocation.arg(this.headerInputMapVar);
            invocation = addExtraInputArgsInMethodInvocation(invocation, this.wsdl, operationName);
            body.add(invocation);
        } else {
            String javaType1 = getOutputJavaType(outputType);
            String javaType = outputJType.name();
            // [RESULT]
            // <outputType> result = restService.invoke(inputMap, <outputType>);
            invocation.arg(this.codeModel.ref(javaType1).dotclass());
            invocation.arg(this.headerInputMapVar);
            invocation = addExtraInputArgsInMethodInvocation(invocation, this.wsdl, operationName);
            JVar var = body.decl(this.codeModel.ref(javaType), "result", invocation);

            // [RESULT]
            // return ((<outputType>) result);
            body._return(JExpr.cast(this.codeModel.ref(javaType), var));
        }
    }

    @Override
    protected JBlock addExtraInputParameters(JBlock body, ServiceInfo serviceInfo, WSDL wsdl, String operationName) {
        return body;
    }

    protected JBlock addInputParameters(JBlock body, Map<String, String> paramMap, boolean isRef) {
        for (Map.Entry<String, String> entry : paramMap.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            JInvocation invocation = this.urlInputMapVar.invoke("put");
            invocation.arg(JExpr.lit(key));
            if (isRef) {
                invocation.arg(JExpr.ref(value));
            } else {
                invocation.arg(JExpr.lit(value));
            }
            body.add(invocation);
        }

        return body;
    }

    private InvokeParams extraceInvokeParams(String operationName) {
        PortTypeInfo portTypeInfo = this.serviceInfo.getPortTypeInfoList().get(0);
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

    private boolean passedInHeader(String operationName, String paramName) {
        List<RESTInputParam> list = this.serviceDefinition.getInputParams(operationName);
        if (list != null) {
            for (RESTInputParam rip : list) {
                if (rip.getName().equals(paramName)) {
                    return rip.toLocation() == RESTInputParam.InputLocation.HEADER;
                }
            }
        }
        return false;
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
                        this.endpoint = args[2];
                    case 2:
                        this.contentType = args[1];
                    case 1:
                        this.method = args[0];
                }
            }
        }

        public String getMethod() {
            return this.method;
        }

        public String getContentType() {
            return this.contentType;
        }

        public String getEndpoint() {
            return this.endpoint;
        }
    }

    /**
     * Implement this method if the output type of the service invocation method, which is originated from WSDL, needs
     * to be customized for any reason.
     * 
     * @param invocation the java code object for method invocation
     * @param wsdl the WSDL object
     * @return the java code object for method invocation
     */
    protected JInvocation addExtraInputArgsInMethodInvocation(JInvocation invocation, WSDL wsdl, String operName) {
        return invocation;
    }
}
