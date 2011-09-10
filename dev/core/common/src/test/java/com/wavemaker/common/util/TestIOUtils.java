/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
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
package com.wavemaker.common.util;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.infra.WMTestCase;

/**
 * @author Matt Small
 * @version $Rev:22672 $ - $Date:2008-05-30 14:37:26 -0700 (Fri, 30 May 2008) $
 *
 */
public class TestIOUtils extends WMTestCase {

    private File tempDir;
    
    @Override
    public void setUp() throws Exception {
        
        try {
            tempDir = IOUtils.createTempDirectory();
            SpringUtils.initSpringConfig();
        } catch (RuntimeException e) {
            IOUtils.deleteRecursive(tempDir);
            throw(e);
        }
    }

    @Override
    public void tearDown() throws Exception {
        
        IOUtils.deleteRecursive(tempDir);
    }
    
    public void testCreateTempDirectory_shortPrefix() throws Exception {
        
        File newTempDir = IOUtils.createTempDirectory("a", "bcd");
        assertTrue(newTempDir.getName().startsWith("aaa"));
    }

    public void testCreateTempDirectory() throws Exception {
        
        File newTempDir = IOUtils.createTempDirectory();
        assertTrue(newTempDir.exists());
        newTempDir.delete();
        assertFalse(newTempDir.exists());
    }
    
    public void testDeleteOneLevel() throws Exception {
        
        File newTempDir = IOUtils.createTempDirectory();
        assertTrue(newTempDir.exists());
        IOUtils.deleteRecursive(newTempDir);
        assertFalse(newTempDir.exists());
    }
    
    public void testDeleteTwoLevels() throws Exception {
        
        File newTempDir = IOUtils.createTempDirectory();
        assertTrue(newTempDir.exists());
        File newTempDir2 = new File(newTempDir, "foobar");
        newTempDir2.mkdir();
        File newTempFile = new File(newTempDir2, "foo.txt");
        newTempFile.createNewFile();
        IOUtils.deleteRecursive(newTempDir);
        assertFalse(newTempDir.exists());
    }
   
    public void testMakeDirectories() throws Exception {
        
        File wantToCreate = new File(tempDir, "foo/bar/baz.txt");
        
        boolean gotException = false;
        try {
            wantToCreate.createNewFile();
        } catch (Exception e) {
            gotException = true;
        }
        assertTrue(gotException);
        
        IOUtils.makeDirectories(wantToCreate.getParentFile(), tempDir);
        
        assertTrue(wantToCreate.getParentFile().exists());
        
        wantToCreate.createNewFile();
        
        File alreadyExists = new File(tempDir, "bar");
        alreadyExists.mkdir();
        IOUtils.makeDirectories(alreadyExists, wantToCreate);
    }

    public void testBadMakeDirectories() throws Exception {
        
        File wantToCreate = new File("/_foobarblahgoo_/bar");
        
        boolean gotException = false;
        try {
            IOUtils.makeDirectories(wantToCreate.getParentFile(), tempDir);
        } catch (FileAccessException ex) {
            gotException = true;
            assertTrue("got message: "+ex.getMessage(),
                    ex.getMessage().startsWith("Reached filesystem root"));
        }
        assertTrue(gotException);
    }
    
    public void testTouchDNE() throws Exception {
        
        File f = File.createTempFile("touchDNE", "tmp");
        f.delete();
        f.deleteOnExit();
        assertTrue(!f.exists());
        IOUtils.touch(f);
        assertTrue(f.exists());
    }
    
    public void testTouch() throws Exception {
        
        File f = File.createTempFile("touch", "tmp");
        f.deleteOnExit();
        assertTrue(f.exists());
        
        long lastModified = f.lastModified();
        
        // UNIX counts in seconds
        Thread.sleep(3000);
        
        IOUtils.touch(f);

        assertTrue(lastModified < f.lastModified());
    }
    
    public void testTouchDir() throws Exception {
        
        File f = null;
        
        try {
             f = IOUtils.createTempDirectory();

             long lastModified = f.lastModified();
             
             // UNIX counts in seconds
             Thread.sleep(3000);
             
             IOUtils.touch(f);

             assertTrue(lastModified < f.lastModified());
        } finally {
            if (null!=f)
                IOUtils.deleteRecursive(f);
        }
    }
    
    public void testCopyFiles() throws Exception {
        
        File source = File.createTempFile("testCopyFilesSrc", ".tmp");
        File dest = File.createTempFile("testCopyFilesDest", ".tmp");
        source.deleteOnExit();
        dest.delete();
        dest.deleteOnExit();
        assertFalse(dest.exists());
        
        FileUtils.writeStringToFile(source, "foo");
        
        IOUtils.copy(source, dest);
        assertTrue(dest.exists());
        assertEquals(source, dest);
    }
    
    public void testCopyFilesExcludes() throws Exception {
        
        File source = File.createTempFile("testCopyFilesSrc", ".tmp");
        File dest = File.createTempFile("testCopyFilesDest", ".tmp");
        source.deleteOnExit();
        dest.delete();
        dest.deleteOnExit();
        assertFalse(dest.exists());
        
        FileUtils.writeStringToFile(source, "foo");
        
        List<String> excludes = new ArrayList<String>();
        excludes.add(source.getName());
        IOUtils.copy(source, dest, excludes);
        assertFalse(dest.exists());
    }
    
    public void testCopyDirectories() throws Exception {
        
        File source = IOUtils.createTempDirectory("testCopyDirectoriesSrc", "");
        File dest = IOUtils.createTempDirectory("testCopyDirectoriesSrc", "");
        
        try {
            IOUtils.deleteRecursive(dest);
            assertTrue(source.exists());
            assertTrue(source.isDirectory());
            assertFalse(dest.exists());

            File sourceFile = new File(source, "foo");
            FileUtils.writeStringToFile(sourceFile, "foo");
            File sourceDir = new File(source, "bar");
            sourceDir.mkdir();
            File sourceDirFile = new File(sourceDir, "barfile");
            FileUtils.writeStringToFile(sourceDirFile, "foobarbaz");
            
            
            IOUtils.copy(source, dest);
            assertTrue(dest.exists());
            assertTrue(dest.isDirectory());
            
            File destFile = new File(dest, "foo");
            File destDir = new File(dest, "bar");
            File destDirFile = new File(destDir, "barfile");
            assertTrue(destFile.exists());
            assertEquals(sourceFile, destFile);
            assertTrue(destDir.exists());
            assertTrue(destDir.isDirectory());
            assertTrue(destDirFile.exists());
            assertEquals(sourceDirFile, destDirFile);
        } finally {
            IOUtils.deleteRecursive(source);
            IOUtils.deleteRecursive(dest);
        }
    }
    
    public void testCopyDirectoriesExcludes() throws Exception {
        
        String excludeName = "DoNotCopy";
        List<String> excludes = new ArrayList<String>();
        excludes.add(excludeName);
        
        File source = IOUtils.createTempDirectory("testCopyDirectoriesSrc", "");
        File dest = IOUtils.createTempDirectory("testCopyDirectoriesSrc", "");
        
        try {
            IOUtils.deleteRecursive(dest);
            assertTrue(source.exists());
            assertTrue(source.isDirectory());
            assertFalse(dest.exists());

            File sourceFile = new File(source, "foo");
            FileUtils.writeStringToFile(sourceFile, "foo");
            File sourceDir = new File(source, "bar");
            sourceDir.mkdir();
            File sourceDirFile = new File(sourceDir, "barfile");
            FileUtils.writeStringToFile(sourceDirFile, "foobarbaz");
            File sourceExcludeDir = new File(source, excludeName);
            sourceExcludeDir.mkdir();
            File sourceExcludeFile = new File(sourceDir, excludeName);
            FileUtils.writeStringToFile(sourceExcludeFile, "a");
            
            
            IOUtils.copy(source, dest, excludes);
            assertTrue(dest.exists());
            assertTrue(dest.isDirectory());
            
            File destFile = new File(dest, "foo");
            File destDir = new File(dest, "bar");
            File destDirFile = new File(destDir, "barfile");
            File destExcludeDir = new File(dest, excludeName);
            File destExcludeFile = new File(destDir, excludeName);
            assertTrue(destFile.exists());
            assertEquals(sourceFile, destFile);
            assertTrue(destDir.exists());
            assertTrue(destDir.isDirectory());
            assertTrue(destDirFile.exists());
            assertEquals(sourceDirFile, destDirFile);
            assertFalse(destExcludeDir.exists());
            assertFalse(destExcludeFile.exists());
        } finally {
            IOUtils.deleteRecursive(source);
            IOUtils.deleteRecursive(dest);
        }
    }
    
    public void testDeleteOnExit() throws Exception {
        
        File tempDir = IOUtils.createTempDirectory("testDeleteOnExit", "tmp");
        assertTrue(tempDir.exists());
        IOUtils.deleteFileOnShutdown(tempDir);
        
        // and now, hopefully, we won't see that file ever
    }
    
    public void testDeleteOnExitDNE() throws Exception {
        
        File tempDir = IOUtils.createTempDirectory("testDeleteOnExit", "tmp");
        assertTrue(tempDir.exists());
        FileUtils.forceDelete(tempDir);
        IOUtils.deleteFileOnShutdown(tempDir);
        
        // and now, hopefully, we won't see that file ever
    }
    
    public void testExclusionByExactMatch() {
        
        assertTrue(IOUtils.excludeByExactMatch(new File("/foo/bar/"+IOUtils.DEFAULT_EXCLUSION.get(0))));
        assertFalse(IOUtils.excludeByExactMatch(new File("/foo/bar/"+IOUtils.DEFAULT_EXCLUSION.get(0)+".foo")));
    }
}