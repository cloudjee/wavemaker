/*
 *  Copyright (C) 2009-2010 WaveMaker Software, Inc.
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
package com.wavemaker.testsupport;

import java.io.File;
import java.io.IOException;

import org.apache.commons.lang.NullArgumentException;


/**
 * Static utilities for tests.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public class UtilTest {

    /**
     * An optional file-based semaphore.  Mostly used to lock tests (or test
     * classes, in setUp()) from executing at the same time in hudson.  This
     * locks the semaphore, and returns a lock object to be passed in to
     * {@link UtilTest#unlockSemaphore(Object)}.
     */
    public static String lockSemaphore(String semaphoreName) throws Exception {
    
        return lockSemaphore(semaphoreName, 50, 500);
    }
    
    public static String lockSemaphore(String semaphoreName, int iter, int sleep)
            throws Exception {
        
        String tmpdir = System.getProperty("java.io.tmpdir");
        File tempFile = new File(new File(tmpdir), semaphoreName+".lock");
        
        int slept = 0;
        while (slept<iter) {
            if (!tempFile.exists()) {
                try {
                    tempFile.createNewFile();
                    tempFile.deleteOnExit();
                    break;
                } catch (IOException e) {
                    // ignore
                }
            }
            
            Thread.sleep(sleep);
            slept++;
        }
        
        return tempFile.getAbsolutePath();
    }

    public static void unlockSemaphore(String semaphoreLock) throws Exception {
        
        if (null==semaphoreLock) {
            throw new NullArgumentException("semaphoreLock");
        }
        
        (new File(semaphoreLock)).delete();
    }
}