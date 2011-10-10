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

package com.wavemaker.common.util;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.infra.WMTestCase;

/**
 * @author small
 * @version $Rev$ - $Date:2008-05-30 14:37:26 -0700 (Fri, 30 May 2008) $
 * 
 */
public class TestSystemUtils extends WMTestCase {

    @Override
    public void setUp() throws Exception {
        SpringUtils.initSpringConfig();
    }

    public void testCipher() {
        String s = "Rock Band";
        String e = SystemUtils.encrypt(s);
        assertTrue(SystemUtils.isEncrypted(e));
        assertEquals(s, SystemUtils.decrypt(e));

        s = "WAveMaKER rocks awesome great job!";
        e = SystemUtils.encrypt(s);
        assertTrue(SystemUtils.isEncrypted(e));
        assertEquals(s, SystemUtils.decrypt(e));
    }

    public void testUnwrap() {

        Exception e = new Exception("foobar");
        Throwable t = SystemUtils.unwrapInternalException(e);
        assertEquals(e, t);

        Exception wrapped = new WMRuntimeException("foo");
        e = new WMRuntimeException(MessageResource.CANNOT_ROLLBACK_TX, wrapped);
        t = SystemUtils.unwrapInternalException(e);
        assertEquals(wrapped, t);
    }
}
