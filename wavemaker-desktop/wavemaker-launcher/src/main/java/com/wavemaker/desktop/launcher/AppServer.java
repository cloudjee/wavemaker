/*
 * Copyright (C) 2011 VMWare, Inc. All rights reserved.
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

public class AppServer implements LifecycleListener {

    public enum SERVER_STATUS {
        UNKNOWN, INITIALIZING, STARTING, RUNNING, STOPPING, STOPPED
    }

    private Launcher launcher;

    private String[] args;

    private SERVER_STATUS status = SERVER_STATUS.UNKNOWN;

    public AppServer(Launcher launcher, String[] args) {
        this.launcher = launcher;
        this.args = args;
        this.launcher.addLifecycleListener(this);
    }

    @Override
    public void lifecycleEvent(LifecycleEvent event) {
        if (Lifecycle.INIT_EVENT.equals(event.getType())) {
            this.status = SERVER_STATUS.INITIALIZING;
        } else if (Lifecycle.BEFORE_START_EVENT.equals(event.getType())) {
            this.status = SERVER_STATUS.STARTING;
        } else if (Lifecycle.AFTER_START_EVENT.equals(event.getType())) {
            this.status = SERVER_STATUS.RUNNING;
        } else if (Lifecycle.BEFORE_STOP_EVENT.equals(event.getType())) {
            this.status = SERVER_STATUS.STOPPING;
        } else if (Lifecycle.AFTER_STOP_EVENT.equals(event.getType())) {
            this.status = SERVER_STATUS.STOPPED;
        }
    }

    public SERVER_STATUS getStatus() {
        return this.status;
    }

    public void start() {
        // Invoke server in a separate thread
        Thread server = new Thread(new Runnable() {

            @Override
            public void run() {
                AppServer.this.launcher.process(AppServer.this.args);
            }
        });
        server.start();
    }

    public void stop() {
        this.launcher.stopServer();
    }

    public Launcher getLauncher() {
        return this.launcher;
    }

    public void setLauncher(Launcher launcher) {
        this.launcher = launcher;
    }

    public String[] getArgs() {
        return this.args;
    }

    public void setArgs(String[] args) {
        this.args = args;
    }
}