/*
 * Copyright (C) 2011 WaveMaker Software, Inc.
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

public class AppServer implements LifecycleListener {
	public enum SERVER_STATUS{
		UNKNOWN,
		INITIALIZING,
		STARTING,
		RUNNING,
		STOPPING,
		STOPPED
	}

	private Launcher launcher;
	private String[] args;
	private SERVER_STATUS status = SERVER_STATUS.UNKNOWN;

	public AppServer(Launcher launcher, String[] args) {
		this.launcher = launcher;
		this.args = args;
		this.launcher.addLifecycleListener(this);
	}

	public void lifecycleEvent(LifecycleEvent event) {
		if(Lifecycle.INIT_EVENT.equals(event.getType()))
		{
			this.status = SERVER_STATUS.INITIALIZING;
		}
		else if(Lifecycle.BEFORE_START_EVENT.equals(event.getType()))
		{
			this.status = SERVER_STATUS.STARTING;
		}
		else if(Lifecycle.AFTER_START_EVENT.equals(event.getType()))
		{
			this.status = SERVER_STATUS.RUNNING;
		}
		else if(Lifecycle.BEFORE_STOP_EVENT.equals(event.getType()))
		{
			this.status = SERVER_STATUS.STOPPING;
		}
		else if(Lifecycle.AFTER_STOP_EVENT.equals(event.getType()))
		{
			this.status = SERVER_STATUS.STOPPED;
		}
	}

	public SERVER_STATUS getStatus()
	{
		return this.status;
	}

	public void start() {
		// Invoke server in a separate thread
		Thread server = new Thread(new Runnable() {
			public void run() {
				launcher.process(args);
			}
		});
		server.start();
	}

	public void stop() {
		this.launcher.stopServer();
	}

	public Launcher getLauncher() {
		return launcher;
	}

	public void setLauncher(Launcher launcher) {
		this.launcher = launcher;
	}

	public String[] getArgs() {
		return args;
	}

	public void setArgs(String[] args) {
		this.args = args;
	}
}