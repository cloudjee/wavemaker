/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.desktop.launcher;

import org.apache.catalina.Lifecycle;
import org.apache.catalina.LifecycleEvent;
import org.apache.catalina.LifecycleListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Force the MySQL driver to create it's timer thread outside of a web application thread to avoid inheriting the web
 * application context classloader, among other things. This can cause classloader related memory leaks if the web
 * application is reloaded or undeployed.
 * 
 */
public class MySQLThreadFix implements LifecycleListener {

    private static Log log = LogFactory.getLog(MySQLThreadFix.class);

    @Override
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
