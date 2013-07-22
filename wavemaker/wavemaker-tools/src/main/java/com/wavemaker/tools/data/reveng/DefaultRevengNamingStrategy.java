/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

package com.wavemaker.tools.data.reveng;

import org.hibernate.cfg.reveng.DelegatingReverseEngineeringStrategy;
import org.hibernate.cfg.reveng.ReverseEngineeringStrategy;
import org.hibernate.cfg.reveng.TableIdentifier;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.Tuple;

import java.sql.Types;

/**
 * @author Simon Toens
 */
public class DefaultRevengNamingStrategy extends DelegatingReverseEngineeringStrategy implements ReverseEngineeringStrategy {

    public DefaultRevengNamingStrategy(ReverseEngineeringStrategy delegate) {
        super(delegate);
    }

    @Override
    public String columnToPropertyName(TableIdentifier table, String columnName) {
        String rtn = super.columnToPropertyName(table, columnName);
        return StringUtils.toJavaIdentifier(rtn);
    }

    @Override
    public String tableToClassName(TableIdentifier tableIdentifier) {
        String rtn = super.tableToClassName(tableIdentifier);
        Tuple.Two<String, String> t = StringUtils.splitPackageAndClass(rtn);
        return StringUtils.fq(t.v1, StringUtils.toJavaIdentifier(t.v2));
    }

    @Override
    public String columnToHibernateTypeName(TableIdentifier table, String columnName, int sqlType, int length, 
                                            int precision, int scale, boolean nullable, boolean generatedIdentifier) {
        String type;

        if (sqlType == Types.CHAR && length == 1) {
            type = "string";
        } else {
            type = super.columnToHibernateTypeName(table, columnName, sqlType, length, precision, scale, nullable, generatedIdentifier);
        }

        return type;
    }
}
