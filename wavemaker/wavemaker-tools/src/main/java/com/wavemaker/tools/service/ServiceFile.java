
package com.wavemaker.tools.service;

import org.springframework.core.io.Resource;

import com.wavemaker.tools.io.File;

/**
 * Provides access to a service file. Files should be accessed as {@link File}s but legacy {@link Resource} access is
 * also provided to allow {@link ServiceDefinitionFactory} instances to gradually be refactored.
 */
public final class ServiceFile {

    private final File file;

    private final Resource resource;

    public ServiceFile(File file, Resource resource) {
        this.file = file;
        this.resource = resource;
    }

    public File asFile() {
        return this.file;
    }

    @Deprecated
    public Resource asResource() {
        return this.resource;
    }
}
