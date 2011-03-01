/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.data;

import com.wavemaker.runtime.data.task.CheckQueryTask;
import com.wavemaker.runtime.data.task.CountTask;
import com.wavemaker.runtime.data.task.DeleteTask;
import com.wavemaker.runtime.data.task.GetSessionTask;
import com.wavemaker.runtime.data.task.HQLReadTask;
import com.wavemaker.runtime.data.task.InsertTask;
import com.wavemaker.runtime.data.task.MergeForInsertTask;
import com.wavemaker.runtime.data.task.MergeForUpdateTask;
import com.wavemaker.runtime.data.task.NamedQueryTask;
import com.wavemaker.runtime.data.task.PreProcessorRouterTask;
import com.wavemaker.runtime.data.task.QueryTask;
import com.wavemaker.runtime.data.task.SearchTask;
import com.wavemaker.runtime.data.task.UpdateTask;

/**
 * Various default task implementations.
 * 
 * @author Simon Toens
 */
public class DefaultTaskManager implements TaskManager {

    public static final String GET_READ_TASK = "getReadTask";
    private static final Task READ_TASK = new HQLReadTask();

    public static final String GET_QUERY_TASK = "getQueryTask";
    private static final Task NAMED_QUERY = new NamedQueryTask();

    public static final String GET_INSERT_TASK = "getInsertTask";
    private static final Task INSERT = new InsertTask();

    public static final String GET_DELETE_TASK = "getDeleteTask";
    private static final Task DELETE = new DeleteTask();

    public static final String GET_UPDATE_TASK = "getUpdateTask";
    private static final Task UPDATE = new UpdateTask();

    public static final String GET_SEARCH_TASK = "getSearchTask";
    private static final Task SEARCH = new SearchTask();

    public static final String GET_COUNT_TASK = "getCountTask";
    private static final Task COUNT = new CountTask();

    public static final String GET_SESSION_TASK = "getSessionTask";
    private static final Task SESSION = new GetSessionTask();

    private static final Task RUN_QUERY_TASK = new QueryTask();
    private static final Task CHECK_QUERY_TASK = new CheckQueryTask();

    private static final Task MERGE_FOR_UPDATE_TASK = new MergeForUpdateTask();
    private static final Task MERGE_FOR_INSERT_TASK = new MergeForInsertTask();
    private static final Task PRE_PROCESSOR_TASK = new PreProcessorRouterTask();

    // need to investigate why this static initializer doesn't run in tests
    // workaround with synchronized method below
    // private final static DefaultTaskManager instance =
    // new DefaultTaskManager();
    private static DefaultTaskManager instance = null;

    public synchronized static DefaultTaskManager getInstance() {
        if (instance == null) {
            instance = new DefaultTaskManager();
        }
        return instance;
    }

    public DefaultTaskManager() {}

    public Task getQueryTask() {
        return NAMED_QUERY;
    }

    public Task getInsertTask() {
        return INSERT;
    }

    public Task getDeleteTask() {
        return DELETE;
    }

    public Task getUpdateTask() {
        return UPDATE;
    }

    public Task getSearchTask() {
        return SEARCH;
    }

    public Task getCountTask() {
        return COUNT;
    }

    public Task getSessionTask() {
        return SESSION;
    }

    public Task getRunQueryTask() {
        return RUN_QUERY_TASK;
    }

    public Task getCheckQueryTask() {
        return CHECK_QUERY_TASK;
    }

    public Task getReadTask() {
        return READ_TASK;
    }

    public Task getMergeForInsertTask() {
        return MERGE_FOR_INSERT_TASK;
    }

    public Task getMergeForUpdateTask() {
        return MERGE_FOR_UPDATE_TASK;
    }

    public Task getPreProcessorRouterTask() {
        return PRE_PROCESSOR_TASK;
    }

}
