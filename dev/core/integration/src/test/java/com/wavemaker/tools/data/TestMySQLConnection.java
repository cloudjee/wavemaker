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

package com.wavemaker.tools.data;

import java.io.IOException;
import java.util.Properties;

import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.data.DataServiceRuntimeException;
import com.wavemaker.tools.data.util.DataServiceTestUtils;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class TestMySQLConnection extends WMTestCase {

    private static final Properties p = DataServiceTestUtils.loadSakilaConnectionProperties();

    public void testConnection1() throws IOException {
        TestDBConnection t = new TestDBConnection();
        t.setProperties(p);
        t.run();
    }

    public void testConnection2() throws IOException {
        TestDBConnection t = new TestDBConnection();
        t.setProperties(p);
        t.setUsername("___foo");
        try {
            t.run();
        } catch (DataServiceRuntimeException ex) {
            Throwable cause = ex.getCause();
            assertTrue(cause.getMessage().startsWith("Access denied"));
            return;
        }

        fail("connection should have failed");
    }

    // http://dev.wavemaker.com/forums/?q=node/1482#comment-4464
    public void testConnection3() throws IOException {

        SpringUtils.initSpringConfig();

        // this should fail because there's no suitable driver,
        // *not* because dialect has not been set
        p.setProperty("mysql.connectionUrl", "jdbc:foo");

        TestDBConnection t = new TestDBConnection();
        t.setProperties(p);
        try {
            t.run();
        } catch (DataServiceRuntimeException ex) {
            Throwable cause = ex.getCause();
            assertTrue(cause.getMessage().startsWith("No suitable driver"));
            return;
        }

        fail("connection should have failed");
    }

}
