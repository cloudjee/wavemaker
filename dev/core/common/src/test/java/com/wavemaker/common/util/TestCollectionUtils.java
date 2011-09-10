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
package com.wavemaker.common.util;

import java.util.List;
import java.util.Set;

import com.wavemaker.infra.WMTestCase;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestCollectionUtils extends WMTestCase {

    public void testCreateList() {
        
        List<String> strList = CollectionUtils.createList("foo", "bar");
        assertEquals(2, strList.size());
        assertEquals("foo", strList.get(0));
    }
    
    public void testCreateSet() {
        
        Set<String> strSet = CollectionUtils.createSet("foo", "bar");
        assertEquals(2, strSet.size());
        assertEquals("foo", strSet.iterator().next());
    }
}