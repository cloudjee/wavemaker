/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
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
import java.util.List;
import java.util.Map;

import javax.xml.namespace.QName;

import com.sun.codemodel.JBlock;
import com.sun.codemodel.JDefinedClass;
import com.sun.codemodel.JExpr;
import com.sun.codemodel.JFieldVar;
import com.sun.codemodel.JInvocation;
import com.sun.codemodel.JMethod;
import com.sun.codemodel.JMod;
import com.sun.codemodel.JType;
import com.sun.codemodel.JVar;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.ws.util.Constants;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.service.codegen.ServiceGenerator;
import com.wavemaker.tools.ws.wsdl.ServiceInfo;
import com.wavemaker.tools.ws.wsdl.WSDL;

/**
 * Base class for all Web Service generators.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public abstract class WebServiceGenerator extends ServiceGenerator {

    protected static final String SERVICE_QNAME_VAR_PROP_NAME = "serviceQNameVar";
    
    protected WSDL wsdl;

    protected List<File> jaxbBindingFiles;
    
    protected JFieldVar serviceIdVar;
    
    protected JFieldVar bindingPropertiesVar;

    public WebServiceGenerator(GenerationConfiguration configuration) {
        super(configuration);
        if (serviceDefinition instanceof WSDL) {
            wsdl = (WSDL) serviceDefinition;
        } else {
            throw new WMRuntimeException(
                    "Service Generator can be used with WSDL only!");
        }
    }

    @Override
    protected void preGeneration() throws GenerationException {
        // create package directory if it is not already exists
        File packageDir = getPackageDir();
        if (!packageDir.exists()) {
            packageDir.mkdirs();
        }
        
        // generate JAXB binding customization files
        XJBBuilder builder = new XJBBuilder(wsdl);
        jaxbBindingFiles = builder.generate(configuration.getOutputDirectory(),
                false);

        // set JAXB TypeMapper
        JAXBTypeMapper typeMapper = null;
        try {
            typeMapper = new JAXBTypeMapper(wsdl, jaxbBindingFiles);
        } catch (GenerationException e) {
            // it may due to class/interface names collision, try to put
            // schemas in seperate packages.
            jaxbBindingFiles = builder.generate(
                    configuration.getOutputDirectory(), true);
            try {
                typeMapper = new JAXBTypeMapper(wsdl, jaxbBindingFiles);
            } catch (GenerationException ex) {
                // for some WSDLs, the global binding file causes some issues;
                // so remove global binding file and try again.
                removeGlobalBindingFile();
                typeMapper = new JAXBTypeMapper(wsdl, jaxbBindingFiles);
            }
        }
        wsdl.setTypeMapper(typeMapper);
    }

    private void removeGlobalBindingFile() {
        int index = 0;
        for (File jaxbBindingFile : jaxbBindingFiles) {
            if (jaxbBindingFile.getName().equals(
                    Constants.JAXB_GLOBAL_BINDING_FILE)) {
                jaxbBindingFiles.remove(index);
                break;
            }
            index++;
        }
    }

    @Override
    protected void postGeneration() throws GenerationException {
    }

    @Override
    protected void preGenerateClassBody(JDefinedClass cls)
            throws GenerationException {
        
        // [RESULT]
        // public String serviceId = <serviceId>;
        serviceIdVar = cls.field(JMod.PUBLIC, codeModel.ref(String.class),
                "serviceId", JExpr.lit(wsdl.getServiceId()));
        
        for (ServiceInfo serviceInfo : wsdl.getServiceInfoList()) {
            String sname = serviceInfo.getName();
            // [RESULT]
            // private QName <sname>QName = new QName(<namespaceURI>, <sname>);
            JInvocation invocation = JExpr._new(codeModel.ref(QName.class));
            invocation.arg(JExpr.lit(serviceInfo.getQName().getNamespaceURI()));
            invocation.arg(JExpr.lit(sname));
            JFieldVar serviceQNameVar = cls.field(JMod.PRIVATE, codeModel.ref(QName.class),
                    CodeGenUtils.toVariableName(sname) + "QName", invocation);
            
            serviceInfo.setProperty(SERVICE_QNAME_VAR_PROP_NAME, serviceQNameVar);
        }
        
        // [RESULT]
        // private BindingProperties bindingProperties;
        bindingPropertiesVar = cls.field(JMod.PRIVATE, 
                codeModel.ref(BindingProperties.class), "bindingProperties");
    }
    
    @Override
    protected void postGenerateClassBody(JDefinedClass cls)
        throws GenerationException {
        
        JMethod getBindingPropsMethod = cls.method(JMod.PUBLIC, 
                codeModel.ref(BindingProperties.class),
                "getBindingProperties");
        JBlock getBlock = getBindingPropsMethod.body();
        getBlock._return(bindingPropertiesVar);
        
        JMethod setBindingPropsMethod = cls.method(JMod.PUBLIC, codeModel.VOID, 
                "setBindingProperties");
        JVar var = setBindingPropsMethod.param(codeModel.ref(BindingProperties.class), 
                "bindingProperties");
        JBlock setBlock = setBindingPropsMethod.body();
        setBlock.assign(JExpr._this().ref(bindingPropertiesVar), var);
    }

    @Override
    protected void generateOperationMethodBody(JMethod method, JBlock body,
            String operationName, Map<String, JType> inputJTypeMap,
            JType outputJType, Integer overloadCount) throws GenerationException {
    }

    /**
     * Obtains a type object from the type string.
     * 
     * @param type
     *            The type string. This could be simple Java type like
     *            "java.io.File", or generic type like "java.util.Map<String,String>".
     * @return A type object.
     * @throws GenerationException
     */
    protected JType parseType(String type) throws GenerationException {
        try {
            return codeModel.parseType(type);
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
        return CodeGenUtils.getPackageDir(configuration.getOutputDirectory(), 
                wsdl.getPackageName());
    }
    
    /**
     * Returns the path to the WSDL file relative to the src directory.  For
     * example: net/webservicex/stockquote/stockquote.wsdl
     * @return
     */
    protected String getRelativeWSDLPath() {
        return wsdl.getPackageName().replace('.', '/') + "/"
                + new File(wsdl.getURI()).getName();
    }

}
