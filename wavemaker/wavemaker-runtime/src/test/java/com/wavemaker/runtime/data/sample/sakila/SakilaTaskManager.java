/*
 *  Copyright (C) 2009 WaveMaker Software, Inc.
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

package com.wavemaker.runtime.data.sample.sakila;

import java.util.Date;

import org.hibernate.Session;

import com.wavemaker.common.util.ObjectAccess;
import com.wavemaker.runtime.data.DefaultTaskManager;
import com.wavemaker.runtime.data.Task;
import com.wavemaker.runtime.data.TaskManager;
import com.wavemaker.runtime.data.task.InsertTask;
import com.wavemaker.runtime.data.task.UpdateTask;

public class SakilaTaskManager extends DefaultTaskManager implements TaskManager {

    private final ObjectAccess objectInvoker = ObjectAccess.getInstance();

    private final Task insertTask = new InsertTask() {

        @Override
        public Object run(Session session, String dbName, Object... input) {

            maybeSetLastUpdate(input[0]);

            return super.run(session, dbName, input);
        }
    };

    private final Task updateTask = new UpdateTask() {

        @Override
        public Object run(Session session, String dbName, Object... input) {

            maybeSetLastUpdate(input[0]);

            return super.run(session, dbName, input);
        }
    };

    @Override
    public Task getInsertTask() {
        return this.insertTask;
    }

    @Override
    public Task getUpdateTask() {
        return this.updateTask;
    }

    private void maybeSetLastUpdate(Object o) {

        if (!this.objectInvoker.hasProperty(o.getClass(), "lastUpdate")) {
            return;
        }

        Date lastUpdate = this.objectInvoker.getProperty(o, "lastUpdate");

        if (lastUpdate == null) {
            this.objectInvoker.setProperty(o, "lastUpdate", new Date());
        }

    }

}
