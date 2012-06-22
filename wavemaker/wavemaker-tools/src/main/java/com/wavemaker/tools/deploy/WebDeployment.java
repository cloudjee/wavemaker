
package com.wavemaker.tools.deploy;

import org.springframework.util.Assert;

/**
 * A {@link Deployment} for a running web application.
 * 
 * @author Phillip Webb
 */
public class WebDeployment extends Deployment {

    private final String url;

    public WebDeployment(String url) {
        Assert.notNull(url, "URL must not be null");
        this.url = url;
    }

    public String getUrl() {
        return this.url;
    }

    @Override
    public String toString() {
        return getUrl();
    }
}
