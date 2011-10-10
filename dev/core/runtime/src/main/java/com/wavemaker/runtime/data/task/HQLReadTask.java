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

import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.MatchMode;

import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.TypeConversionUtils;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.json.type.reflect.ReflectTypeDefinition;
import com.wavemaker.runtime.data.DataServiceLoggers;
import com.wavemaker.runtime.data.Task;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.data.util.HQLGenerator;
import com.wavemaker.runtime.service.Filter;
import com.wavemaker.runtime.service.OrderBy;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.runtime.service.PropertyOptions;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.runtime.service.response.LiveDataServiceResponse;

/**
 * LiveDataService.read implementation using HQL.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 */
public class HQLReadTask extends AbstractReadTask implements Task, DefaultRollback {

    private static final String BIND_PARAM_PREFIX = "_";

    private static final Object UNSET = new Object();

    private static final String ID_PROP_NAME = "id";

    private static final String ID_BIND_PARAM = BIND_PARAM_PREFIX + "id";

    private class JoinStrategy implements HQLGenerator.JoinStrategy {

        private final Class<?> type;

        private final Collection<String> outerJoinPropertyPaths = new HashSet<String>();

        private JoinStrategy(Class<?> type) {
            this.type = type;
        }

        public Join getJoin(String propertyPath, String dbName) {
            for (String s : this.outerJoinPropertyPaths) {
                if (propertyPath.startsWith(s)) {
                    return HQLGenerator.JoinStrategy.Join.LEFT_OUTER_JOIN;
                }
            }

            if (isNulleable(this.type, propertyPath, dbName)) {
                this.outerJoinPropertyPaths.add(propertyPath);
                return HQLGenerator.JoinStrategy.Join.LEFT_OUTER_JOIN;
            }

            return HQLGenerator.JoinStrategy.Join.INNER_JOIN;
        }
    };

    private class TypeManager implements HQLGenerator.TypeManager {

        private final Class<?> type;

        private final Collection<String> componentPropertyPaths = new HashSet<String>();

        private TypeManager(Class<?> type) {
            this.type = type;
        }

        public boolean isComponentPath(String propertyPath, String dbName) {
            for (String s : this.componentPropertyPaths) {
                if (propertyPath.startsWith(s)) {
                    return true;
                }
            }

            if (isComponentType(this.type, propertyPath, dbName)) {
                this.componentPropertyPaths.add(propertyPath);
                return true;
            }

            return false;
        }

    };

    public Object run(Session session, String dbName, Object... input) {

        if (ObjectUtils.isNullOrEmpty(input)) {
            throw new IllegalArgumentException("input cannot be null or empty");
        }

        Class<?> type = null;
        Object instance = null;
        PropertyOptions propertyOptions = null;
        PagingOptions pagingOptions = null;

        Map<String, Object> bindParams = new LinkedHashMap<String, Object>();

        for (Object o : input) {
            if (o == null) {
                continue;
            } else if (o instanceof Class) {
                // what if the instance is a Class?
                type = (Class<?>) o;
            } else if (o instanceof TypeDefinition) {
                if (o instanceof ReflectTypeDefinition) {
                    type = ((ReflectTypeDefinition) o).getKlass();
                } else {
                    throw new IllegalArgumentException("ReflectTypeDefinition required, instead found " + o + " (" + o.getClass() + ")");
                }
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

        String idPropName = null;
        Object idValue = UNSET;
        if (instance != null) {
            idPropName = getMetaData(dbName).getIdPropertyName(type);
            idValue = getObjectAccess().getProperty(instance, idPropName);

            if (idValue == null) {
                throw new IllegalArgumentException(type.getName() + "'s " + idPropName + " must be set");
            }

        }

        HQLGenerator generator = setupGenerator(type, instance, propertyOptions, pagingOptions, idPropName, idValue, bindParams, dbName);

        return getResponse(session, generator, instance, pagingOptions, idValue, bindParams, dbName);
    }

    public String getName() {
        return "Built-in CRUD Read Task";
    }

    private TypedServiceReturn getResponse(Session session, HQLGenerator generator, Object instance, PagingOptions pagingOptions, Object idValue,
        Map<String, Object> bindParams, String dbName) {

        String queryStr = generator.getQuery(dbName);

        logQuery(queryStr, bindParams);

        Query query = session.createQuery(queryStr);

        handleBindParameters(idValue, query, bindParams);

        applyPaging(pagingOptions, query);

        LiveDataServiceResponse rtn = new LiveDataServiceResponse();

        boolean singleResult = instance != null;

        rtn.setResult(runQuery(query, singleResult, dbName));

        if (pagingOptions != null) {

            String countQueryStr = generator.getCountQuery(dbName);

            logQuery(countQueryStr, bindParams);

            Query countQuery = session.createQuery(countQueryStr);

            handleBindParameters(idValue, countQuery, bindParams);

            rtn.setDataSetSize((Long) runQuery(countQuery, true, dbName));
        }

        // TODO is this hokey? I think it is - maybe. small, 200901
        TypedServiceReturn tsr = new TypedServiceReturn();
        tsr.setReturnValue(rtn);

        return tsr;
    }

    private void handleBindParameters(Object idValue, Query query, Map<String, Object> bindParams) {

        if (idValue == null) {
            if (DataServiceLoggers.taskLogger.isDebugEnabled()) {
                DataServiceLoggers.taskLogger.debug("ignoring null id value");
            }
        } else if (idValue != UNSET) {
            query.setParameter(ID_BIND_PARAM, idValue);
            if (DataServiceLoggers.taskLogger.isDebugEnabled()) {
                DataServiceLoggers.taskLogger.debug("binding id value: " + idValue);
            }
        }

        for (String bindParam : bindParams.keySet()) {
            query.setParameter(bindParam, bindParams.get(bindParam));
        }

    }

    private HQLGenerator setupGenerator(Class<?> type, Object instance, PropertyOptions propertyOptions, PagingOptions pagingOptions,
        String idPropName, Object idValue, Map<String, Object> bindParams, String dbName) {

        HQLGenerator rtn = new HQLGenerator(type, new JoinStrategy(type), new TypeManager(type));

        if (propertyOptions != null) {
            handlePropertyOptions(type, rtn, propertyOptions, bindParams, dbName);
        }

        if (pagingOptions == null) {
            addDefaultOrder(rtn);
        } else {
            List<OrderBy> orders = pagingOptions.getOrderByList();
            if (orders.isEmpty()) {
                addDefaultOrder(rtn);
            } else {
                rtn.setOrderBy(pagingOptions.getOrderByList());
            }
        }

        if (idValue != null && idValue != UNSET) {
            rtn.addSelection(idPropName, "=" + getBindParamRef(ID_BIND_PARAM));
        }

        return rtn;
    }

    private void handlePropertyOptions(Class<?> type, HQLGenerator generator, PropertyOptions options, Map<String, Object> bindParams, String dbName) {

        generator.loadEagerly(options.getProperties());

        // hack until we have actual expression support:
        // only allow testing for equality for all primitive types except
        // strings.
        // for strings, we allow =foo and change it to something like:
        // like '%foo'
        // depending on matchMode
        for (Filter f : options.getFilterList()) {
            String propertyPath = f.getPropertyPath();
            String s = f.getExpression();
            StringBuilder value = new StringBuilder();
            boolean isLike = false;
            boolean isStr = false;
            Class<?> propertyType = getPropertyType(type, propertyPath, dbName);
            isStr = String.class == propertyType;
            if (isStr) {
                MatchMode m = DataServiceUtils.parseMatchMode(options.getMatchMode());
                if (m == MatchMode.EXACT) {
                    value.append(s);
                } else {
                    isLike = true;
                    if (m == MatchMode.START) {
                        value.append(s).append("%");
                    } else if (m == MatchMode.END) {
                        value.append("%").append(s);
                    } else if (m == MatchMode.ANYWHERE) {
                        value.append("%").append(s).append("%");
                    }
                }
            }

            if (value.length() == 0) {
                value.append(s);
            }

            StringBuilder expr = new StringBuilder();
            if (isLike) {
                expr.append("like ");
            } else {
                expr.append("=");
            }

            String bindParam = getNextBindParam(bindParams.keySet());

            Object o = TypeConversionUtils.fromString(propertyType, value.toString());

            expr.append(getBindParamRef(bindParam));

            if (isStr && options.isIgnoreCase()) {
                o = String.valueOf(o).toLowerCase();
                generator.addSelection(propertyPath, expr.toString(), true);
            } else {
                generator.addSelection(propertyPath, expr.toString(), false);
            }
            bindParams.put(bindParam, o);
        }
    }

    private void addDefaultOrder(HQLGenerator generator) {
        generator.addAscOrder(ID_PROP_NAME);
    }

    private String getBindParamRef(String bindParam) {
        return ":" + bindParam;
    }

    private String getNextBindParam(Collection<String> bindParams) {
        String rtn = StringUtils.getUniqueName(BIND_PARAM_PREFIX + "p", bindParams);
        return rtn;
    }
}
