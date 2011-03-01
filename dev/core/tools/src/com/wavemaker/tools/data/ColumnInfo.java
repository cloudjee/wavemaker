/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.data;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.XMLUtils;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.data.parser.HbmConstants;

/**
 * Wrapper around Column.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class ColumnInfo implements Cloneable {

    private String name = null;

    private String sqlType = null;

    private String generator = null;

    // instead of generic generator params, we only support the "sequence name"
    // for now
    // private Map<String, String> generatorParams = new LinkedHashMap<String,
    // String>();
    private String sequenceName = null;

    private Integer length = null;

    private Integer precision = null;

    private boolean notNull = false;

    private boolean isPk = false;

    private boolean isFk = false;

    private boolean persistType = true;

    public static ColumnInfo newColumnInfo(PropertyInfo parentProperty) {
        return newColumnInfo(parentProperty, Collections
                .<String, String> emptyMap());
    }

    public static ColumnInfo newColumnInfo(PropertyInfo parentProperty,
            Map<String, String> attributes) {

        ColumnInfo rtn = new ColumnInfo();

        rtn.setNotNull(Boolean.parseBoolean(attributes
                .get(HbmConstants.FQ_COL_NOT_NULL_ATTR)));
        String name = attributes.get(HbmConstants.FQ_COL_NAME_ATTR);
        if (ObjectUtils.isNullOrEmpty(name)) {
            rtn.setName(parentProperty.getName());
        } else {
            rtn.setName(name);
        }

        String type = attributes.get(HbmConstants.FQ_COL_TYPE_ATTR);
        if (type == null) {
            // use property type - need the correctly mapped sql type
            // here
            if (parentProperty.getIsRelated()) {
                // if this is a related property, the actual col type will
                // be set after all entities have been instantiated
                // see EntityInfo.initFkColumnTypes
            } else {
                if (parentProperty.getType() != null) {
                    type = parentProperty.getType();
                    rtn.persistType(false);
                }
            }
        }
        if (type != null) {
            rtn.setSqlType(type);
        }

        String length = attributes.get(HbmConstants.FQ_COL_LENGTH_ATTR);
        if (length != null) {
            rtn.setLength(Integer.valueOf(length));
        }

        String precision = attributes.get(HbmConstants.FQ_COL_PRECISION_ATTR);
        if (precision != null) {
            rtn.setPrecision(Integer.valueOf(precision));
        }

        if (parentProperty.getIsId()) {
            rtn.setIsPk(true);
            rtn.setNotNull(true);

            String generator = attributes.get(HbmConstants.FQ_GEN_TYPE_ATTR);

            if (!ObjectUtils.isNullOrEmpty(generator)) {

                rtn.setGenerator(generator);

                if (generator.equals(HbmConstants.SEQUENCE_GENERATOR)) {
                    
                    String prefix = HbmConstants.GEN_PARAM_EL + XMLUtils.SCOPE_SEP;                    

                    Collection<String> c = ObjectUtils.getKeysStartingWith(
                            prefix, attributes);

                    for (String s : c) {
                        String paramName = s.substring(prefix.length());
                        if (paramName.equals(HbmConstants.SEQUENCE_NAME_PARAM)) {
                            rtn.sequenceName = attributes.get(s);
                        }
                    }
                }
            }
        }

        if (parentProperty.getIsRelated()) {
            rtn.setIsFk(true);
        }

        return rtn;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSqlType(String sqlType) {
        this.sqlType = sqlType;
    }

    public String getSqlType() {
        return sqlType;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public Integer getLength() {
        return length;
    }

    public void setPrecision(Integer precision) {
        this.precision = precision;
    }

    public Integer getPrecision() {
        return precision;
    }

    public boolean getNotNull() {
        return notNull;
    }

    public void setNotNull(boolean b) {
        this.notNull = b;
    }
    
    public boolean generated() {
        return generator != null && !generator.equals(DataServiceConstants.GENERATOR_ASSIGNED);
    }

    public String getGenerator() {
        return generator;
    }

    public void setGenerator(String s) {
        generator = s;
    }

    public boolean getIsPk() {
        return isPk;
    }

    public void setIsPk(boolean b) {
        isPk = b;
    }

    public boolean getIsFk() {
        return isFk;
    }

    public void setGeneratorParam(String s) {
        sequenceName = s;
    }

    public String getGeneratorParam() {
        return sequenceName;
    }

    public void setIsFk(boolean b) {
        isFk = b;
    }

    public void persistType(boolean b) {
        persistType = b;
    }

    public boolean shouldPersistType() {
        return persistType;
    }

    @Override
    public Object clone() {
        try {
            return super.clone();
        } catch (CloneNotSupportedException ex) {
            throw new AssertionError(ex);
        }
    }
    
    public boolean onlyGeneratorHasChanged(ColumnInfo o) {
        return isEqualTo(o, true);
    }
    
    public boolean isEqualTo(ColumnInfo o) {
        return isEqualTo(o, false);
    }
    

    private boolean isEqualTo(ColumnInfo o, boolean ignoreGenerator) {
        if (o == null) {
            return false;
        }
        boolean rtn = true;
        
        if (!ignoreGenerator) {
            rtn &= String.valueOf(generator).equals(
                    String.valueOf(o.generator));
            rtn &= String.valueOf(sequenceName).equals(
                    String.valueOf(o.sequenceName));
        }
        
        // don't check for fk - fk boolean is read only on client
        //rtn &= String.valueOf(isFk).equals(String.valueOf(o.isFk));
        
        rtn &= String.valueOf(isPk).equals(String.valueOf(o.isPk));
        rtn &= String.valueOf(length).equals(String.valueOf(o.length));
        rtn &= String.valueOf(name).equals(String.valueOf(o.name));
        rtn &= String.valueOf(notNull).equals(String.valueOf(o.notNull));
        rtn &= String.valueOf(precision).equals(String.valueOf(o.precision));
        rtn &= String.valueOf(sqlType).equals(String.valueOf(o.sqlType));

        return rtn;
    }
    
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(name);
        if (generator != null) {
            sb.append(" generator:");
            sb.append(generator);
            if (sequenceName != null) {
                sb.append(sequenceName);
            }
        }
        sb.append(" not-null:" + notNull);
        if (length != null) {
            sb.append(" length:" + length);
        }
        return sb.toString();
    }
}
