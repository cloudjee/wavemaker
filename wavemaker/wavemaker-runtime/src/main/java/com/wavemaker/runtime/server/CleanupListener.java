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

package com.wavemaker.runtime.server;

import java.beans.Introspector;
import java.sql.Driver;
import java.sql.DriverManager;
import java.util.Enumeration;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.logging.LogFactory;

import com.wavemaker.common.util.CastUtils;
import com.wavemaker.runtime.WMAppContext;

/**
 * Listener that flushes all of the Introspector's internal caches and de-registers all JDBC drivers on web app
 * shutdown.
 * 
 * @author Frankie Fu
 */
public class CleanupListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent event) {
        WMAppContext.getInstance(event);
    }

    @Override
    public void contextDestroyed(ServletContextEvent event) {
        try {
            // remove from the system DriverManager the JDBC drivers registered
            // by this web app
            for (Enumeration<Driver> e = CastUtils.cast(DriverManager.getDrivers()); e.hasMoreElements();) {
                Driver driver = e.nextElement();
                if (driver.getClass().getClassLoader() == getClass().getClassLoader()) {
                    DriverManager.deregisterDriver(driver);
                }
            }

            LogFactory.releaseAll();

            // flush all of the Introspector's internal caches
            Introspector.flushCaches();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
