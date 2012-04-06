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
