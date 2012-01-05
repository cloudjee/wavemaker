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

package com.wavemaker.runtime.data;

import org.hibernate.Transaction;

import com.wavemaker.runtime.data.sample.sakila.TestStaff;

/**
 * Tests Hibernate directly without using any wm infrastucture.
 * 
 */
public class TestHibernate2 extends BaseHibernateTest {

    public void testBlob() throws Exception {

        Transaction tx = session.beginTransaction();

        TestStaff s = (TestStaff) session.get(TestStaff.class, Byte.valueOf("1"));
        tx.rollback();
        session.close();

        double length = s.getPicture().length();

        assertEquals(36365d, length);
    }
}
