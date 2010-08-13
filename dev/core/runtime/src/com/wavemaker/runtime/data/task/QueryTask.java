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
package com.wavemaker.runtime.data.task;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.hibernate.Query;
import org.hibernate.Session;

import com.wavemaker.runtime.data.Task;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.service.PagingOptions;

/**
 * Runs a query.
 * 
 * @author Simon Toens
 */
public class QueryTask extends AbstractReadTask implements Task {

    
    /**
     * First element in input array is the query.
     */
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

        Map<String, BindParameter> bindParams = handleBindParameters(input);

        Query query = createQuery(session, input);

        prepareQuery(query, bindParams, pagingOptions);

        return runQuery(query);
    }

    protected Map<String, BindParameter> handleBindParameters(Object... input) {
        
        Map<String, BindParameter> rtn = new HashMap<String, BindParameter>();
        
        if (input.length > 1) {
            for (int i = 1; i < input.length; i += 2) {
                String name = (String)input[i];
                rtn.put(name, new BindParameter(name, input[i+1]));
            }
        }
        
        return rtn;
    }

    protected Query createQuery(Session session, Object... input) {

        return session.createQuery((String) input[0]);
    }

    protected Object runQuery(Query query) {
        
        if (DataServiceUtils.isDML(query.getQueryString())) {

            return query.executeUpdate();
        }

        return query.list();
    }

    @SuppressWarnings("unchecked")
    protected void prepareQuery(Query query, Map<String, 
				BindParameter> bindParams, 
				PagingOptions pagingOptions) {

        for (Map.Entry<String, BindParameter> e : bindParams.entrySet()) {

            String name = e.getKey();
            Object value = e.getValue().value;

            if (value != null && 
                Collection.class.isAssignableFrom(value.getClass())) {
                query.setParameterList(name, (Collection<Object>)value);
            } else {
                query.setParameter(name, value);
            }
        }
        
        applyPaging(pagingOptions, query);

    }

    public String getName() {
        return "Built-in Query Task";
    }

    class BindParameter {

        final String name;

        final String type;

        final Object value;

        BindParameter(String name, Object value) {
            this(name, null, value);
        }

        BindParameter(String name, String type, Object value) {
            this.name = name;
            this.type = type;
            this.value = value;
        }
    }
}
