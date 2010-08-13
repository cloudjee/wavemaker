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
package com.wavemaker.testsupport.spring;

import javax.servlet.http.HttpSession;

import org.springframework.mock.web.MockHttpSession;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.testsupport.spring.SpringTestCase;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestSpringTestCase extends WMTestCase {

    public void testArrayCopy() {

        SpringTestCase stcEmptyArray = new SpringTestCase() {
            @Override
            protected String[] getWebAppConfigLocations() {
                return new String[]{};
            }

            @Override
            protected HttpSession getHttpSession() {
                return new MockHttpSession();
            }
        };
        String[] res = stcEmptyArray.getConfigLocations();
        assertEquals(SpringTestCase.DEFAULT_LOCATIONS.length,
                res.length);

        SpringTestCase stcNullArray = new SpringTestCase() {
            @Override
            protected String[] getWebAppConfigLocations() {
                return null;
            }

            @Override
            protected HttpSession getHttpSession() {
                return new MockHttpSession();
            }
        };
        res = stcNullArray.getConfigLocations();
        assertEquals(SpringTestCase.DEFAULT_LOCATIONS.length,
                res.length);

        SpringTestCase stcArray = new SpringTestCase() {
            @Override
            protected String[] getWebAppConfigLocations() {
                return new String[]{"foo", "bar"};
            }

            @Override
            protected HttpSession getHttpSession() {
                return new MockHttpSession();
            }
        };
        res = stcArray.getConfigLocations();
        assertEquals(SpringTestCase.DEFAULT_LOCATIONS.length+2,
                res.length);
    }
}