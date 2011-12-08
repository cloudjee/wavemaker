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

package com.wavemaker.tools.data;

import java.io.File;
import java.io.IOException;
import java.util.Collection;

import org.springframework.core.io.FileSystemResource;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.JSONState;
import com.wavemaker.runtime.data.DataServiceTestConstants;
import com.wavemaker.runtime.data.util.QueryRunner;
import com.wavemaker.runtime.server.InternalRuntime;
import com.wavemaker.tools.data.spring.SpringService;
import com.wavemaker.tools.data.util.DataServiceTestUtils;

/**
 * 
 * @author Jeremy Grelle
 * 
 */
public class TestQueryRunner extends WMTestCase {

    private File f = null;

    private QueryRunner runner = null;

    @Override
    public void setUp() throws IOException {
        this.f = DataServiceTestUtils.setupSakilaConfiguration().getParentFile();
        ClassLoaderUtils.TaskRtn task = new ClassLoaderUtils.TaskRtn() {

            @Override
            public Object run() {
                return SpringService.initQueryRunner(DataServiceTestConstants.SAKILA_SPRING_CFG);
            }

        };
        this.runner = (QueryRunner) ClassLoaderUtils.runInClassLoaderContext(task, new FileSystemResource(this.f.getAbsolutePath() + "/"));
    }

    @Override
    public void tearDown() throws IOException {
        try {
            this.runner.dispose();
        } finally {
            IOUtils.deleteRecursive(this.f);
        }
    }

    public TestQueryRunner() {
        InternalRuntime.setInternalRuntimeBean(new InternalRuntime());
        InternalRuntime.getInstance().setJSONState(new JSONState());
    }

    public void testQueryRunner1() {

        Object o = this.runner.run("select count(a) from Actor a");

        assertTrue(o instanceof Collection);
        assertTrue(((Collection<?>) o).iterator().next().equals(new Long(200)));
    }

    public void testQueryRunner2() {

        Object o = this.runner.run("from Actor");

        assertTrue(o instanceof Collection);
        assertTrue(((Collection<?>) o).size() == 200);
    }

    public void testQueryRunner3() {

        this.runner.addBindParameter("id", "java.lang.Short", "2");
        Object o = this.runner.run("from Actor _a where _a.id=:id");

        assertTrue(o instanceof Collection);
        assertTrue(((Collection<?>) o).size() == 1);
    }
}
