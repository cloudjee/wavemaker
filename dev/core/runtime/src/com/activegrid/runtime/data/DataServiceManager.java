/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
package com.activegrid.runtime.data;

import org.hibernate.Session;

/**
 * Entry point of Data Service API.
 * 
 * Every service that is a "Data Service" has one associated DataServiceManager
 * instance.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 * @deprecated This is now deprecated; see
 *             {@link com.wavemaker.runtime.data.DataServiceManager}. This will
 *             be removed in a future release.
 */
@Deprecated
public interface DataServiceManager {

    /**
     * Start a transaction, ignored if a tx is already running.
     */
    void begin();

    /**
     * Commit the current transaction, if one is in progress.
     */
    void commit();

    /**
     * Rollback the current transaction, if one is in progress.
     */
    void rollback();

    /**
     * Run a Task instance within a Transaction.
     * 
     * @param task The task to run
     * @param input Generic input the task may use
     * @return Return value, may be null
     */
    Object invoke(Task task, Object... input);

    /**
     * @return The Hibernate Session.
     */
    Session getSession();
    

    DataServiceMetaData getMetaData();
    
    void dispose();
}
