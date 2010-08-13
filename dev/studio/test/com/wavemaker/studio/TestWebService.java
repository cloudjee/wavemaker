/*
 * Copyright (C) 2007-2008 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
package com.wavemaker.studio;

import java.net.URL;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.studio.infra.StudioTestCase;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class TestWebService extends StudioTestCase {

    public void testRegisterFeedService() throws Exception {
        makeProject(this.getName());
        Object registerFeedServiceResponse = invokeService_toObject(
                "webService", "registerFeedService", null);
        assertTrue(registerFeedServiceResponse instanceof String);
        String serviceId = (String) registerFeedServiceResponse;
        assertEquals("FeedService", serviceId);
    }

    public void testImportWSDL() throws Exception {
        makeProject(this.getName());
        String resource = ClassLoaderUtils
                .getResource("com/wavemaker/runtime/ws/YahooTrafficData.wsdl");
        String filePath = (new URL(resource)).getFile();
        Object importWSDLResponse = invokeService_toObject("webService",
                "importWSDL", new Object[] { filePath, null, true });
        assertTrue(importWSDLResponse instanceof String);
        String serviceId = (String) importWSDLResponse;
        assertEquals("YahooTraffic", serviceId);
    }

    public void testImportWSDLWithNonExistingWSDL() throws Exception {
        makeProject(this.getName());
        String filePath = "YahooTrafficData.wsdl";
        try {
            invokeService_toObject("webService", "importWSDL",
                    new Object[] { filePath, null, true });
            fail("should throw an exception here.");
        } catch (WMRuntimeException e) {
            // expected
        }
    }

    public void testImportWADL1() throws Exception {
        makeProject(this.getName());
        String resource = ClassLoaderUtils
                .getResource("com/wavemaker/runtime/ws/exchangeex.wadl");
        String filePath = (new URL(resource)).getFile();
        Object importWSDLResponse = invokeService_toObject("webService",
                "importWSDL", new Object[] { filePath, null, true });
        assertTrue(importWSDLResponse instanceof String);
        String serviceId = (String) importWSDLResponse;
        assertEquals("exchangeex", serviceId);
        
        Object getWSDLResponse = invokeService_toObject("webService",
                "getWSDL", new Object[] { serviceId });
        assertTrue(getWSDLResponse instanceof String);
    }

    public void testImportWADL2() throws Exception {
        makeProject(this.getName());
        String resource = ClassLoaderUtils
                .getResource("com/wavemaker/runtime/ws/babelfishenglishtofrench.wadl");
        String filePath = (new URL(resource)).getFile();
        Object importWSDLResponse = invokeService_toObject("webService",
                "importWSDL", new Object[] { filePath, null, true });
        assertTrue(importWSDLResponse instanceof String);
        String serviceId = (String) importWSDLResponse;
        assertEquals("babelfishenglishtofrench", serviceId);
        
        Object getWSDLResponse = invokeService_toObject("webService",
                "getWSDL", new Object[] { serviceId });
        assertTrue(getWSDLResponse instanceof String);
    }
    
    public void testGetWSDL() throws Exception {
        makeProject(this.getName());
        String resource = ClassLoaderUtils
                .getResource("com/wavemaker/runtime/ws/YahooTrafficData.wsdl");
        String filePath = (new URL(resource)).getFile();
        Object importWSDLResponse = invokeService_toObject("webService",
                "importWSDL", new Object[] { filePath, null, true });
        assertTrue(importWSDLResponse instanceof String);
        String serviceId = (String) importWSDLResponse;
        Object getWSDLResponse = invokeService_toObject("webService",
                "getWSDL", new Object[] { serviceId });
        assertTrue(getWSDLResponse instanceof String);
        assertTrue(((String) getWSDLResponse)
                .indexOf("yahoomaps:TrafficDataRequestMsg") != -1);
    }

    public void testGetWSDLWithInvalidServiceId() throws Exception {
        String serviceId = "dummyService";
        try {
            invokeService_toObject("webService",
                    "getWSDL", new Object[] { serviceId });
            fail("should throw an exception here.");
        } catch (WMRuntimeException e) {
            // expected
        }
    }

    public void testBindingProperties() throws Exception {
        makeProject(this.getName());
        String resource = ClassLoaderUtils
                .getResource("com/wavemaker/runtime/ws/YahooTrafficData.wsdl");
        String filePath = (new URL(resource)).getFile();
        Object importWSDLResponse = invokeService_toObject("webService",
                "importWSDL", new Object[] { filePath, null, true });
        String serviceId = (String) importWSDLResponse;
        BindingProperties bindingProperties = new BindingProperties();
        bindingProperties.setConnectionTimeout(1000);
        bindingProperties.setHttpBasicAuthUsername("ffu");
        bindingProperties.setHttpBasicAuthPassword("welcome");
        invokeService_toObject("webService", "setBindingProperties",
                new Object[] { serviceId, bindingProperties });
        Object getBindingPropertiesResponse = invokeService_toObject(
                "webService", "getBindingProperties",
                new Object[] { serviceId });
        assertTrue(getBindingPropertiesResponse instanceof BindingProperties);
        assertEquals(1000, ((BindingProperties) bindingProperties)
                .getConnectionTimeout());
        assertEquals("ffu", ((BindingProperties) bindingProperties)
                .getHttpBasicAuthUsername());
        assertEquals("welcome", ((BindingProperties) bindingProperties)
                .getHttpBasicAuthPassword());
    }

    public void testSetBindingPropertiesWithInvalidServiceId()
            throws Exception {
        makeProject(this.getName());
        String serviceId = "dummyService";
        BindingProperties bindingProperties = new BindingProperties();
        bindingProperties.setConnectionTimeout(1000);
        bindingProperties.setHttpBasicAuthUsername("ffu");
        bindingProperties.setHttpBasicAuthPassword("welcome");
        try {
            invokeService_toObject("webService", "setBindingProperties",
                    new Object[] { serviceId, bindingProperties });
            fail("should throw an exception here.");
        } catch (WMRuntimeException e) {
            // expected
        }
    }
}
