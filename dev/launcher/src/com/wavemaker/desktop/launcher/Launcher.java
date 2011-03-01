/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
import org.apache.catalina.LifecycleListener;
import org.apache.catalina.Server;
import org.apache.catalina.startup.Catalina;

import java.util.Map;
import java.util.Properties;
import java.util.LinkedHashMap;

import com.wavemaker.desktop.util.TomcatUndeployer;

/**
 * @author small
 * @version $Rev$ - $Date: 2009-03-09 11:41:44 -0700 (Mon, 09 Mar 2009)
 *          $
 */
public class Launcher extends Catalina {

	public Launcher()
	{
		super();
		this.setAwait(true);
    }

	public void setServer(Server server) {
		if (server instanceof Lifecycle) {
			for (LifecycleListener listener : this.lifecycle
					.findLifecycleListeners()) {
				((Lifecycle) server).addLifecycleListener(listener);
			}
		}
		//Main.printlnToLog("Shutdown Port: " + server.getPort() + " - " + server.getShutdown());
		super.setServer(server);
	}

    public void stopServer() {
        this.undeploy();
        stopServer(null);
    }

    protected void initStreams() {
		// do nothing
	}

    private void undeploy() {
        Properties props = System.getProperties();
        String context = null;
        Map<String, String> m = new LinkedHashMap<String, String>(4);
        for (Map.Entry<Object, Object> mapEntry: props.entrySet()) {
            String key = (String)mapEntry.getKey();
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