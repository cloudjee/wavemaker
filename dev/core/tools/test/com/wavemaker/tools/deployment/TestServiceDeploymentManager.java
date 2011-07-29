/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.deployment;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.BeanUtils;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;

import com.wavemaker.common.ResourceManager;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.runtime.server.json.JSONUtils;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioConfiguration;

/**
 * @author Jeremy Grelle
 */
public class TestServiceDeploymentManager {

    private static File homeDir;
    
    private StudioConfiguration studioConfig;
    
    @Mock 
    private ProjectManager projectManager;
    
    private ServiceDeploymentManager mgr;
    
    @BeforeClass
    public static void initHomeDir() throws IOException {
        homeDir = IOUtils.createTempDirectory(TestServiceDeploymentManager.class.getName(), "tmp");
    }
    
    @Before
    public void setUp() {
        assertTrue(homeDir.exists());
        assertTrue(homeDir.isDirectory());
        File commonDir = new File(homeDir, "common");
        commonDir.mkdir();
        assertTrue(commonDir.exists());
        assertTrue(commonDir.isDirectory());
        studioConfig = new StudioConfiguration();
        studioConfig.setTestWaveMakerHome(homeDir);
        MockitoAnnotations.initMocks(this);
        mgr = new ServiceDeploymentManager();
        mgr.setProjectManager(projectManager);
        mgr.setStudioConfiguration(studioConfig);
        
        ResourceManager resourceManager = BeanUtils.instantiateClass(ResourceManager.class);
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("wm_resource");
        resourceManager.setMessageSource(messageSource);
        
        File projectDir = new File(homeDir, "projects/foo");
        projectDir.mkdirs();
        assertTrue(projectDir.isDirectory());
        Project proj = new Project(projectDir);
        when(projectManager.getCurrentProject()).thenReturn(proj);
    }
    
    @After
    public void cleanUp() throws IOException {
        logContents();
        File deploymentsFile = new File(homeDir, "common/deployments.js");
        for (File file : new File(homeDir, "common").listFiles()) {
            file.delete();
        }
        assertFalse(deploymentsFile.exists());
    }
    
    private void logContents() throws IOException {
        File deploymentsFile = new File(homeDir, "common/deployments.js");
        byte[] contents = FileCopyUtils.copyToByteArray(deploymentsFile);
        System.out.println(new String(contents));
    }

    @Test
    public void testSaveDeploymentInfo_NewDeploymentInfos() throws IOException {
        DeploymentInfo deployment1 = stubDeployment1();
        DeploymentInfo deployment2 = stubDeployment2();
        DeploymentInfo deployment3 = stubDeployment3();
        DeploymentInfo deployment4 = stubDeployment1();
        
        String result = mgr.saveDeploymentInfo(deployment1);
        assertEquals("foo0", result);
        result = mgr.saveDeploymentInfo(deployment2);
        assertEquals("foo1", result);
        result = mgr.saveDeploymentInfo(deployment3);
        assertEquals("foo2", result);
        
        File projectDir = new File(homeDir, "projects/bar");
        projectDir.mkdirs();
        assertTrue(projectDir.isDirectory());
        Project proj = new Project(projectDir);
        when(projectManager.getCurrentProject()).thenReturn(proj);
        
        result = mgr.saveDeploymentInfo(deployment4);
        assertEquals("bar0", result);
        
        Resource deploymentsFile = new FileSystemResource(homeDir.getPath()+"/").createRelative("common/deployments.js");
        assertTrue(deploymentsFile.exists());
        
        Deployments deployments = readDeploymentsFile();
        DeploymentInfo saved1 = deployments.forProject("foo").get(0);
        assertEquals(deployment1, saved1);
        assertTrue(StringUtils.hasText(saved1.getDeploymentId()));
        DeploymentInfo saved2 = deployments.forProject("foo").get(1);
        assertEquals(deployment2, saved2);
        assertTrue(StringUtils.hasText(saved2.getDeploymentId()));
        DeploymentInfo saved3 = deployments.forProject("foo").get(2);
        assertEquals(deployment3, saved3);
        assertTrue(StringUtils.hasText(saved3.getDeploymentId()));
        DeploymentInfo saved4 = deployments.forProject("bar").get(0);
        assertEquals(deployment4, saved4);
        assertTrue(StringUtils.hasText(saved4.getDeploymentId()));
        
        Set<String> ids = new HashSet<String>();
        ids.add(saved1.getDeploymentId());
        ids.add(saved2.getDeploymentId());
        ids.add(saved3.getDeploymentId());
        ids.add(saved4.getDeploymentId());
        assertEquals(4, ids.size());
    }
    
    @Test
    public void testSaveDeploymentInfo_UpdatedDeploymentInfo() throws IOException {
        DeploymentInfo originalDeployment = stubDeployment1();
        
        String result = mgr.saveDeploymentInfo(originalDeployment);
        assertEquals("foo0", result);
        
        Resource deploymentsFile = new FileSystemResource(homeDir.getPath()+"/").createRelative("common/deployments.js");
        assertTrue(deploymentsFile.exists());
        
        Deployments deployments = readDeploymentsFile();
        DeploymentInfo deploymentToUpdate = deployments.forProject("foo").get(0);
        deploymentToUpdate.setName("Bar Deployment");
        result = mgr.saveDeploymentInfo(deploymentToUpdate);
        assertEquals("foo0", result);
        deployments = readDeploymentsFile();
        assertEquals(deploymentToUpdate, deployments.forProject("foo").get(0));
    }
    
    @Test
    public void testGetDeploymentInfo() throws FileNotFoundException, IOException {
        Resource testFile = new ClassPathResource("com/wavemaker/tools/deployment/deployments.js");
        assertTrue(testFile.exists());
        Resource deploymentsFile = new FileSystemResource(homeDir.getPath()+"/").createRelative("common/deployments.js");
        FileCopyUtils.copy(testFile.getFile(), deploymentsFile.getFile());
        assertTrue(deploymentsFile.exists());
        
        List<DeploymentInfo> result = mgr.getDeploymentInfo();
        assertEquals(3, result.size());
    }

    private Deployments readDeploymentsFile() throws FileNotFoundException, IOException {
        JSON result = JSONUnmarshaller.unmarshal(FileCopyUtils.copyToString(new FileReader(new File(homeDir, "common/deployments.js"))));
        Assert.isTrue(result instanceof JSONObject, "deployments.js is in an unexpected format.");
        return (Deployments) JSONUtils.toBean((JSONObject)result, Deployments.class);
    }
    
    private DeploymentInfo stubDeployment1() {
        DeploymentInfo deployment1 = new DeploymentInfo();
        deployment1.setApplicationName("stubby1");
        deployment1.setUsername("manager");
        deployment1.setPassword("manager");
        deployment1.setDeploymentType(DeploymentType.TOMCAT);
        deployment1.setName("Stubby 1 Tomcat Deployment");
        deployment1.setHost("localhost");
        deployment1.setPort(8080);

        List<DeploymentDB> dbs1 = new ArrayList<DeploymentDB>();
        DeploymentDB db1 = new DeploymentDB();
        db1.setDataModelId("foo");
        db1.setDbName("foo");
        db1.setConnectionUrl("jdbc:mysql://localhost:3306/foo");
        db1.setUsername("marty");
        db1.setPassword("mcfly");
        dbs1.add(db1);
        deployment1.setDatabases(dbs1);

        return deployment1;
    }
    
    private DeploymentInfo stubDeployment2() {
        DeploymentInfo deployment2 = new DeploymentInfo();
        deployment2.setApplicationName("stubby1");
        deployment2.setUsername("joe@vmware.com");
        deployment2.setPassword("cfLoginToken");
        deployment2.setDeploymentType(DeploymentType.CLOUD_FOUNDRY);
        deployment2.setName("Stubby 1 CloudFoundry Deployment");
        deployment2.setTarget("api.cloudfoundry.com");

        List<DeploymentDB> dbs2 = new ArrayList<DeploymentDB>();
        DeploymentDB db2 = new DeploymentDB();
        db2.setDataModelId("foo");
        db2.setDbName("foo");
        db2.setServiceName("mysql-4b710");
        dbs2.add(db2);
        deployment2.setDatabases(dbs2);
        
        return deployment2;
    }

    private DeploymentInfo stubDeployment3() {
        DeploymentInfo deployment3 = new DeploymentInfo();
        deployment3.setApplicationName("stubby1");
        deployment3.setDeploymentType(DeploymentType.FILE);
        deployment3.setName("Stubby 1 WAR Deployment");
        deployment3.setArchiveType(ArchiveType.EAR);

        List<DeploymentDB> dbs3 = new ArrayList<DeploymentDB>();
        DeploymentDB db3 = new DeploymentDB();
        db3.setDataModelId("foo");
        db3.setDbName("foo");
        db3.setJndiName("/foo/bar/db");
        deployment3.setDatabases(dbs3);
        
        return deployment3;
    }
}
