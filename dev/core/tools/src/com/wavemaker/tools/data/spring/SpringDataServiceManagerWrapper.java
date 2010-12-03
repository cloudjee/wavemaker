/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.data.spring;

import org.hibernate.Session;
import org.springframework.context.support.GenericApplicationContext;

import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.Task;

import java.util.Map;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class SpringDataServiceManagerWrapper implements DataServiceManager {

    private final DataServiceManager delegate;
    private final GenericApplicationContext ctx;

    public SpringDataServiceManagerWrapper(DataServiceManager delegate,
            GenericApplicationContext ctx) {
        this.delegate = delegate;
        this.ctx = ctx;
    }

    public void begin() {
        delegate.begin();
    }

    public void commit() {
        delegate.commit();
    }

    public void dispose() {
        try {
            delegate.dispose();
        } finally {
            ctx.close();
        }
    }

    public DataServiceMetaData getMetaData() {
        return delegate.getMetaData();
    }

    public Session getSession() {
        return delegate.getSession();
    }

    public Object invoke(Task task, Object... input) {
        return delegate.invoke(task, (Object[])input);
    }

    public Object invoke(Task task, Map<String, Class<?>> types, boolean named, Object... input) {
        return delegate.invoke(task, types, named, (Object[])input); //xxx0909
    }

    public void rollback() {
        delegate.rollback();
    }
}
