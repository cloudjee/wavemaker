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
package com.wavemaker.runtime.data.spring;

import java.util.HashMap;
import java.util.Map;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import com.wavemaker.common.util.Tuple;

/**
 * @author Simon Toens
 * @version $Rev:22658 $ - $Date:2008-05-30 09:30:24 -0700 (Fri, 30 May 2008) $
 * 
 */
public class ConfigurationRegistry {

    private static final ConfigurationRegistry instance = 
        new ConfigurationRegistry();

    public static ConfigurationRegistry getInstance() {
        return instance;
    }

    private Map<String, Tuple.Two<Configuration, SessionFactory>> reg = 
        new HashMap<String, Tuple.Two<Configuration, SessionFactory>>();

    private ConfigurationRegistry() {
    }

    public synchronized void register(String name, 
                                      Configuration configuration) 
    {
        getEntry(name).v1 = configuration;
    }

    public synchronized void register(String name, 
                                      SessionFactory sessionFactory) 
    {
        getEntry(name).v2 = sessionFactory;
    }

    public synchronized Configuration getConfiguration(String name) {
        if (reg.get(name) == null) {
            return null;
        }
        return reg.get(name).v1;
    }
    
    public synchronized SessionFactory getSessionFactory(String name) {
        if (reg.get(name) == null) {
            return null;
        }
        return reg.get(name).v2;
    }

    public synchronized void remove(String name) {
        reg.remove(name);
    }

    private synchronized Tuple.Two<Configuration, SessionFactory>
        getEntry(String name) 
    {
        Tuple.Two<Configuration, SessionFactory> rtn = reg.get(name);
        if (rtn == null) {
            rtn = Tuple.tuple(null, null);
        reg.put(name, rtn);
        } 
        return rtn;
    }
}
