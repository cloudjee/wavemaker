/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.StringTokenizer;

import org.apache.commons.logging.Log;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.runtime.data.DataServiceRuntimeException;

public class JDBCUtils {

    private JDBCUtils() {
        throw new UnsupportedOperationException();
    }

    public static void loadDriver(String driverClassName) {
        ClassLoaderUtils.loadClass(driverClassName);
    }

    public static Connection getConnection(String url, String username,
            String password, String driverClassName) {
        try {
            loadDriver(driverClassName);
            return DriverManager.getConnection(url, username, password);
        } catch (SQLException ex) {
            throw new DataServiceRuntimeException(ex);
        }
    }

    public static Object runSql(String[] sql, String url, String username,
            String password, String driverClassName) {
        return runSql(sql, url, username, password, driverClassName, false);
    }

    public static Object runSql(String[] sql, String url, String username,
            String password, String driverClassName, boolean isDDL) {
        return runSql(sql, url, username, password, driverClassName, null,
                isDDL);
    }

    public static Object runSql(String sql[], String url, String username,
            String password, String driverClassName, Log logger, boolean isDDL) {

        Connection con = getConnection(url, username, password, driverClassName);

        try {
            try {
                con.setAutoCommit(true);
            } catch (SQLException ex) {
                throw new DataServiceRuntimeException(ex);
            }

            Statement s = con.createStatement();

            try {
                try {
                    for (String stmt : sql) {
                        if (logger != null && logger.isInfoEnabled()) {
                            logger.info("Running " + stmt);
                        }
                        s.execute(stmt);
                    }
                    if (!isDDL) {
                        ResultSet r = s.getResultSet();
                        List<Object> rtn = new ArrayList<Object>();
                        while (r.next()) {
                            // getting only the first col is pretty unuseful
                            rtn.add(r.getObject(1));
                        }
                        return (Object[]) rtn.toArray(new Object[rtn.size()]);
                    }
                } catch (Exception ex) {
                    if (logger != null && logger.isErrorEnabled()) {
                        logger.error(ex.getMessage());
                    }
                    throw ex;
                }
            } finally {
                try {
                    s.close();
                } catch (Exception ignore) {
                }
            }
        } catch (Exception ex) {
            if (ex instanceof RuntimeException) {
                throw (RuntimeException) ex;
            } else {
                throw new DataServiceRuntimeException(ex);
            }
        } finally {
            try {
                con.close();
            } catch (Exception ignore) {
            }
        }

        return null;
    }

    public static void testMySQLConnection(String url, String username,
            String password, String driverClassName) {

        runSql(new String[] { "SHOW DATABASES" }, url, username, password,
                driverClassName);
    }

    public static void testOracleConnection(String url, String username,
            String password, String driverClassName) {

        runSql(new String[] { "SELECT TABLE_NAME FROM TABS" }, url, username,
                password, driverClassName);
    }

    public static void testSQLServerConnection(String url, String username,
            String password, String driverClassName) {

        runSql(new String[] { "SELECT NAME FROM master..sysdatabases" }, url,
                username, password, driverClassName);
    }

    //public static String reWriteConnectionUrl(String webAppRoot1, String connectionUrl)
    public static String reWriteConnectionUrl(String connectionUrl, String webAppRoot)
    {
        if (connectionUrl.contains(webAppRoot)) {
            return connectionUrl;
        }

        StringTokenizer cxnStrTokens = new StringTokenizer(connectionUrl, ":");
    	String driverType = null;
    	String dbType = null;
    	String dbFormat = null;
    	String dbFileName = null;
    	int index = 0;
    	
    	ArrayList<String> dbSettings = new ArrayList<String>();
    	
    	while (cxnStrTokens.hasMoreElements())
    	{
    		String token = cxnStrTokens.nextToken();
    		if (token.equals("jdbc") && (index == 0))
    		{
    			driverType = token;
    		}
    		
    		if (token.equals("hsqldb") && (index == 1))
    		{
    			dbType = token;
    		}
    		
    		if (token.equals("file") && (index == 2))
    		{
    			dbFormat = token;
    		}
    		
    		if (index == 3)
    		{
    			// get the file path
    			StringTokenizer dbFileCfgTokens = new StringTokenizer(token, ";");
    			dbFileName = dbFileCfgTokens.nextToken();
    			while (dbFileCfgTokens.hasMoreTokens())
    			{
    				dbSettings.add(dbFileCfgTokens.nextToken());
    			}
    		}
    		
    		index++;
    	}
    	
    	// Making sure it is the hsqldb file copy
    	assert((driverType != null) && driverType.equals("jdbc"));
    	assert((dbType != null) && dbType.equals("hsqldb"));
    	assert((dbFormat != null) && dbFormat.equals("file"));
    	assert((dbFileName != null));
    	assert(index == 4);
    	
    	//String hsqlDBName = webAppRoot + "/" +  dbFileName;
        String hsqlDBName = DataServiceConstants.WEB_ROOT_TOKEN + "/data/" + dbFileName;

        // Need more program logic for the settings on url
    	String cxnUrl = new String("jdbc" + ":" + "hsqldb" + ":" + "file" + ":" + hsqlDBName);
    	Iterator<String> itr = dbSettings.iterator();
    	
    	while (itr.hasNext())
    	{
    		cxnUrl += ";";
    		cxnUrl += (String) itr.next(); 
    	}

        cxnUrl = StringUtils.replacePlainStr(cxnUrl, DataServiceConstants.WEB_ROOT_TOKEN, webAppRoot);

        return cxnUrl;
    }
    
    public static void testHSQLConnection(String url, String username,
            String password, String driverClassName) {

        if (!url.contains("ifexists")) {
            if (!url.endsWith(";")) {
                url += ";";
            }
            url += "ifexists=true";
        }
        
        Connection con = null;
        try {
            con = getConnection(url, username, password, driverClassName);
        } finally {
            try {
                con.close();
            } catch (Exception ignore) {
            }
        }

    }

    public static String getMySQLDatabaseName(String connectionUrl) {
        String s = StringUtils.fromFirstOccurrence(connectionUrl, "?", -1);
        int i = s.lastIndexOf("/");
        if (i <= 0 || i == (s.length() - 1)) {
            return null;
        }
        if (s.charAt(i - 1) == '/') {
            return null;
        }
        return s.substring(i + 1);
    }

}
