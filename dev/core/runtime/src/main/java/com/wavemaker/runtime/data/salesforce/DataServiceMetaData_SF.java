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

package com.wavemaker.runtime.data.salesforce;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;
import java.io.InputStream;
import java.io.InputStreamReader;


import org.hibernate.Session;
import org.hibernate.cfg.Configuration;
import org.hibernate.engine.NamedQueryDefinition;
import org.hibernate.mapping.Property;

import com.wavemaker.common.Resource;
import com.wavemaker.common.util.*;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.data.parser.HbmQueryParser;
import com.wavemaker.runtime.data.*;
import com.wavemaker.runtime.ws.salesforce.SalesforceSupport;

/**
 * Wraps a Salesforce Data Source Configuration with convenience methods.
 * 
 * @author slee
 */
public class DataServiceMetaData_SF implements DataServiceMetaData {

    //private final Configuration cfg;

    private DataServiceOperationManager operationManager = null;

    // entity classes
    private final List<Class<?>> entityClasses = 
        new ArrayList<Class<?>>();

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

    public DataServiceMetaData_SF(String configurationName
                                  //Configuration cfg
                                    ) {
        this(configurationName, Collections.<String, String> emptyMap());
    }

    public DataServiceMetaData_SF(String configurationName,
                               //Configuration cfg,
                               Map<String, String> properties) 
    {
        this.configurationName = configurationName;
        //this.cfg = cfg;

        String s = 
            properties.get(DataServiceConstants.REFRESH_ENTITIES_PROPERTY);

        if (s == null) {
            refreshEntities = Collections.emptySet();
        } else {
            refreshEntities = new HashSet<String>(StringUtils.split(s));
        }

        initMappingData();

    }


    public void init(Session session, boolean useIndividualCRUDOperations) {}

    /**
     * Must be called before calling any other methods on this instance.
     * 
     * @param configurationName
     *                A valid configuration name.
     */
    public void init(String configurationName) {

        DataOperationFactory fac = initFactory(configurationName);

        operationManager = new DataServiceOperationManager(fac, false);
    }

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
        return null;
    }

    private void initMappingData() {
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

        return null;
    }

    public boolean isCompositeProperty(Class<?> c, String propertyName) {

        return false;
    }

    public Collection<String> getRelPropertyNames(Class<?> c) {

        return null;
    }

    public Property getProperty(String className, String propertyName) {

        return null;
    }

    public String getDataPackage() {

        return null;
    }

    public boolean isEntity(Class<?> c) {
        return false;
    }

    public Collection<String> getOperationNames() {
        return operationManager.getOperationNames();
    }

    public NamedQueryDefinition getQueryDefinition(String queryName) {

        return null;
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

    private DataOperationFactory initFactory(String configurationName) {
        return new DataOperationFactory() {

            // this is magic, and has to match the name of the
            // generated example query(ies).
            private static final String GENERATED_QUERY_NAME =
                "ExampleHQLQuery1";

            private static final String qfname = "com/sforce/queries/sforce-queries.xml";
            private HbmQueryParser p;
            private Map<String, QueryInfo> queries = null;

            {
                InputStream is = ClassLoaderUtils.getResourceAsStream(qfname);
                p = new HbmQueryParser(new InputStreamReader(is));

                queries = p.getQueries();
            }

            public Collection<String> getEntityClassNames() {
                return entityClassNames;
            }

            public List<Tuple.Three<String, String, Boolean>> getQueryInputs(
                    String queryName) {

                List<Tuple.Three<String, String, Boolean>> rtn =
                    new ArrayList<Tuple.Three<String, String, Boolean>>();

                Input[] inputs = queries.get(queryName).getInputs();

                for (Input input : inputs) {
                    Tuple.Three<String, String, Boolean> t =
                            new Tuple.Three<String, String, Boolean>(input.getParamName(), input.getParamType(),
                                    input.getList());
                    rtn.add(t);
                }

                return rtn;
            }

            @SuppressWarnings("unchecked")
            public Collection<String> getQueryNames() {

                Collection<String> rtn = new HashSet<String>();

                rtn.addAll(queries.keySet());

                return rtn;
            }

            public List<String> getQueryReturnNames(String operationName,
                    String queryName) {

                String query = queries.get(queryName).getQuery();

                List<String> fldList;

                SalesforceSupport sfs = new SalesforceSupport();
                fldList = sfs.getColumns(query);

                if (fldList == null || fldList.size() == 0)
                    return Collections.emptyList();

                List<String> rtn = new ArrayList<String>();
                int num = 0;
                for (String fld : fldList) {
                    String cnum = "" + num;
                    rtn.add(cnum);
                    num++;
                }

                return rtn;
            }

            public boolean requiresResultWrapper(String operationName,
                    String queryName) {
                return true;
            }

            public List<String> getQueryReturnTypes(String operationName,
                    String queryName) {

                String query = queries.get(queryName).getQuery();

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

            public boolean queryReturnsSingleResult(String operationName,
                    String queryName) {

                // hack for generated queries - only required for initial
                // ServiceDefinition instance that is used to add the service
                /*if (queryName.equals(GENERATED_QUERY_NAME)) {
                    return true;
                }

                // to make existing tests happy
                if (queryName.startsWith("get") && queryName.endsWith(("ById"))) {
                    return true;
                }*/

                return false;
            }
        };
    }
}
