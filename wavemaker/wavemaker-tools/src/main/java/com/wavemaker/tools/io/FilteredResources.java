
package com.wavemaker.tools.io;

import java.util.Iterator;

import org.springframework.core.GenericTypeResolver;
import org.springframework.util.Assert;

/**
 * Implementation of of {@link Resources} that dynamically filters items based on a {@link ResourceFilter}.
 * 
 * @see #apply(Resources, ResourceFilter)
 * 
 * @author Phillip Webb
 */
public class FilteredResources<S extends Resource, T extends Resource> extends AbstractResources<T> {

    private final Resources<S> resources;

    private final Class<?> filterType;

    private final ResourceFilter<T> filter;

    private FilteredResources(Resources<S> resources, ResourceFilter<T> filter) {
        Assert.notNull(resources, "Resources must not be null");
        Assert.notNull(filter, "Filter must not be null");
        this.resources = resources;
        this.filterType = GenericTypeResolver.resolveTypeArgument(filter.getClass(), ResourceFilter.class);
        this.filter = filter;
    }

    @Override
    @SuppressWarnings("unchecked")
    public Iterator<T> iterator() {
        FilteredIterator<S> filteredIterator = new FilteredIterator<S>(this.resources.iterator()) {

            @Override
            protected boolean isElementFiltered(S element) {
                if (!FilteredResources.this.filterType.isInstance(element)) {
                    return true;
                }
                return !FilteredResources.this.filter.include((T) element);
            }
        };
        return (Iterator<T>) filteredIterator;
    }

    /**
     * Apply the given {@link ResourceFilter} to the specified {@link Resources}.
     * 
     * @param resources the resources to filter
     * @param filter the filter to apply
     * @return filtered resources.
     */
    public static <S extends Resource, T extends Resource> Resources<T> apply(Resources<S> resources, ResourceFilter<T> filter) {
        return new FilteredResources<S, T>(resources, filter);
    }
}
