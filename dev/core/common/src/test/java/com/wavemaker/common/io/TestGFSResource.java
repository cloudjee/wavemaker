package com.wavemaker.common.io;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.data.mongodb.MongoDbFactory;

import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSInputFile;

/**
 * @author ecallahan
 * 
 */

public class TestGFSResource {

	private static GridFS mygridfs;
	private static MongoDbFactory mongoFactory;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}

	@Before
	public void setUp() throws Exception {
		// ensure mongo is running
		ApplicationContext ctx = new AnnotationConfigApplicationContext(
				TestMongoConfig.class);
		mongoFactory = (MongoDbFactory) ctx.getBean("mongoFactory");
		System.out.println("Connected to: "
				+ mongoFactory.getDb().getMongo().getAddress().getHost());
		mygridfs = new GridFS(mongoFactory.getDb());
	}

	@After
	public void tearDown() throws Exception {
		mongoFactory.getDb().dropDatabase();
	}

	@Test
	public void testGetPath() {
		String newPath = "/project/testOne/WEB-INF/classes";
		GFSResource gfsRes = new GFSResource(mygridfs, newPath);
		assertEquals(newPath, gfsRes.getPath());
	}

	@Test
	public void testGetFilename() {
		String s = "Hello World <br> ! Good bye for now.";
		byte[] testData = s.getBytes();
		String fn = "MyFile.txt";
		String path = "/home/users/somebody";
		GridFSInputFile file = mygridfs.createFile(testData);
		file.setFilename(fn);
		GFSResource gfsres = new GFSResource(file, path);
		assertEquals(gfsres.getFilename(), fn);

	}

	@Test 
	public void testCreateRelative() { 
		GFSResource newRes = null;
		String relPath = "/WEB-INF";
		String s = "Hello World <br> ! Good bye for now.";
		byte[] testData = s.getBytes();
		String fn = "foo.js";
		String path = "/wavemaker/projects/Project1/webapproot";
		GridFSInputFile file = mygridfs.createFile(testData);
		file.setFilename(fn);
		GFSResource gfsres = new GFSResource(file, path);
		try{
			newRes = gfsres.createRelative(mygridfs, relPath );
		} catch (Exception e) { }
		assertEquals(newRes.getPath(), path + relPath );		 
	}
	 /*
	 * @Test public void testGetMD5() { fail("Not yet implemented"); // TODO }
	 */
}
