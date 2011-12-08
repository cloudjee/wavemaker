/*
 *  Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.testsupport.ant;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.taskdefs.Property;

import com.wavemaker.testsupport.UtilTest;

/**
 * @author Matt Small
 */
public class LockSemaphoreAntTask extends Task {

    @Override
    public void execute() throws BuildException {

        if (null == this.semaphoreName) {
            throw new BuildException("semaphoreName parameter must be set");
        } else if (null == this.propName) {
            throw new BuildException("propName parameter must be set");
        }

        try {
            String s = UtilTest.lockSemaphore(this.semaphoreName, this.iterations, this.sleepTime);
            System.out.println("locked semaphore " + this.semaphoreName);

            Property pTask = new Property();
            pTask.setProject(getProject());
            pTask.setName(this.propName);
            pTask.setValue(s);
            pTask.execute();
        } catch (Exception e) {
            throw new BuildException(e);
        }
    }

    // bean properties
    private String semaphoreName;

    private String propName;

    private int iterations = 50;

    private int sleepTime = 50;

    public void setSemaphoreName(String s) {
        this.semaphoreName = s;
    }

    public String getSemaphoreName() {
        return this.semaphoreName;
    }

    public void setPropName(String propName) {
        this.propName = propName;
    }

    public String getPropName() {
        return this.propName;
    }

    public int getIterations() {
        return this.iterations;
    }

    public void setIterations(int iterations) {
        this.iterations = iterations;
    }

    public int getSleepTime() {
        return this.sleepTime;
    }

    public void setSleepTime(int sleepTime) {
        this.sleepTime = sleepTime;
    }
}