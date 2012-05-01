/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.cloudfoundry;

import java.util.concurrent.TimeUnit;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudApplication.AppState;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

/**
 * General purpose {@link CloudFoundryClient} utilities.
 * 
 * @author Phillip Webb
 */
public abstract class CloudFoundryUtils {

    private static final String CLOUD_CONTROLLER_VARIABLE_NAME = "cloudcontroller";

    static long SLEEP_TIME = TimeUnit.SECONDS.toMillis(1);

    private static final long DEFAULT_TIMEOUT = TimeUnit.MINUTES.toMillis(2);

    /**
     * Start the specified application and {@link #waitUntilRunning(CloudFoundryClient, String) wait} until it is fully
     * running.
     * 
     * @param client the cloud foundry client
     * @param appName the application to start
     */
    public static void startApplicationAndWaitUntilRunning(CloudFoundryClient client, String appName) {
        Assert.notNull(client, "Client must not be null");
        Assert.hasLength(appName, "AppName must not be empty");
        client.startApplication(appName);
        waitUntilRunning(client, appName);
    }

    /**
     * Restart the specified application and {@link #waitUntilRunning(CloudFoundryClient, String) wait} until it is
     * fully running.
     * 
     * @param client the cloud foundry client
     * @param appName the application to start
     */
    public static void restartApplicationAndWaitUntilRunning(CloudFoundryClient client, String appName) {
        Assert.notNull(client, "Client must not be null");
        Assert.hasLength(appName, "AppName must not be empty");
        client.restartApplication(appName);
        waitUntilRunning(client, appName);
    }

    /**
     * Wait until the specified application is fully running.
     * 
     * @param client the cloud foundry client
     * @param appName the application to start
     */
    public static void waitUntilRunning(CloudFoundryClient client, String appName) {
        waitUntilRunning(client, appName, DEFAULT_TIMEOUT);
    }

    /**
     * Wait until the specified application is fully running.
     * 
     * @param client the cloud foundry client
     * @param appName the application to start
     * @param timeout the timeout in milliseconds
     */
    public static void waitUntilRunning(CloudFoundryClient client, String appName, long timeout) {
        Assert.notNull(client, "Client must not be null");
        Assert.hasLength(appName, "AppName must not be empty");
        long startTime = System.currentTimeMillis();
        do {
            try {
                Thread.sleep(SLEEP_TIME);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            CloudApplication application = client.getApplication(appName);
            if (isRunning(application)) {
                return;
            }
            long runTime = System.currentTimeMillis() - startTime;
            if (runTime >= timeout) {
                throw new IllegalStateException("Timeout waiting for '" + appName + "' to start");
            }
        } while (true);

    }

    private static boolean isRunning(CloudApplication application) {
        boolean started = application.getState() == AppState.STARTED;
        int expectedInstances = application.getInstances();
        int runningInstances = application.getRunningInstances();
        return started && expectedInstances == runningInstances;
    }

    /**
     * Return the cloud controller URL.
     * 
     * @return The actual controller URL to use.
     */
    public static String getControllerUrl() {
        return getEnvironmentVariable(CLOUD_CONTROLLER_VARIABLE_NAME, "http://api.cloudfoundry.com");
    }

    /**
     * Return an environment variable value
     * 
     * @param name the name of the variable
     * @param defaultValue the default value to use if the variable has not been set
     * @return the value
     */
    public static String getEnvironmentVariable(String name, String defaultValue) {
        String value = System.getenv(name);
        if (StringUtils.hasLength(value)) {
            return value;
        }
        value = System.getProperty(name);
        if (StringUtils.hasLength(value)) {
            return value;
        }
        return defaultValue;

    }
}
