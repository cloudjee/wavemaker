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

import java.util.Collection;

import com.wavemaker.common.util.OneToManyMap;
import com.wavemaker.infra.WMTestCase;

/**
 * @author stoens
 * @version $Rev:22672 $ - $Date:2008-05-30 14:37:26 -0700 (Fri, 30 May 2008) $
 *
 */
public class TestOneToManyMap extends WMTestCase {
    
    public void testAddRemove() {
        OneToManyMap<String, Integer> m = new OneToManyMap<String, Integer>();
        m.put("test", 1);
        m.put("test", 2);
        m.put("test2", 4);        
        assertTrue(m.containsKey("test"));
        assertTrue(m.containsValue(1));
        assertTrue(m.containsValue(2));
        assertTrue(m.containsValue(4));        
        Collection<Integer> c = m.get("test");
        assertTrue(c.size() == 2);
        assertTrue(c.contains(1));
        assertTrue(c.contains(2));
        
        m.remove("test");
        assertTrue(!m.containsKey("test"));
        assertTrue(!m.containsValue(1));
        assertTrue(!m.containsValue(2));
        assertTrue(m.containsValue(4));        
                
    }

}
