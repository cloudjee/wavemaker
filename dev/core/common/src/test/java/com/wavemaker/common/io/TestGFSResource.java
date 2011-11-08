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
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.test.annotation.IfProfileValue;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;

import com.mongodb.BasicDBObject;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;

/**
 * @author Ed Callahan
 */
@ContextConfiguration()
@RunWith(SpringJUnit4ClassRunner.class)
@IfProfileValue(name = "spring.profiles", value = "cloud-test")
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class })
public class TestGFSResource {

    @Autowired
    private SimpleMongoDbFactory mongoFactory;

    private static final Log log = LogFactory.getLog(TestGFSResource.class);

    private static GridFS gfs;

    @Before
    public void setUp() throws Exception {
        Assert.notNull(this.mongoFactory, "Need a Factory here");
        log.info("Connected to: " // use factory to ensure mongo is running
            + this.mongoFactory.getDb().getMongo().getAddress().getHost());
        gfs = new GridFS(this.mongoFactory.getDb());
    }

    @After
    public void tearDown() throws Exception {
        this.mongoFactory.getDb().dropDatabase();
    }

    @Test
    public void testGetPath() {
        String newPath = "/project/testOne/WEB-INF/classes/";
        GFSResource gfsRes = new GFSResource(gfs, new BasicDBObject(), newPath);
        assertEquals(newPath, gfsRes.getPath());
    }

    @Test
    public void testGetFilename() {
        String filePath = "/project/test/foo.txt";
        GFSResource fileRes = new GFSResource(gfs, new BasicDBObject(), filePath);
        assertEquals("foo.txt", fileRes.getFilename());

        String dirPath = "/project/test/foo/";
        GFSResource dirRes = new GFSResource(gfs, new BasicDBObject(), dirPath);
        assertEquals("foo", dirRes.getFilename());
    }

    @Test
    public void testGetURI() {
        String filePath = "/project/test/foo.txt";
        GFSResource fileRes = new GFSResource(gfs, new BasicDBObject(), filePath);
        URI uri = fileRes.getURI();
        assertNotNull(uri);
    }

    @Test
    public void testFileNotExists() {
        String path = "/someFile.txt";
        GFSResource resA = new GFSResource(gfs, new BasicDBObject(), path);
        assertFalse(resA.exists());
        assertTrue(resA.isFile());
        assertFalse(resA.isDirectory());
    }

    @Test
    public void testDirectoryNotExists() {
        String path = "/somedir/";
        GFSResource resA = new GFSResource(gfs, new BasicDBObject(), path);
        assertFalse(resA.exists());
        assertFalse(resA.isFile());
        assertTrue(resA.isDirectory());
    }

    @Test
    public void testGetInputStream() throws IOException {
        String fileName = "com/wavemaker/common/io/ioc.txt";
        String gfsPath = "/spring/ioc.txt";
        ClassPathResource testResource = new ClassPathResource(fileName);
        String localFileContent = FileCopyUtils.copyToString(new InputStreamReader(testResource.getInputStream()));
        gfs.createFile(testResource.getInputStream(), gfsPath).save();
        GFSResource gfsRes = new GFSResource(gfs, new BasicDBObject(), gfsPath);
        assertTrue(gfsRes.exists());
        String gfsFileContent = FileCopyUtils.copyToString(new InputStreamReader(gfsRes.getInputStream()));
        assertEquals(localFileContent, gfsFileContent);
    }

    @Test
    public void testGetOutputStream() throws IOException {
        String fileName = "com/wavemaker/common/io/ioc.txt";
        String gfsPath = "/spring/ioc.txt";
        ClassPathResource testResource = new ClassPathResource(fileName);
        String localFileContent = FileCopyUtils.copyToString(new InputStreamReader(testResource.getInputStream()));
        GFSResource gfsRes = new GFSResource(gfs, new BasicDBObject(), gfsPath);
        assertFalse(gfsRes.exists());
        FileCopyUtils.copy(testResource.getInputStream(), gfsRes.getOutputStream());
        assertTrue(gfsRes.exists());
        String gfsFileContent = FileCopyUtils.copyToString(new InputStreamReader(gfs.findOne(gfsPath).getInputStream()));
        assertEquals(localFileContent, gfsFileContent);
    }

    @Test
    public void testCreateRelative() throws IOException {
        GFSResource newRes = null;
        String relPath = "WEB-INF/";
        String s = "Hello World <br> ! Good bye for now.";
        byte[] testData = s.getBytes();
        String fn = "foo.js";
        String path = "/wavemaker/projects/Project1/webapproot/";
        GridFSInputFile file = gfs.createFile(testData);
        file.setFilename(fn);
        GFSResource gfsres = new GFSResource(gfs, new BasicDBObject(), path);
        newRes = gfsres.createRelative(relPath);
        assertEquals(newRes.getPath(), path + relPath);
    }

    @Test
    public void testListFiles() throws IOException {
        String fileName = "com/wavemaker/common/io/ioc.txt";
        String gfsPath = "/spring/";
        ClassPathResource testResource = new ClassPathResource(fileName);
        GFSResource res1 = new GFSResource(gfs, new BasicDBObject(), gfsPath + "ioc1.foo");
        GFSResource res2 = new GFSResource(gfs, new BasicDBObject(), gfsPath + "ioc2.bar");
        GFSResource res3 = new GFSResource(gfs, new BasicDBObject(), gfsPath + "/subspring/ioc1.zoo");

        FileCopyUtils.copy(testResource.getInputStream(), res1.getOutputStream());
        FileCopyUtils.copy(testResource.getInputStream(), res2.getOutputStream());
        FileCopyUtils.copy(testResource.getInputStream(), res3.getOutputStream());

        GFSResource gfsRes = new GFSResource(gfs, new BasicDBObject(), "/spring/");
        List<GridFSDBFile> gfsFiles = gfsRes.listFiles();
        assertTrue(gfsFiles.size() == 2);
    }

}
