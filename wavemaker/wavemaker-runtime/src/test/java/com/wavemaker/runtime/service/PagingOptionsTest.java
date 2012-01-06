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

package com.wavemaker.runtime.service;

import java.util.ArrayList;
import java.util.List;

import com.wavemaker.infra.WMTestCase;

/**
 * @author Simon Toens
 */
public class PagingOptionsTest extends WMTestCase {

    public void testOrderBy1() {
        PagingOptions po = new PagingOptions();
        List<String> l = new ArrayList<String>(1);
        l.add("asc:name");
        po.setOrderBy(l);
        assertTrue(po.getOrderByList().size() == 1);
        assertTrue(po.getOrderByList().get(0).isAsc());
        assertTrue(po.getOrderByList().get(0).getPropertyPath().equals("name"));
    }

    public void testOrderBy2() {
        PagingOptions po = new PagingOptions();

        List<String> l = new ArrayList<String>(2);
        l.add("asc:name");
        l.add("desc:foo");
        po.setOrderBy(l);
        assertTrue(po.getOrderByList().size() == 2);

        assertTrue(po.getOrderByList().get(0).isAsc());
        assertTrue(po.getOrderByList().get(0).getPropertyPath().equals("name"));

        assertTrue(po.getOrderByList().get(1).isDesc());
        assertTrue(po.getOrderByList().get(1).getPropertyPath().equals("foo"));
    }

    public void testOrderBy3() {
        PagingOptions po = new PagingOptions();
        // String s = "asc:name, desc:foo, desc:foo.blah.goo";

        List<String> l = new ArrayList<String>(3);
        l.add("asc:name");
        l.add("desc:foo");
        l.add("desc:foo.blah.goo");

        po.setOrderBy(l);
        assertTrue(po.getOrderByList().size() == 3);

        assertTrue(po.getOrderByList().get(0).isAsc());
        assertTrue(po.getOrderByList().get(0).getPropertyPath().equals("name"));

        assertTrue(po.getOrderByList().get(1).isDesc());
        assertTrue(po.getOrderByList().get(1).getPropertyPath().equals("foo"));

        assertTrue(po.getOrderByList().get(2).isDesc());
        assertTrue(po.getOrderByList().get(2).getPropertyPath().equals("foo.blah.goo"));
    }
}
