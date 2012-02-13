
package com.wavemaker.tools.cloudfoundry.spinup;

import org.springframework.core.style.ToStringCreator;
import org.springframework.util.Assert;

/**
 * Details of a deployable application.
 * 
 * @author Phillip Webb
 */
public class ApplicationDetails {

    private final String name;

    private final String url;

    /**
     * Create a new {@link ApplicationDetails} instance.
     * 
     * @param name the name of the application
     * @param url the URI of the application
     */
    public ApplicationDetails(String name, String url) {
        super();
        Assert.notNull(name, "Name must not be null");
        Assert.notNull(url, "URL must not be null");
        this.name = name;
        this.url = url;
    }

    /**
     * Returns the name of the application.
     * 
     * @return the name
     */
    public String getName() {
        return this.name;
    }

    /**
     * Returns the URL of the application.
     * 
     * @return the URL.
     */
    public String getUrl() {
        return this.url;
    }

    @Override
    public String toString() {
        return new ToStringCreator(this).append("name", this.name).append("url", this.url).toString();
    }
}
