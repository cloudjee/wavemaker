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

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.util.StringUtils;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.data.DataServiceType;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.data.DataModelDeploymentConfiguration;
import com.wavemaker.tools.data.util.DataServiceTestUtils;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.deployment.DeploymentDB;
import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.deployment.DeploymentType;
import com.wavemaker.tools.deployment.ServiceDeploymentManager;
import com.wavemaker.tools.service.AbstractFileService;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.FileService;
import com.wavemaker.tools.service.definitions.DataObjects;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.Property;
import com.wavemaker.tools.util.AntUtils;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class TestServiceDeploymentManager extends StudioTestCase {

    private static final String projectName = "myproject";
    private static final String serviceId = "sakila";

    private File rootDir = null;

    @Override
    public void onSetUp() throws Exception {
        super.onSetUp();
        rootDir = makeProject(projectName);
        populateProject(rootDir, true);
        DataServiceTestUtils.setupSakilaConfiguration(new File(rootDir,
                DesignServiceManager.getRuntimeRelativeDir(serviceId)));

        // add dummy servicedef.xml
        String designDir = DesignServiceManager
                .getDesigntimeRelativeDir(serviceId);
        File serviceDef = new File(rootDir, designDir + "/"
                + DesignServiceManager.getServiceXmlRelative());
        serviceDef.getParentFile().mkdirs();

        JAXBContext definitionsContext = JAXBContext
                .newInstance("com.wavemaker.tools.service.definitions");
        Service service = new Service();
        service.setId(serviceId);
        service.setType(DataServiceType.TYPE_NAME);
        service.setSpringFile(DataServiceUtils.getCfgFileName(serviceId));
        service.setDataobjects(new DataObjects());

        Marshaller marshaller = definitionsContext.createMarshaller();
        marshaller.setProperty("jaxb.formatted.output", true);
        marshaller.marshal(service, serviceDef);
    }

    /*public void testGenerateWebappWithJNDI() throws IOException {
        
        ServiceDeploymentManager mgr = (ServiceDeploymentManager) getBean("serviceDeploymentManager");
        assertTrue(mgr != null);
        String jndiName = "java:/comp/eng/blah";
        DeploymentInfo deployment = new DeploymentInfo();
        deployment.setApplicationName(projectName);
        deployment.setDeploymentType(DeploymentType.FILE);
        DeploymentDB db = new DeploymentDB();
        db.setDataModelId("sakila");
        db.setDbName("sakila");
        db.setJndiName(jndiName);
        deployment.getDatabases().add(db);

        File war = mgr.generateWebapp(deployment);
        
        assertEquals(projectName + ".war", war.getName());

        // verify that war has spring file with jndi ds
        final File tmp = IOUtils.createTempDirectory();
        try {
            AntUtils.unjar(war, tmp);
            FileService fileService = new AbstractFileService() {
                public File getFileServiceRoot() {
                    return new File(tmp, "WEB-INF/classes");
                }

            };
            Beans beans = DataServiceUtils.readBeans(fileService,
                    DataServiceUtils.getCfgFileName(serviceId));
            DataServiceTestUtils.verifyJNDIDataSource(beans, jndiName);
        } finally {
            IOUtils.deleteRecursive(tmp);
        }

    }*/
    
    public void testGenerateWebappWithDeploymentDBSettings() throws IOException {
        ServiceDeploymentManager mgr = (ServiceDeploymentManager) getBean("serviceDeploymentManager");
        assertTrue(mgr != null);
        DeploymentInfo deployment = new DeploymentInfo();
        deployment.setApplicationName(projectName);
        deployment.setDeploymentType(DeploymentType.FILE);
        DeploymentDB db = new DeploymentDB();
        db.setDataModelId("sakila");
        db.setDbName("sakila");
        db.setUsername("jimminy");
        db.setPassword(SystemUtils.encrypt("cricket"));
        db.setConnectionUrl("jdbc:mysql://187.1.2.3:3306/foo");
        deployment.getDatabases().add(db);

        File war = mgr.generateWebapp(deployment);
        
        assertEquals(projectName + ".war", war.getName());

        // verify that war has spring file with jndi ds
        final File tmp = IOUtils.createTempDirectory();
        try {
            AntUtils.unjar(war, tmp);
            FileService fileService = new AbstractFileService() {
                public File getFileServiceRoot() {
                    return new File(tmp, "WEB-INF/classes");
                }

            };
            Beans beans = DataServiceUtils.readBeans(fileService,
                    DataServiceUtils.getCfgFileName(serviceId));
            List<Bean> dataSourceBeans = beans.getBeansByType(DriverManagerDataSource.class);
            assertEquals(1, dataSourceBeans.size());
            Resource propsFileResource = new FileSystemResource(new File(fileService.getFileServiceRoot(), "mysql_sakila.properties"));
            Properties deploymentProps = DataServiceUtils.readProperties(propsFileResource.getInputStream());
            assertNotNull(deploymentProps);
            Map<String, String> dbSettings = db.asProperties();
            for (Entry<String, String> prop : dbSettings.entrySet()){
                assertTrue(StringUtils.hasText(deploymentProps.getProperty(prop.getKey())));
                assertEquals(prop.getValue(), deploymentProps.getProperty(prop.getKey()));
            }
        } finally {
            IOUtils.deleteRecursive(tmp);
        }
    }

}
