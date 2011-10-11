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

package com.wavemaker.runtime.data.salesforce;

import java.util.Map;

import org.apache.commons.logging.Log;
import org.hibernate.Session;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.runtime.data.DataServiceLoggers;
import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.Task;
import com.wavemaker.runtime.data.TaskManager;
import com.wavemaker.runtime.data.ThreadContext;
import com.wavemaker.runtime.data.task.DefaultRollback;
import com.wavemaker.runtime.ws.salesforce.SalesforceSupport;

/**
 * @author slee
 * 
 */
public class SalesforceDataServiceManager implements DataServiceManager {

    public static final Log txLogger = DataServiceLoggers.transactionLogger;

    private final PlatformTransactionManager txMgr;

    private final DataServiceMetaData metaData;

    public SalesforceDataServiceManager(PlatformTransactionManager txMgr, TaskManager taskMgr, Map<String, String> properties) {
        this.txMgr = txMgr;
        this.metaData = initMetaData(CommonConstants.SALESFORCE_SERVICE, properties);
    }

    @Override
    public void begin() {
    }

    @Override
    public void commit() {
    }

    @Override
    public void rollback() {
    }

    @Override
    public Session getSession() {
        return null;
    }

    @Override
    public DataServiceMetaData getMetaData() {
        return this.metaData;
    }

    @Override
    public void dispose() {
    }

    @Override
    public Object invoke(Task task, Object... input) {
        return null;
    }

    @Override
    public Object invoke(Task task, Map<String, Class<?>> types, boolean named, Object... input) {

        boolean unset = false;
        ThreadContext.Context ctx = ThreadContext.getContext(this.metaData.getName());
        if (ctx == null) {
            ctx = new ThreadContext.Context(this.txMgr, this.metaData, null, null);
            unset = true;
        }
        try {
            return runInTx(task, types, named, input);
        } finally {
            if (unset) {
                ThreadContext.unsetContext(this.metaData.getName());
            }
        }
    }

    private Object runInTx(Task task, Map<String, Class<?>> types, boolean named, Object... input) {
        TransactionTemplate txTemplate = new TransactionTemplate(this.txMgr);
        boolean rollbackOnly = task instanceof DefaultRollback && !isTxRunning();
        RunInTx tx = new RunInTx(rollbackOnly, types, named, input);
        if (txLogger.isInfoEnabled()) {
            if (isTxRunning()) {
                txLogger.info("tx is running executing \"" + task.getName() + "\" in current tx");
            } else {
                txLogger.info("no tx running, wrapping execution of \"" + task.getName() + "\" in tx");
                if (rollbackOnly) {
                    txLogger.info("rollback enabled for \"" + task.getName() + "\"");
                }
            }
        }

        Object rtn = txTemplate.execute(tx);
        if (txLogger.isInfoEnabled()) {
            if (isTxRunning()) {
                txLogger.info("tx is running after execution of \"" + task.getName() + "\"");
            } else {
                txLogger.info("tx is not running after execution of \"" + task.getName() + "\"");
            }
        }

        return rtn;
    }

    private class RunInTx implements TransactionCallback {

        private final boolean rollbackOnly;

        private final Map<String, Class<?>> types;

        private final boolean named;

        private final Object[] input;

        RunInTx(boolean rollbackOnly, Map<String, Class<?>> types, boolean named, Object... input) {
            this.rollbackOnly = rollbackOnly;
            this.types = types;
            this.named = named;
            this.input = input;
        }

        @Override
        public Object doInTransaction(TransactionStatus status) {
            if (this.rollbackOnly) {
                status.setRollbackOnly();
            }
            Object rtn;

            SalesforceSupport sfs = new SalesforceSupport();
            if (this.named) {
                rtn = sfs.runNamedQuery(this.types, this.input);
            } else {
                rtn = sfs.runQuery(this.types, this.input);
            }

            return rtn;
        }
    }

    private boolean isTxRunning() {
        ThreadContext.Context ctx = ThreadContext.getContext(this.metaData.getName());
        if (ctx == null) {
            return false;
        }
        return ctx.getTransactionStatus() != null;
    }

    private static DataServiceMetaData initMetaData(String configurationName, final Map<String, String> properties) {
        final DataServiceMetaData rtn = new DataServiceMetaData_SF(configurationName, properties);

        rtn.init(configurationName);

        return rtn;
    }

}
