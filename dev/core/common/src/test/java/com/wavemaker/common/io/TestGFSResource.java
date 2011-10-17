/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.common.io;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.test.annotation.IfProfileValue;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;

import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSInputFile;

/**
 * @author Ed Callahan
 * 
 */
@ContextConfiguration()
@RunWith(SpringJUnit4ClassRunner.class)
@IfProfileValue(name = "spring.profiles", value = "cloud-test")
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
public class TestGFSResource  {

    @Autowired
    private SimpleMongoDbFactory mongoFactory;
    
    private static final Log log = LogFactory.getLog(TestGFSResource.class);

    private static GridFS mygridfs;

    @Before
    public void setUp() throws Exception {
    	Assert.notNull(this.mongoFactory, "Need a Factory here");
        log.info("Connected to: " // use factory to ensure mongo is running
            + mongoFactory.getDb().getMongo().getAddress().getHost());
        mygridfs = new GridFS(mongoFactory.getDb());
    }

    @After
    public void tearDown() throws Exception {
        mongoFactory.getDb().dropDatabase();
    }

    @Test
    public void testGetPath() {
        String newPath = "/project/testOne/WEB-INF/classes/";
        GFSResource gfsRes = new GFSResource(mygridfs, newPath);
        assertEquals(newPath, gfsRes.getPath());
    }

    @Test
    public void testEmptyFileExists(){
    	String path = "/someFile.txt";
    	GFSResource resA = new GFSResource(mygridfs, path);
    	assertTrue(true);
    	assertTrue(resA.exists());
    	assertTrue(resA.isFile());
    	assertFalse(resA.isDirectory());
    }
    
    @Test
    public void testGetInputStream(){
    	String fileName = "ioc.txt";
    	String path = "/spring/";
    	try{
    		InputStream fin1 = getClass().getResourceAsStream(fileName);
    		InputStream fin2 = getClass().getResourceAsStream(fileName); 		
    		GFSResource gfsRes = new GFSResource(mygridfs, fin1, fileName, path );
    		gfsRes.save();
    		String gContent = FileCopyUtils.copyToString(new InputStreamReader(gfsRes.getInputStream()));
    		String fContent = FileCopyUtils.copyToString(new InputStreamReader(fin2));
    		assertEquals(fContent,gContent);
    	} catch (IOException ioe){
    		ioe.printStackTrace();
    	}
    }
       
    @Test
    public void testCreateRelative() {
        GFSResource newRes = null;
        String relPath = "WEB-INF/";
        String s = "Hello World <br> ! Good bye for now.";
        byte[] testData = s.getBytes();
        String fn = "foo.js";
        String path = "/wavemaker/projects/Project1/webapproot/";
        GridFSInputFile file = mygridfs.createFile(testData);
        file.setFilename(fn);
        GFSResource gfsres = new GFSResource(mygridfs, path);
        try {
            newRes = gfsres.createRelative(mygridfs, relPath);
        } catch (Exception e) {
        }
        assertEquals(newRes.getPath(), path + relPath);
    }

}
