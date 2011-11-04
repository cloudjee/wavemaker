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

package com.wavemaker.tools.data.spring;

import java.util.Map;

import org.hibernate.Session;
import org.springframework.context.support.GenericApplicationContext;

import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.Task;

/**
 * @author Simon Toens
 */
public class SpringDataServiceManagerWrapper implements DataServiceManager {

    private final DataServiceManager delegate;

    private final GenericApplicationContext ctx;

    public SpringDataServiceManagerWrapper(DataServiceManager delegate, GenericApplicationContext ctx) {
        this.delegate = delegate;
        this.ctx = ctx;
    }

    @Override
    public void begin() {
        this.delegate.begin();
    }

    @Override
    public void commit() {
        this.delegate.commit();
    }

    @Override
    public void dispose() {
        try {
            this.delegate.dispose();
        } finally {
            this.ctx.close();
        }
    }

    @Override
    public DataServiceMetaData getMetaData() {
        return this.delegate.getMetaData();
    }

    @Override
    public Session getSession() {
        return this.delegate.getSession();
    }

    @Override
    public Object invoke(Task task, Object... input) {
        return this.delegate.invoke(task, input);
    }

    @Override
    public Object invoke(Task task, Map<String, Class<?>> types, boolean named, Object... input) {
        return this.delegate.invoke(task, types, named, input); // salesforce
    }

    @Override
    public void rollback() {
        this.delegate.rollback();
    }
}
