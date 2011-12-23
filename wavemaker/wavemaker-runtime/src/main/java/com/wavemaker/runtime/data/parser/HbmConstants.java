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

package com.wavemaker.runtime.data.parser;

import java.util.Collection;
import java.util.HashSet;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.runtime.data.util.DataServiceConstants;

/**
 * @author Simon Toens
 */
public class HbmConstants {

    private HbmConstants() {
        throw new UnsupportedOperationException();
    }

    public static final String MAPPING_EL = "hibernate-mapping";

    public static final String CLASS_EL = "class";

    public static final String META_EL = "meta";

    public static final String COL_EL = "column";

    public static final String GEN_EL = "generator";

    public static final String GEN_PARAM_EL = "param";

    public static final String QUERY_EL = "query";

    public static final String QUERY_PARAM_EL = "query-param";

    public static final String TABLE_ATTR = "table";

    public static final String SCHEMA_ATTR = "schema";

    public static final String CATALOG_ATTR = "catalog";

    public static final String NAME_ATTR = "name";

    public static final String COMMENT_ATTR = "comment";

    public static final String TYPE_ATTR = "type";

    public static final String COL_TYPE_ATTR = "sql-type";

    public static final String LENGTH_ATTR = "length";

    public static final String PRECISION_ATTR = "precision";

    public static final String NOT_NULL_ATTR = "not-null";

    public static final String META_VALUE_ATTR = "attribute";

    public static final String COMP_ID_EL = "composite-id";

    public static final String COMPONENT_EL = "component";

    public static final String ID_EL = "id";

    public static final String TO_ONE_EL = "many-to-one";

    public static final String TO_MANY_EL = "one-to-many";

    public static final String PROP_EL = "property";

    public static final String SET_EL = "set";

    public static final String KEY_EL = "key";

    public static final String KEY_PROP_EL = "key-property";

    public static final String COMPONENT_TYPE_ATTR = "class";

    public static final String COMP_ID_TYPE_ATTR = "class";

    public static final String TO_MANY_TYPE_ATTR = "class";

    public static final String TO_ONE_TYPE_ATTR = "class";

    public static final String GEN_TYPE_ATTR = "class";

    public static final String INVERSE_ATTR = "inverse";

    public static final String FETCH_ATTR = "fetch";

    public static final String INSERT_ATTR = "insert";

    public static final String UPDATE_ATTR = "update";

    public static final String DYNAMIC_INSERT = "dynamic-insert";

    public static final String DYNAMIC_UPDATE = "dynamic-update";

    public static final String CASCADE_ATTR = "cascade";

    public static final String FQ_TO_MANY_TYPE_ATTR = fq(TO_MANY_EL, TO_MANY_TYPE_ATTR);

    public static final String FQ_GEN_TYPE_ATTR = fq(GEN_EL, GEN_TYPE_ATTR);

    public static final String FQ_GEN_PARAM_NAME_ATTR = fq(GEN_PARAM_EL, NAME_ATTR);

    public static final String FQ_COL_NAME_ATTR = fq(COL_EL, NAME_ATTR);

    public static final String FQ_COL_LENGTH_ATTR = fq(COL_EL, LENGTH_ATTR);

    public static final String FQ_COL_PRECISION_ATTR = fq(COL_EL, PRECISION_ATTR);

    public static final String FQ_COL_TYPE_ATTR = fq(COL_EL, COL_TYPE_ATTR);

    public static final String FQ_COL_NOT_NULL_ATTR = fq(COL_EL, NOT_NULL_ATTR);

    public static final String SEQUENCE_GENERATOR = DataServiceConstants.GENERATOR_SEQUENCE;

    public static final String SEQUENCE_NAME_PARAM = "sequence";

    public static final Collection<String> PROP_WRAPPER_ELS = new HashSet<String>(2);
    static {
        PROP_WRAPPER_ELS.add(COMP_ID_EL);
        PROP_WRAPPER_ELS.add(COMPONENT_EL);
    }

    public static final String HBM_SYSTEM_ID = "http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd";

    public static final String HBM_PUBLIC_ID = "-//Hibernate/Hibernate Mapping DTD 3.0//EN";

    private static String fq(String s1, String s2) {
        return StringUtils.fq(s1, s2);
    }

}
