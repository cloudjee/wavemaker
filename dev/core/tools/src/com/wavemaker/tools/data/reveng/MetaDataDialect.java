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
package com.wavemaker.tools.data.reveng;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.DataServiceLoggers;

/**
 * Use for Postgres, SQLServer, HSQLDB import.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class MetaDataDialect extends BasicMetaDataDialect {

    @Override
    public Iterator<Map<String, String>> getSuggestedPrimaryKeyStrategyName(
            String catalog, String schema, String table) {

        String pkStrategy = null;

        ResultSet rs = null;

        Statement stmt = null;

        try {

            stmt = getConnection().createStatement();

            String sql = getSQL(catalog, schema, table);

            if (DataServiceLoggers.importLogger.isDebugEnabled()) {
                DataServiceLoggers.importLogger
                        .debug("getSuggestedPrimaryKeyStrategyName: " + sql);
            }

            rs = stmt.executeQuery(sql);

            ResultSetMetaData rsmd = rs.getMetaData();
            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                if (rsmd.isAutoIncrement(i)) {
                    pkStrategy = DataServiceConstants.GENERATOR_IDENTITY;
                    break;
                }
            }

        } catch (SQLException ex) {
            throw new ConfigurationException(ex);
        } finally {
            try {
                rs.close();
            } catch (Exception ignore) {
            }
            try {
                stmt.close();
            } catch (Exception ignore) {
            }
        }

        Map<String, String> m = new HashMap<String, String>(4);
        m.put("TABLE_CAT", catalog);
        m.put("TABLE_SCHEMA", schema);
        m.put("TABLE_NAME", table);
        m.put("HIBERNATE_STRATEGY", pkStrategy);
        List<Map<String, String>> l = new ArrayList<Map<String, String>>(1);
        l.add(m);
        return l.iterator();
    }

    protected String getSQL(String catalog, String schema, String table) {

        String rtn = "select * from ";

        if (catalog != null) {
            rtn += quote(catalog) + getCatalogSeparator();
        }
        if (schema != null) {
            rtn += quote(schema) + getCatalogSeparator();
        }
        rtn += quote(table) + " where 1=0";

        return rtn;
    }
}
