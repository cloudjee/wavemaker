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
import java.util.Arrays;
import java.util.List;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.tools.ws.wsdl.SchemaElementType;
import com.wavemaker.tools.ws.wsdl.WSDL;

/**
 * @author ffu
 * @version $Rev:22673 $ - $Date:2008-05-30 14:45:46 -0700 (Fri, 30 May 2008) $
 * 
 */
public class TestWSDLSoap extends WMTestCase {
    
    public static WSDL getStockQuoteWSDL() throws Exception {
        return TestWSDL.getWSDL("com/wavemaker/tools/ws/stockquote.wsdl");
    }
    
    public static WSDL getSalesforceWSDL() throws Exception {
        String wsdlResource = "com/wavemaker/tools/ws/salesforceEnterprise.wsdl";
        List<String> bindingResources = new ArrayList<String>();
        bindingResources.add("com/wavemaker/tools/ws/SforceService1.xjb");
        bindingResources.add("com/wavemaker/tools/ws/SforceService2.xjb");
        bindingResources.add("com/wavemaker/tools/ws/SforceService3.xjb");
        return TestWSDL.getWSDL(wsdlResource, bindingResources);
    }

    public static WSDL getWeatherForecastWSDL() throws Exception {
        String wsdlResource = "com/wavemaker/tools/ws/WeatherForecast.wsdl";
        List<String> bindingResources = new ArrayList<String>();
        bindingResources.add("com/wavemaker/tools/ws/global-binding.xjb");
        bindingResources.add("com/wavemaker/tools/ws/WeatherForecast1.xjb");
        return TestWSDL.getWSDL(wsdlResource, bindingResources);
    }
    
    public static WSDL getBasicRealTimeQuotesWSDL() throws Exception {
        String wsdlResource = "com/wavemaker/tools/ws/BasicRealTimeQuotes.wsdl";
        List<String> bindingResources = new ArrayList<String>();
        bindingResources.add("com/wavemaker/tools/ws/global-binding.xjb");
        bindingResources.add("com/wavemaker/tools/ws/BasicRealTimeQuotes1.xjb");
        bindingResources.add("com/wavemaker/tools/ws/BasicRealTimeQuotes2.xjb");
        return TestWSDL.getWSDL(wsdlResource, bindingResources);
    }
    
    private static final String[] REAL_QUOTE_TYPE_PROPERTYNAMES = new String[] {
        "symbol", "CUSIP", "CIK", "name", "date", "time", "last", "quantity",
        "changeFromPrevious", "percentChangeFromPrevious", "open",
        "changeFromOpen", "percentChangeFromOpen", "bid", "ask", "spread",
        "bidQuantity", "askQuantity", "volume", "ECNVolume", "highest", "lowest",
        "rank"
    };

    public static WSDL getUSHolidayDatesWSDL() throws Exception {
        String wsdlResource = "com/wavemaker/tools/ws/USHolidayDates.wsdl";
        List<String> bindingResources = new ArrayList<String>();
        bindingResources.add("com/wavemaker/tools/ws/global-binding.xjb");
        bindingResources.add("com/wavemaker/tools/ws/USHolidayDates1.xjb");
        return TestWSDL.getWSDL(wsdlResource, bindingResources);
    }

    public static WSDL getSingleCharService() throws Exception {
        return TestWSDL.getWSDL("com/wavemaker/tools/ws/SingleCharService.wsdl");
    }

    public static WSDL getHelloWorldWSDL() throws Exception {
        return TestWSDL.getWSDL("com/wavemaker/tools/ws/HelloWorld.wsdl");
    }

    public void testStockQuoteGetServiceName() throws Exception {
        WSDL wsdl = getStockQuoteWSDL();
        assertEquals("StockQuote", wsdl.getServiceId());
    }

    public void testStockQuoteGetOperationNames() throws Exception {
        WSDL wsdl = getStockQuoteWSDL();
        List<String> operationNames = wsdl.getOperationNames();
        assertEquals(1, operationNames.size());
        assertEquals("getQuote", operationNames.get(0));
    }

    public void testStockQuoteGetInputTypes() throws Exception {
        WSDL wsdl = getStockQuoteWSDL();
        List<ElementType> inputTypes = wsdl.getInputTypes("getQuote");
        assertEquals(1, inputTypes.size());
        ElementType inputType = inputTypes.get(0);
        assertEquals("parameters", inputType.getName());
        assertEquals("net.webservicex.stockquote.GetQuote", inputType.getJavaType());
        assertEquals(false, inputType.isList());
        
        // check the child properties for the inputType
        List<ElementType> properties = inputType.getProperties();
        assertEquals(1, properties.size());
        assertEquals("java.lang.String", properties.get(0).getJavaType());
        assertEquals(0, properties.get(0).getProperties().size());
    }
    
    public void testStockQuoteGetTypes() throws Exception {
        WSDL wsdl = getStockQuoteWSDL();
        List<ElementType> types = wsdl.getTypes();
        assertEquals(2, types.size());
        for (ElementType type : types) {
            if (type.getJavaType().equals("net.webservicex.stockquote.GetQuote")) {
                List<ElementType> properties = type.getProperties();
                assertNotNull(properties);
                assertEquals(1, properties.size());
                assertEquals("symbol", properties.get(0).getName());
                assertEquals("java.lang.String", properties.get(0).getJavaType());
            }
        }
    }

    public void testStockQuoteGetUnWrappedInputTypes() throws Exception {
        WSDL wsdl = getStockQuoteWSDL();
        List<ElementType> inputTypes = wsdl.getInputTypes("getQuote", true);
        assertEquals(1, inputTypes.size());
        ElementType inputType = inputTypes.get(0);
        assertEquals("symbol", inputType.getName());
        assertEquals("java.lang.String", inputType.getJavaType());
        assertEquals(false, inputType.isList());
    }

    public void testStockQuoteGetOutputType() throws Exception {
        WSDL wsdl = getStockQuoteWSDL();
        ElementType outputType = wsdl.getOutputType("getQuote");
        assertEquals("parameters", outputType.getName());
        assertEquals("net.webservicex.stockquote.GetQuoteResponse", outputType
                .getJavaType());
        assertEquals(false, outputType.isList());
        
        // check the child properties for the outputType
        List<ElementType> properties = outputType.getProperties();
        assertEquals(1, properties.size());
        assertEquals("java.lang.String", properties.get(0).getJavaType());
        assertEquals(0, properties.get(0).getProperties().size());
    }

    public void testStockQuoteGetUnWrappedOutputType() throws Exception {
        WSDL wsdl = getStockQuoteWSDL();
        ElementType outputType = wsdl.getOutputType("getQuote", true);
        assertEquals("getQuoteResult", outputType.getName());
        assertEquals("java.lang.String", outputType.getJavaType());
        assertEquals(false, outputType.isList());
    }

    public void testSalesforceGetServiceName() throws Exception {
        WSDL wsdl = getSalesforceWSDL();
        assertEquals("SforceService", wsdl.getServiceId());
    }

    public void testSalesforceGetInputTypes() throws Exception {
        WSDL wsdl = getSalesforceWSDL();
        List<ElementType> inputTypes = wsdl.getInputTypes("login");
        assertEquals(1, inputTypes.size());
        assertEquals("com.sforce.soap.enterprise.sforceservice.Login", inputTypes.get(0)
                .getJavaType());
        
        // check the child properties for the inputType
        List<ElementType> properties = inputTypes.get(0).getProperties();
        assertEquals(2, properties.size());
        assertEquals("java.lang.String", properties.get(0).getJavaType());
        assertEquals(0, properties.get(0).getProperties().size());
        assertEquals("java.lang.String", properties.get(1).getJavaType());
        assertEquals(0, properties.get(1).getProperties().size());
    }

    public void testSalesforceGetSOAPHeaderInputTypes() throws Exception {
        WSDL wsdl = getSalesforceWSDL();
        List<SchemaElementType> headerInputTypes = wsdl
                .getSOAPHeaderInputTypes("update");
        assertEquals(3, headerInputTypes.size());

        List<String> expectedHeaderJavaTypes = new ArrayList<String>();
        expectedHeaderJavaTypes.add("com.sforce.soap.enterprise.sforceservice.SessionHeader");
        expectedHeaderJavaTypes
                .add("com.sforce.soap.enterprise.sforceservice.AssignmentRuleHeader");
        expectedHeaderJavaTypes.add("com.sforce.soap.enterprise.sforceservice.MruHeader");

        for (SchemaElementType headerInputType : headerInputTypes) {
            String javaType = headerInputType.getJavaType();
            expectedHeaderJavaTypes.remove(javaType);
        }

        if (expectedHeaderJavaTypes.size() != 0) {
            fail("also expected these SOAP headers Java types: "
                    + expectedHeaderJavaTypes);
        }
    }
    
    public void testWeatherForecastGetTypes() throws Exception {
        WSDL wsdl = getWeatherForecastWSDL();
        List<ElementType> types = wsdl.getTypes();
        for (ElementType type : types) {
            if (type.getJavaType().equals("net.webservicex.weatherforecast.ArrayOfWeatherDataType")) {
                List<ElementType> properties = type.getProperties();
                assertEquals(1, properties.size());
                assertEquals("weatherDatas", properties.get(0).getName());
            }
        }
    }
    
    public void testBasicRealTimeQuotesGetTypes() throws Exception {
        List<String> allPropNames = Arrays.asList(REAL_QUOTE_TYPE_PROPERTYNAMES);
        WSDL wsdl = getBasicRealTimeQuotesWSDL();
        List<ElementType> types = wsdl.getTypes();
        for (ElementType type : types) {
            if (type.getJavaType().equals("com.strikeiron.basicrealtimequotes.RealQuoteType")) {
                List<ElementType> properties = type.getProperties();
                for (ElementType prop : properties) {
                    assertTrue(prop.getName(), allPropNames.contains(prop.getName()));
                }
            }
        }
    }

    public void testUSHolidayDatesGetOutputType() throws Exception {
        WSDL wsdl = getUSHolidayDatesWSDL();
        ElementType outputType = wsdl.getOutputType("getMartinLutherKingDay");
        List<ElementType> properties = outputType.getProperties();
        assertEquals(1, properties.size());
        assertEquals("java.util.Date", properties.get(0).getJavaType());
    }
    
    public void testUSHolidayDatesGetAllTypes() throws Exception {
        WSDL wsdl = getUSHolidayDatesWSDL();
        List<ElementType> types = wsdl.getTypes();
        for (ElementType type : types) {
            if (type.getName().equals("getPresidentsDayResponse")) {
                List<ElementType> properties = type.getProperties();
                assertEquals(1, properties.size());
                assertEquals("java.util.Date", properties.get(0).getJavaType());
            }
        }
    }

    public void testSingleCharServiceGetInputTypes() throws Exception {
        WSDL wsdl = getSingleCharService();
        List<ElementType> inputTypes = wsdl.getInputTypes("add");
        assertEquals(1, inputTypes.size());
        assertEquals("a", inputTypes.get(0).getProperties().get(0).getName());
    }

    public void testHelloWorldGetOutputType() throws Exception {
        WSDL wsdl = getHelloWorldWSDL();
        ElementType outputType = wsdl.getOutputType("helloWorld");
        assertEquals("java.lang.String", outputType.getProperties().get(0).getJavaType());
    }
}
