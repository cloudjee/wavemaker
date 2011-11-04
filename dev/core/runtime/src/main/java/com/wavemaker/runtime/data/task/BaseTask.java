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

package com.wavemaker.runtime.data.task;

import org.apache.commons.logging.Log;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import com.wavemaker.common.util.ObjectAccess;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.runtime.data.DataServiceLoggers;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.Task;
import com.wavemaker.runtime.data.ThreadContext;
import com.wavemaker.runtime.data.util.DataServiceUtils;

/**
 * @author Simon Toens
 */
public abstract class BaseTask implements Task {

    private final Log logger = DataServiceLoggers.taskLogger;

    private final ObjectAccess objectAccess = ObjectAccess.getInstance();

    protected ObjectAccess getObjectAccess() {
        return this.objectAccess;
    }

    protected static DataServiceMetaData getMetaData(String dbName) {
        ThreadContext.Context ctx = ThreadContext.getContext(dbName);
        return ctx.getMetaData();
    }

    protected static SessionFactory getSessionFactory(String dbName) {
        ThreadContext.Context ctx = ThreadContext.getContext(dbName);
        return ctx.getSessionFactory();
    }

    protected static Configuration getConfiguration(String dbName) {
        ThreadContext.Context ctx = ThreadContext.getContext(dbName);
        return ctx.getConfiguration();
    }

    protected boolean isRelatedMany(Class<?> c) {
        return DataServiceUtils.isRelatedMany(c);
    }

    protected Object loadById(Object o, Session session, String dbName) {
        return DataServiceUtils.loadById(o, session, getMetaData(dbName), this.logger);
    }

    protected Object loadIntoSession(Object o, Session session, String dbname) {
        Object rtn = loadById(o, session, dbname);

        if (rtn == null) {
            if (DataServiceLoggers.taskLogger.isInfoEnabled()) {
                DataServiceLoggers.taskLogger.info("Skipping instance " + ObjectUtils.getId(o) + " because it is transient");
            }
        }

        return rtn;
    }

    protected Object emptyInstanceWithId(Object o, DataServiceMetaData metaData) {
        String s = metaData.getIdPropertyName(o.getClass());
        Object id = getObjectAccess().getProperty(o, s);
        Object rtn = this.objectAccess.newInstance(getEntityClass(o));
        this.objectAccess.setProperty(rtn, s, id);
        return rtn;
    }

    protected Class<?> getEntityClass(Object entityInstance) {
        return DataServiceUtils.getEntityClass(entityInstance.getClass());
    }

    protected void maybeRefreshEntity(Object o, Session session, String dbName) {
        if (getMetaData(dbName).refreshEntity(o.getClass())) {
            session.flush();
            session.refresh(o);
        }
    }
}
