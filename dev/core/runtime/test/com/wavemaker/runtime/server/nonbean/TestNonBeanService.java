/*
 *  Copyright (C) 2009 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.server.nonbean;

import org.apache.commons.lang.ArrayUtils;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.servlet.mvc.AbstractController;

import com.wavemaker.infra.TestSpringContextTestCase;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestNonBeanService extends TestSpringContextTestCase {

    @Override
    protected String[] getWebAppConfigLocations() {
        return (String[]) ArrayUtils.add(super.getWebAppConfigLocations(),
                this.getClass().getPackage().getName().replace(".", "/")+"/nonbean.xml");
    }
    
    public void testInvokeFoo() throws Exception {
        
        MockHttpServletRequest mhr = new MockHttpServletRequest(
                AbstractController.METHOD_POST,
                "/" + "nonBean" + ".json");
        mhr.setContent("{\"params\": [{\"a\":\"b\"}, 1, \"foo\"], \"method\": \"foo\", \"id\": 1}".getBytes());

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService(mhr, mhresp);
        
        String response = mhresp.getContentAsString();
        assertEquals("{\"result\":[\"31foo\"]}", response);
    }
}