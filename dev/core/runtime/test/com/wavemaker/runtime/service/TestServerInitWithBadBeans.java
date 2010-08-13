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
package com.wavemaker.runtime.service;

import com.wavemaker.infra.TestSpringContextTestCase;
import com.wavemaker.runtime.service.ServiceManager;

/**
 * Test the entire server init with some bad service beans (without classes),
 * this should enforce a lazy load.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public class TestServerInitWithBadBeans extends TestSpringContextTestCase {

    @Override
    protected String[] getWebAppConfigLocations() {
        return new String[] { "com/wavemaker/runtime/server/WEB-INF/test-springapp.xml", 
                "com/wavemaker/runtime/server/WEB-INF/service-badbean.xml"};
    }
    
    public void testLoad() {
        
        ServiceManager sm = (ServiceManager) getBean("serviceManager");
        assertNotNull(sm.getServiceWire("testservice"));
        
        try {
            getBean("badBean");
            fail("expected exception");
        } catch (RuntimeException e) {
            // good
        }
    }
}