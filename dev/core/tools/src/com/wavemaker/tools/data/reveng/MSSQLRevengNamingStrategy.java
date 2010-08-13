/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.data.reveng;

import org.hibernate.cfg.reveng.DelegatingReverseEngineeringStrategy;
import org.hibernate.cfg.reveng.ReverseEngineeringStrategy;
import org.hibernate.cfg.reveng.TableIdentifier;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.Tuple;

import java.sql.Types;

/**
 * @author slee
 * 
 */
public class MSSQLRevengNamingStrategy extends DefaultRevengNamingStrategy {
    
    public MSSQLRevengNamingStrategy(ReverseEngineeringStrategy delegate) {
        super(delegate);
    }
    
    //Convert TEXT type in MS SQL Server into STRING type
    @Override
    public String columnToHibernateTypeName(TableIdentifier table, String columnName, int sqlType, int length,
                                            int precision, int scale, boolean nullable, boolean generatedIdentifier) {
        String type;

        if (sqlType == Types.CLOB) {
            type = "string";
        } else {
            type = super.columnToHibernateTypeName(table, columnName, sqlType, length, precision, scale,
                                                    nullable, generatedIdentifier);
        }

        return type;
    }
}
