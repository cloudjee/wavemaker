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

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.web.servlet.support.WebContentGenerator;

import com.wavemaker.runtime.test.TestSpringContextTestCase;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
@ContextConfiguration(locations = "classpath:com/wavemaker/runtime/server/nonbean/nonbean.xml")
public class TestNonBeanService extends TestSpringContextTestCase {

    @Test
    public void testInvokeFoo() throws Exception {

        MockHttpServletRequest mhr = new MockHttpServletRequest(WebContentGenerator.METHOD_POST, "/" + "nonBean" + ".json");
        mhr.setContent("{\"params\": [{\"a\":\"b\"}, 1, \"foo\"], \"method\": \"foo\", \"id\": 1}".getBytes());

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService(mhr, mhresp);

        String response = mhresp.getContentAsString();
        assertEquals("{\"result\":[\"31foo\"]}", response);
    }
}