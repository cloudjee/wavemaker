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

import org.springframework.core.io.ClassPathResource;

import com.wavemaker.infra.TestSpringContextTestCase;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public abstract class RuntimeDataSpringContextTestCase extends
        TestSpringContextTestCase {

    public RuntimeDataSpringContextTestCase() {
    }

    public RuntimeDataSpringContextTestCase(String methodName) {
        super(methodName);
    }

    @Override
    protected String[] getWebAppConfigLocations() {

        ClassPathResource cpr = new ClassPathResource(
                DataServiceTestConstants.SAKILA_SPRING_CFG);
        assertTrue("couldn't find "
                + DataServiceTestConstants.SAKILA_SPRING_CFG
                + "; bad classpath?", cpr.exists());

        return new String[] {
                "com/wavemaker/runtime/server/WEB-INF/test-springapp.xml",
                DataServiceTestConstants.SAKILA_SPRING_CFG, "orahr.spring.xml",
                "adventure.spring.xml", "aghr.spring.xml",
                "db2sample.spring.xml" };
    }

}
