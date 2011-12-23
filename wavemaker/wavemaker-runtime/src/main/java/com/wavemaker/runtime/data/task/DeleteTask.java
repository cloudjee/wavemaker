/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

public class DeleteTask extends BaseTask {

    @Override
    public Object run(Session session, String dbName, Object... input) {

        if (ObjectUtils.isNullOrEmpty(input)) {
            throw new IllegalArgumentException("Need instance to delete");
        }

        for (int i = 0; i < input.length; i++) {

            Object o = loadIntoSession(input[i], session, dbName);

            if (o != null) {
                session.delete(o);
            }
        }

        return null;

    }

    @Override
    public String getName() {
        return "Build-in Delete Task";
    }

}
