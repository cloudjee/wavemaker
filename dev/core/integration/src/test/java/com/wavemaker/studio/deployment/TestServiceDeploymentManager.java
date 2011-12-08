/*
 * Copyright (C) 2008 WaveMaker Software, Inc.
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

package com.wavemaker.studio.deployment;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;

import org.junit.Before;
import org.junit.Test;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.data.DataServiceType;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.data.DataModelDeploymentConfiguration;
import com.wavemaker.tools.data.util.DataServiceTestUtils;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.deployment.ServiceDeploymentManager;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.service.AbstractFileService;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.FileService;
import com.wavemaker.tools.service.definitions.DataObjects;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.util.AntUtils;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 * 
 */
public class TestServiceDeploymentManager extends StudioTestCase {

    private static final String projectName = "myproject";

    private static final String serviceId = "sakila";

    private File rootDir = null;

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        this.rootDir = makeProject(projectName);
        populateProject(this.rootDir, true);
        DataServiceTestUtils.setupSakilaConfiguration(new File(this.rootDir, DesignServiceManager.getRuntimeRelativeDir(serviceId)));

        // add dummy servicedef.xml
        String designDir = DesignServiceManager.getDesigntimeRelativeDir(serviceId);
        File serviceDef = new File(this.rootDir, designDir + "/" + DesignServiceManager.getServiceXmlRelative());
        serviceDef.getParentFile().mkdirs();

        JAXBContext definitionsContext = JAXBContext.newInstance("com.wavemaker.tools.service.definitions");
        Service service = new Service();
        service.setId(serviceId);
        service.setType(DataServiceType.TYPE_NAME);
        service.setSpringFile(DataServiceUtils.getCfgFileName(serviceId));
        service.setDataobjects(new DataObjects());

        Marshaller marshaller = definitionsContext.createMarshaller();
        marshaller.setProperty("jaxb.formatted.output", true);
        marshaller.marshal(service, serviceDef);
    }

    @Test
    public void testGenerateWebapp() throws IOException {

        ServiceDeploymentManager mgr = (ServiceDeploymentManager) getBean("serviceDeploymentManager");
        assertTrue(mgr != null);
        String jndiName = "java:/comp/eng/blah";
        Map<String, String> m = new HashMap<String, String>(1);
        m.put(serviceId + "." + DataModelDeploymentConfiguration.JNDI_NAME_PROPERTY, jndiName);

        File war = mgr.generateWebapp(new FileSystemResource(this.rootDir.getAbsolutePath() + "/"), m, false).getFile();

        assertEquals(projectName + ".war", war.getName());

        // verify that war has spring file with jndi ds
        final File tmp = IOUtils.createTempDirectory();
        try {
            AntUtils.unjar(war, tmp);
            FileService fileService = new AbstractFileService(new LocalStudioConfiguration()) {

                @Override
                public Resource getFileServiceRoot() {
                    return new FileSystemResource(tmp.getAbsolutePath() + "/").createRelative("WEB-INF/classes");
                }

            };
            Beans beans = DataServiceUtils.readBeans(fileService, DataServiceUtils.getCfgFileName(serviceId));
            DataServiceTestUtils.verifyJNDIDataSource(beans, jndiName);
        } finally {
            IOUtils.deleteRecursive(tmp);
        }

    }

}
