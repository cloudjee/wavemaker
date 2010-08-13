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
package com.wavemaker.desktop.launcher;

import org.apache.catalina.Lifecycle;
import org.apache.catalina.LifecycleEvent;
import org.apache.catalina.LifecycleListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Force the MySQL driver to create it's timer thread outside of a
 * web application thread to avoid inheriting the web application
 * context classloader, among other things.  This can cause
 * classloader related memory leaks if the web application is
 * reloaded or undeployed.
 *
 */
public class MySQLThreadFix implements LifecycleListener {

    private static Log log = LogFactory.getLog(MySQLThreadFix.class);

    public void lifecycleEvent(LifecycleEvent event) {
        if (Lifecycle.INIT_EVENT.equals(event.getType())) {
            try {
                Class.forName("com.mysql.jdbc.ConnectionImpl");
                log.info("mysql driver loaded");
            } catch (ClassNotFoundException e) {
                try {
                    Class.forName("com.mysql.jdbc.Connection");
                    log.info("mysql driver loaded");
                } catch (ClassNotFoundException e2) {
                    log.warn("Couldn't find MySQL driver; will be loaded by webapps.");
                }
            }
        }
    }
}
