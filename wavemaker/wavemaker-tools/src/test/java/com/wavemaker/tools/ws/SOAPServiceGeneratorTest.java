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

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.core.io.FileSystemResource;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.ClassUtils;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.util.AntUtils;
import com.wavemaker.tools.ws.wsdl.WSDL;
import com.wavemaker.tools.ws.wsdl.WSDLManager;

/**
 * @author Frankie Fu
 */
public class SOAPServiceGeneratorTest extends WMTestCase {

    private static final String STOCKQUOTE_WSDL = "com/wavemaker/tools/ws/stockquote.wsdl";

    private File outputDir = null;

    @Override
    public void setUp() throws Exception {
        this.outputDir = IOUtils.createTempDirectory();
    }

    @Override
    public void tearDown() throws IOException {
        IOUtils.deleteRecursive(this.outputDir);
    }

    protected Class<?> generate(String wsdlResource) throws Exception {
        SpringUtils.initSpringConfig();

        String resource = ClassLoaderUtils.getResource(wsdlResource);
        WSDL wsdl = WSDLManager.processWSDL(resource, null, null, null);

        GenerationConfiguration genConfig = new GenerationConfiguration(wsdl, new FileSystemResource(this.outputDir));
        SOAPServiceGenerator generator = new SOAPServiceGenerator(genConfig);
        generator.generate();

        AntUtils.javac(this.outputDir.getAbsolutePath(), this.outputDir);
        URLClassLoader cl = new URLClassLoader(new URL[] { this.outputDir.toURI().toURL() });
        Class<?> serviceClass = Class.forName(wsdl.getPackageName() + "." + wsdl.getServiceId(), true, cl);
        return serviceClass;
    }

    public void testStockQuote() {
    }

    public void xtestStockQuote() throws Exception {
        Class<?> serviceClass = generate(STOCKQUOTE_WSDL);

        List<Method> methods = ClassUtils.getPublicMethods(serviceClass);

        Set<String> someExpectedMethodNames = new HashSet<String>();
        someExpectedMethodNames.add("GetQuote");
        for (Method m : methods) {
            someExpectedMethodNames.remove(m.getName());
        }
        if (!someExpectedMethodNames.isEmpty()) {
            fail("Also expected these methods " + someExpectedMethodNames);
        }
    }
}
