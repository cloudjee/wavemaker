/*
 *  Copyright (C) 2009-2011 WaveMaker Software, Inc.
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
package com.wavemaker.testsupport.ant;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;

import com.wavemaker.testsupport.UtilTest;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class UnlockSemaphoreAntTask extends Task {

    public void execute() throws BuildException {
        
        if (null==semaphoreReturn) {
            throw new BuildException("semaphoreReturn parameter must be set");
        }
        
        try {
            UtilTest.unlockSemaphore(semaphoreReturn);
            System.out.println("unlocked semaphore with key "+semaphoreReturn);
        } catch (Exception e) {
            throw new BuildException(e);
        }
    }
    


    // bean properties
    private String semaphoreReturn;
    
    public void setSemaphoreReturn(String semaphoreReturn) {
        this.semaphoreReturn = semaphoreReturn;
    }
    public String getSemaphoreReturn() {
        return semaphoreReturn;
    }
}