
package com.wavemaker.tools.deployment.cloudfoundry;

import java.util.concurrent.TimeUnit;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudApplication.AppState;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.springframework.util.Assert;

/**
 * General purpose {@link CloudFoundryClient} utilities.
 * 
 * @author Phillip Webb
 */
public abstract class CloudFoundryClientUtils {

    private static final long SLEEP_TIME = TimeUnit.SECONDS.toMillis(1);

    private static final long ATTEMPTS = TimeUnit.MINUTES.toSeconds(2);

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
        Assert.notNull(client, "Client must not be null");
        Assert.hasLength(appName, "AppName must not be empty");
        for (int i = 0; i < ATTEMPTS; i++) {
            try {
                Thread.sleep(SLEEP_TIME);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            CloudApplication application = client.getApplication(appName);
            if (isRunning(application)) {
                return;
            }
        }
        throw new IllegalStateException("Timeout waiting for '" + appName + "' to start");
    }

    private static boolean isRunning(CloudApplication application) {
        boolean started = application.getState() == AppState.STARTED;
        int expectedInstances = application.getInstances();
        int runningInstances = application.getRunningInstances();
        return started && expectedInstances == runningInstances;
    }
}
