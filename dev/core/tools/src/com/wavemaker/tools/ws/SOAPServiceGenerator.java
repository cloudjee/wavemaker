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
package com.wavemaker.tools.ws;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;

import com.sun.codemodel.JBlock;
import com.sun.codemodel.JCatchBlock;
import com.sun.codemodel.JClass;
import com.sun.codemodel.JDefinedClass;
import com.sun.codemodel.JExpr;
import com.sun.codemodel.JFieldVar;
import com.sun.codemodel.JInvocation;
import com.sun.codemodel.JMethod;
import com.sun.codemodel.JMod;
import com.sun.codemodel.JTryBlock;
import com.sun.codemodel.JType;
import com.sun.codemodel.JVar;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.ws.jaxws.SOAPBindingResolver;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.ws.jaxws.JAXWSBuilder;
import com.wavemaker.tools.ws.jaxws.JAXWSPortTypeInfo;
import com.wavemaker.tools.ws.jaxws.JAXWSServiceInfo;
import com.wavemaker.tools.ws.wsdl.SchemaElementType;

/**
 * This class generates SOAP service stubs.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 */
public class SOAPServiceGenerator extends WebServiceGenerator {

    protected static final String SOAP_SERVICE_VAR_PROP_NAME = "soapServiceVar";

    private JAXWSBuilder jaxwsBuilder;
    
    private List<JAXWSServiceInfo> serviceInfoList;

    private Map<String, JFieldVar> opSoapServiceMap = new HashMap<String, JFieldVar>();

    public SOAPServiceGenerator(GenerationConfiguration configuration) {
        super(configuration);

        jaxwsBuilder = new JAXWSBuilder(wsdl, configuration
                .getOutputDirectory(), configuration.getOutputDirectory());
        serviceInfoList = jaxwsBuilder.getServiceInfoList();
    }

    @Override
    protected void preGeneration() throws GenerationException {
        super.preGeneration();

        // generate JAXB Java files and JAXWS service client Java files
        jaxwsBuilder.generate(jaxbBindingFiles);
    }

    @Override
    protected void postGeneration() throws GenerationException {
        super.postGeneration();

        // delete generated class files
        for (File file : getPackageDir().listFiles()) {
            if (file.getName().endsWith(".class")) {
                file.delete();
            }
        }
    }

    @Override
    protected void preGenerateClassBody(JDefinedClass cls)
            throws GenerationException {
        super.preGenerateClassBody(cls);
        
        for (JAXWSServiceInfo serviceInfo : serviceInfoList) {
            for (JAXWSPortTypeInfo portTypeInfo : serviceInfo.getPortTypeInfoList()) {
                String seiVarName = CodeGenUtils.toVariableName(portTypeInfo.getName()) + "Service";
                // [RESULT]
                // private <seiClass> <seiVarName>;
                JClass jclass = codeModel.ref(portTypeInfo.getSeiFQClassName());
                JFieldVar soapServiceVar = cls.field(JMod.PRIVATE, jclass, seiVarName);
                portTypeInfo.setProperty(SOAP_SERVICE_VAR_PROP_NAME, soapServiceVar);
            }
        }
        
        populateOpSoapServiceMap();
    }

    private void populateOpSoapServiceMap() {
        for (JAXWSServiceInfo serviceInfo : serviceInfoList) {
            for (JAXWSPortTypeInfo portTypeInfo : serviceInfo
                    .getPortTypeInfoList()) {
                for (String opName : portTypeInfo.getOperationNames()) {
                    opSoapServiceMap.put(opName, portTypeInfo.getProperty(
                            SOAP_SERVICE_VAR_PROP_NAME, JFieldVar.class));
                }
            }
        }
    }

    @Override
    protected void generateDefaultConstructorBody(JBlock body)
            throws GenerationException {
        for (JAXWSServiceInfo serviceInfo : serviceInfoList) {
            String serviceClientVarName = CodeGenUtils.toVariableName(serviceInfo.getServiceClientClassName());
            // [RESULT]
            // <serviceClientClass> <serviceClientVar>;
            JClass jclass = codeModel.ref(serviceInfo.getServiceClientFQClassName());
            JVar serviceClientVar = body.decl(jclass, serviceClientVarName);
        
            // [RESULT]
            // try {
            JTryBlock tryBlock = body._try();
            JBlock tryBody = tryBlock.body();
        
            // [RESULT]
            // URL wsdlLocation = new ClassPathResource(<packageWsdlPath>).getURL();
            JInvocation newClassPathResourceInvoke = JExpr._new(codeModel.ref(
                    ClassPathResource.class)).arg(getRelativeWSDLPath()).invoke("getURL");
            JVar wsdlLocationVar = tryBody.decl(codeModel.ref(URL.class), 
                    "wsdlLocation", newClassPathResourceInvoke);
        
            // [RESULT]
            // <serviceClientVar> = new <serviceClientClass>(wsdlLocation, <serviceQNameVar>);
            JInvocation newServiceClientInvoke = JExpr._new(jclass).arg(wsdlLocationVar);
            newServiceClientInvoke.arg(serviceInfo.getProperty(SERVICE_QNAME_VAR_PROP_NAME, JFieldVar.class));
            tryBody.assign(serviceClientVar, newServiceClientInvoke);
        
            // [RESULT]
            // } catch (IOException e) {
            JCatchBlock catchBlock = tryBlock._catch(codeModel.ref(IOException.class));
            catchBlock.param("e");
        
            // [RESULT]
            // <serviceClientVar> = new <serviceClientClass>();
            catchBlock.body().assign(serviceClientVar, JExpr._new(jclass));
        
            for (JAXWSPortTypeInfo portTypeInfo : serviceInfo.getPortTypeInfoList()) {
                // [RESULT]
                // <soapServiceVar> = serviceClient.get<portTypeName>();
                body.assign(portTypeInfo.getProperty(SOAP_SERVICE_VAR_PROP_NAME, JFieldVar.class), serviceClientVar.invoke("get"
                    + JAXWSBuilder.getJaxwsGeneratedClassName(portTypeInfo.getPortName())));
            }
        }
    }

    @Override
    protected void generateOperationMethodBody(JMethod method, JBlock body,
            String operationName, Map<String, JType> inputJTypeMap, ElementType outputType1, //salesforce
            JType outputJType, Integer overloadCount) throws GenerationException {
        super.generateOperationMethodBody(method, body, operationName, 
                inputJTypeMap, outputType1, outputJType, overloadCount);
        
        JFieldVar soapServiceVar = opSoapServiceMap.get(operationName);
        
        List<SchemaElementType> exceptionTypes = wsdl.getExceptionTypes(operationName);
        // for now, if there is any fault(s) defined for the operation, then
        // have the method throws java.lang.Exception
        if (exceptionTypes.size() > 0) {
            method._throws(codeModel.ref(Exception.class));
        }

        List<SchemaElementType> inputTypes = wsdl
                .getDefinedInputTypes(operationName);
        ElementType outputType = wsdl.getOutputType(operationName);

        JVar outputVar = null;
        if (outputType != null) {
            // [RESULT]
            // <outputJType> response;
            outputVar = body.decl(outputJType, "response");
        }

        // [RESULT]
        // SOAPBindingResolver.setBindingProperties((BindingProvider)<soapServiceVar>, bindingProperties);
        JInvocation bindingInvoke = codeModel.ref(SOAPBindingResolver.class)
                .staticInvoke("setBindingProperties");
        bindingInvoke.arg(JExpr.cast(
                parseType("javax.xml.ws.BindingProvider"),
                soapServiceVar));
        bindingInvoke.arg(bindingPropertiesVar);
        body.add(bindingInvoke);

        List<SchemaElementType> soapHeaderInputTypes = wsdl
                .getSOAPHeaderInputTypes(operationName);
        if (soapHeaderInputTypes != null && soapHeaderInputTypes.size() > 0) {
            // [RESULT]
            // SOAPBindingResolver.setHeaders((WSBindingProvider)<soapServiceVar>, arg1, ...);
            JInvocation bindingHeadersInvoke = codeModel.ref(SOAPBindingResolver.class)
                    .staticInvoke("setHeaders");
            bindingHeadersInvoke.arg(JExpr.cast(
                    parseType("com.sun.xml.ws.developer.WSBindingProvider"),
                    soapServiceVar));
            for (SchemaElementType soapHeaderInputType : soapHeaderInputTypes) {
                bindingHeadersInvoke.arg(JExpr.ref(soapHeaderInputType.getName()));
            }
            body.add(bindingHeadersInvoke);
        }

        // [RESULT]
        // response = <soapServiceVar>.<operationMethodName>(arg1, ...);
        JInvocation soapServiceInvocation = soapServiceVar.invoke(JAXWSBuilder
                .getJavaMethodName(operationName));
        if (inputTypes != null) {
            for (SchemaElementType inputType : inputTypes) {
                soapServiceInvocation.arg(JExpr.ref(inputType.getName()));
            }
        }
        if (outputVar != null) {
            // [RESULT]
            // return response;
            body.assign(outputVar, soapServiceInvocation);
            body._return(outputVar);
        }
    }
}
