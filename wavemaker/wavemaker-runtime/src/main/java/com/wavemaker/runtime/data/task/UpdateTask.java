/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.data.Task;

/**
 * @author Simon Toens
 */
public class UpdateTask extends BaseTask implements PreProcessor, Task {

    /**
     * Update each object in input. This is a noop when invoked directly from the client - all work is done in the
     * PreProcessor task.
     */
    @Override
    public Object run(Session session, String dbName, Object... input) {

        if (ObjectUtils.isNullOrEmpty(input)) {
            throw new IllegalArgumentException("Need a least one instance to update");
        }

        Object o = input[0];

        WMAppContext wmApp = WMAppContext.getInstance();
        if (wmApp != null && wmApp.isMultiTenant()) {
            Object rtn = loadIntoSession(o, session, dbName);

            if (rtn != null) {
                // session.update(o);
                if (!session.contains(o)) {
                    session.update(o);
                }
            }
        } else {
            if (!session.contains(o)) {
                session.update(o);
            }
        }

        maybeRefreshEntity(o, session, dbName);

        return o;
    }

    @Override
    public String getName() {
        return "Built-in Update Task";
    }

}
