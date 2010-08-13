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
package com.wavemaker.runtime.server.json;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.AlternateJSONTransformer;
import com.wavemaker.json.JSONMarshaller;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.json.JSONState;


/**
 * Test JSON performance, make sure nothing is worse.
 * 
 * This is disabled by default; running stuff in the background can make this
 * fail.  Remove the DISABLED lines to enable the tests.
 * 
 * 
 * @version $Rev$ - $Id$
 * @author small
 */
public class TestJsonPerformance extends WMTestCase {
    
    private Level oldLoggerLevel;
    Logger jsonMarshallerLogger = Logger.getLogger(JSONMarshaller.class);
    
    @Override
    public void setUp() throws Exception {
        
        super.setUp();
        oldLoggerLevel = jsonMarshallerLogger.getLevel();
        jsonMarshallerLogger.setLevel(Level.ERROR);
    }
    
    @Override
    public void tearDown() throws Exception {
        
        super.tearDown();
        jsonMarshallerLogger.setLevel(oldLoggerLevel);
    }
    
    public void testNothing() {
        // stub to prevent this test from failing
    }

    /**
     * Test the speed and memory usage of the default json-lib toBean(), as well
     * as my re-implementation.
     *
     * stock json 2.2 vs current AlternateJSONTransformer (iterations=5):
     *          alternate, avg mem: 466978.0, time: 20.5
     *          std, avg mem: 1.9336264E7, time: 779.0
     *
     *
     * stock json 2.2 vs current AlternateJSONTransformer (iterations=10):
     *          alternate, avg mem: 466978.0, time: 20.5
     *          std, avg mem: 1.9336264E7, time: 779.0
     * 
     * new numbers (from r22569):
     *     [junit] testToBean()
     *     [junit] alternate, avg mem: 470717.3333333333, time: 20.666666666666668
     *     [junit] std, avg mem: 1.7070099555555556E7, time: 730.8888888888889
     *     [junit]
     *     [junit] testSerialize()
     *     [junit] average old: 2050736.0
     *     [junit] time old: 244.25
     *     [junit] average new: 502008.0
     *     [junit] time new: 169.75
     *
     *
     * @throws Exception
     */
    public void DISABLEDtestToBean() throws Exception {
        
        System.out.println("testToBean()");

        Runtime r = Runtime.getRuntime();
        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);

        String jsonString = JSONMarshaller.marshal(
                getLocalResultObject().get("result"), jc);
        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal(jsonString);

        System.gc();
        Thread.yield();
        System.gc();
        System.gc();
        System.gc();
        System.gc();
        System.gc();

        int iterations = 10;
        double altAccumMem = 0.;
        double altAccumTime = 0.;
        double stdAccumMem = 0.;
        double stdAccumTime = 0.;

        long timeStart, timeEnd;
        long memStart, memEnd;

        boolean afterFirstRun = false;


        @SuppressWarnings("unused")
        Object o;

        for (int i=0;i<iterations;i++) {
            doGC();
            memStart = r.totalMemory() - r.freeMemory();
            timeStart = System.currentTimeMillis();

            o = AlternateJSONTransformer.toObject(jo, LocalActor.class);

            timeEnd = System.currentTimeMillis();
            memEnd = r.totalMemory() - r.freeMemory();

            o = null;

            // discard results from the first run
            if (afterFirstRun) {
                altAccumMem += (memEnd-memStart);
                altAccumTime += (timeEnd-timeStart);
            } else {
                afterFirstRun = true;
            }

            doGC();
        }

        altAccumMem/=(iterations-1);
        altAccumTime/=(iterations-1);
        stdAccumMem/=(iterations-1);
        stdAccumTime/=(iterations-1);

        System.out.println("alternate, avg mem: "+altAccumMem+", time: "+
                altAccumTime);
        System.out.println("std, avg mem: "+stdAccumMem+", time: "+
                stdAccumTime);
        System.out.println();
        
        assertTrue(altAccumMem < stdAccumMem);
        assertTrue(altAccumTime < stdAccumTime);
    }

    /**
     * test the memory consumption of the current json library.  With a shorter
     * possible object tree (replace getResultObject() with
     * getLocalResultObject()), the memory usage drops immediately.
     *
     * Test mav-881.
     *
     * json-lib-2.3-SNAPSHOT reports:
     *      3173032.0 (my linux box), 3198543.2 (eng3-checkin win4)
     * json-lib-2.2 reports:
     *      2140696.0 (my linux box), 2166209.6 (eng3-checkin win4)
     *
     * @throws Exception
     */
    public void DISABLEDtestSerialize() throws Exception {

        System.out.println("testSerialize()");
        
        Runtime r = Runtime.getRuntime();
        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);

        Map<String, Actor> res = getResultObject();


        // run through JSON once, to see if we need to load anything
        @SuppressWarnings("unused")
        String jo = JSONMarshaller.marshal(res, jc);
        // System.out.println("jo: "+jo);
        jo = null;

        doGC();

        long time_start = 0;
        long mem_diff = 0;
        double mem_accumulation_old = 0;
        double mem_accumulation_new = 0;
        double time_accum_old = 0;
        double time_accum_new = 0;
        int iterations = 4;             // no diff between runs, so keep it low

        for (int i=0;i<iterations;i++) {
            time_start = System.currentTimeMillis();
            mem_diff = doJsonSerialize_old(res, jc, r);
            mem_accumulation_old += mem_diff;
            time_accum_old = (System.currentTimeMillis() - time_start);
            
            time_start = System.currentTimeMillis();
            mem_diff = doJsonSerialize_new(res, jc, r);
            mem_accumulation_new += mem_diff;
            time_accum_new = (System.currentTimeMillis() - time_start);
        }
        
        assertFalse(Double.MAX_VALUE==mem_accumulation_old);
        assertFalse(Double.MAX_VALUE==mem_accumulation_new);
        double mem_average_old = mem_accumulation_old / iterations;
        double mem_average_new = mem_accumulation_new / iterations;
        
        assertFalse(Double.MAX_VALUE==time_accum_new);
        assertFalse(Double.MAX_VALUE==time_accum_old);
        double time_average_new = time_accum_new / iterations;
        double time_average_old = time_accum_old / iterations;
        
        System.out.println("average old: "+mem_average_old);
        System.out.println("time old: "+time_average_old);
        System.out.println("average new: "+mem_average_new);
        System.out.println("time new: "+time_average_new);
        System.out.println();
        
        assertTrue("new perf: "+time_average_new+" !< old: "+time_average_old,
                time_average_new < time_average_old);
        assertTrue("mem new: "+mem_average_new+" !< old: "+mem_average_old,
                mem_average_new < mem_average_old);
    }

    private Map<String, LocalActor> getLocalResultObject() {

        Map<String, LocalActor> res = new HashMap<String, LocalActor>();
        LocalActor a = new LocalActor("first", "last");
        Set<LocalFilmActor> filmActors = new HashSet<LocalFilmActor>();

        res.put("result", a);
        a.setFilmActors(filmActors);

        for (int i = 0; i < 1000; i++) {
            LocalFilm f = new LocalFilm();
            f.setTitle("Film #" + i);

            LocalFilmActor fa = new LocalFilmActor();
            fa.setFilm(f);
            fa.setActor(a);

            filmActors.add(fa);
        }

        return res;
    }

    private Map<String, Actor> getResultObject() {

        Map<String, Actor> res = new HashMap<String, Actor>();
        Actor a = new Actor();
        a.setFirstName("first");
        a.setLastName("last");
        Set<FilmActor> filmActors = new HashSet<FilmActor>();

        res.put("result", a);
        a.setFilmActors(filmActors);

        for (int i = 0; i < 1000; i++) {
            Film f = new Film();
            f.setTitle("Film #" + i);

            FilmActor fa = new FilmActor();
            fa.setFilm(f);
            fa.setActor(a);

            filmActors.add(fa);
        }

        return res;
    }

    /**
     * Return the difference in memory, between when the JSONObject is in memory,
     * and when that's been gc'd.
     *
     * @param object
     * @param jc
     * @return
     * @throws IOException
     */
    private long doJsonSerialize_old(Object object, JSONState jc, Runtime r)
            throws IOException {

        long afterSerialization = 0;
        long afterFreedJson = 0;

        doGC();

        String jo = JSONMarshaller.marshal(object, jc);
        @SuppressWarnings("unused")
        String s = jo.toString();
        doGC();
        afterSerialization = r.totalMemory() - r.freeMemory();

        jo = null;
        jc = null;
        s = null;
        doGC();
        afterFreedJson = r.totalMemory() - r.freeMemory();

        return afterSerialization - afterFreedJson;
    }
    
    /**
     * Return the difference in memory, between when the JSONObject is in memory,
     * and when that's been gc'd.
     *
     * @param object
     * @param jc
     * @return
     * @throws IOException
     */
    private long doJsonSerialize_new(Object object, JSONState jc, Runtime r)
            throws IOException {

        long afterSerialization = 0;
        long afterFreedJson = 0;

        doGC();

        @SuppressWarnings("unused")
        String jo = JSONMarshaller.marshal(object, jc);
        doGC();
        afterSerialization = r.totalMemory() - r.freeMemory();

        jo = null;
        jc = null;
        doGC();
        afterFreedJson = r.totalMemory() - r.freeMemory();

        return afterSerialization - afterFreedJson;
    }

    private void doGC() {

        System.gc();
        Thread.yield();
        System.gc();
        System.gc();
        System.gc();
        System.gc();
        System.gc();
    }

    public static class LocalActor {

        private Set<LocalFilmActor> filmActors;
        private String first;
        private String last;

        public LocalActor() {
            // do nothing
        }

        public LocalActor(String first, String last) {
            this.first = first;
            this.last = last;
        }

        public Set<LocalFilmActor> getFilmActors() {
            return filmActors;
        }
        public void setFilmActors(Set<LocalFilmActor> filmActors) {
            this.filmActors = filmActors;
        }
        public String getFirst() {
            return first;
        }
        public void setFirst(String first) {
            this.first = first;
        }
        public String getLast() {
            return last;
        }
        public void setLast(String last) {
            this.last = last;
        }
    }

    public static class LocalFilmActor {

        private LocalFilm film;
        private LocalActor actor;

        public LocalFilm getFilm() {
            return film;
        }
        public void setFilm(LocalFilm film) {
            this.film = film;
        }
        public LocalActor getActor() {
            return actor;
        }
        public void setActor(LocalActor actor) {
            this.actor = actor;
        }
    }

    public static class LocalFilm {

        private String title;

        public String getTitle() {
            return title;
        }
        public void setTitle(String title) {
            this.title = title;
        }
    }
}
