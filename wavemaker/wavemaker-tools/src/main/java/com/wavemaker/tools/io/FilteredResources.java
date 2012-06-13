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
import java.util.List;

import org.springframework.util.Assert;

/**
 * Implementation of of {@link Resources} that dynamically filters items based on a {@link ResourceFilter}.
 * 
 * @see #include(Resources, ResourceIncludeFilter)
 * 
 * @author Phillip Webb
 */
public class FilteredResources<T extends Resource> extends AbstractResources<T> {

    private static enum Type {
        INCLUDE, EXCLUDE
    }

    private final Resources<T> source;

    private final Type type;

    private final List<ResourceFilter> filters;

    private FilteredResources(Resources<T> source, Type type, List<ResourceFilter> filters) {
        Assert.notNull(source, "Source must not be null");
        Assert.notNull(filters, "Filters must not be null");
        this.source = source;
        this.filters = filters;
        this.type = type;
    }

    @Override
    public Iterator<T> iterator() {
        FilteredIterator<T> filteredIterator = new FilteredIterator<T>(this.source.iterator()) {

            @Override
            protected boolean isElementFiltered(T element) {
                return FilteredResources.this.type == Type.INCLUDE ? !isMatch(element) : isMatch(element);
            }

            private boolean isMatch(T element) {
                for (ResourceFilter filter : FilteredResources.this.filters) {
                    if (filter.match(element)) {
                        return true;
                    }
                }
                return false;
            }

        };
        return filteredIterator;
    }

}
