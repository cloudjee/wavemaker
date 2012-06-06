
package com.wavemaker.tools.io;

import org.springframework.core.GenericTypeResolver;

/**
 * Allow {@link ResourceIncludeFilter}s with a generic types to filter all {@link Resource}s.
 * 
 * @author Phillip Webb
 */
public class GenericResourceIncludeFilter<R extends Resource> implements ResourceIncludeFilter<Resource> {

    private final Class<?> filterType;

    private final ResourceIncludeFilter<R> filter;

    private final boolean includeNonMatching;

    private GenericResourceIncludeFilter(ResourceIncludeFilter<R> filter, boolean includeNonMatching) {
        this.filterType = GenericTypeResolver.resolveTypeArgument(filter.getClass(), ResourceIncludeFilter.class);
        this.filter = filter;
        this.includeNonMatching = includeNonMatching;
    }

    @SuppressWarnings("unchecked")
    @Override
    public boolean include(Resource resource) {
        if (!this.filterType.isInstance(resource)) {
            return this.includeNonMatching;
        }
        return this.filter.include((R) resource);
    }

    public static <R extends Resource> GenericResourceIncludeFilter<R> filterNonMatchingGeneric(ResourceIncludeFilter<R> filter) {
        return new GenericResourceIncludeFilter<R>(filter, false);
    }

    public static <R extends Resource> GenericResourceIncludeFilter<R> includeNonMatchingGeneric(ResourceIncludeFilter<R> filter) {
        return new GenericResourceIncludeFilter<R>(filter, true);
    }

}
