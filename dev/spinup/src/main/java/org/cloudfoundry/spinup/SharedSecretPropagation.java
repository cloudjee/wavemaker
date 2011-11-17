
package org.cloudfoundry.spinup;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.spinup.authentication.SharedSecret;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

/**
 * Propagates a {@link SharedSecret} to a running cloud foundry application.
 * 
 * @author Phillip Webb
 */
public class SharedSecretPropagation {

    static final String ENV_KEY = SharedSecretPropagation.class.getName() + ".SECRET";

    private final CloudFoundryClient client;

    public SharedSecretPropagation(CloudFoundryClient client) {
        Assert.notNull(client, "Client must not be null");
        this.client = client;
    }

    public void sendTo(String applicationName, SharedSecret secret) {
        Assert.notNull(applicationName, "ApplicationName must not be null");
        CloudApplication application = this.client.getApplication(applicationName);
        sendTo(application, secret);
    }

    public void sendTo(CloudApplication application, SharedSecret secret) {
        Assert.notNull(application, "Application must not be null");
        Map<String, String> env = new HashMap<String, String>();
        env.putAll(application.getEnvAsMap());
        env.put(ENV_KEY, Hex.encodeHexString(secret.getBytes()));
        this.client.updateApplicationEnv(application.getName(), env);
    }

    public SharedSecret getForSelf() {
        try {
            String secret = getEnv(ENV_KEY);
            Assert.state(StringUtils.hasLength(secret), "No shared secret has been propagated");
            return SharedSecret.fromBytes(Hex.decodeHex(secret.toCharArray()));
        } catch (DecoderException e) {
            throw new IllegalStateException("Unable to decode shared secret key", e);
        }
    }

    protected String getEnv(String name) {
        return System.getenv(name);
    }
}
