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

package com.wavemaker.runtime.data.spring;

import java.util.HashMap;
import java.util.Map;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import com.wavemaker.common.util.Tuple;

/**
 * @author Simon Toens
 */
public class ConfigurationRegistry {

    private static final ConfigurationRegistry instance = new ConfigurationRegistry();

    public static ConfigurationRegistry getInstance() {
        return instance;
    }

    private final Map<String, Tuple.Two<Configuration, SessionFactory>> reg = new HashMap<String, Tuple.Two<Configuration, SessionFactory>>();

    private ConfigurationRegistry() {
    }

    public synchronized void register(String name, Configuration configuration) {
        getEntry(name).v1 = configuration;
    }

    public synchronized void register(String name, SessionFactory sessionFactory) {
        getEntry(name).v2 = sessionFactory;
    }

    public synchronized Configuration getConfiguration(String name) {
        if (this.reg.get(name) == null) {
            return null;
        }
        return this.reg.get(name).v1;
    }

    public synchronized SessionFactory getSessionFactory(String name) {
        if (this.reg.get(name) == null) {
            return null;
        }
        return this.reg.get(name).v2;
    }

    public synchronized void remove(String name) {
        this.reg.remove(name);
    }

    private synchronized Tuple.Two<Configuration, SessionFactory> getEntry(String name) {
        Tuple.Two<Configuration, SessionFactory> rtn = this.reg.get(name);
        if (rtn == null) {
            rtn = Tuple.tuple(null, null);
            this.reg.put(name, rtn);
        }
        return rtn;
    }
}
