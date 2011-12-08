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

import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import com.wavemaker.common.util.ImmutableEntryMap;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.common.util.TypeConversionUtils;
import com.wavemaker.runtime.data.Task;
import com.wavemaker.runtime.service.Filter;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.runtime.service.PropertyOptions;
import com.wavemaker.runtime.service.response.LiveDataServiceResponse;

/**
 * Attempt to implement LiveDataService.read using Hibernate Criteria API. This is not a complete implementation, and
 * has been replaced by HQLReadTask.
 * 
 * This class remains unused.
 * 
 * @author Simon Toens
 */
public class CriteriaReadTask extends AbstractReadTask implements Task, DefaultRollback {

    // Class (type), Object (instance)
    @Override
    public Object run(Session session, String dbName, Object... input) {

        if (ObjectUtils.isNullOrEmpty(input)) {
            throw new IllegalArgumentException("input cannot be null or empty");
        }

        Class<?> type = null;
        Object instance = null;
        PropertyOptions propertyOptions = null;
        PagingOptions pagingOptions = null;

        for (Object o : input) {
            if (o == null) {
                continue;
            } else if (o instanceof Class) {
                // what if the instance is a Class?
                type = (Class<?>) o;
            } else if (PropertyOptions.class.isAssignableFrom(o.getClass())) {
                propertyOptions = (PropertyOptions) o;
            } else if (PagingOptions.class.isAssignableFrom(o.getClass())) {
                pagingOptions = (PagingOptions) o;
            } else {
                instance = o;
            }
        }

        if (type == null && instance == null) {
            throw new IllegalArgumentException("Either root type or instance must be set");
        }

        if (type == null) {
            type = instance.getClass();
        }

        Map<String, Criteria> criterias = new ImmutableEntryMap<String, Criteria>();

        Criteria rootCriteria = initCriteriasMap(criterias, type, session);

        if (instance != null) {
            String idPropName = getMetaData(dbName).getIdPropertyName(type);
            Object value = getObjectAccess().getProperty(instance, idPropName);
            if (value == null) {
                // error out?
            } else {
                addEqualsFilter(rootCriteria, idPropName, value);
            }
        }

        if (propertyOptions != null) {
            applyPropertyOptions(type, propertyOptions, criterias, dbName);
        }

        LiveDataServiceResponse rtn = new LiveDataServiceResponse();

        if (pagingOptions != null) {
            applyOrderBy(pagingOptions, criterias);
            applyPaging(pagingOptions, rootCriteria);
            if (pagingOptions.getMaxResults() != null) {
                rtn.setDataSetSize(pagingOptions.getMaxResults());
            }
        }

        rtn.setResult(rootCriteria.list());

        return rtn;
    }

    @Override
    public String getName() {
        return "Built-in CRUD Read Task";
    }

    private void applyPropertyOptions(Class<?> type, PropertyOptions options, Map<String, Criteria> criterias, String dbName) {

        for (String s : options.getProperties()) {
            getCriteriaForPath(s, criterias, true);
        }

        for (Filter f : options.getFilterList()) {
            Class<?> propType = getPropertyType(type, f.getPropertyPath(), dbName);
            Object value = TypeConversionUtils.fromString(propType, f.getExpression());
            Tuple.Two<String, String> p = splitPath(f.getPropertyPath());
            Criteria c = getCriteriaForPath(p.v1, criterias);
            applyFilter(c, p.v2, value);
        }
    }

    private void applyFilter(Criteria criteria, String property, Object value) {
        addEqualsFilter(criteria, property, value);
    }

    private void addEqualsFilter(Criteria criteria, String property, Object value) {
        criteria.add(Restrictions.eq(property, value));
    }
}
