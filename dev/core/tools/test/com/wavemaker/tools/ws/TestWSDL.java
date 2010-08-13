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
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.tools.ws.JAXBTypeMapper;
import com.wavemaker.tools.ws.wsdl.WSDL;
import com.wavemaker.tools.ws.wsdl.WSDLManager;

/**
 * @author ffu
 * @version $Rev:22673 $ - $Date:2008-05-30 14:45:46 -0700 (Fri, 30 May 2008) $
 * 
 */
public class TestWSDL extends WMTestCase {

    public static WSDL buildWSDL(String wsdlResource) throws Exception {
        String resource = ClassLoaderUtils.getResource(wsdlResource);
        WSDL wsdl = WSDLManager.processWSDL(resource, null);
        return wsdl;
    }

    public static JAXBTypeMapper buildJAXBTypeMapper(WSDL wsdl,
            List<String> bindingResources) throws Exception {
        List<File> bindingFiles = new ArrayList<File>();
        if (bindingResources != null) {
            for (String bindingResource : bindingResources) {
                File bindingFile = new File(new URI(ClassLoaderUtils
                        .getResource(bindingResource)));
                bindingFiles.add(bindingFile);
            }
        }
        JAXBTypeMapper mapper = new JAXBTypeMapper(wsdl, bindingFiles);
        return mapper;
    }

    public static WSDL getWSDL(String wsdlResource,
            List<String> bindingResources) throws Exception {
        WSDL wsdl = buildWSDL(wsdlResource);
        JAXBTypeMapper mapper = buildJAXBTypeMapper(wsdl, bindingResources);
        wsdl.setTypeMapper(mapper);
        return wsdl;
    }

    public static WSDL getWSDL(String wsdlResource) throws Exception {
        return getWSDL(wsdlResource, null);
    }

    public void testWSDLBuilder() throws Exception {
        WSDL wsdl = buildWSDL("com/wavemaker/runtime/ws/stockquote.wsdl");
        assertNotNull(wsdl);
    }

    public void testJAXBTypeMapperBuilder() throws Exception {
        WSDL wsdl = buildWSDL("com/wavemaker/runtime/ws/stockquote.wsdl");
        JAXBTypeMapper mapper = buildJAXBTypeMapper(wsdl, null);
        assertNotNull(mapper);
    }
    
    public void testRPCEncodedWSDL() throws Exception {
        try {
            buildWSDL("com/wavemaker/runtime/ws/GoogleSearch.wsdl");
            fail("should fail an exception for RPC/encoded style.");
        } catch (Exception e) {
            // expected exception
        }
    }

}
