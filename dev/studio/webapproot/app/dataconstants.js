/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
dojo.provide("wm.studio.app.dataconstants");

DML_OPERATIONS = ["insert", "update", "delete"];

// These have to match RelatedInfo.Cardinalty
ONE_TO_ONE = "to-one";
ONE_TO_ZERO_OR_ONE = "to-zero-or-one";
ONE_TO_MANY = "to-many";

// Has to match PropertyInfo.PK_META
PRIMARY_KEY = "pk";

DEFAULT_TABLE_FILTER = ".*";
DEFAULT_SCHEMA_FILTER = ".*";

DEFAULT_COL_PRECISION = "";
DEFAULT_COL_LENGTH = "";

HSQL_DB_TYPE = "HSQLDB";
MYSQL_DB_TYPE = "MySQL";
POSTGRESQL_DB_TYPE = "PostgreSQL"
ORACLE_DB_TYPE = "Oracle";
DB2_DB_TYPE =  "DB2";
SQL_SERVER_DB_TYPE = "SQLServer";
OTHER_DB_TYPE = "Other";

IDENTITY_GENERATOR = "identity";

HIBERNATE_INT_TYPE = "integer";
JAVA_INT_TYPE = "Integer";

HIBERNATE_STRING_TYPE = "string";

// Should match BaseDataModelSetup.DEFAULT_DB_TYPE
DEFAULT_DB_TYPE = MYSQL_DB_TYPE;

POSTGRESQL_DEFAULT_TABLE_FILTER = "^pg_.*";
POSTGRESQL_DEFAULT_SCHEMA_FILTER = "public";

SQL_SERVER_DEFAULT_SCHEMA = "dbo";

DEFAULT_PACKAGE_ROOT = "com.";
DATA_PACKAGE_NAME = ".data";

ROOT_NODE = "DBOBJS";
DATA_MODEL_ROOT_NODE = "DB";
QUERY_ROOT_NODE = "QRS";
ENTITY_ROOT_NODE = "TPS";
ENTITY_NODE = "TBL";
PROPERTY_NODE = "PROP";
COLUMN_NODE = "COL";
RELATIONSHIP_NODE = "REL";

CHECK_QUERY_OP = "checkQuery";
EXPORT_DB_OP = "exportDatabase";
IMPORT_DB_OP = "importDatabase";
LOAD_CONNECTION_PROPS_OP = "readConnectionProperties";
LOAD_DATA_MODEL_NAMES_OP = "getDataModelNames";
LOAD_DATA_TYPES_TREE_OP = "getTypeRefTree";
LOAD_DDL_OP = "getExportDDL";
LOAD_IP_OP = "getLocalHostIP";
LOAD_PRIMITIVES_OP = "listPrimitives";
LOAD_QUERIES_TREE_OP = "getQueriesTree";
LOAD_QUERY_OP = "getQuery";
NEW_DATA_MODEL_OP = "newDataModel";
REIMPORT_DB_OP = "reImportDatabase";
REMOVE_QUERY_OP = "deleteQuery";
RUN_QUERY_OP = "runQuery";
SAVE_CONNECTION_PROPS_OP = "writeConnectionProperties";
SAVE_QUERY_OP = "updateQuery";
TEST_CONNECTION_OP = "testConnection";

SALESFORCE_SERVICE = "salesforceService"; //xxx
