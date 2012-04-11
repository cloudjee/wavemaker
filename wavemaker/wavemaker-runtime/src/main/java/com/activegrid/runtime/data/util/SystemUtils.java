/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.activegrid.runtime.data.util;

import java.util.List;

import org.hibernate.Session;

import com.activegrid.runtime.data.DataServiceManager;
import com.activegrid.runtime.data.DataServiceManagerAccess;
import com.activegrid.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.server.InternalRuntime;

/**
 * Published utility methods.
 * 
 * @author Simon Toens
 * @deprecated This is now deprecated; see {@link com.wavemaker.runtime.data.util.SystemUtils}. This will be removed in
 *             a future release.
 */
@Deprecated
public class SystemUtils {

    private SystemUtils() {
        throw new UnsupportedOperationException();
    }

    public static Object clientPrepare(Object o) {
        return clientPrepare(o, null);
    }

    public static Object clientPrepare(Object o, DataServiceManagerAccess mgrAccess) {

        registerPropertyFilter();

        return o;
    }

    public static void registerPropertyFilter() {

        com.wavemaker.runtime.data.util.SystemUtils.registerPropertyFilter();
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
}
