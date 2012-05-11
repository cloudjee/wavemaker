/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
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

import java.net.MalformedURLException;
import java.io.File;
import java.io.IOException;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;
import com.wavemaker.tools.project.LocalStudioFileSystem;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.ServiceGenerator;
import com.wavemaker.tools.ws.wsdl.WSDL;
import com.wavemaker.tools.io.filesystem.local.LocalFileSystem;
import com.wavemaker.tools.io.filesystem.FileSystemFolder;
import com.wavemaker.tools.io.filesystem.FileSystemUtils;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.ClassPathFile;

/**
 * @author Frankie Fu
 * @author Jeremy Grelle
 */
public class WebServiceFactoryTest extends WMTestCase {

    private static final String STOCKQUOTE_WSDL = "com/wavemaker/tools/ws/stockquote.wsdl";

    private static final String YAHOO_STOCKQUOTE_WSDL = "com/wavemaker/tools/ws/YahooStockQuote.wsdl";

    public void testForSOAP() throws MalformedURLException {
        Resource wsdl = new ClassPathResource(STOCKQUOTE_WSDL);
        WebServiceFactory factory = new WebServiceFactory();
        DeprecatedServiceDefinition serviceDefinition = null;

        com.wavemaker.tools.io.File wsdlFile = null;
        try {
            wsdlFile = FileSystemUtils.convertToFileSystemFile(wsdl.getFile());
        } catch (IOException ex) {
            fail("Exception occurred while converting resource." + ex.getMessage());
        }

        serviceDefinition = factory.getServiceDefinition(wsdlFile);
        if (!(serviceDefinition instanceof WSDL)) {
            fail("The service definition should be a WSDL.");
        }

        File tempDir = null;
        try {
            tempDir = (new LocalStudioFileSystem().createTempDir()).getFile();
        } catch (IOException ex) {
            fail("Exception occurred during getServiceDefiniton." + ex.getMessage());
        }
        LocalFileSystem fileSystem = new LocalFileSystem(tempDir);
        Folder folder = FileSystemFolder.getRoot(fileSystem);

        GenerationConfiguration cfg = new GenerationConfiguration(serviceDefinition, folder);
        ServiceGenerator serviceGenerator = factory.getServiceGenerator(cfg);
        if (!(serviceGenerator instanceof SOAPServiceGenerator)) {
            fail("ServiceGenerator should be an instance of SOAPServiceGenerator, but was getting " + serviceGenerator.getClass().getName());
        }
    }

    public void testForREST() throws MalformedURLException {
        Resource wsdl = new ClassPathResource(YAHOO_STOCKQUOTE_WSDL);
        com.wavemaker.tools.io.File wsdlFile = null;
        try {
            wsdlFile = FileSystemUtils.convertToFileSystemFile(wsdl.getFile());
        } catch (IOException ex) {
            fail("Exception occurred while converting resource." + ex.getMessage());
        }
        WebServiceFactory factory = new WebServiceFactory();
        DeprecatedServiceDefinition serviceDefinition = null;
        try {
            serviceDefinition = factory.getServiceDefinition(wsdlFile);
            if (!(serviceDefinition instanceof WSDL)) {
                fail("The service definition should be a WSDL.");
            }
        } catch (WMRuntimeException e) {
            fail("Exception occurred during getServiceDefiniton." + e);
        }
        GenerationConfiguration cfg = new GenerationConfiguration(serviceDefinition, null);
        ServiceGenerator serviceGenerator = factory.getServiceGenerator(cfg);
        if (!(serviceGenerator instanceof RESTServiceGenerator)) {
            fail("ServiceGenerator should be an instance of RESTServiceGenerator, but was getting " + serviceGenerator.getClass().getName());
        }
    }
}
