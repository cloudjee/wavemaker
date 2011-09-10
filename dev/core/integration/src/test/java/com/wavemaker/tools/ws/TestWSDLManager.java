/*
 *  Copyright (C) 2008-2009 WaveMaker Software, Inc.
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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import com.wavemaker.common.Resource;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.runtime.test.TestSpringContextTestCase;
import com.wavemaker.tools.ws.wsdl.WSDLException;
import com.wavemaker.tools.ws.wsdl.WSDLManager;

/**
 * Test WSDLManager.
 *
 * @author Frankie Fu
 * @version $Rev:22673 $ - $Date:2008-05-30 14:45:46 -0700 (Fri, 30 May 2008) $
 */
public class TestWSDLManager extends TestSpringContextTestCase {

    private static final String STOCKQUOTE_WSDL = "com/wavemaker/tools/ws/stockquote.wsdl";

    private static final String YAHOO_STOCKQUOTE_WSDL = "com/wavemaker/tools/ws/YahooStockQuote.wsdl";

    private static final String YAHOO_TRAFFIC_WSDL = "com/wavemaker/tools/ws/YahooTrafficData.wsdl";

    @Test
    public void testRegisterWSDL() throws WSDLException {
        WSDLManager manager = WSDLManager.getInstance();
        manager.registerWSDL(ClassLoaderUtils.getResource(STOCKQUOTE_WSDL), null);
        manager.registerWSDL(ClassLoaderUtils
                .getResource(YAHOO_STOCKQUOTE_WSDL), null);
        manager.registerWSDL(ClassLoaderUtils.getResource(YAHOO_TRAFFIC_WSDL), null);
        String[] allServiceIds = manager.getAllServiceIds();
        assertEquals(3, allServiceIds.length);
    }

    @Test
    public void testNullWsdlUri() throws WSDLException {
        WSDLManager manager = WSDLManager.getInstance();
        try {
            manager.registerWSDL(null, null);
        } catch (IllegalArgumentException e) {
            assertTrue(e.getMessage().equals(
                    Resource.WS_NULL_WSDL_URI.getMessage()));
        }
    }
}
