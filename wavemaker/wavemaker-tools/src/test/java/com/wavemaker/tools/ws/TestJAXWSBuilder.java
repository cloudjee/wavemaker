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

import java.util.List;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.tools.ws.jaxws.JAXWSBuilder;
import com.wavemaker.tools.ws.jaxws.JAXWSServiceInfo;
import com.wavemaker.tools.ws.wsdl.WSDL;

/**
 * @author Frankie Fu
 */
public class TestJAXWSBuilder extends WMTestCase {

    public void testGetServiceInfoList() throws Exception {
        WSDL wsdl = null;
        try {
            wsdl = TestWSDLSoap.getSalesforceWSDL();
        } catch (Exception e) {
            e.printStackTrace();
            fail(e.getMessage());
        }
        JAXWSBuilder jaxwsBuilder = new JAXWSBuilder(wsdl, null, null);
        List<JAXWSServiceInfo> serviceInfoList = jaxwsBuilder.getServiceInfoList();
        assertEquals(1, serviceInfoList.size());
        assertEquals(1, serviceInfoList.get(0).getPortTypeInfoList().size());
    }

    public void testGetJavaMethodName() throws Exception {
        String javaMethodName = JAXWSBuilder.getJavaMethodName("login");
        assertEquals("login", javaMethodName);
        javaMethodName = JAXWSBuilder.getJavaMethodName("update");
        assertEquals("update", javaMethodName);
        javaMethodName = JAXWSBuilder.getJavaMethodName("GetOneQuote");
        assertEquals("getOneQuote", javaMethodName);
        javaMethodName = JAXWSBuilder.getJavaMethodName("biblio-retrieval");
        assertEquals("biblioRetrieval", javaMethodName);
    }

    public void testGetJaxwsGeneratedClassName() throws Exception {
        String className = JAXWSBuilder.getJaxwsGeneratedClassName("BasicRealTimeQuotesSoap");
        assertEquals("BasicRealTimeQuotesSoap", className);
    }
}
