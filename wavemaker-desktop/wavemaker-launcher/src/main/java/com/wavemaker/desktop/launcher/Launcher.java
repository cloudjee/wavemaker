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

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.catalina.Lifecycle;
import org.apache.catalina.LifecycleListener;
import org.apache.catalina.Server;
import org.apache.catalina.startup.Catalina;

import com.wavemaker.desktop.util.TomcatUndeployer;

/**
 * @author Matt Small
 */
public class Launcher extends Catalina {

    public Launcher() {
        super();
        this.setAwait(true);
    }

    @Override
    public void setServer(Server server) {
        if (server instanceof Lifecycle) {
            for (LifecycleListener listener : this.lifecycle.findLifecycleListeners()) {
                ((Lifecycle) server).addLifecycleListener(listener);
            }
        }
        super.setServer(server);
    }

    @Override
    public void stopServer() {
        this.undeploy();
        stopServer(null);
    }

    @Override
    protected void initStreams() {
        // do nothing
    }

    private void undeploy() {
        Properties props = System.getProperties();
        String context = null;
        Map<String, String> m = new LinkedHashMap<String, String>(4);
        for (Map.Entry<Object, Object> mapEntry : props.entrySet()) {
            String key = (String) mapEntry.getKey();
            if (key.equals("wm.proj.deploy.name")) {
                context = String.valueOf(mapEntry.getValue());
            } else if (key.contains("wm.proj.")) {
                key = key.substring(8);
                m.put(key, String.valueOf(mapEntry.getValue()));
            }
        }

        if (context != null) {
            TomcatUndeployer depTarget = new TomcatUndeployer();
            depTarget.undeploy(context, m);
        }
    }
}