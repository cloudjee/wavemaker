
package com.wavemaker.io;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;

import org.springframework.util.Assert;

/**
 * Implementation of {@link Resources} backed by a {@link Collection}.
 * 
 * @author Phillip Webb
 */
public class ResourcesCollection<T extends Resource> extends AbstractResources<T> {

    /**
     * Empty implementation.
     */
    @SuppressWarnings("rawtypes")
    private static final Resources<?> EMPTY_RESOURCES = new AbstractResources() {

        @Override
        public Iterator iterator() {
            return Collections.EMPTY_SET.iterator();
        }
    };

    /**
     * Returns an empty {@link Resources} instance.
     * 
     * @return empty {@link Resources}
     */
    @SuppressWarnings("unchecked")
    public static final <T extends Resource> Resources<T> emptyResources() {
        return (Resources<T>) EMPTY_RESOURCES;
    }

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
