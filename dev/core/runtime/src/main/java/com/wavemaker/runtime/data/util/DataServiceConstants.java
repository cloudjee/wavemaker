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

package com.wavemaker.runtime.data.util;

import com.wavemaker.json.AlternateJSONTransformer;

/**
 * @author Simon Toens
 */
public class DataServiceConstants {

    public static final Class<?> DEFAULT_COLLECTION_TYPE = java.util.Set.class;

    public static final String GENERATE_OLD_STYLE_OPRS_PROPERTY = "useIndividualCRUDOperations";

    public static final String REFRESH_ENTITIES_PROPERTY = "refreshEntities";

    public static final String SPRING_CFG_MAPPINGS_ATTR = "mappingResources";

    public static final String SPRING_CFG_LOCATIONS_ATTR = "locations";

    public static final String QUERY_EXT = ".ql.xml";

    public static final String DEFAULT_QUERY_FILE = "app-queries" + QUERY_EXT;

    public static final String HBM_EXT = ".hbm.xml";

    public static final String DEFAULT_FILTER = ".*";

    public static final String SQL_SERVER_DEFAULT_SCHEMA = "dbo";

    public static final String SPRING_CFG_EXT = ".spring.xml";

    public static final String ANNO_CHAR = "@";

    public static final String DESIGN_ANNO_CHAR = ANNO_CHAR + "design.";

    public static final String DEFAULT_QUERY_STORE = DESIGN_ANNO_CHAR + "default-queries";

    public static final String GENERATED_QUERY = DESIGN_ANNO_CHAR + "generated";

    public static final String HIBERNATE_USER_PROPERTY = "hibernate.connection.username";

    public static final String HIBERNATE_PASS_PROPERTY = "hibernate.connection.password";

    public static final String HIBERNATE_DRIVER_CLASS_NAME_PROPERTY = "hibernate.connection.driver_class";

    public static final String HIBERNATE_CONNECTION_URL_PROPERTY = "hibernate.connection.url";

    public static final String HIBERNATE_DIALECT_PROPERTY = "hibernate.dialect";

    public static final String DB_USERNAME = ".username";

    public static final String DB_PASS = ".password";

    public static final String DB_URL = ".connectionUrl";

    public static final String DB_URL_KEY = DB_URL.substring(1);

    public static final String DB_DRIVER_CLASS_NAME = ".driverClassName";

    public static final String DB_DIALECT = ".dialect";

    public static final String DB_TABLE_FILTER = ".tableFilter";

    public static final String DB_SCHEMA_FILTER = ".schemaFilter";

    public static final String DB_REVENG_NAMING = ".reverseNamingStrategy";

    public static final String DB_TYPE = "type";

    public static final String PROPERTIES_FILE_BASENAME_SEP = "_";

    public static final String PROPERTIES_FILE_EXT = ".properties";

    public static final String COUNT_OP_SUFFIX = "Count";

    public static final String JAVA_EXT = ".java";

    public static final Class<Integer> DML_OPERATION_RTN_TYPE = Integer.class;

    public final static String DEFAULT_PACKAGE_ROOT = "com.";

    public final static String DATA_PACKAGE_NAME = "data";

    public static final String OUTPUT_PACKAGE_NAME = "output";

    public static final String PROP_SEP = "" + AlternateJSONTransformer.PROP_SEP;

    public static final String OLD_SESSION_FACTORY_CLASS_NAME = "com.activegrid.runtime.data.spring.AGLocalSessionFactoryBean";

    public static final String OLD_SPRING_DATA_SERVICE_MANAGER_NAME = "com.activegrid.runtime.data.spring.SpringDataServiceManager";

    public static final String OLD_TASK_MANAGER_NAME = "com.activegrid.runtime.data.DefaultTaskManager";

    public static final String COLUMN_NODE = "COL";

    public static final String RELATIONSHIP_NODE = "REL";

    public static final String PROPERTY_NODE = "PROP";

    public static final String ENTITY_NODE = "TBL";

    public static final String PK_IMAGE = "images/key_16.png";

    public static final String TO_ONE_IMAGE = "images/to_one_16.png";

    public static final String TO_MANY_IMAGE = "images/to_many_16.png";

    public static final String SELECT_KEYWORD = "select";

    public static final String GENERATOR_IDENTITY = "identity";

    public static final String GENERATOR_ASSIGNED = "assigned";

    public static final String GENERATOR_SEQUENCE = "sequence";

    public static final String WEB_ROOT_TOKEN = "{WebAppRoot}";

    public static final String HSQL_URL_PREFIX = "jdbc:hsqldb:file:";

    public static final String HSQL_URL_SUFFIX = ";shutdown=true;ifexists=true";

    public static final String CURRENT_PROJECT_MANAGER = "currentProjectManager";

    public static final String CURRENT_PROJECT_NAME = "currentProjectName";

    public static final String CURRENT_PROJECT_APP_ROOT = "currentProjectRoot";

    public static final String WAVEMAKER_STUDIO = "WaveMaker Studio";

    public static final String TENANT_FIELD_PROPERTY_NAME = "tenantIdField";

    public static final String TENANT_COLUMN_PROPERTY_NAME = "tenantIdColumn";

    public static final String DEFAULT_TENANT_ID_PROPERTY_NAME = "defTenantId";

    public static final String DEFAULT_TENANT_FIELD = "None";

    public static final int DEFAULT_TENANT_ID = 999;

    private DataServiceConstants() {
        throw new UnsupportedOperationException();
    }

}
