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

import java.util.ArrayList;
import java.util.List;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.tools.ws.wsdl.WSDL;

/**
 * @author Frankie Fu
 */
public class WSDLRestTest extends WMTestCase {

    public static WSDL getYahooStockQuoteWSDL() throws Exception {
        return WSDLTest.getWSDL("com/wavemaker/tools/ws/YahooStockQuote.wsdl");
    }

    public static WSDL getYahooTrafficDataWSDL() throws Exception {
        return WSDLTest.getWSDL("com/wavemaker/tools/ws/YahooTrafficData.wsdl");
    }

    public static WSDL getAmazonSearchWSDL() throws Exception {
        String wsdlResource = "com/wavemaker/tools/ws/AmazonREST.wsdl";
        List<String> bindingResources = new ArrayList<String>();
        bindingResources.add("com/wavemaker/tools/ws/AmazonRESTService1.xjb");
        return WSDLTest.getWSDL(wsdlResource, bindingResources);
    }

    public void testYahooStockQuoteGetServiceName() throws Exception {
        WSDL wsdl = getYahooStockQuoteWSDL();
        assertEquals("YahooStockQuote", wsdl.getServiceId());
    }

    public void testYahooStockQuoteGetEndpointLocation() throws Exception {
        WSDL wsdl = getYahooStockQuoteWSDL();
        assertEquals(
            "http://service.openkapow.com/frankiefu/yahooquoteservice?symbol={symbol}&resultformat=xml&xml.rootElementName=&html.title=&html.style.stylesheetLink=&header=yes&json.callbackFunction=",
            wsdl.getEndpointLocation());
    }

    public void testYahooStockQuoteGetOperationNames() throws Exception {
        WSDL wsdl = getYahooStockQuoteWSDL();
        List<String> operationNames = wsdl.getOperationNames();
        assertEquals(1, operationNames.size());
        assertEquals("getQuote", operationNames.get(0));
    }

    public void testYahooStockQuoteGetInputTypes() throws Exception {
        WSDL wsdl = getYahooStockQuoteWSDL();
        List<ElementType> inputTypes = wsdl.getInputTypes("getQuote");
        assertEquals(1, inputTypes.size());
        ElementType inputType = inputTypes.get(0);
        assertEquals("symbol", inputType.getName());
        assertEquals("java.lang.String", inputType.getJavaType());
        assertEquals(false, inputType.isList());

        // check the child properties for the inputType
        assertEquals(0, inputType.getProperties().size());
    }

    public void testYahooStockQuoteGetOutputType() throws Exception {
        WSDL wsdl = getYahooStockQuoteWSDL();
        ElementType outputType = wsdl.getOutputType("getQuote", false);
        assertEquals("body", outputType.getName());
        assertEquals("com.openkapow.service.frankiefu.yahooquoteservice.yahoostockquote.Result", outputType.getJavaType());
        assertEquals(false, outputType.isList());

        // check the child properties for the outputType
        List<ElementType> properties = outputType.getProperties();
        assertEquals(1, properties.size());
        assertEquals("java.lang.String", properties.get(0).getJavaType());
        assertEquals(0, properties.get(0).getProperties().size());
    }

    public void testYahooStockQuoteGetTypes() throws Exception {
        WSDL wsdl = getYahooStockQuoteWSDL();
        List<ElementType> types = wsdl.getTypes();
        assertEquals(1, types.size());
        assertEquals("com.openkapow.service.frankiefu.yahooquoteservice.yahoostockquote.Result", types.get(0).getJavaType());
        List<ElementType> properties = types.get(0).getProperties();
        assertEquals(1, properties.size());
        assertEquals("quote", properties.get(0).getName());
        assertEquals("java.lang.String", properties.get(0).getJavaType());
    }

    public void testYahooTrafficGetServiceName() throws Exception {
        WSDL wsdl = getYahooTrafficDataWSDL();
        assertEquals("YahooTraffic", wsdl.getServiceId());
    }

    public void testYahooTrafficGetEndpointLocation() throws Exception {
        WSDL wsdl = getYahooTrafficDataWSDL();
        assertEquals("http://api.local.yahoo.com/MapsService/V1/trafficData?appid={appid}&street={street}&city={city}&state={state}&include_map=1",
            wsdl.getEndpointLocation());
    }

    public void testYahooTrafficGetOperationNames() throws Exception {
        WSDL wsdl = getYahooTrafficDataWSDL();
        List<String> operationNames = wsdl.getOperationNames();
        assertEquals(1, operationNames.size());
        assertEquals("getTrafficData", operationNames.get(0));
    }

    public void testYahooTrafficGetInputTypes() throws Exception {
        WSDL wsdl = getYahooTrafficDataWSDL();
        List<ElementType> inputTypes = wsdl.getInputTypes("getTrafficData");
        assertEquals(4, inputTypes.size());
        ElementType inputType = inputTypes.get(0);
        assertEquals("appid", inputType.getName());
        assertEquals("java.lang.String", inputType.getJavaType());
        assertEquals(false, inputType.isList());
        assertEquals(0, inputType.getProperties().size());
        inputType = inputTypes.get(1);
        assertEquals("street", inputType.getName());
        assertEquals("java.lang.String", inputType.getJavaType());
        assertEquals(false, inputType.isList());
        assertEquals(0, inputType.getProperties().size());
        inputType = inputTypes.get(2);
        assertEquals("city", inputType.getName());
        assertEquals("java.lang.String", inputType.getJavaType());
        assertEquals(false, inputType.isList());
        assertEquals(0, inputType.getProperties().size());
        inputType = inputTypes.get(3);
        assertEquals("state", inputType.getName());
        assertEquals("java.lang.String", inputType.getJavaType());
        assertEquals(false, inputType.isList());
        assertEquals(0, inputType.getProperties().size());
    }

    public void testYahooTrafficGetOutputType() throws Exception {
        WSDL wsdl = getYahooTrafficDataWSDL();
        ElementType outputType = wsdl.getOutputType("getTrafficData", false);
        assertEquals("body", outputType.getName());
        assertEquals("yahoo.maps.yahootraffic.ResultSet", outputType.getJavaType());
        assertEquals(false, outputType.isList());
    }

    public void testAmazonSearchGetTypes() throws Exception {
        WSDL wsdl = getAmazonSearchWSDL();
        assertNotNull(wsdl);
        List<ElementType> types = wsdl.getTypes();
        for (ElementType type : types) {
            String javaType = type.getJavaType();
            if (javaType.equals("com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListmaniaLists")) {
                assertEquals(1, type.getProperties().size());
                assertEquals("com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListmaniaLists.ListmaniaList",
                    type.getProperties().get(0).getJavaType());
            }
            if (javaType.equals("com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Items")) {
                List<ElementType> properties = type.getProperties();
                assertEquals(5, properties.size());
            }
        }
    }
}
