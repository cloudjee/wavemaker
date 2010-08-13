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
package com.wavemaker.runtime.data;

import java.util.Collection;
import java.util.List;
import java.util.Properties;

import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.data.sample.sakila.TestActor;
import com.wavemaker.runtime.data.sample.sakila.TestCity;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.service.ElementType;

/**
 * @author Simon Toens
 */
public class TestDataServiceMetaData extends WMTestCase {

    private DataServiceDefinition def = null;

    public void setUp() {
        SpringUtils.initSpringConfig();

        Properties p = DataServiceUtils
                .loadDBProperties(DataServiceTestConstants.MYSQL_SAKILA_PROPERTIES);

        def = new DataServiceDefinition(DataServiceTestConstants.SAKILA_HIBERNATE_CFG, p, true);
    }

    public void tearDown() {
        def.dispose();
    }

    public void testQueryReturnType() {
        DataServiceMetaData cfg = def.getMetaData();

        String outputType = cfg.getOperation("getCountryById").getOutputType();

        assertTrue(outputType.equals(
            "com.wavemaker.runtime.data.sample.sakila.ExtendedCountry"));
    }

    public void testPackageName() {
        DataServiceMetaData cfg = def.getMetaData();
        assertTrue("com.wavemaker.runtime.data.sample.sakila".equals(cfg
                .getDataPackage()));

    }

    public void testQueryInputTypes() {
        DataServiceMetaData cfg = def.getMetaData();

        List<String> inputTypes = cfg.getOperation("getCountryById")
                .getInputTypes();

        assertTrue(inputTypes.size() == 1);
        assertTrue(inputTypes.get(0).equals("java.lang.Short"));

        List<String> inputNames = cfg.getOperation("getCountryById")
                .getInputNames();

        assertTrue(inputNames.size() == 1);
        assertTrue(inputNames.get(0).equals("id"));
    }

    public void testIsEntity() {
        DataServiceMetaData cfg = def.getMetaData();
        assertTrue(cfg.isEntity(TestActor.class));
        assertFalse(cfg.isEntity(String.class));
    }

    public void testRelPropertyNames() {
        DataServiceMetaData cfg = def.getMetaData();
        try {
            Collection<String> names = cfg.getRelPropertyNames(TestCity.class);
            assertTrue(names.size() == 2);
            assertTrue(names.contains("addresses"));
            assertTrue(names.contains("country"));
        } finally {
            cfg.dispose();
        }
    }

    public void testIdPropertyNames() {
        DataServiceMetaData cfg = def.getMetaData();
        try {
            String id = cfg.getIdPropertyName(TestCity.class);
            assertTrue(id.equals("cityId"));
        } finally {
            cfg.dispose();
        }
    }

    public void testGetTypes() {
        boolean found = false;
        assertEquals(10, def.getTypes().size());
        for (ElementType el : def.getTypes()) {
            if (el.getJavaType().equals(
                    "com.wavemaker.runtime.data.sample.sakila.TestActor")) {
                found = true;
                break;
            }
        }
        if (!found) {
            WMTestCase.fail("Didn't find Actor type");
        }
    }
}
