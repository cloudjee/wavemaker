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

import com.wavemaker.infra.WMTestCase;

/**
 * @author Simon Toens
 */
public class TestHbmWriter extends WMTestCase {

    public void testReadWriteActor() throws Exception {
        // File f = ClassLoaderUtils.getClasspathFile("com/activegrid/runtime/data/sample/sakila2/Actor.hbm.xml");
        // HbmParser p = new HbmParser(f);
        // p.initAll();
        // EntityInfo ei = p.getEntity();
        //
        // HbmWriter w = new HbmWriter(new PrintWriter(System.out));
        // w.setEntity(ei);
        // w.write();
    }

    public void testReadWriteFilmActor() throws Exception {
        // File f = ClassLoaderUtils.getClasspathFile("com/activegrid/runtime/data/sample/sakila2/FilmActor.hbm.xml");
        // HbmParser p = new HbmParser(f);
        // p.initAll();
        // EntityInfo ei = p.getEntity();
        //
        // HbmWriter w = new HbmWriter(new PrintWriter(System.out));
        // w.setEntity(ei);
        // w.write();
    }

    public void testReadWriteActorQueries() throws Exception {
        // File f = ClassLoaderUtils.getClasspathFile("com/activegrid/runtime/data/sample/sakila2/Actor.crud.hql.xml");
        // HbmQueryParser p = new HbmQueryParser(f);
        // p.initAll();
        // List<QueryInfo> queries = p.getQueries();
        //
        // warn("got queries: " + queries);
        //
        // HbmQueryWriter w = new HbmQueryWriter(new PrintWriter(System.out));
        // w.setQueries(queries);
        // w.write();
    }

}
