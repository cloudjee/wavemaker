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

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Map;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.runtime.service.Filter;
import com.wavemaker.runtime.service.OrderBy;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class HQLGenerator {

    public interface TypeManager {

        boolean isComponentPath(String propertyPath, String dbName);

    };

    public interface JoinStrategy {

        public static enum Join {

            INNER_JOIN(), LEFT_OUTER_JOIN();

            @Override
            public String toString() {
                if (this == INNER_JOIN) {
                    return "join";
                } else {
                    return "left outer join";
                }
            }
        }

        Join getJoin(String propertyPath, String dbName);

    };

    private static enum Operator {

        AND(), OR();

        @Override
        public String toString() {
            if (this == OR) {
                return "or";
            } else if (this == AND) {
                return "and";
            }
            throw new AssertionError();
        }
    };

    private static final String SELECT = DataServiceConstants.SELECT_KEYWORD;

    // private static final String DISTINCT = "distinct";

    private static final String FROM = "from";

    private static final String WHERE = "where";

    private static final String FETCH = "fetch";

    private static final String ORDER_BY = "order by";

    private static final String ASC = "asc";

    private static final String DESC = "desc";

    private static final String COUNT = "count";

    private static final String LOWER = "lower";

    private static final String ALIAS_PREFIX = "_e";

    private static final String ALL_COLUMNS = "*";

    private static final String ROOT_PATH = "";

    private static final HQLGenerator.JoinStrategy DEFAULT_JOIN_STRATEGY = new HQLGenerator.JoinStrategy() {

        @Override
        public Join getJoin(String propertyPath, String dbName) {
            return Join.INNER_JOIN;
        }
    };

    private final Class<?> rootEntity;

    private final Collection<String> eagerPropertyPaths = new LinkedHashSet<String>();

    private final Map<String, String> propPathToAlias = new HashMap<String, String>();

    private final Map<String, String> aliasToPropPath = new HashMap<String, String>();

    private final Collection<String> aliases = new HashSet<String>();

    // selection property paths that should be passed to lower()
    private final Collection<String> lowerPropertyPaths = new HashSet<String>();

    private final Collection<String> lowerOrders = new HashSet<String>();

    private final JoinStrategy joinStrategy;

    private final TypeManager typeManager;

    private Collection<Filter> selections = new ArrayList<Filter>();

    private Collection<OrderBy> orders = new ArrayList<OrderBy>();

    public HQLGenerator(Class<?> rootEntity) {
        this(rootEntity, DEFAULT_JOIN_STRATEGY, new TypeManager() {

            @Override
            public boolean isComponentPath(String propertyPath, String dbName) {
                return false;
            }
        });
    }

    public HQLGenerator(Class<?> rootEntity, TypeManager typeManager) {
        this(rootEntity, DEFAULT_JOIN_STRATEGY, typeManager);
    }

    public HQLGenerator(Class<?> rootEntity, JoinStrategy joinStrategy, TypeManager typeManager) {
        this.rootEntity = rootEntity;
        this.joinStrategy = joinStrategy;
        this.typeManager = typeManager;
    }

    public HQLGenerator loadEagerly(Collection<String> propertyPaths) {
        for (String s : propertyPaths) {
            loadEagerly(s);
        }

        return this;
    }

    public HQLGenerator loadEagerly(String propertyPath) {

        validatePropertyPath(propertyPath);

        this.eagerPropertyPaths.add(propertyPath);

        int i = 0;
        while ((i = propertyPath.lastIndexOf(DataServiceConstants.PROP_SEP)) != -1) {
            propertyPath = propertyPath.substring(0, i);
            this.eagerPropertyPaths.add(propertyPath);
        }

        return this;
    }

    public HQLGenerator setSelections(Collection<Filter> selections) {
        this.selections = selections;
        return this;
    }

    public HQLGenerator addSelection(String propertyPath, String expression) {
        return addSelection(propertyPath, expression, false);
    }

    public HQLGenerator addSelection(String propertyPath, String expression, boolean lower) {

        if (expression == null) {
            throw new IllegalArgumentException("expression cannot be null");
        }

        validatePropertyPath(propertyPath);

        Filter f = new Filter(propertyPath, expression);

        this.selections.add(f);

        if (lower) {
            this.lowerPropertyPaths.add(propertyPath);
        }

        return this;
    }

    public HQLGenerator setOrderBy(Collection<OrderBy> orders) {
        return setOrderBy(orders, false);
    }

    public HQLGenerator setOrderBy(Collection<OrderBy> orders, boolean lower) {
        this.orders = orders;

        if (lower) {
            for (OrderBy order : orders) {
                this.lowerOrders.add(order.getPropertyPath());
            }
        }

        return this;
    }

    public HQLGenerator addAscOrder(String propertyPath) {
        return addAscOrder(propertyPath, false);
    }

    public HQLGenerator addAscOrder(String propertyPath, boolean lower) {
        OrderBy o = new OrderBy();
        o.setAsc(propertyPath);
        this.orders.add(o);
        if (lower) {
            this.lowerOrders.add(propertyPath);
        }
        return this;
    }

    public HQLGenerator addDescOrder(String propertyPath) {
        return addDescOrder(propertyPath, false);
    }

    public HQLGenerator addDescOrder(String propertyPath, boolean lower) {
        OrderBy o = new OrderBy();
        o.setDesc(propertyPath);
        this.orders.add(o);
        if (lower) {
            this.lowerOrders.add(propertyPath);
        }
        return this;
    }

    public String getQuery(String dbName) {
        return getQuery(false, dbName);
    }

    public String getCountQuery(String dbName) {
        return getQuery(true, dbName);
    }

    private String getQuery(boolean count, String dbName) {
        reset();

        StringBuilder rtn = new StringBuilder();

        select(rtn, count);

        from(rtn);

        for (String s : getJoinPropertyPaths(count)) {
            createAlias(rtn, s, count, dbName);
        }

        boolean isFirst = true;
        for (Filter f : this.selections) {
            if (isFirst) {
                where(rtn);
                condition(rtn, f.getPropertyPath(), f.getExpression());
                isFirst = false;
            } else {
                condition(rtn, f.getPropertyPath(), f.getExpression(), Operator.AND);
            }
        }

        if (!count) {
            isFirst = true;
            for (OrderBy o : this.orders) {
                order(rtn, o, isFirst);
                isFirst = false;
            }
        }

        return rtn.toString();
    }

    private void reset() {
        this.propPathToAlias.clear();
        this.aliasToPropPath.clear();
        this.aliases.clear();
        this.propPathToAlias.put(ROOT_PATH, getNextAlias());
    }

    private Collection<String> getJoinPropertyPaths(boolean count) {
        Collection<String> rtn = new HashSet<String>();
        if (!count) {
            for (String s : this.eagerPropertyPaths) {
                rtn.add(s);
            }
        }
        for (Filter f : this.selections) {
            String s = splitProperty(f.getPropertyPath()).v1;
            if (s.length() > 0) {
                rtn.add(s);
            }
        }

        if (!count) {
            for (OrderBy o : this.orders) {
                String s = splitProperty(o.getPropertyPath()).v1;
                if (s.length() > 0) {
                    rtn.add(s);
                }
            }
        }

        return rtn;
    }

    private boolean isComponentPath(String propertyPath, String dbName) {
        return this.typeManager.isComponentPath(propertyPath, dbName);
    }

    private void validatePropertyPath(String propertyPath) {
        if (propertyPath == null) {
            throw new IllegalArgumentException("propertyPath cannot be null");
        }
        if (propertyPath.startsWith(DataServiceConstants.PROP_SEP)) {
            throw new IllegalArgumentException("propertyPath cannot start with " + DataServiceConstants.PROP_SEP);
        }
        if (propertyPath.endsWith(DataServiceConstants.PROP_SEP)) {
            throw new IllegalArgumentException("propertyPath cannot end with " + DataServiceConstants.PROP_SEP);
        }
    }

    private void select(StringBuilder sb, boolean count) {
        sb.append(SELECT).append(" ");

        if (count) {
            sb.append(COUNT).append("(");
            // MAV-1288 - use '*' instead of the root alias
            sb.append(ALL_COLUMNS);
            sb.append(")");
        } else {
            sb.append(getRootAlias());
        }
    }

    private void from(StringBuilder sb) {
        sb.append(" ").append(FROM).append(" ").append(this.rootEntity.getName()).append(" ").append(getRootAlias());
    }

    private void where(StringBuilder sb) {
        sb.append(" ");
        sb.append(WHERE);
    }

    private void condition(StringBuilder sb, String propertyPath, String expression) {
        condition(sb, propertyPath, expression, null);
    }

    private void condition(StringBuilder sb, String propertyPath, String expression, Operator op) {
        sb.append(" ");
        if (op != null) {
            sb.append(op);
            sb.append(" ");
        }
        String alias = getAliasedPropertyPath(propertyPath);

        if (this.lowerPropertyPaths.contains(propertyPath)) {
            applyFunction(sb, LOWER, alias);
        } else {
            sb.append(alias);
        }
        sb.append(" ");
        sb.append(expression);
    }

    private void order(StringBuilder sb, OrderBy order, boolean isFirst) {
        if (isFirst) {
            sb.append(" ");
            sb.append(ORDER_BY);
            sb.append(" ");
        } else {
            sb.append(", ");
        }

        String alias = getAliasedPropertyPath(order.getPropertyPath());

        if (this.lowerOrders.contains(order.getPropertyPath())) {
            applyFunction(sb, LOWER, alias);
        } else {
            sb.append(alias);
        }

        sb.append(" ");
        if (order.isAsc()) {
            sb.append(ASC);
        } else {
            sb.append(DESC);
        }
    }

    private void join(StringBuilder sb, String propertyPath, String alias, String join, boolean eager) {

        sb.append(" ").append(join).append(" ");

        if (eager) {
            sb.append(FETCH).append(" ");
        }

        sb.append(propertyPath).append(" ").append(alias);
    }

    private void applyFunction(StringBuilder sb, String function, String arg) {
        sb.append(function);
        sb.append("(");
        sb.append(arg);
        sb.append(")");
    }

    private String getRootAlias() {
        return this.propPathToAlias.get(ROOT_PATH);
    }

    private String getAliasedPropertyPath(String propertyPath) {

        Tuple.Two<String, String> t = splitProperty(propertyPath);
        String path = t.v1;
        String propName = t.v2;

        String alias = getAlias(path);
        if (alias == null) {
            throw new AssertionError("unknown property path \"" + path + "\"");
        }
        return alias + DataServiceConstants.PROP_SEP + propName;
    }

    private String getAlias(String propertyPath) {
        return this.propPathToAlias.get(propertyPath);
    }

    // create alias and add joins
    private String createAlias(StringBuilder sb, String propertyPath, boolean count, String dbName) {
        Tuple.Three<String, String, String> t = resolvePropertyPath(propertyPath);
        String resolvedPath = t.v1;
        String alias = t.v2;
        String unresolvedPath = t.v3;

        if (unresolvedPath == null) {
            return alias;
        } else {
            int i = 0;
            while (unresolvedPath.length() > 0) {
                i = unresolvedPath.indexOf(DataServiceConstants.PROP_SEP);
                String joinOn = unresolvedPath;
                if (i > -1) {
                    joinOn = unresolvedPath.substring(0, i);
                    unresolvedPath = unresolvedPath.substring(i + 1);
                } else {
                    unresolvedPath = "";
                }

                String path = alias + DataServiceConstants.PROP_SEP + joinOn;

                if (resolvedPath.length() > 0) {
                    resolvedPath += DataServiceConstants.PROP_SEP;
                }

                resolvedPath += joinOn;

                if (isComponentPath(resolvedPath, dbName)) {

                    Tuple.Three<String, String, String> rp = resolvePropertyPath(resolvedPath);

                    String aliasedComponentPath = rp.v2 + DataServiceConstants.PROP_SEP + rp.v3;
                    addAlias(aliasedComponentPath, resolvedPath);

                } else {

                    alias = getNextAlias();

                    addAlias(alias, resolvedPath);

                    boolean eager = !count && this.eagerPropertyPaths.contains(resolvedPath);

                    String join = this.joinStrategy.getJoin(resolvedPath, dbName).toString();

                    join(sb, path, alias, join, eager);

                }
            }
        }

        return alias;
    }

    private void addAlias(String alias, String path) {
        this.propPathToAlias.put(path, alias);
        this.aliasToPropPath.put(alias, path);
    }

    // returns resolved property path, alias for that resolved path,
    // and unresolved part of property path
    private Tuple.Three<String, String, String> resolvePropertyPath(String propertyPath) {
        String alias = null;
        String path = propertyPath;
        int i = 0;
        while ((alias = getAlias(path)) == null) {
            i = path.lastIndexOf(DataServiceConstants.PROP_SEP);
            if (i > -1) {
                path = path.substring(0, i);
            } else {
                path = ROOT_PATH;
            }
        }
        String unresolvedPath = null;
        if (i != 0) {
            unresolvedPath = propertyPath.substring(i + 1);
        }
        return Tuple.tuple(path, alias, unresolvedPath);
    }

    private Tuple.Two<String, String> splitProperty(String propertyPath) {
        String path = ROOT_PATH;
        String propName = propertyPath;
        int i = propertyPath.lastIndexOf(DataServiceConstants.PROP_SEP);
        if (i > -1) {
            path = propertyPath.substring(0, i);
            propName = propertyPath.substring(i + 1);
        }
        return Tuple.tuple(path, propName);
    }

    private String getNextAlias() {
        String rtn = StringUtils.getUniqueName(ALIAS_PREFIX, this.aliases);
        this.aliases.add(rtn);
        return rtn;
    }
}
