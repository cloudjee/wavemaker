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

import java.util.Properties;
import java.util.Set;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import com.wavemaker.common.util.CastUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.data.sample.sakila.TestActor;
import com.wavemaker.runtime.data.sample.sakila.TestFilmActor;
import com.wavemaker.runtime.data.util.DataServiceUtils;

/**
 * Test paging for collections.
 * 
 * @author stoens
 * @version $Rev$ - $Date$
 *
 */
public class TestPagingRelated extends WMTestCase {
    
    private static SessionFactory sessionFactory = null;

    private static Session session = null;

    static {
        Properties p = DataServiceUtils
                .loadDBProperties(DataServiceTestConstants.MYSQL_SAKILA_PROPERTIES);

        Configuration cfg = 
            com.wavemaker.runtime.data.util.DataServiceUtils.initConfiguration(
                DataServiceTestConstants.SAKILA_HIBERNATE_CFG, p);

        sessionFactory = cfg.buildSessionFactory();
    }

    @Override
    public void setUp() {
        session = sessionFactory.openSession();
    }

    @Override
    public void tearDown() {
        if (session.isOpen()) {
            session.close();
        }
    }    
    
    public void testPageActorFilms() {
        
        TestActor actor = 
            (TestActor)session.get(TestActor.class, new Short("1"));
        
        Set<TestFilmActor> l = CastUtils.cast(actor.getFilmActors());
        
        // get total size of data set - for this to not hit the db, the 
        // collection has to mapped with lazy="extra":
//        <set name="filmActors" inverse="true" lazy="extra">
//          <key>
//            <column name="actor_id" not-null="true">
//            </column>
//          </key>
//          <one-to-many class="com.wavemaker.runtime.data.sample.sakila.FilmActor" />
//        </set>
        
        assertEquals(19, l.size());
        
        // page through related film actors:

        Query q = 
            session.createFilter(actor.getFilmActors(), "order by id.actorId");
        q.setMaxResults(5);
        assertEquals(5, q.list().size());
    }

}
