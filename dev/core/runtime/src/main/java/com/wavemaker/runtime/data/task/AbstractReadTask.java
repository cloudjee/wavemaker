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

package com.wavemaker.runtime.data.task;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.FetchMode;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.mapping.Column;
import org.hibernate.mapping.Property;
import org.hibernate.type.Type;

import com.wavemaker.common.util.ObjectAccess;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.runtime.data.DataServiceLoggers;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.Task;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.service.OrderBy;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.runtime.service.ServiceConstants;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public abstract class AbstractReadTask extends BaseTask implements Task {

    private interface PropertyTraversal {

        boolean keepGoing(Type type);
    }

    private static final PropertyTraversal NOOP_PROPERTY_TRAVERSAL = new PropertyTraversal() {

        @Override
        public boolean keepGoing(Type type) {
            return true;
        }
    };

    private static final PropertyTraversal COMPONENT_PROPERTY_TRAVERSAL = new PropertyTraversal() {

        @Override
        public boolean keepGoing(Type type) {
            return !type.isComponentType();
        }
    };

    private static final String ROOT_CRITERIA_KEY = "";

    protected Criteria initCriteriasMap(Map<String, Criteria> criterias, Class<?> rootType, Session session) {
        Criteria rtn = session.createCriteria(rootType);
        if (DataServiceLoggers.taskLogger.isDebugEnabled()) {
            DataServiceLoggers.taskLogger.debug("Created root criteria for " + rootType.getName());
        }
        criterias.put(ROOT_CRITERIA_KEY, rtn);
        return rtn;
    }

    protected Criteria getRootCriteria(Map<String, Criteria> criterias) {
        return criterias.get(ROOT_CRITERIA_KEY);
    }

    protected void fetch(Criteria criteria, String propertyName) {
        criteria.setFetchMode(propertyName, FetchMode.JOIN);
    }

    protected Criteria getCriteriaForPath(String path, Map<String, Criteria> criterias) {
        return getCriteriaForPath(path, criterias, false);
    }

    protected Criteria getCriteriaForPath(String path, Map<String, Criteria> criterias, boolean fetch) {

        Criteria rtn = criterias.get(path);
        if (rtn != null) {
            return rtn;
        }

        // find parent, and create a new one
        Tuple.Two<String, String> p = splitPath(path);
        Criteria parent = getCriteriaForPath(p.v1, criterias);

        rtn = parent.createCriteria(p.v2);

        if (fetch) {
            fetch(parent, p.v2);
        }

        criterias.put(path, rtn);

        return rtn;
    }

    protected Tuple.Two<String, String> splitPath(String path) {
        String parent = ROOT_CRITERIA_KEY;
        String child = path;
        int i = path.lastIndexOf(ServiceConstants.PROPERTY_SEP);
        if (i > -1) {
            parent = path.substring(0, i);
            child = path.substring(i + 1);
        }
        return Tuple.tuple(parent, child);
    }

    protected void applyPaging(PagingOptions options, Criteria c) {

        if (options == null) {
            return;
        }

        Long firstResult = options.getFirstResult();
        if (firstResult != null) {
            c.setFirstResult(firstResult.intValue());
        }
        Long maxResults = options.getMaxResults();
        if (maxResults != null) {
            c.setMaxResults(maxResults.intValue());
        }

        // this options instance can be re-used for the next page
        options.nextPage();
    }

    protected void applyPaging(PagingOptions options, Query q) {

        if (options == null) {
            return;
        }

        Long firstResult = options.getFirstResult();
        if (firstResult != null) {
            q.setFirstResult(firstResult.intValue());
        }
        Long maxResults = options.getMaxResults();
        if (maxResults != null) {
            q.setMaxResults(maxResults.intValue());
        }

        // this options instance can be re-used for the next page
        options.nextPage();
    }

    protected void applyOrderBy(PagingOptions options, Map<String, Criteria> criterias) {

        if (options == null) {
            return;
        }

        if (options.getOrderByList().isEmpty()) {
            // get root criteria and add default ordering
            getRootCriteria(criterias).addOrder(Order.asc("id"));
            return;
        }

        for (OrderBy orderBy : options.getOrderByList()) {

            String orderByExp = orderBy.getPropertyPath();

            // rightmost part of path is the property we want to order by
            // rest is the path to the Criteria instance
            Tuple.Two<String, String> t = splitPath(orderByExp);
            Criteria c = getCriteriaForPath(t.v1, criterias);

            Order o = null;
            if (orderBy.isAsc()) {
                o = Order.asc(t.v2);
            } else {
                o = Order.desc(t.v2);
            }

            if (DataServiceLoggers.taskLogger.isDebugEnabled()) {
                DataServiceLoggers.taskLogger.debug("Added order by " + orderBy);
            }

            c.addOrder(o);
        }

    }

    protected String[] splitPropertyPath(String propertyPath) {
        String[] rtn = null;
        if (propertyPath.indexOf(DataServiceConstants.PROP_SEP) == -1) {
            rtn = new String[] { propertyPath };
        } else {
            rtn = propertyPath.split("\\" + DataServiceConstants.PROP_SEP);
        }
        return rtn;
    }

    protected Class<?> getPropertyType(Class<?> rootType, String propertyPath, String dbName) {
        Property p = getProperty(rootType, propertyPath, NOOP_PROPERTY_TRAVERSAL, dbName);
        Type hbmType = p.getType();
        return hbmType.getReturnedClass();
    }

    protected boolean isComponentType(Class<?> rootType, String propertyPath, String dbName) {
        Property p = getProperty(rootType, propertyPath, COMPONENT_PROPERTY_TRAVERSAL, dbName);
        return p == null;
    }

    protected boolean isNulleable(Class<?> rootType, String propertyPath, String dbName) {
        Property p = getProperty(rootType, propertyPath, NOOP_PROPERTY_TRAVERSAL, dbName);
        if (isRelatedMany(p.getType().getReturnedClass())) {
            return true;
        }
        return ((Column) p.getColumnIterator().next()).isNullable();
    }

    protected void logQuery(String query) {
        logQuery(query, Collections.<String, Object> emptyMap());
    }

    protected void logQuery(String query, Map<String, Object> bindParams) {
        if (DataServiceLoggers.taskLogger.isInfoEnabled()) {
            DataServiceLoggers.taskLogger.info(query);
            if (!bindParams.isEmpty()) {
                DataServiceLoggers.taskLogger.debug(bindParams);
            }
        }
    }

    protected Object runQuery(Query query, boolean singleResult, String dbName) {

        if (singleResult) {
            return query.uniqueResult();
        } else {

            List<?> rs = query.list();

            SessionFactory sessFact = getSessionFactory(dbName);
            Type[] returnTypes = query.getReturnTypes();
            Class<?> returnedClass = returnTypes[0].getReturnedClass();
            String[] propertyNames = sessFact.getClassMetadata(returnedClass).getPropertyNames();
            Type[] propertyTypes = sessFact.getClassMetadata(returnedClass).getPropertyTypes();

            ObjectAccess oa = ObjectAccess.getInstance();

            //
            // To eliminate possible duplicates and construct a new list
            // with orders preserved for the final results
            //
            Iterator<?> rsItr = rs.iterator();
            List<Object> finalResultSet = new ArrayList<Object>();
            while (rsItr.hasNext()) {
                Object obj = rsItr.next();
                if (finalResultSet.contains(obj)) {
                    continue;
                }

                for (int i = 0; i < propertyTypes.length; i++) {
                    if (propertyTypes[i].getName().contains("lob") || propertyTypes[i].getName().toLowerCase().contains("binary")) {
                        oa.setProperty(obj, propertyNames[i], null);
                    }
                }
                finalResultSet.add(obj);
            }

            return finalResultSet;
        }
    }

    private Property getProperty(Class<?> rootType, String propertyPath, PropertyTraversal traversalStrategy, String dbName) {

        Property rtn = null;

        DataServiceMetaData m = getMetaData(dbName);

        String entityName = rootType.getName();

        SessionFactory fac = getSessionFactory(dbName);

        for (String s : splitPropertyPath(propertyPath)) {

            rtn = m.getProperty(entityName, s);

            Type hbmType = rtn.getType();

            if (!traversalStrategy.keepGoing(hbmType)) {
                return null;
            }

            entityName = DataServiceUtils.getJavaTypeName(hbmType, fac);
        }

        return rtn;
    }

}
