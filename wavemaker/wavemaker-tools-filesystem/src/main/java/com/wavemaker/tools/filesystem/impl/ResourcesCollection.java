
package com.wavemaker.tools.filesystem.impl;

import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;

import org.springframework.util.Assert;

import com.wavemaker.tools.filesystem.Resource;

/**
 * Implementation of {@link Resources} backed by a {@link Collection}.
 * 
 * @author Phillip Webb
 */
public class ResourcesCollection<T extends Resource> extends AbstractResources<T> {

    private final Collection<T> resources;

    public ResourcesCollection(Collection<T> resources) {
        Assert.notNull(resources, "Resources must not be null");
        this.resources = resources;
    }

    public ResourcesCollection(T... resources) {
        Assert.notNull(resources, "Resources must not be null");
        this.resources = Arrays.asList(resources);
    }

    @Override
    public Iterator<T> iterator() {
        return this.resources.iterator();
    }
}
