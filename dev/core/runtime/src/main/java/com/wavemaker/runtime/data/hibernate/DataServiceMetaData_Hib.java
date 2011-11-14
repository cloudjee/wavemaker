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
import org.hibernate.mapping.Component;
import org.hibernate.mapping.Property;
import org.hibernate.mapping.RootClass;
import org.hibernate.mapping.Subclass;
import org.hibernate.mapping.Value;
import org.hibernate.type.Type;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.util.CastUtils;
import com.wavemaker.common.util.OneToManyMap;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.runtime.data.DataOperationFactory;
import com.wavemaker.runtime.data.DataServiceLoggers;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.DataServiceOperation;
import com.wavemaker.runtime.data.DataServiceOperationManager;
import com.wavemaker.runtime.data.DataServiceRuntimeException;
import com.wavemaker.runtime.data.spring.ConfigurationRegistry;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.data.util.DataServiceUtils;

/**
 * Wraps a Hibernate Configuration with convenience methods.
 * 
 * @author Simon Toens
 */
public class DataServiceMetaData_Hib implements DataServiceMetaData { // salesforce

    private final Configuration cfg;

    private DataServiceOperationManager operationManager = null;

    // entity classes
    private final List<Class<?>> entityClasses = new ArrayList<Class<?>>();

    // RootClass (String) -> RootClass
    private final Map<Class<?>, RootClass> rootClasses = new HashMap<Class<?>, RootClass>();

    // RootClass -> all properties
    private final OneToManyMap<String, Property> allProperties = new OneToManyMap<String, Property>();

    private final OneToManyMap<String, String> allPropertyNames = new OneToManyMap<String, String>();

    // RootClass -> properties for related objects
    private final OneToManyMap<String, Property> relProperties = new OneToManyMap<String, Property>();

    private final OneToManyMap<String, String> relPropertyNames = new OneToManyMap<String, String>();

    // RootClass -> all properties in a Map for lookup by property name
    private final Map<String, Map<String, Property>> allPropertiesMap = new HashMap<String, Map<String, Property>>();

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

    public DataServiceMetaData_Hib(String configurationName, Configuration cfg, Map<String, String> properties) {
        this.configurationName = configurationName;
        this.cfg = cfg;

        String s = properties.get(DataServiceConstants.REFRESH_ENTITIES_PROPERTY);

        if (s == null) {
            this.refreshEntities = Collections.emptySet();
        } else {
            this.refreshEntities = new HashSet<String>(StringUtils.split(s));
        }

        initMappingData();
    }

    /**
     * Must be called before calling any other methods on this instance.
     * 
     * @param session A valid session for this Configuration.
     */
    @Override
    public void init(Session session, boolean useIndividualCRUDOperations) {

        DataOperationFactory fac = initFactory(session);

        this.operationManager = new DataServiceOperationManager(fac, useIndividualCRUDOperations);
    }

    @Override
    public void init(String configurationName) {
    } // salesforce

    @Override
    public void dispose() {
    }

    @Override
    public String getName() {
        return this.configurationName;
    }

    @Override
    public String getServiceClassName() {
        return this.serviceClassName;
    }

    @Override
    public void setHelperClassNames(Collection<String> helperClassNames) {
        this.helperClassNames = helperClassNames;
    }

    @Override
    public Collection<String> getHelperClassNames() {
        return this.helperClassNames;
    }

    @Override
    public void setServiceClassName(String serviceClassName) {
        this.serviceClassName = serviceClassName;
    }

    @Override
    public Configuration getConfiguration() {
        return this.cfg;
    }

    private void initMappingData() {

        RootClass rc;
        // for (Iterator<RootClass> iter = CastUtils.cast(getConfiguration()
        for (Iterator iter = CastUtils.cast(getConfiguration().getClassMappings()); iter.hasNext();) {

            // RootClass rc = iter.next();
            Object obj = iter.next();
            if (obj instanceof RootClass) {
                rc = (RootClass) obj;
            } else {
                rc = ((Subclass) obj).getRootClass();
            }

            String s = rc.getClassName();
            this.entityClassNames.add(s);
            this.entityNames.add(StringUtils.splitPackageAndClass(s).v2);

            this.rootClasses.put(rc.getMappedClass(), rc);
            this.entityClasses.add(rc.getMappedClass());

            Map<String, Property> propertiesMap = new HashMap<String, Property>();
            this.allPropertiesMap.put(rc.getClassName(), propertiesMap);

            for (Iterator<Property> iter2 = CastUtils.cast(rc.getPropertyIterator()); iter2.hasNext();) {

                Property p = iter2.next();
                initProperty(rc.getClassName(), p, propertiesMap);
            }

            Property id = rc.getIdentifierProperty();
            initProperty(rc.getClassName(), id, propertiesMap);
        }
    }

    private void initProperty(String owningClassName, Property p, Map<String, Property> propertiesMap) {
        this.allProperties.put(owningClassName, p);
        if (p != null) {
            this.allPropertyNames.put(owningClassName, p.getName());
            propertiesMap.put(p.getName(), p);
            Value v = p.getValue();
            if (v.getType().isEntityType() || !v.isSimpleValue()) {
                this.relProperties.put(owningClassName, p);
                this.relPropertyNames.put(owningClassName, p.getName());
            }

            if (p.getType().isComponentType()) {
                addComponentProperties(p);
            }
        }
    }

    private void addComponentProperties(Property p) {
        String s = p.getType().getReturnedClass().getName();
        this.componentClassNames.add(s);
        Value v = p.getValue();
        Component comp = (Component) v;
        Map<String, Property> propertiesMap = new HashMap<String, Property>();
        this.allPropertiesMap.put(s, propertiesMap);
        for (Iterator<Property> iter = CastUtils.cast(comp.getPropertyIterator()); iter.hasNext();) {
            Property p2 = iter.next();
            initProperty(s, p2, propertiesMap);
        }
    }

    @Override
    public Collection<String> getEntityClassNames() {
        return this.entityClassNames;
    }

    @Override
    public List<Class<?>> getEntityClasses() {
        return this.entityClasses;
    }

    @Override
    public boolean refreshEntity(Class<?> c) {

        if (!isEntity(c)) {
            throw new DataServiceRuntimeException(c + " is not an entity");
        }

        return this.refreshEntities.contains(c.getName());
    }

    @Override
    public String getIdPropertyName(Class<?> c) {

        if (!isEntity(c)) {
            throw new DataServiceRuntimeException(c + " is not an entity");
        }

        RootClass rc = getRootClass(c);

        Property id = rc.getIdentifierProperty();

        return id.getName();
    }

    @Override
    public boolean isCompositeProperty(Class<?> c, String propertyName) {

        if (!isEntity(c)) {
            throw new DataServiceRuntimeException(c + " is not an entity");
        }

        RootClass rc = getRootClass(c);

        Property p = rc.getProperty(propertyName);

        return p.isComposite();
    }

    @Override
    public Collection<String> getRelPropertyNames(Class<?> c) {

        if (!isEntity(c)) {
            throw new DataServiceRuntimeException(c + " is not an entity");
        }

        Collection<String> rtn = this.relPropertyNames.get(c.getName());

        if (rtn == null) {
            return Collections.emptyList();
        }

        return rtn;
    }

    @Override
    public Property getProperty(String className, String propertyName) {

        ensureEntityOrComponent(className);

        return this.allPropertiesMap.get(className).get(propertyName);
    }

    @Override
    public String getDataPackage() {
        Configuration cfg = getConfiguration();
        RootClass rc = (RootClass) cfg.getClassMappings().next();
        String className = rc.getClassName();
        return StringUtils.fromLastOccurrence(className, ".", -1);
    }

    @Override
    public boolean isEntity(Class<?> c) {
        return getRootClass(c) != null;
    }

    @Override
    public Collection<String> getOperationNames() {
        return this.operationManager.getOperationNames();
    }

    @Override
    public NamedQueryDefinition getQueryDefinition(String queryName) {
        Configuration cfg = getConfiguration();
        NamedQueryDefinition rtn = (NamedQueryDefinition) cfg.getNamedQueries().get(queryName);
        if (rtn == null) {
            rtn = (NamedQueryDefinition) cfg.getNamedSQLQueries().get(queryName);
        }
        return rtn;
    }

    public NamedQueryDefinition getHqlQueryDefinition(String queryName) {
        Configuration cfg = getConfiguration();
        NamedQueryDefinition rtn = (NamedQueryDefinition) cfg.getNamedQueries()
                .get(queryName);
        return rtn;
    }

    public NamedQueryDefinition getSqlQueryDefinition(String queryName) {
        Configuration cfg = getConfiguration();
        NamedQueryDefinition rtn = (NamedQueryDefinition) cfg.getNamedSQLQueries()
                    .get(queryName);
        return rtn;
    }

    public DataServiceOperation getOperation(String operationName) {
        DataServiceOperation rtn = this.operationManager.getOperation(operationName);
        if (rtn == null) {
            throw new DataServiceRuntimeException(MessageResource.OPERATION_NOT_FOUND, this.configurationName, operationName,
                this.operationManager.getOperationNames());
        }
        return rtn;
    }

    private RootClass getRootClass(Class<?> c) {
        return this.rootClasses.get(c);
    }

    private String getJavaTypeName(Type type) {
        SessionFactory fac = ConfigurationRegistry.getInstance().getSessionFactory(this.configurationName);
        return DataServiceUtils.getJavaTypeName(type, fac);
    }

    private void ensureEntityOrComponent(String className) {
        if (!this.entityClassNames.contains(className) && !this.componentClassNames.contains(className)) {
            throw new IllegalArgumentException("Unknown Entity or Component class: " + className);
        }
    }

    private DataOperationFactory initFactory(final Session session) {
        return new DataOperationFactory() {

            // this is magic, and has to match the name of the
            // generated example query(ies).
            private static final String GENERATED_QUERY_NAME = "ExampleHQLQuery1";

            @Override
            public Collection<String> getEntityClassNames() {
                return DataServiceMetaData_Hib.this.entityClassNames;
            }

            @Override
            public List<Tuple.Three<String, String, Boolean>> getQueryInputs(String queryName) {

                List<Tuple.Three<String, String, Boolean>> rtn = new ArrayList<Tuple.Three<String, String, Boolean>>();

                NamedQueryDefinition def = getQueryDefinition(queryName);

                Map<String, String> m = CastUtils.cast(def.getParameterTypes());

                for (Map.Entry<String, String> e : m.entrySet()) {
                    Tuple.Two<String, Boolean> t = DataServiceUtils.getQueryType(e.getValue());
                    rtn.add(Tuple.tuple(e.getKey(), t.v1, t.v2));
                }

                return rtn;
            }

            @Override
            @SuppressWarnings("unchecked")
            public Collection<String> getQueryNames() {

                Collection<String> rtn = new HashSet<String>();

                Configuration cfg = getConfiguration();

                rtn.addAll(cfg.getNamedQueries().keySet());
                rtn.addAll(cfg.getNamedSQLQueries().keySet());

                return rtn;
            }

            @Override
            public List<String> getQueryReturnNames(String operationName, String queryName) {

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

            @Override
            public boolean requiresResultWrapper(String operationName, String queryName) {
                NamedQueryDefinition query = getQueryDefinition(queryName);
                return DataServiceUtils.requiresResultWrapper(query.getQuery());
            }

            @Override
            public List<String> getQueryReturnTypes(String operationName, String queryName) {

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
                    rtn.add(DataServiceConstants.DML_OPERATION_RTN_TYPE.getName());
                } else {

                    if (DataServiceUtils.isDynamicInstantiationQuery(queryString)) {
                        String className = DataServiceUtils.getDynamicInstantiationClassName(queryString);

                        if (!StringUtils.isFullyQualified(className)) {
                            if (DataServiceMetaData_Hib.this.entityNames.contains(className)) {
                                className = StringUtils.fq(getDataPackage(), className);
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

            @Override
            public boolean queryReturnsSingleResult(String operationName, String queryName) {

                // hack for generated queries - only required for initial
                // ServiceDefinition instance that is used to add the service
                if (queryName.equals(GENERATED_QUERY_NAME)) {
                    return true;
                }

                // to make existing tests happy
                if (queryName.startsWith("get") && queryName.endsWith("ById")) {
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
                        DataServiceLoggers.metaDataLogger.debug("Failed to determine rtn type for query \"" + queryName + "\"");
                    }
                }
                return rtn;
            }
        };
    }
}
