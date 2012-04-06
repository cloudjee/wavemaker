/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.data.salesforce;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import org.hibernate.Session;
import org.hibernate.cfg.Configuration;
import org.hibernate.engine.NamedQueryDefinition;
import org.hibernate.mapping.Property;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.runtime.data.DataOperationFactory;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.DataServiceOperation;
import com.wavemaker.runtime.data.DataServiceOperationManager;
import com.wavemaker.runtime.data.DataServiceRuntimeException;
import com.wavemaker.runtime.data.Input;
import com.wavemaker.runtime.data.QueryInfo;
import com.wavemaker.runtime.data.parser.HbmQueryParser;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.ws.salesforce.SalesforceSupport;

/**
 * Wraps a Salesforce Data Source Configuration with convenience methods.
 * 
 * @author Seung Lee
 */
public class SalesForceDataServiceMetaData implements DataServiceMetaData {

    private DataServiceOperationManager operationManager = null;

    // entity classes
    private final List<Class<?>> entityClasses = new ArrayList<Class<?>>();

    // Entity class names in alphabetical order
    private final SortedSet<String> entityClassNames = new TreeSet<String>();

    // Helper classes that are not part of the data model
    // Right now we only have query result wrappers
    private Collection<String> helperClassNames = Collections.emptySet();

    // entities to refresh after insert/update
    private final Set<String> refreshEntities;

    // used for messages
    private final String configurationName;

    private String serviceClassName = null;

    public SalesForceDataServiceMetaData(String configurationName) {
        this(configurationName, Collections.<String, String> emptyMap());
    }

    public SalesForceDataServiceMetaData(String configurationName, Map<String, String> properties) {
        this.configurationName = configurationName;
        // this.cfg = cfg;

        String s = properties.get(DataServiceConstants.REFRESH_ENTITIES_PROPERTY);

        if (s == null) {
            this.refreshEntities = Collections.emptySet();
        } else {
            this.refreshEntities = new HashSet<String>(StringUtils.split(s));
        }

        initMappingData();

    }

    @Override
    public void init(Session session, boolean useIndividualCRUDOperations) {
    }

    /**
     * Must be called before calling any other methods on this instance.
     * 
     * @param configurationName A valid configuration name.
     */
    @Override
    public void init(String configurationName) {

        DataOperationFactory fac = initFactory(configurationName);

        this.operationManager = new DataServiceOperationManager(fac, false);
    }

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
        return null;
    }

    private void initMappingData() {
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

        return null;
    }

    @Override
    public boolean isCompositeProperty(Class<?> c, String propertyName) {

        return false;
    }

    @Override
    public Collection<String> getRelPropertyNames(Class<?> c) {

        return null;
    }

    @Override
    public Property getProperty(String className, String propertyName) {

        return null;
    }

    @Override
    public String getDataPackage() {

        return null;
    }

    @Override
    public boolean isEntity(Class<?> c) {
        return false;
    }

    @Override
    public Collection<String> getOperationNames() {
        return this.operationManager.getOperationNames();
    }

    @Override
    public NamedQueryDefinition getQueryDefinition(String queryName) {

        return null;
    }

    @Override
    public DataServiceOperation getOperation(String operationName) {
        DataServiceOperation rtn = this.operationManager.getOperation(operationName);
        if (rtn == null) {
            throw new DataServiceRuntimeException(MessageResource.OPERATION_NOT_FOUND, this.configurationName, operationName,
                this.operationManager.getOperationNames());
        }
        return rtn;
    }

    @Override
    public NamedQueryDefinition getHqlQueryDefinition(String queryName) {
        return null;
    }

    @Override
    public NamedQueryDefinition getSqlQueryDefinition(String queryName) {
        return null;
    }

    private DataOperationFactory initFactory(String configurationName) {
        return new DataOperationFactory() {

            private static final String qfname = "com/sforce/queries/sforce-queries.xml";

            private HbmQueryParser p;

            private Map<String, QueryInfo> queries = null;

            {
                InputStream is = ClassLoaderUtils.getResourceAsStream(qfname);
                this.p = new HbmQueryParser(new InputStreamReader(is));

                this.queries = this.p.getQueries();
            }

            @Override
            public Collection<String> getEntityClassNames() {
                return SalesForceDataServiceMetaData.this.entityClassNames;
            }

            @Override
            public List<Tuple.Three<String, String, Boolean>> getQueryInputs(String queryName) {

                List<Tuple.Three<String, String, Boolean>> rtn = new ArrayList<Tuple.Three<String, String, Boolean>>();

                Input[] inputs = this.queries.get(queryName).getInputs();

                for (Input input : inputs) {
                    Tuple.Three<String, String, Boolean> t = new Tuple.Three<String, String, Boolean>(input.getParamName(), input.getParamType(),
                        input.getList());
                    rtn.add(t);
                }

                return rtn;
            }

            @Override
            public Collection<String> getQueryNames() {

                Collection<String> rtn = new HashSet<String>();

                rtn.addAll(this.queries.keySet());

                return rtn;
            }

            @Override
            public List<String> getQueryReturnNames(String operationName, String queryName) {

                String query = this.queries.get(queryName).getQuery();

                List<String> fldList;

                SalesforceSupport sfs = new SalesforceSupport();
                fldList = sfs.getColumns(query);

                if (fldList == null || fldList.size() == 0) {
                    return Collections.emptyList();
                }

                List<String> rtn = new ArrayList<String>();
                int num = 0;
                for (String fld : fldList) {
                    String cnum = "" + num;
                    rtn.add(cnum);
                    num++;
                }

                return rtn;
            }

            @Override
            public boolean requiresResultWrapper(String operationName, String queryName) {
                return true;
            }

            @Override
            public List<String> getQueryReturnTypes(String operationName, String queryName) {

                String query = this.queries.get(queryName).getQuery();

                List<String> types;

                SalesforceSupport sfs = new SalesforceSupport();
                try {
                    types = sfs.getColumnTypes(query);
                } catch (Exception e) {
                    e.printStackTrace();
                    return null;
                }

                return types;
            }

            @Override
            public boolean queryReturnsSingleResult(String operationName, String queryName) {

                // hack for generated queries - only required for initial
                // ServiceDefinition instance that is used to add the service
                /*
                 * if (queryName.equals(GENERATED_QUERY_NAME)) { return true; }
                 * 
                 * // to make existing tests happy if (queryName.startsWith("get") && queryName.endsWith(("ById"))) {
                 * return true; }
                 */

                return false;
            }
        };
    }
}
