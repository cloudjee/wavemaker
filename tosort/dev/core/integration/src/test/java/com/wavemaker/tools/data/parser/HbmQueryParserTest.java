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

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.tools.data.QueryInfo;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class TestHbmQueryParser extends WMTestCase {

    public void testMetaExists() throws Exception {
        HbmQueryParser p = buildParser("com/wavemaker/runtime/data/sample/sakila/Actor.crud.hql.xml");
        try {
            assertTrue(p.getMeta().equals("test123"));
        } finally {
            p.close();
        }
    }

    public void testNoMeta() throws Exception {
        HbmQueryParser p = buildParser("com/wavemaker/runtime/data/sample/sakila/Film.crud.hql.xml");
        try {
            assertTrue(p.getMeta() == null);
        } finally {
            p.close();
        }
    }

    public void testNoMetaWithQueries() throws Exception {
        HbmQueryParser p = buildParser("com/wavemaker/runtime/data/sample/sakila/Film.crud.hql.xml");
        assertTrue(p.getMeta() == null);

        assertTrue(p.getQueries().size() == 1);

        Map<String, QueryInfo> queryMap = p.getQueries();

        List<QueryInfo> queries = new ArrayList<QueryInfo>();

        for (QueryInfo q : queryMap.values()) {
            queries.add(q);
        }

        assertTrue(queries.get(0).getName().equals("getFilmById"));
    }

    public void testGetActorQueries() throws Exception {
        HbmQueryParser p = buildParser("com/wavemaker/runtime/data/sample/sakila/Actor.crud.hql.xml");

        Map<String, QueryInfo> queryMap = p.getQueries();

        List<QueryInfo> queries = new ArrayList<QueryInfo>();

        for (QueryInfo q : queryMap.values()) {
            queries.add(q);
        }

        assertEquals(5, queries.size());
        assertTrue(queries.get(0).getName().equals("getActorById"));
        assertTrue(queries.get(0).getQuery().equals("from Actor _a where _a.id=:id"));
        assertTrue(queries.get(0).getInputs().length == 1);
        assertTrue(queries.get(0).getInputs()[0].getParamName().equals("id"));
        assertTrue(queries.get(0).getInputs()[0].getParamType().equals("java.lang.Short"));

        assertTrue(queries.get(1).getName().equals("getEverySingleActor"));
        assertTrue(queries.get(1).getQuery().equals("from Actor"));
        assertTrue(queries.get(1).getInputs().length == 0);
    }

    private HbmQueryParser buildParser(String path) throws IOException {
        ClassPathResource hqlResource = new ClassPathResource(path);
        return new HbmQueryParser(new InputStreamReader(hqlResource.getInputStream()));
    }
}
