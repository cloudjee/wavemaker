/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.runtime.data.hibernate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.engine.NamedQueryDefinition;
import org.hibernate.mapping.*;
import org.hibernate.type.Type;

import com.wavemaker.common.Resource;
import com.wavemaker.common.util.*;
import com.wavemaker.runtime.data.spring.ConfigurationRegistry;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.data.*;

/**
 * Wraps a Hibernate Configuration with convenience methods.
 * 
 * @author Simon Toens
 */
public class DataServiceMetaData_Hib implements DataServiceMetaData { //salesforce

    private final Configuration cfg;

    private DataServiceOperationManager operationManager = null;

    // entity classes
    private final List<Class<?>> entityClasses = 
        new ArrayList<Class<?>>();

    // RootClass (String) -> RootClass
    private final Map<Class<?>, RootClass> rootClasses = 
        new HashMap<Class<?>, RootClass>();

    // RootClass -> all properties
    private final OneToManyMap<String, Property> allProperties = 
        new OneToManyMap<String, Property>();

    private final OneToManyMap<String, String> allPropertyNames = 
        new OneToManyMap<String, String>();

    // RootClass -> properties for related objects
    private final OneToManyMap<String, Property> relProperties = 
        new OneToManyMap<String, Property>();

    private final OneToManyMap<String, String> relPropertyNames = 
        new OneToManyMap<String, String>();

    // RootClass -> all properties in a Map for lookup by property name
    private final Map<String, Map<String, Property>> allPropertiesMap = 
        new HashMap<String, Map<String, Property>>();

    // Entity class names in alphabetical order
    private final SortedSet<String> entityClassNames = new TreeSet<String>();

    // Component class names in alphabetical order
    private final SortedSet<String> componentClassNames = new TreeSet<String>();

    private final SortedSet<String> entityNames = new TreeSet<String>();

    // Helper classes that are not part of the data model
    // Right now we only have query result wrappers
    private Collection<String> helperClassNames = Collections.emptySet();

    // entities to refresh after insert/update
    private final Set<String> refreshEntities;

    // used for messages
    private final String configurationName;

    private String serviceClassName = null;

    public DataServiceMetaData_Hib(String configurationName, Configuration cfg) {
        this(configurationName, cfg, Collections.<String, String> emptyMap());
    }

    public DataServiceMetaData_Hib(String configurationName,
                               Configuration cfg,
                               Map<String, String> properties) 
    {
        this.configurationName = configurationName;
        this.cfg = cfg;

        String s = 
            properties.get(DataServiceConstants.REFRESH_ENTITIES_PROPERTY);

        if (s == null) {
            refreshEntities = Collections.emptySet();
        } else {
            refreshEntities = new HashSet<String>(StringUtils.split(s));
        }

        initMappingData();
    }

    /**
     * Must be called before calling any other methods on this instance.
     * 
     * @param session
     *                A valid session for this Configuration.
     */
    public void init(Session session, boolean useIndividualCRUDOperations) {

        DataOperationFactory fac = initFactory(session);

        operationManager = new DataServiceOperationManager(fac,
                useIndividualCRUDOperations);
    }

    public void init(String configurationName) {} //salesforce

    public void dispose() {}

    public String getName() {
        return configurationName;
    }

    public String getServiceClassName() {
        return serviceClassName;
    }

    public void setHelperClassNames(Collection<String> helperClassNames) {
        this.helperClassNames = helperClassNames;
    }

    public Collection<String> getHelperClassNames() {
        return helperClassNames;
    }

    public void setServiceClassName(String serviceClassName) {
        this.serviceClassName = serviceClassName;
    }

    public Configuration getConfiguration() {
        return cfg;
    }

    private void initMappingData() {

        RootClass rc;
        //for (Iterator<RootClass> iter = CastUtils.cast(getConfiguration()
        for (Iterator iter = CastUtils.cast(getConfiguration()
                .getClassMappings()); iter.hasNext();) {

            //RootClass rc = iter.next();
            Object obj = iter.next();
            if (obj instanceof RootClass)
                rc = (RootClass)obj;
            else
                rc = ((Subclass)obj).getRootClass();

            String s = rc.getClassName();
            entityClassNames.add(s);
            entityNames.add(StringUtils.splitPackageAndClass(s).v2);

            rootClasses.put(rc.getMappedClass(), rc);
            entityClasses.add(rc.getMappedClass());

            Map<String, Property> propertiesMap = 
                new HashMap<String, Property>();
            allPropertiesMap.put(rc.getClassName(), propertiesMap);

            for (Iterator<Property> iter2 = CastUtils.cast(rc
                    .getPropertyIterator()); iter2.hasNext();) {

                Property p = (Property) iter2.next();
                initProperty(rc.getClassName(), p, propertiesMap);
            }

            Property id = rc.getIdentifierProperty();
            initProperty(rc.getClassName(), id, propertiesMap);
        }
    }

    private void initProperty(String owningClassName, Property p,
            Map<String, Property> propertiesMap) {
        allProperties.put(owningClassName, p);
        if (p != null) {
            allPropertyNames.put(owningClassName, p.getName());
            propertiesMap.put(p.getName(), p);
            Value v = p.getValue();
            if (v.getType().isEntityType() || !v.isSimpleValue()) {
                relProperties.put(owningClassName, p);
                relPropertyNames.put(owningClassName, p.getName());
            }

            if (p.getType().isComponentType()) {
                addComponentProperties(p);
            }
        }
    }

    private void addComponentProperties(Property p) {
        String s = p.getType().getReturnedClass().getName();
        componentClassNames.add(s);
        Value v = p.getValue();
        Component comp = (Component) v;
        Map<String, Property> propertiesMap = new HashMap<String, Property>();
        allPropertiesMap.put(s, propertiesMap);
        for (Iterator<Property> iter = CastUtils.cast(comp
                .getPropertyIterator()); iter.hasNext();) {
            Property p2 = iter.next();
            initProperty(s, p2, propertiesMap);
        }
    }

    public Collection<String> getEntityClassNames() {
        return entityClassNames;
    }

    public List<Class<?>> getEntityClasses() {
        return entityClasses;
    }

    public boolean refreshEntity(Class<?> c) {

        if (!isEntity(c)) {
            throw new DataServiceRuntimeException(c + " is not an entity");
        }

        return refreshEntities.contains(c.getName());
    }

    public String getIdPropertyName(Class<?> c) {

        if (!isEntity(c)) {
            throw new DataServiceRuntimeException(c + " is not an entity");
        }

        RootClass rc = getRootClass(c);

        Property id = rc.getIdentifierProperty();

        return id.getName();
    }

    public boolean isCompositeProperty(Class<?> c, String propertyName) {

        if (!isEntity(c)) {
            throw new DataServiceRuntimeException(c + " is not an entity");
        }

        RootClass rc = getRootClass(c);

        Property p = rc.getProperty(propertyName);

        return p.isComposite();
    }

    public Collection<String> getRelPropertyNames(Class<?> c) {

        if (!isEntity(c)) {
            throw new DataServiceRuntimeException(c + " is not an entity");
        }

        Collection<String> rtn = relPropertyNames.get(c.getName());

        if (rtn == null) {
            return Collections.emptyList();
        }

        return rtn;
    }

    public Property getProperty(String className, String propertyName) {

        ensureEntityOrComponent(className);

        return allPropertiesMap.get(className).get(propertyName);
    }

    public String getDataPackage() {
        Configuration cfg = getConfiguration();
        RootClass rc = (RootClass) cfg.getClassMappings().next();
        String className = rc.getClassName();
        return StringUtils.fromLastOccurrence(className, ".", -1);
    }

    public boolean isEntity(Class<?> c) {
        return getRootClass(c) != null;
    }

    public Collection<String> getOperationNames() {
        return operationManager.getOperationNames();
    }

    public NamedQueryDefinition getQueryDefinition(String queryName) {
        Configuration cfg = getConfiguration();
        NamedQueryDefinition rtn = (NamedQueryDefinition) cfg.getNamedQueries()
                .get(queryName);
        if (rtn == null) {
            rtn = (NamedQueryDefinition) cfg.getNamedSQLQueries()
                    .get(queryName);
        }
        return rtn;
    }

    public DataServiceOperation getOperation(String operationName) {
        DataServiceOperation rtn = operationManager.getOperation(operationName);
        if (rtn == null) {
            throw new DataServiceRuntimeException(
                Resource.OPERATION_NOT_FOUND,
                configurationName, 
                operationName, 
                operationManager.getOperationNames());
        }
        return rtn;
    }

    private RootClass getRootClass(Class<?> c) {
        return rootClasses.get(c);
    }

    private String getJavaTypeName(Type type) {
        SessionFactory fac = ConfigurationRegistry.getInstance()
            .getSessionFactory(configurationName);
        return DataServiceUtils.getJavaTypeName(type, fac);
    }

    private void ensureEntityOrComponent(String className) {
        if (!entityClassNames.contains(className)
                && !componentClassNames.contains(className)) {
            throw new IllegalArgumentException(
                    "Unknown Entity or Component class: " + className);
        }
    }

    private DataOperationFactory initFactory(final Session session) {
        return new DataOperationFactory() {

            // this is magic, and has to match the name of the
            // generated example query(ies).
            private static final String GENERATED_QUERY_NAME = 
                "ExampleHQLQuery1";

            public Collection<String> getEntityClassNames() {
                return entityClassNames;
            }

            public List<Tuple.Three<String, String, Boolean>> getQueryInputs(
                    String queryName) {

                List<Tuple.Three<String, String, Boolean>> rtn = 
                    new ArrayList<Tuple.Three<String, String, Boolean>>();

                NamedQueryDefinition def = getQueryDefinition(queryName);

                Map<String, String> m = CastUtils.cast(def.getParameterTypes());

                for (Map.Entry<String, String> e : m.entrySet()) {
                    Tuple.Two<String, Boolean> t = DataServiceUtils
                            .getQueryType(e.getValue());
                    rtn.add(Tuple.tuple(e.getKey(), t.v1, t.v2));
                }

                return rtn;
            }

            @SuppressWarnings("unchecked")
            public Collection<String> getQueryNames() {

                Collection<String> rtn = new HashSet<String>();

                Configuration cfg = getConfiguration();

                rtn.addAll(cfg.getNamedQueries().keySet());
                rtn.addAll(cfg.getNamedSQLQueries().keySet());

                return rtn;
            }

            public List<String> getQueryReturnNames(String operationName,
                    String queryName) {

                Query query = session.getNamedQuery(queryName);

                try {
                    String[] names = query.getReturnAliases();
                    if (names != null) {
                        return Arrays.asList(names);
                    }
                } catch (RuntimeException ex) {
                }

                return Collections.emptyList();

            }

            public boolean requiresResultWrapper(String operationName,
                    String queryName) {
                NamedQueryDefinition query = getQueryDefinition(queryName);
                return DataServiceUtils.requiresResultWrapper(query.getQuery());
            }

            public List<String> getQueryReturnTypes(String operationName,
                    String queryName) {

                List<String> rtn = new ArrayList<String>();

                Type[] rtnTypes = getReturnTypes(queryName);

                String queryString = getQueryDefinition(queryName).getQuery();

                if (rtnTypes == null) {
                    // Must be DML
                    if (!DataServiceUtils.isDML(queryString)) {
                        // throw new AssertionError(
                        // "Query " + queryName + " doesn't return anything");
                        // actually if it is a sql query we also end up here -
                        // the tests have at least one...
                    }
                    rtn.add(DataServiceConstants.DML_OPERATION_RTN_TYPE
                            .getName());
                } else {

                    if (DataServiceUtils
                            .isDynamicInstantiationQuery(queryString)) {
                        String className = DataServiceUtils
                                .getDynamicInstantiationClassName(queryString);

                        if (!StringUtils.isFullyQualified(className)) {
                            if (entityNames.contains(className)) {
                                className = StringUtils.fq(getDataPackage(),
                                        className);
                            }
                        }
                        rtn.add(className);
                    } else {
                        for (Type t : rtnTypes) {
                            rtn.add(getJavaTypeName(t));
                        }
                    }
                }

                return rtn;
            }

            public boolean queryReturnsSingleResult(String operationName,
                    String queryName) {

                // hack for generated queries - only required for initial
                // ServiceDefinition instance that is used to add the service
                if (queryName.equals(GENERATED_QUERY_NAME)) {
                    return true;
                }

                // to make existing tests happy
                if (queryName.startsWith("get") && queryName.endsWith(("ById"))) {
                    return true;
                }

                return false;
            }

            private Type[] getReturnTypes(String queryName) {

                Type[] rtn = null;

                Query query = session.getNamedQuery(queryName);

                // this blows up for named sql queries (vs named hql queries)
                // exception msg from hibernate is: "not yet implemented for sql
                // queries"
                try {
                    rtn = query.getReturnTypes();
                } catch (RuntimeException ex) {
                    if (DataServiceLoggers.metaDataLogger.isDebugEnabled()) {
                        DataServiceLoggers.metaDataLogger
                            .debug("Failed to determine rtn type for query \""
                                   + queryName + "\"");
                    }
                }
                return rtn;
            }
        };
    }
}
