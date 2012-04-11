/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.data.spring;

import java.sql.Connection;
import java.sql.SQLException;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

import com.wavemaker.runtime.data.DataServiceLoggers;

/**
 * @author Simon Toens
 */
public class ThreadLocalDriverManagerDataSource extends DriverManagerDataSource {

    private static ThreadLocal<ConnectionProperties> threadLocal = new ThreadLocal<ConnectionProperties>();

    public static void setConnectionProperties(ConnectionProperties connectionProperties) {
        threadLocal.set(connectionProperties);
    }

    public static void unsetConnectionProperties() {
        threadLocal.set(null);
    }

    // @Override
    public String getDriverClassName() {
        ConnectionProperties props = threadLocal.get();
        if (props == null) {
            // return super.getDriverClassName(); //commented out when upgrading to spring 2.5.6
            return "";
        }

        String rtn = props.getDriverClassName();

        if (rtn == null) {
            // return super.getDriverClassName(); //commented out when upgrading to spring 2.5.6
            return "";
        }

        // loads driver class
        super.setDriverClassName(rtn);

        return rtn;
    }

    @Override
    public String getPassword() {
        ConnectionProperties props = threadLocal.get();
        if (props == null) {
            return super.getPassword();
        }

        String rtn = props.getPassword();

        if (rtn == null) {
            return super.getPassword();
        }

        return rtn;
    }

    @Override
    public String getUsername() {
        ConnectionProperties props = threadLocal.get();
        if (props == null) {
            return super.getUsername();
        }

        String rtn = props.getUsername();

        if (rtn == null) {
            return super.getUsername();
        }

        return rtn;
    }

    @Override
    public String getUrl() {
        ConnectionProperties props = threadLocal.get();
        if (props == null) {
            return super.getUrl();
        }

        String rtn = props.getUrl();

        if (rtn == null) {
            return super.getUrl();
        }

        return rtn;
    }

    @Override
    public Connection getConnection() throws SQLException {
        if (DataServiceLoggers.connectionLogger.isDebugEnabled()) {
            DataServiceLoggers.connectionLogger.debug("getConnection: " + getUrl() + " " + getUsername() + "/" + getPassword() + " "
                + getDriverClassName());
        }
        return super.getConnection();
    }

    public static class ConnectionProperties {

        private String url;

        private String username;

        private String password;

        private String driver;

        public ConnectionProperties() {
            setConnectionProperties(this);
        }

        public void setDriverClassName(String driver) {
            this.driver = driver;
        }

        public String getDriverClassName() {
            return this.driver;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getUsername() {
            return this.username;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getPassword() {
            return this.password;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getUrl() {
            return this.url;
        }
    }
}
