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
package com.wavemaker.tools.data.parser;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.data.EntityInfo;
import com.wavemaker.tools.data.PropertyInfo;
import com.wavemaker.tools.data.util.DataServiceTestUtils;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class TestHbmParser extends WMTestCase {
    
    private static File rootDir = null;

    static {
        try {

            rootDir = DataServiceTestUtils.setupSakilaConfiguration()
                    .getParentFile();

        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }

    }    

     public void testGetGeneratorParams() throws Exception {
        File f = new File(rootDir, "com/wavemaker/runtime/data/sample/sakila/GeneratorParams.hbm.xml");
        assertTrue(f.exists());
        HbmParser p = new HbmParser(f);
        EntityInfo ei = p.getEntity();
        assertTrue(ei.getEntityName().equals("Foo"));
        PropertyInfo id = p.getProperties().iterator().next();
        assertEquals("id", id.getName());
        assertTrue(id.getColumn() != null);
        assertEquals(DataServiceConstants.GENERATOR_SEQUENCE, id.getColumn().getGenerator());
        assertEquals("v1", id.getColumn().getGeneratorParam());
    }

    public void testGetEntity() throws Exception {
        File f = new File(rootDir, "com/wavemaker/runtime/data/sample/sakila/Actor.hbm.xml");
        HbmParser p = new HbmParser(f);
        EntityInfo ei = p.getEntity();
        assertTrue(ei.getEntityName().equals("Actor"));
        assertTrue(ei.getPackageName().equals(
                "com.wavemaker.runtime.data.sample.sakila"));
        assertTrue(ei.getTableName().equals("actor"));
        assertTrue(ei.getCatalogName().equals("sakila"));
    }

    public void testGetPropertiesAndColumns1() throws Exception {
        File f = new File(rootDir, "com/wavemaker/runtime/data/sample/sakila/Actor.hbm.xml");
        HbmParser p = new HbmParser(f);
        List<PropertyInfo> props = new ArrayList<PropertyInfo>(p
                .getProperties());
        assertTrue(props.size() == 5);

        assertTrue(props.get(0).getName().equals("actorId"));
        assertTrue(props.get(0).getType().equals("short"));
        assertTrue(props.get(0).getFullyQualifiedType().equals("short"));
        assertTrue(props.get(0).getIsId());
        assertTrue(!props.get(0).getIsRelated());
        assertTrue(!props.get(0).getIsInverse());
        assertTrue(props.get(0).getCompositeProperties().isEmpty());
        assertTrue(props.get(0).getCardinality() == null);

        assertTrue(props.get(0).getColumn().getName().equals("actor_id"));
        assertTrue(props.get(0).getColumn().getGenerator().equals(DataServiceConstants.GENERATOR_IDENTITY));
        assertTrue(props.get(0).getColumn().getIsPk());
        assertTrue(!props.get(0).getColumn().getIsFk());
        assertTrue(props.get(0).getColumn().getNotNull());
        assertTrue(props.get(0).getColumn().getLength() == null);

        assertTrue(props.get(1).getName().equals("firstName"));
        assertTrue(props.get(1).getType().equals("string"));
        assertTrue(props.get(1).getFullyQualifiedType().equals("string"));
        assertTrue(!props.get(1).getIsId());
        assertTrue(!props.get(1).getIsRelated());
        assertTrue(!props.get(1).getIsInverse());
        assertTrue(props.get(1).getCompositeProperties().isEmpty());
        assertTrue(props.get(1).getCardinality() == null);

        assertTrue(props.get(1).getColumn().getName().equals("first_name"));
        assertTrue(props.get(1).getColumn().getGenerator() == null);
        assertTrue(!props.get(1).getColumn().getIsPk());
        assertTrue(!props.get(1).getColumn().getIsFk());
        assertTrue(props.get(1).getColumn().getNotNull());
        assertTrue(props.get(1).getColumn().getLength().equals(
                Integer.valueOf(45)));

        assertTrue(props.get(2).getName().equals("lastName"));
        assertTrue(props.get(2).getType().equals("string"));
        assertTrue(props.get(2).getFullyQualifiedType().equals("string"));
        assertTrue(!props.get(2).getIsId());
        assertTrue(!props.get(2).getIsRelated());
        assertTrue(!props.get(2).getIsInverse());
        assertTrue(props.get(2).getCompositeProperties().isEmpty());
        assertTrue(props.get(2).getCardinality() == null);

        assertTrue(props.get(2).getColumn().getName().equals("last_name"));
        assertTrue(props.get(2).getColumn().getGenerator() == null);
        assertTrue(!props.get(2).getColumn().getIsPk());
        assertTrue(!props.get(2).getColumn().getIsFk());
        assertTrue(props.get(2).getColumn().getNotNull());
        assertTrue(props.get(2).getColumn().getLength().equals(
                Integer.valueOf(45)));

        assertTrue(props.get(3).getName().equals("lastUpdate"));
        assertTrue(props.get(3).getType().equals("timestamp"));
        assertTrue(props.get(3).getFullyQualifiedType().equals("timestamp"));
        assertTrue(!props.get(3).getIsId());
        assertTrue(!props.get(3).getIsRelated());
        assertTrue(!props.get(3).getIsInverse());
        assertTrue(props.get(3).getCompositeProperties().isEmpty());
        assertTrue(props.get(3).getCardinality() == null);

        assertTrue(props.get(3).getColumn().getName().equals("last_update"));
        assertTrue(props.get(3).getColumn().getGenerator() == null);
        assertTrue(!props.get(3).getColumn().getIsPk());
        assertTrue(!props.get(3).getColumn().getIsFk());
        assertTrue(props.get(3).getColumn().getNotNull());
        assertTrue(props.get(3).getColumn().getLength().equals(
                Integer.valueOf(19)));

        assertTrue(props.get(4).getName().equals("filmActors"));
        assertTrue(props.get(4).getType().equals("FilmActor"));
        assertTrue(props.get(4).getFullyQualifiedType().equals(
                "com.wavemaker.runtime.data.sample.sakila.FilmActor"));
        assertTrue(!props.get(4).getIsId());
        assertTrue(props.get(4).getIsRelated());
        assertTrue(props.get(4).getIsInverse());
        assertTrue(props.get(4).getCompositeProperties().isEmpty());
        assertTrue(props.get(4).getCardinality().toString().equals("to-many"));

        assertTrue(props.get(4).getColumn().getName().equals("actor_id"));
        assertTrue(props.get(4).getColumn().getGenerator() == null);
        assertTrue(!props.get(4).getColumn().getIsPk());
        assertTrue(props.get(4).getColumn().getIsFk());
        assertTrue(props.get(4).getColumn().getNotNull());
        assertTrue(props.get(4).getColumn().getLength() == null);
    }

    public void testGetPrecision() throws Exception {
        File f = new File(rootDir, "com/wavemaker/runtime/data/sample/sakila/Film.hbm.xml");
        HbmParser p = new HbmParser(f);

        Map<String, PropertyInfo> props = p.getPropertiesMap();

        PropertyInfo pr = props.get("rentalRate");

        assertTrue(pr != null);
        assertTrue(pr.getName().equals("rentalRate"));
        assertTrue(pr.getType().equals("big_decimal"));
        assertTrue(pr.getColumn() != null);
        assertTrue(pr.getColumn().getPrecision().equals(4));
    }
    
    public void testComponent() {
        File f = new File(rootDir, "com/wavemaker/runtime/data/sample/sakila/CustomerListFixed.hbm.xml");
        HbmParser p = new HbmParser(f);
        
        PropertyInfo pr = p.getPropertiesMap().get("id");
        assertFalse(pr.getIsId());
        assertTrue(pr.hasCompositeProperties());
        Collection<PropertyInfo> props = pr.getCompositeProperties();
        assertEquals(9, props.size());
    }
}