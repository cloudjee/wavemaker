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

import java.util.ArrayList;
import java.util.List;

import org.springframework.util.Assert;

/**
 * Builder class that can be used to easily construct {@link ResourceFilter}s. Filters can be built for {@link File}s,
 * {@link Folder}s or {@link Resource}s with matching performed on {@link Resource#getName() names} or
 * {@link Resource#toString() paths}. Builders can be chained together to form compound (AND) matches.
 * 
 * @author Phillip Webb
 */
public abstract class ResourceFiltering {

    /**
     * No Filtering.
     */
    public static final ResourceFilter<Resource> NONE = new ResourceFilter<Resource>() {

        @Override
        public boolean include(Resource resource) {
            return true;
        }
    };

    private static final ResourceFilter<File> FILE_FILTER = new ResourceTypeFilter<File>(File.class);

    private static final ResourceFilter<Folder> FOLDER_FILTER = new ResourceTypeFilter<Folder>(Folder.class);

    /**
     * Filter that only accepts {@link File}s.
     * 
     * @return the filter
     */
    public static ResourceFilter<File> files() {
        return FILE_FILTER;
    }

    /**
     * Filter that only accepts {@link Folder}s.
     * 
     * @return the filter
     */
    public static ResourceFilter<Folder> folders() {
        return FOLDER_FILTER;
    }

    @SuppressWarnings("unchecked")
    public static <T extends Resource> ResourceFilter<T> none() {
        return (ResourceFilter<T>) NONE;
    }

    /**
     * Start filtering based on {@link Folder} {@link Folder#getName() names}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static ResourceAttributeFilter<Folder> folderNames() {
        return getFor(Folder.class, ResourceAttribute.NAME_IGNORING_CASE);
    }

    /**
     * Start filtering based on {@link Folder} {@link Folder#getName() names}. NOTE: matching is case sensitive.
     * 
     * @return the filter
     */
    public static ResourceAttributeFilter<Folder> caseSensitiveFolderNames() {
        return getFor(Folder.class, ResourceAttribute.NAME);
    }

    /**
     * Start filtering based on {@link Folder} {@link Folder#toString() paths}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static ResourceAttributeFilter<Folder> folderPaths() {
        return getFor(Folder.class, ResourceAttribute.PATH_IGNORING_CASE);
    }

    /**
     * Start filtering based on {@link Folder} {@link Folder#toString() paths}. NOTE: matching is case sensitive.
     * 
     * @return the filter
     */
    public static ResourceAttributeFilter<Folder> caseSensitiveFolderPaths() {
        return getFor(Folder.class, ResourceAttribute.PATH);
    }

    /**
     * Start filtering based on {@link File} {@link Folder#getName() names}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static ResourceAttributeFilter<File> fileNames() {
        return getFor(File.class, ResourceAttribute.NAME_IGNORING_CASE);
    }

    /**
     * Start filtering based on {@link File} {@link Folder#getName() names}. NOTE: matching is case sensitive.
     * 
     * @return the filter
     */
    public static ResourceAttributeFilter<File> caseSensitiveFileNames() {
        return getFor(File.class, ResourceAttribute.NAME);
    }

    /**
     * Start filtering based on {@link File} {@link Folder#toString() paths}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static ResourceAttributeFilter<File> filePaths() {
        return getFor(File.class, ResourceAttribute.PATH_IGNORING_CASE);
    }

    /**
     * Start filtering based on {@link File} {@link Folder#toString() paths}. NOTE: matching is case sensitive.
     * 
     * @return the filter
     */
    public static ResourceAttributeFilter<File> caseSensitiveFilePaths() {
        return getFor(File.class, ResourceAttribute.PATH);
    }

    /**
     * Start filtering based on {@link Resource} {@link Folder#getName() names}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static ResourceAttributeFilter<Resource> resourceNames() {
        return getFor(Resource.class, ResourceAttribute.NAME_IGNORING_CASE);
    }

    /**
     * Start filtering based on {@link Resource} {@link Folder#getName() names}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static ResourceAttributeFilter<Resource> caseSensitiveResourceNames() {
        return getFor(Resource.class, ResourceAttribute.NAME);
    }

    /**
     * Start filtering based on {@link Resource} {@link Folder#toString() paths}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static ResourceAttributeFilter<Resource> resourcePaths() {
        return getFor(Resource.class, ResourceAttribute.PATH_IGNORING_CASE);
    }

    /**
     * Start filtering based on {@link Resource} {@link Folder#toString() paths}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static ResourceAttributeFilter<Resource> caseSensitiveResourcePaths() {
        return getFor(Resource.class, ResourceAttribute.PATH);
    }

    /**
     * Start filtering based on the specified resource type and attribute.
     * 
     * @param resourceType the resource type
     * @param attribute the attribute
     * @return the filter
     */
    public static <T extends Resource> ResourceAttributeFilter<T> getFor(Class<T> resourceType, ResourceAttribute attribute) {
        Assert.notNull(resourceType, "ResourceType must not be null");
        Assert.notNull(attribute, "Attribute must not be null");
        return new ResourceAttributeFilter<T>(attribute, null, new ResourceTypeFilter<T>(resourceType));
    }

    /**
     * Filter all hidden resources (ie resource names starting '.')
     * 
     * @return the filter
     */
    public static ResourceFilter<Resource> hiddenResources() {
        return resourceNames().starting(".");
    }

    /**
     * Filter all non-hidden resources (ie resource names not starting '.');
     * 
     * @return the filter
     */
    public static ResourceFilter<Resource> nonHiddenResources() {
        return resourceNames().notStarting(".");
    }

    /**
     * Filter all hidden folders (ie folder names starting '.')
     * 
     * @return the filter
     */
    public static ResourceFilter<Folder> hiddenFolders() {
        return folderNames().starting(".");
    }

    /**
     * Filter all non-hidden folders (ie folder names not starting '.');
     * 
     * @return the filter
     */
    public static ResourceFilter<Folder> nonHiddenFolders() {
        return folderNames().notStarting(".");
    }

    /**
     * Filter all hidden files (ie file names starting '.')
     * 
     * @return the filter
     */
    public static ResourceFilter<File> hiddenFiles() {
        return fileNames().starting(".");
    }

    /**
     * Filter all non-hidden files (ie file names not starting '.');
     * 
     * @return the filter
     */
    public static ResourceFilter<File> nonHiddenFiles() {
        return fileNames().notStarting(".");
    }

    /**
     * Various attributes that can be used to filter resources.
     */
    public enum ResourceAttribute {

        NAME(false) {

            @Override
            public String get(Resource resource) {
                return resource.getName();
            }
        },
        NAME_IGNORING_CASE(true) {

            @Override
            public String get(Resource resource) {
                return resource.getName();
            }
        },
        PATH(false) {

            @Override
            public String get(Resource resource) {
                return resource.toString();
            }
        },
        PATH_IGNORING_CASE(true) {

            @Override
            public String get(Resource resource) {
                return resource.toString();
            }
        };

        private final boolean ignoreCase;

        private ResourceAttribute(boolean ignoreCase) {
            this.ignoreCase = ignoreCase;
        }

        public abstract String get(Resource resource);

        public boolean isIgnoreCase() {
            return this.ignoreCase;
        }
    }

    /**
     * The {@link ResourceFilter} and builder used to further restrict filtering.
     */
    public static class ResourceAttributeFilter<T extends Resource> implements ResourceFilter<T> {

        private final ResourceAttribute attribute;

        private final ResourceAttributeFilter<T> parent;

        private final ResourceFilter<T> filter;

        public ResourceAttributeFilter(ResourceAttribute attribute, ResourceAttributeFilter<T> parent, ResourceFilter<T> filter) {
            this.attribute = attribute;
            this.parent = parent;
            this.filter = filter;
        }

        /**
         * Filter attributes starting with the specified string.
         * 
         * @param prefix the prefix to filter against. If multiple values are specified any may match
         * @return the filter
         */
        public ResourceAttributeFilter<T> starting(CharSequence... prefix) {
            return newResourceAttributeFilter(stringFilter(StringOperation.STARTS, prefix));
        }

        /**
         * Filter attributes not starting with the specified string.
         * 
         * @param prefix the prefix to filter against. If multiple values are specified all must match
         * @return the filter
         */
        public ResourceAttributeFilter<T> notStarting(CharSequence... prefix) {
            return newResourceAttributeFilter(not(stringFilter(StringOperation.STARTS, prefix)));
        }

        /**
         * Filter attributes ending with the specified string.
         * 
         * @param postfix the postfix to filter against. If multiple values are specified any may match
         * @return the filter
         */

        public ResourceAttributeFilter<T> ending(CharSequence... postfix) {
            return newResourceAttributeFilter(stringFilter(StringOperation.ENDS, postfix));
        }

        /**
         * Filter attributes not ending with the specified string.
         * 
         * @param postfix the postfix to filter against. If multiple values are specified all must match
         * @return the filter
         */
        public ResourceAttributeFilter<T> notEnding(CharSequence... postfix) {
            return newResourceAttributeFilter(not(stringFilter(StringOperation.ENDS, postfix)));
        }

        /**
         * Filter attributes containing with the specified string.
         * 
         * @param content the contents to filter against. If multiple values are specified any may match
         * @return the filter
         */
        public ResourceAttributeFilter<T> containing(CharSequence... content) {
            return newResourceAttributeFilter(stringFilter(StringOperation.CONTAINS, content));
        }

        /**
         * Filter attributes not containing with the specified string.
         * 
         * @param content the contents to filter against. If multiple values are specified all must match
         * @return the filter
         */
        public ResourceAttributeFilter<T> notContaining(CharSequence... content) {
            return newResourceAttributeFilter(not(stringFilter(StringOperation.CONTAINS, content)));
        }

        /**
         * Filter attributes matching the specified string
         * 
         * @param value the values to match
         * @return the filter
         */
        public ResourceAttributeFilter<T> matching(CharSequence... value) {
            return newResourceAttributeFilter(stringFilter(StringOperation.MATCHES, value));
        }

        /**
         * Filter attributes not matching the specified string
         * 
         * @param value the value to match
         * @return the filter
         */
        public ResourceAttributeFilter<T> notMatching(CharSequence... value) {
            return newResourceAttributeFilter(not(stringFilter(StringOperation.MATCHES, value)));
        }

        private ResourceFilter<T> stringFilter(StringOperation operation, CharSequence... values) {
            CompoundFilter<T> filter = new CompoundFilter<T>();
            for (CharSequence value : values) {
                filter.add(new StringFilter<T>(this.attribute, operation, value));
            }
            return filter;
        }

        private ResourceFilter<T> not(ResourceFilter<T> filter) {
            return new InvertFilter<T>(filter);
        }

        private ResourceAttributeFilter<T> newResourceAttributeFilter(ResourceFilter<T> filter) {
            return new ResourceAttributeFilter<T>(this.attribute, this, filter);
        }

        @Override
        public boolean include(T resource) {
            if (this.parent != null && !this.parent.include(resource)) {
                return false;
            }
            return this.filter.include(resource);
        }
    }

    private static class ResourceTypeFilter<T extends Resource> implements ResourceFilter<T> {

        private final Class<T> resourceType;

        public ResourceTypeFilter(Class<T> resourceType) {
            this.resourceType = resourceType;
        }

        @Override
        public boolean include(T resource) {
            return this.resourceType.isInstance(resource);
        }
    }

    private static class CompoundFilter<T extends Resource> implements ResourceFilter<T> {

        private final List<ResourceFilter<T>> filters = new ArrayList<ResourceFilter<T>>();

        public void add(ResourceFilter<T> filter) {
            this.filters.add(filter);
        }

        @Override
        public boolean include(T resource) {
            for (ResourceFilter<T> filter : this.filters) {
                if (filter.include(resource)) {
                    return true;
                }
            }
            return false;
        }
    }

    private static class InvertFilter<T extends Resource> implements ResourceFilter<T> {

        private final ResourceFilter<T> filter;

        public InvertFilter(ResourceFilter<T> filter) {
            this.filter = filter;
        }

        @Override
        public boolean include(T resource) {
            return !this.filter.include(resource);
        }
    }

    private enum StringOperation {
        STARTS, ENDS, CONTAINS, MATCHES
    }

    private static class StringFilter<T extends Resource> implements ResourceFilter<T> {

        private final ResourceAttribute attribute;

        private final StringOperation operation;

        private final CharSequence value;

        public StringFilter(ResourceAttribute attribute, StringOperation operation, CharSequence value) {
            this.attribute = attribute;
            this.operation = operation;
            this.value = value;
        }

        @Override
        public boolean include(T resource) {
            String attributeString = this.attribute.get(resource);
            String matchString = this.value.toString();
            if (this.attribute.isIgnoreCase()) {
                attributeString = attributeString.toLowerCase();
                matchString = matchString.toLowerCase();
            }
            switch (this.operation) {
                case STARTS:
                    return attributeString.startsWith(matchString);
                case ENDS:
                    return attributeString.endsWith(matchString);
                case CONTAINS:
                    return attributeString.contains(matchString);
                case MATCHES:
                    return attributeString.equals(matchString);
            }
            return false;
        }
    }
}
