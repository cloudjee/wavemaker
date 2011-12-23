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

package com.wavemaker.tools.ws;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.xml.namespace.QName;

import org.springframework.core.io.Resource;

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
import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ConversionUtils;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.ws.util.Constants;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.service.codegen.ServiceGenerator;
import com.wavemaker.tools.ws.salesforce.JAXBTypeMapper_SF;
import com.wavemaker.tools.ws.wsdl.ServiceInfo;
import com.wavemaker.tools.ws.wsdl.TypeMapper;
import com.wavemaker.tools.ws.wsdl.WSDL;

/**
 * Base class for all Web Service generators.
 * 
 * @author Frankie Fu
 * @author Jeremy Grelle
 */
public abstract class WebServiceGenerator extends ServiceGenerator {

    protected static final String SERVICE_QNAME_VAR_PROP_NAME = "serviceQNameVar";

    protected List<Resource> jaxbBindingFiles;

    protected JFieldVar serviceIdVar;

    protected JFieldVar bindingPropertiesVar;

    public WebServiceGenerator() {
    }

    public WebServiceGenerator(GenerationConfiguration configuration) {
        this.init(configuration);
    }

    @Override
    public void init(GenerationConfiguration configuration) {
        super.init(configuration);
        if (this.serviceDefinition instanceof WSDL) {
            this.wsdl = (WSDL) this.serviceDefinition;
        } else {
            throw new WMRuntimeException("Service Generator can be used with WSDL only!");
        }
    }

    @Override
    protected void preGeneration() throws GenerationException {
        // create package directory if it is not already exists
        getPackageDir();

        // generate JAXB binding customization files
        XJBBuilder builder = new XJBBuilder(this.wsdl);

        // set JAXB TypeMapper
        TypeMapper typeMapper = null;

        try {
            this.jaxbBindingFiles = ConversionUtils.convertToResourceList(builder.generate(this.configuration.getOutputDirectory().getFile(), false));

            typeMapper = new JAXBTypeMapper_SF(this.wsdl, this.jaxbBindingFiles);
        } catch (GenerationException e) {
            try {
                // it may due to class/interface names collision, try to put
                // schemas in seperate packages.
                this.jaxbBindingFiles = ConversionUtils.convertToResourceList(builder.generate(this.configuration.getOutputDirectory().getFile(),
                    true));
                typeMapper = new JAXBTypeMapper_SF(this.wsdl, this.jaxbBindingFiles);
            } catch (GenerationException ex) {
                // for some WSDLs, the global binding file causes some issues;
                // so remove global binding file and try again.
                removeGlobalBindingFile();
                typeMapper = new JAXBTypeMapper_SF(this.wsdl, this.jaxbBindingFiles);
            } catch (IOException ex) {
                throw new GenerationException(ex);
            }
        } catch (IOException ex) {
            throw new GenerationException(ex);
        }
        this.wsdl.setTypeMapper(typeMapper);
    }

    private void removeGlobalBindingFile() {
        int index = 0;
        for (Resource jaxbBindingFile : this.jaxbBindingFiles) {
            if (jaxbBindingFile.getFilename().equals(Constants.JAXB_GLOBAL_BINDING_FILE)) {
                this.jaxbBindingFiles.remove(index);
                break;
            }
            index++;
        }
    }

    @Override
    protected void postGeneration() throws GenerationException {
    }

    @Override
    protected void preGenerateClassBody(JDefinedClass cls) throws GenerationException {

        // [RESULT]
        // public String serviceId = <serviceId>;
        this.serviceIdVar = cls.field(JMod.PUBLIC, this.codeModel.ref(String.class), "serviceId", JExpr.lit(this.wsdl.getServiceId()));

        for (ServiceInfo serviceInfo : this.wsdl.getServiceInfoList()) {
            String sname = serviceInfo.getName();
            // [RESULT]
            // private QName <sname>QName = new QName(<namespaceURI>, <sname>);
            JInvocation invocation = JExpr._new(this.codeModel.ref(QName.class));
            invocation.arg(JExpr.lit(serviceInfo.getQName().getNamespaceURI()));
            invocation.arg(JExpr.lit(sname));
            JFieldVar serviceQNameVar = cls.field(JMod.PRIVATE, this.codeModel.ref(QName.class), CodeGenUtils.toVariableName(sname) + "QName",
                invocation);

            serviceInfo.setProperty(SERVICE_QNAME_VAR_PROP_NAME, serviceQNameVar);
        }

        // [RESULT]
        // private BindingProperties bindingProperties;
        this.bindingPropertiesVar = cls.field(JMod.PRIVATE, this.codeModel.ref(BindingProperties.class), "bindingProperties");
    }

    @Override
    protected void postGenerateClassBody(JDefinedClass cls) throws GenerationException {

        JMethod getBindingPropsMethod = cls.method(JMod.PUBLIC, this.codeModel.ref(BindingProperties.class), "getBindingProperties");
        JBlock getBlock = getBindingPropsMethod.body();
        getBlock._return(this.bindingPropertiesVar);

        JMethod setBindingPropsMethod = cls.method(JMod.PUBLIC, this.codeModel.VOID, "setBindingProperties");
        JVar var = setBindingPropsMethod.param(this.codeModel.ref(BindingProperties.class), "bindingProperties");
        JBlock setBlock = setBindingPropsMethod.body();
        setBlock.assign(JExpr._this().ref(this.bindingPropertiesVar), var);

        // special requirements for Salesforce
        if (this.serviceDefinition.getServiceId().equals(CommonConstants.SALESFORCE_SERVICE)) { // salesforce
            JCodeModel mdl = new JCodeModel();
            JDefinedClass liveDataSvcCls;

            try {
                liveDataSvcCls = mdl._class("com.sforce.LiveDataServiceImpl_SF"); // salesforce
            } catch (Exception e) {
                throw new GenerationException(e);
            }

            cls._extends(liveDataSvcCls);
        }
    }

    @Override
    protected void generateOperationMethodBody(JMethod method, JBlock body, String operationName, Map<String, JType> inputJTypeMap,
        ElementType outputType, // salesforce
        JType outputJType, Integer overloadCount) throws GenerationException {
    }

    /**
     * Obtains a type object from the type string.
     * 
     * @param type The type string. This could be simple Java type like "java.io.File", or generic type like
     *        "java.util.Map<String,String>".
     * @return A type object.
     * @throws GenerationException
     */
    protected JType parseType(String type) throws GenerationException {
        try {
            return this.codeModel.parseType(type);
        } catch (ClassNotFoundException e) {
            throw new GenerationException(e);
        }
    }

    /**
     * Returns the Java package directory for this service.
     * 
     * @return The Java package directory for this service.
     */
    protected File getPackageDir() {
        try {
            return CodeGenUtils.getPackageDir(this.configuration.getOutputDirectory().getFile(), this.wsdl.getPackageName());
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    /**
     * Returns the path to the WSDL file relative to the src directory. For example:
     * net/webservicex/stockquote/stockquote.wsdl
     * 
     * @return
     */
    protected String getRelativeWSDLPath() {
        return this.wsdl.getPackageName().replace('.', '/') + "/" + new File(this.wsdl.getURI()).getName();
    }

}
