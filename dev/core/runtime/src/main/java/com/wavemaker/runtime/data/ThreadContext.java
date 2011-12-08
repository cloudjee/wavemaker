/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.data;

import java.util.HashMap;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;

/**
 * @author Simon Toens
 */
public class ThreadContext {

    private static ThreadLocal<Task> preProcessorTask = new ThreadLocal<Task>();

    private static ThreadLocal<HashMap<String, Context>> threadLocal = new ThreadLocal<HashMap<String, Context>>();

    private ThreadContext() {
    }

    public static Task getPreProcessorTask() {
        return preProcessorTask.get();
    }

    public static void setPreProcessorTask(Task task) {
        preProcessorTask.set(task);
    }

    public static void unsetPreProcessorTask() {
        preProcessorTask.set(null);
    }

    public static Context getContext(String dbName) {
        HashMap<String, Context> contextHash = getThreadLocalHash();
        if (contextHash == null || contextHash.size() == 0) {
            return null;
        }
        return contextHash.get(dbName);
    }

    public static void unsetContext(String dbName) {
        HashMap<String, Context> contextHash = threadLocal.get();
        contextHash.remove(dbName);
        threadLocal.set(contextHash);
    }

    public static HashMap<String, Context> getThreadLocalHash() {
        return threadLocal.get();
    }

    public static class Context {

        private final PlatformTransactionManager txMgr;

        private final DataServiceMetaData metaData;

        private final SessionFactory fac;

        private final Configuration cfg;

        private TransactionStatus txStatus = null;

        public Context(PlatformTransactionManager txMgr, DataServiceMetaData metaData, Configuration cfg, SessionFactory fac) {
            this.txMgr = txMgr;
            this.metaData = metaData;
            this.cfg = cfg;
            this.fac = fac;

            HashMap<String, Context> contextHash = threadLocal.get();
            if (contextHash == null) {
                contextHash = new HashMap<String, Context>();
            }

            contextHash.put(metaData.getName(), this);
            threadLocal.set(contextHash);
        }

        public PlatformTransactionManager getTransactionManager() {
            return this.txMgr;
        }

        public DataServiceMetaData getMetaData() {
            return this.metaData;
        }

        public Configuration getConfiguration() {
            return this.cfg;
        }

        public void setTransactionStatus(TransactionStatus txStatus) {
            this.txStatus = txStatus;
        }

        public TransactionStatus getTransactionStatus() {
            return this.txStatus;
        }

        public SessionFactory getSessionFactory() {
            return this.fac;
        }
    }
}
