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

package com.wavemaker.runtime.data.util;

import java.util.List;

import org.hibernate.Session;

import com.wavemaker.runtime.data.DataPropertyFilter;
import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.DataServiceManagerAccess;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.server.InternalRuntime;

/**
 * Published utility methods.
 * 
 * @author Simon Toens
 */
public abstract class SystemUtils {

    private SystemUtils() {
    }

    public static void clientPrepare() {
        registerPropertyFilter();
    }

    public static Object serverMergeForUpdate(Object o, DataServiceManagerAccess mgrAccess) {
        DataServiceManager mgr = mgrAccess.getDataServiceManager();
        return serverMergeForUpdate(o, mgr.getSession(), mgr.getMetaData());
    }

    public static Object serverMergeForUpdate(Object o, Session session, DataServiceMetaData metaData) {
        if (o == null) {
            return null;
        }

        InternalRuntime internalRuntime = InternalRuntime.getInstance();
        List<List<String>> args = internalRuntime.getDeserializedProperties();
        if (args.isEmpty()) {
            return o;
        }

        List<String> populatedProperties = args.get(0); // hardcoded first arg?
        return DataServiceUtils.mergeForUpdate(o, session, metaData, populatedProperties);
    }

    public static Object serverMergeForInsert(Object o, Session session, DataServiceMetaData metaData) {
        return DataServiceUtils.mergeForInsert(o, session, metaData);
    }

    // does this need to be public?
    public static void registerPropertyFilter() {
        InternalRuntime internalRuntime = InternalRuntime.getInstance();
        internalRuntime.getJSONState().setPropertyFilter(DataPropertyFilter.getInstance());
    }

    /**
     * @deprecated
     */
    @Deprecated
    public static Object clientPrepare(Object o) {
        registerPropertyFilter();
        return o;
    }

    /**
     * @deprecated
     */
    @Deprecated
    public static Object clientPrepare(Object o, DataServiceManagerAccess mgrAccess) {
        registerPropertyFilter();
        return o;
    }
}
