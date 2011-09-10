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
package com.wavemaker.runtime.data.json;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.servlet.mvc.AbstractController;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.runtime.data.DataServiceTestConstants;
import com.wavemaker.runtime.data.RuntimeDataSpringContextTestCase;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.events.EventManager;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
@DirtiesContext
public abstract class BaseJSONDataTest extends RuntimeDataSpringContextTestCase {
    
    @Before
    public void setUp() throws Exception {
        
//    do this in code:
//
//    <entry key-ref="dataServiceEventListener">
//        <list>
//            <ref bean="sakiladb2springEventWire"/>
//        </list>
//    </entry>

        EventManager eventMgr = getEventManager();
        ServiceWire sakilaServiceWire = (ServiceWire) getBean(
                DataServiceTestConstants.SAKILA_SERVICE_SPRING_EVENT_WIRE_ID_2);
        Object eventListener = getBean(DataServiceTestConstants.EVENT_LISTENER_BEAN_ID);
        eventMgr.addEvent(eventListener, sakilaServiceWire);
    }

    protected String runSakilaOpMarshalledResponse(String opName,
            Object... args) {
        return runOpMarshalledResponse(DataServiceTestConstants.SAKILA_SERVICE_SPRING_ID_2,
                opName, args);
    }

    protected String runSakilaOpMarshalledResponse(String post) {
        return runOpMarshalledResponse(DataServiceTestConstants.SAKILA_SERVICE_SPRING_ID_2,
                post);
    }

    protected String runRuntimeOpMarshalledResponse(String opName,
            Object... args) {
        return runOpMarshalledResponse(DataServiceTestConstants.RUNTIME_SERVICE_ID, opName,
                args);
    }
    
    protected String runRuntimeOpMarshalledResponse(String post) {
        return runOpMarshalledResponse(DataServiceTestConstants.RUNTIME_SERVICE_ID, post);
    }
    

    protected String runOpMarshalledResponse(String serviceName, String opName,
            Object... args) {

        MockHttpServletResponse resp = new MockHttpServletResponse();
        
        try {
            invokeService(serviceName, opName, args, resp);
        } catch (Exception e) {
            fail(e.getMessage());
        }

        return processResponse(resp);
    }

    protected String runOpMarshalledResponse(String serviceName, String post) {

        MockHttpServletRequest request = new MockHttpServletRequest(
                AbstractController.METHOD_POST,
                "/" + serviceName + ".json");
        request.setSession(new MockHttpSession());
        request.setContent(post.getBytes());
        MockHttpServletResponse response = new MockHttpServletResponse();
        
        try {
            invokeService(request, response);
        } catch (Exception e) {
            fail(e.getMessage());
        }

        return processResponse(response);
    }

    protected List<Map<String, String>> tokenizeObjectLiteralList(String s) {

        if (s.startsWith("[") && s.endsWith("]")) {
            s = s.substring(1, s.length() - 1);
        } else {
            throw new IllegalArgumentException("This is not a list: " + s);
        }

        List<String> tokens = StringUtils.split(s);

        List<Map<String, String>> rtn = new ArrayList<Map<String, String>>(
                tokens.size());

        for (String i : tokens) {
            rtn.add(tokenizeObjectLiteral(i));
        }

        return rtn;
    }

    protected Map<String, String> tokenizeObjectLiteral(String s) {

        if (s.startsWith("[") && s.endsWith("]")) {
            s = s.substring(1, s.length() - 1);
        }

        if (s.startsWith("{") && s.endsWith("}")) {
            s = s.substring(1, s.length() - 1);
        }

        Collection<Character> sep = new HashSet<Character>(2);
        sep.add(',');
        sep.add(':');
        List<String> tokens = StringUtils.split(s, sep);

        Map<String, String> rtn = new HashMap<String, String>(tokens.size() / 2);
        for (int i = 0; i < tokens.size(); i += 2) {
            String name = StringUtils.unquote(tokens.get(i));
            String value = StringUtils.unquote(tokens.get(i + 1));
            rtn.put(name, value);
        }
        return rtn;
    }

    protected void verifyCityAttributes(Map<String, String> attrs,
            boolean checkRelated) {
        verifyCityAttributes(attrs, false, false);
    }

    protected void verifyCityAttributes(Map<String, String> attrs,
            boolean checkRelated, boolean relatedShouldBeThere) {
        assertTrue("cityId has not been marshalled", attrs
                .containsKey("cityId"));
        assertTrue("city has not been marshalled", attrs.containsKey("city"));
        assertTrue("lastUpdate has not been marshalled", attrs
                .containsKey("lastUpdate"));

        if (!checkRelated) {
            return;
        }

        if (relatedShouldBeThere) {
            assertTrue("addresses has not been marshalled", attrs
                    .containsKey("addresses"));
            assertTrue("country has not been marshalled", attrs
                    .containsKey("country"));
        } else {
            assertFalse("addresses should not have been marshalled", attrs
                    .containsKey("addresses"));
            assertFalse("country should not have been marshalled", attrs
                    .containsKey("country"));
        }
    }

    protected void verifyCountryAttributes(Map<String, String> attrs,
            boolean relatedShouldBeThere) {
        assertTrue("countryId has not been marshalled", attrs
                .containsKey("countryId"));
        assertTrue("country has not been marshalled", attrs
                .containsKey("country"));
        assertTrue("lastUpdate has not been marshalled", attrs
                .containsKey("lastUpdate"));

        if (relatedShouldBeThere) {
            assertTrue("cities has not been marshalled", attrs
                    .containsKey("cities"));
        } else {
            assertFalse("cities should not have been marshalled", attrs
                    .containsKey("cities"));
        }
    }

    protected Map<String, String> getModifiedProperties(Map<String, String> m1,
            Map<String, String> m2) {

        Map<String, String> rtn = new HashMap<String, String>();

        for (Map.Entry<String, String> e : m1.entrySet()) {
            if (m2.containsKey(e.getKey())) {
                if (!String.valueOf(e.getValue()).equals(
                        String.valueOf(m2.get(e.getKey())))) {
                    rtn.put(e.getKey(), m2.get(e.getKey()));
                }
            } else {
                rtn.put(e.getKey(), null);
            }
        }

        return rtn;
    }

    private String processResponse(MockHttpServletResponse resp) {

        String rtn = null;
        try {
            rtn = resp.getContentAsString();
        } catch (UnsupportedEncodingException ex) {
            throw new WMRuntimeException(ex);
        }

        String result = "{"
                + StringUtils.doubleQuote(ServerConstants.RESULTS_PART) + ":";

        int i = rtn.indexOf(result);
        if (i != -1) {
            rtn = rtn.substring(result.length(), rtn.length() - 1);
        }

        return rtn;
    }
}
