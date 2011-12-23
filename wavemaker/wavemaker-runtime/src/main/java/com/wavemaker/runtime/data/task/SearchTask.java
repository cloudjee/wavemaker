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

package com.wavemaker.runtime.data.task;

import java.util.Collection;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Example;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;

import com.wavemaker.common.util.ImmutableEntryMap;
import com.wavemaker.common.util.ObjectAccess;
import com.wavemaker.common.util.ObjectGraphTraversal;
import com.wavemaker.common.util.ObjectGraphTraversal.Context;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.runtime.data.DataServiceLoggers;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.QueryOptions;
import com.wavemaker.runtime.data.Task;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.runtime.service.ServiceConstants;

/**
 * @author Simon Toens
 */
public class SearchTask extends AbstractReadTask implements Task, DefaultRollback {

    private static final QueryOptions DEFAULT_QUERY_OPTIONS = new QueryOptions();

    @Override
    public Object run(Session session, String dbName, Object... input) {

        if (input == null || input.length == 0) {
            throw new IllegalArgumentException("Need search instance or class");
        }

        QueryOptions options = getQueryOptions(input);

        Criteria criteria = getCritieria(session, input[0], options, dbName);

        applyPaging(options, criteria);

        return criteria.list();
    }

    protected boolean addOrder() {
        return true;
    }

    protected QueryOptions getQueryOptions(Object[] input) {

        QueryOptions rtn = DEFAULT_QUERY_OPTIONS;

        if (input.length > 1) {
            if (input[1] == null) {
                return new QueryOptions();
            }
            if (input[1] instanceof PagingOptions) {
                if (input[1] instanceof QueryOptions) {
                    rtn = (QueryOptions) input[1];
                } else {
                    PagingOptions po = (PagingOptions) input[1];
                    rtn = new QueryOptions(po);
                }
            } else {
                throw new IllegalArgumentException("Second input argument must be a " + PagingOptions.class.getName() + " or "
                    + QueryOptions.class.getName() + " instance");
            }
        }
        return rtn;
    }

    // Traverse object graph
    // Store all Criteria instances, using properties as key
    // Go over order by, use stored Criteria instances, create new one only if
    // necessary
    protected Criteria getCritieria(Session session, Object rootSearchObject, final QueryOptions options, String dbName) {

        final DataServiceMetaData metaData = getMetaData(dbName);

        Criteria rootCriteria = null;

        final Map<String, Criteria> criterias = new ImmutableEntryMap<String, Criteria>();

        if (rootSearchObject instanceof Class) {
            rootCriteria = initCriteriasMap(criterias, (Class<?>) rootSearchObject, session);
        } else {

            rootCriteria = initCriteriasMap(criterias, rootSearchObject.getClass(), session);

            addExample(rootSearchObject, rootCriteria, options);

            handleIdInSearch(rootSearchObject, rootCriteria, options, metaData);

            ObjectGraphTraversal.ObjectVisitor ov = new ObjectGraphTraversal.ObjectVisitor() {

                @Override
                public void cycle(Object o, Context ctx) {
                }

                @Override
                public void visit(Object queryInstance, Context ctx) {

                    String propertyName = ctx.getProperties().get(0);

                    if (DataServiceLoggers.taskLogger.isDebugEnabled()) {
                        DataServiceLoggers.taskLogger.debug("Adding criteria on property " + propertyName);
                    }

                    Criteria parentCriteria = (Criteria) ctx.getValues().get(1);

                    if (DataServiceLoggers.taskLogger.isDebugEnabled()) {
                        DataServiceLoggers.taskLogger.debug("Parent criteria is " + parentCriteria);
                    }

                    Criteria c = parentCriteria.createCriteria(propertyName);

                    String k = ObjectUtils.toString(ctx.getProperties(), ServiceConstants.PROPERTY_SEP);

                    criterias.put(k, c);

                    ctx.getValues().set(0, c);

                    addExample(queryInstance, c, options);
                    handleIdInSearch(queryInstance, c, options, metaData);
                }
            };

            ObjectGraphTraversal tr = DataServiceUtils.getRelatedTraversal(ov, getObjectAccess(), metaData, false);

            tr.traverse(rootSearchObject, rootCriteria);
        }

        if (addOrder()) {
            applyOrderBy(options, criterias);
        }

        for (String s : options.getSqlRestrictions()) {
            rootCriteria.add(Restrictions.sqlRestriction(s));
        }

        return rootCriteria;
    }

    @Override
    public String getName() {
        return "Built-in Query By Example Task";
    }

    // this is here because Hibernate's QBE skips over id properties
    // http://opensource.atlassian.com/projects/hibernate/browse/HB-1437
    private void handleIdInSearch(Object o, Criteria c, QueryOptions options, DataServiceMetaData metaData) {

        String idPropName = metaData.getIdPropertyName(o.getClass());

        ObjectAccess oa = getObjectAccess();

        Object value = oa.getProperty(o, idPropName);

        if (value == null && options.getExcludeNone()) {
            return;
        }

        if (metaData.isCompositeProperty(o.getClass(), idPropName)) {
            if (value != null) {
                Collection<String> propNames = oa.getPropertyNames(value.getClass());
                for (String p : propNames) {
                    String compPropName = idPropName + DataServiceConstants.PROP_SEP + p;
                    Object pv = getObjectAccess().getProperty(value, p);
                    addRestriction(c, compPropName, pv, options);
                }
            }
        } else {
            addRestriction(c, idPropName, value, options);
        }
    }

    private static void addRestriction(Criteria c, String propName, Object value, QueryOptions options) {

        if (value == null && options.getExcludeNone()) {
            return;
        }

        if (String.class.isAssignableFrom(value.getClass())) {

            MatchMode matchMode = options.getTypedMatchMode();

            if (options.getIgnoreCase()) {
                c.add(Restrictions.ilike(propName, (String) value, matchMode));
            } else {
                c.add(Restrictions.like(propName, (String) value, matchMode));
            }

        } else {
            if (String.valueOf(value).equals("0") && options.getExcludeZeros()) {
                return;
            }
            c.add(Restrictions.eq(propName, value));
        }

    }

    private static void addExample(Object o, Criteria c, QueryOptions options) {

        Example e = Example.create(o);
        c.add(e);

        if (DataServiceLoggers.taskLogger.isDebugEnabled()) {
            DataServiceLoggers.taskLogger.debug("Added example for " + ObjectUtils.objectToString(o));
        }

        if (options.getTypedMatchMode() != null) {
            e.enableLike(options.getTypedMatchMode());
        }

        if (options.getExcludeNone()) {
            e.excludeNone();
        }

        if (options.getExcludeZeros()) {
            e.excludeZeroes();
        }

        if (options.getIgnoreCase()) {
            e.ignoreCase();
        }
    }
}
