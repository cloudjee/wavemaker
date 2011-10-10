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

package com.wavemaker.runtime.data.task;

import org.hibernate.Session;

import com.wavemaker.runtime.data.DefaultTaskManager;
import com.wavemaker.runtime.data.Task;
import com.wavemaker.runtime.data.TaskManager;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class PreProcessorRouterTask extends BaseTask implements Task {

    private static final DefaultTaskManager dfltTaskMgr = DefaultTaskManager.getInstance();

    public Object run(Session session, String dbName, Object... input) {

        if (input.length != 3) {
            throw new IllegalArgumentException("Expected input of length 3");
        }

        if (!(input[0] instanceof Object[])) {
            throw new IllegalArgumentException("Expected input[0] to be an Object array");
        }

        if (!(input[1] instanceof Task)) {
            throw new IllegalArgumentException("Expected input[1] to be a Task");
        }

        if (!(input[2] instanceof TaskManager)) {
            throw new IllegalArgumentException("Expected input[2] to be a TaskManager");
        }

        Object[] args = (Object[]) input[0];

        Task taskToRun = (Task) input[1];

        TaskManager taskMgr = (TaskManager) input[2];

        if (taskToRun == taskMgr.getInsertTask()) {
            return dfltTaskMgr.getMergeForInsertTask().run(session, dbName, args);
        } else if (taskToRun == taskMgr.getUpdateTask()) {
            return dfltTaskMgr.getMergeForUpdateTask().run(session, dbName, args);
        } else {
            return args;
        }
    }

    public String getName() {
        return "Built-in PreProcessor Router Task";
    }

}
