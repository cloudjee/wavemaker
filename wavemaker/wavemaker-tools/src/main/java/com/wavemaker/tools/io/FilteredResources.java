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

package com.wavemaker.tools.io;

import java.util.Iterator;

import org.springframework.core.GenericTypeResolver;
import org.springframework.util.Assert;

/**
 * Implementation of of {@link Resources} that dynamically filters items based on a {@link ResourceIncludeFilter}.
 * 
 * @see #apply(Resources, ResourceIncludeFilter)
 * 
 * @author Phillip Webb
 */
public class FilteredResources<S extends Resource, T extends Resource> extends AbstractResources<T> {

    private final Resources<S> resources;

    private final Class<?> filterType;

    private final ResourceIncludeFilter<T> filter;

    private FilteredResources(Resources<S> resources, ResourceIncludeFilter<T> filter) {
        Assert.notNull(resources, "Resources must not be null");
        Assert.notNull(filter, "Filter must not be null");
        this.resources = resources;
        this.filterType = GenericTypeResolver.resolveTypeArgument(filter.getClass(), ResourceIncludeFilter.class);
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
     * Apply the given {@link ResourceIncludeFilter} to the specified {@link Resources}.
     * 
     * @param resources the resources to filter
     * @param filter the filter to apply
     * @return filtered resources.
     */
    public static <S extends Resource, T extends Resource> Resources<T> apply(Resources<S> resources, ResourceIncludeFilter<T> filter) {
        return new FilteredResources<S, T>(resources, filter);
    }
}
