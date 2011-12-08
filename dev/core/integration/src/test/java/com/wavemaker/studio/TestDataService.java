/*
 * Copyright (C) 2007-2008 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.wavemaker.studio;

import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Test;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.runtime.data.DataServiceType;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.definition.AbstractDeprecatedServiceDefinition;
import com.wavemaker.runtime.service.definition.ReflectServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.util.AntUtils;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 * 
 */
public class TestDataService extends StudioTestCase {

    private static final String serviceName = "aghr";

    private class TestDataServiceDefinition extends AbstractDeprecatedServiceDefinition implements ReflectServiceDefinition {

        private final String serviceId;

        public TestDataServiceDefinition(String serviceId) {
            this.serviceId = serviceId;
        }

        public String getRuntimeConfiguration() {
            return null;
        }

        public String getServiceClass() {
            return "abc";
        }

        public String getServiceId() {
            return this.serviceId;
        }

        public String getPackageName() {
            return "def";
        }

        public ServiceType getServiceType() {
            return new DataServiceType();
        }

        public List<String> getOperationNames() {
            return Collections.emptyList();
        }

        public List<ElementType> getInputTypes(String operationName) {
            return Collections.emptyList();
        }

        public ElementType getOutputType(String operationName) {
            return null;
        }

        public List<ElementType> getTypes() {
            return Collections.emptyList();
        }

        public void dispose() {
        }

        public List<String> getEventNotifiers() {
            return new ArrayList<String>();
        }

        public boolean isLiveDataService() {
            return true;
        }

        @Override
        public String getPartnerName() {
            return null;
        }

        public String getOperationType(String operationName) {return null;}
    }

    @Before
    @Override
    public void setUp() throws Exception {

        super.setUp();
        makeProject("foo");

        try {
            File aghr = ClassLoaderUtils.getClasspathFile("aghr.jar").getFile();
            File sakila = ClassLoaderUtils.getClasspathFile("sakila.jar").getFile();

            DesignServiceManager mgr = (DesignServiceManager) getBean("designServiceManager");

            File aghrSrcDir = mgr.getServiceRuntimeDirectory("aghr").getFile();
            File sakilaSrcDir = mgr.getServiceRuntimeDirectory("sakila").getFile();
            FileUtils.forceMkdir(aghrSrcDir);
            FileUtils.forceMkdir(sakilaSrcDir);

            AntUtils.unjar(aghr, aghrSrcDir);
            AntUtils.unjar(sakila, sakilaSrcDir);

            ServiceDefinition sd = new TestDataServiceDefinition("sakila");
            mgr.defineService(sd);
            ServiceDefinition sd2 = new TestDataServiceDefinition("aghr");
            mgr.defineService(sd2);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }

    }

    @Test
    public void testInitDataService() throws Exception {
        Collection<?> c = (Collection<?>) invokeService_toObject("dataService", "getEntityNames", new String[] { serviceName });

        assertTrue(c.contains("Employee") && c.contains("Compkey") && c.size() == 3);
    }
}
