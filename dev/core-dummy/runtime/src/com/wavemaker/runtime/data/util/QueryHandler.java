/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.util.List;
import org.hibernate.cfg.Configuration;

/**
 * A dummy class for QueryHandler
 *
 * @author S Lee
 *
 */

public class QueryHandler implements InvocationHandler {
    public QueryHandler(Configuration cfg) {
        System.out.println("\n*** Multi-Tenant feature is not avaliable in this package ***\n");
    }

    public QueryHandler (Object target, Configuration cfg) {
        System.out.println("\n*** Multi-Tenant feature is not avaliable in this package ***\n");
    }

    public Object invoke(Object proxy, Method m, Object[] args) throws Throwable {
        System.out.println("\n*** Multi-Tenant feature is not avaliable in this package ***\n");
        return null;
    }

    public String modifySQL (Object o, String fieldName, int tid) {
        System.out.println("\n*** Multi-Tenant feature is not avaliable in this package ***\n");
        return null;
    }

    public static List<String> parseSQL(String qryStr) { //xxx
        System.out.println("\n*** Multi-Tenant feature is not avaliable in this package ***\n");
        return null;
    }

    public static boolean isDelimiter(String val) { //xxx
        System.out.println("\n*** Multi-Tenant feature is not avaliable in this package ***\n");
        return false;
    }

    class SingleQuery {
    }
}
