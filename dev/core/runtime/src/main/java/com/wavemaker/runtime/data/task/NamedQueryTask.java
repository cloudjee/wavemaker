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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.engine.NamedQueryDefinition;
import org.hibernate.engine.NamedSQLQueryDefinition;
import org.hibernate.type.Type;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.util.CastUtils;
import com.wavemaker.common.util.ObjectAccess;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.runtime.data.DataServiceLoggers;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.DataServiceRuntimeException;
import com.wavemaker.runtime.data.Task;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.service.PagingOptions;

/**
 * Looks up a query by name, and runs it.
 * 
 * @author Simon Toens
 */
public class NamedQueryTask extends BaseTask implements Task {

    private final Log logger = DataServiceLoggers.taskLogger;

    /**
     * First element in input array is the query name
     */
    @Override
    public Object run(Session session, String dbName, Object... input) {
        
        PagingOptions pagingOptions = null;

        if (input.length > 0) {
            Object o = input[input.length - 1];
            if (o instanceof PagingOptions) {
                pagingOptions = (PagingOptions)o;
                Object[] ar = new Object[input.length - 1];
                System.arraycopy(input, 0, ar, 0, ar.length);
                input = ar;
            }
        }

        DataServiceMetaData meta = getMetaData(dbName);

        String queryName = (String) input[0];

        Object bindParamValues[] = new Object[input.length - 1];

        System.arraycopy(input, 1, bindParamValues, 0, bindParamValues.length);

        Query query = session.getNamedQuery(queryName);

        String queryString = query.getQueryString();

        handleBindParams(query, queryName, bindParamValues, meta);

        Object rtn = null;

        if (DataServiceUtils.isDML(queryString)) {
            ArrayList<Object> l = new ArrayList<Object>(1);
            l.add(query.executeUpdate());
            rtn = l;
        } else {

            AbstractReadTask.applyPaging(pagingOptions, query);
            rtn = query.list();

            NamedQueryDefinition def = meta.getQueryDefinition(queryName);
            boolean supportsReturnType = !(def instanceof NamedSQLQueryDefinition);

            if (supportsReturnType && DataServiceUtils.requiresResultWrapper(queryString)
                && !DataServiceUtils.isDynamicInstantiationQuery(queryString)) {
                rtn = marshalIntoCustomType(queryName, meta, query, rtn);
            }
        }

        if (this.logger.isDebugEnabled()) {
            this.logger.debug("rtn for query \"" + queryName + "\": " + rtn);
        }

        return rtn;
    }

    @Override
    public String getName() {
        return "Built-in Named Query Task";
    }

    @SuppressWarnings("unchecked")
    private void handleBindParams(Query query, String queryName, Object[] paramValues, DataServiceMetaData meta) {

        NamedQueryDefinition def = meta.getQueryDefinition(queryName);

        Map<String, String> m = CastUtils.cast(def.getParameterTypes());

        String paramNames[] = new String[m.size()];
        String paramTypes[] = new String[m.size()];

        int i = 0;
        for (Map.Entry<String, String> e : m.entrySet()) {
            paramNames[i] = e.getKey();
            paramTypes[i] = e.getValue();
            i++;
        }

        if (paramTypes.length == 0) {
            if (paramValues.length > 0) {
                logExtraParam(queryName, paramValues);
            }
        } else {
            if (paramValues.length == 0) {
                throw new DataServiceRuntimeException(MessageResource.QUERY_REQUIRES_PARAMS, queryName, ObjectUtils.toString(paramTypes));
            }

            // REVIEW 09-Sep-07 stoens@activegrid.com --
            // verify handling of datetime types here
            for (int j = 0; j < paramValues.length; j++) {
                String name = paramNames[j];
                Object value = paramValues[j];
                if (value != null && Collection.class.isAssignableFrom(value.getClass())) {
                    query.setParameterList(name, (Collection) value);
                } else {
                    query.setParameter(name, value);
                }
            }
        }
    }

    private void logExtraParam(String queryName, Object[] bindParams) {
        if (this.logger.isWarnEnabled()) {
            String val = ObjectUtils.toString(bindParams);
            this.logger.warn(MessageResource.QUERY_NO_PARMS.getMessage(queryName, val));
            if (bindParams.length == 1 && bindParams[0] == null && this.logger.isDebugEnabled()) {
                this.logger.debug(queryName + " invoked with input (Object)null " + "instead of (Object[])null?");
            }
        }
    }

    private Object marshalIntoCustomType(String queryName, DataServiceMetaData meta, Query query, Object rtn) {

        Type[] types = query.getReturnTypes();
        String[] returnAliases = query.getReturnAliases();

        if (returnAliases == null) {
            returnAliases = new String[] {};
        }

        List<String> propertyNames = DataServiceUtils.getColumnNames(types.length, Arrays.asList(returnAliases));

        @SuppressWarnings("unchecked")
        List<Object> rows = (List<Object>) rtn;

        List<Object> newRtn = new ArrayList<Object>(rows.size());

        ObjectAccess oa = getObjectAccess();

        for (Object o : rows) {
            Object bean = instantiateOutputType(meta.getDataPackage(), queryName);
            newRtn.add(bean);
            if (o instanceof Object[]) {
                Object[] row = (Object[]) o;
                if (row.length != propertyNames.size()) {
                    throw new AssertionError("Number of columns doesn't match");
                }
                int i = 0;
                for (Object col : row) {
                    oa.setProperty(bean, propertyNames.get(i++), col);
                }
            } else {
                if (propertyNames.size() != 1) {
                    throw new AssertionError("Expected single column");
                }
                oa.setProperty(bean, propertyNames.get(0), o);
            }
        }

        return newRtn;

    }

    private Object instantiateOutputType(String dataPackage, String queryName) {
        try {
            return getObjectAccess().newInstance(DataServiceUtils.getOutputType(dataPackage, queryName));
        } catch (RuntimeException ex) {
            try {
                return getObjectAccess().newInstance(DataServiceUtils.getOldOutputType(dataPackage, queryName));
            } catch (RuntimeException ex2) {
                throw ex;
            }
        }
    }
}
