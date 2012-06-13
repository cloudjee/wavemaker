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
 * @see ResourceFilter
 * 
 * @author Phillip Webb
 */
public abstract class FilterOn {

    // FIXME simplyify by removing file/folder variants

    // FIXME delete ALL, FILE_FILTER and FOLDER_FILTER

    /**
     * No Filtering.
     */
    public static final ResourceFilter ALL = new ResourceFilter() {

        @Override
        public boolean match(Resource resource) {
            return true;
        }
    };

    private static final ResourceFilter FILE_FILTER = new FileTypeFilter();

    private static final ResourceFilter FOLDER_FILTER = new FolderTypeFilter();

    /**
     * Filter that only accepts {@link File}s.
     * 
     * @return the filter
     */
    public static ResourceFilter files() {
        return FILE_FILTER;
    }

    /**
     * Filter that only accepts {@link Folder}s.
     * 
     * @return the filter
     */
    public static ResourceFilter folders() {
        return FOLDER_FILTER;
    }

    public static ResourceFilter all() {
        return ALL;
    }

    /**
     * Start filtering based on {@link Folder} {@link Folder#getName() names}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static AttributeFilter folderNames() {
        return getFor(Folder.class, ResourceAttribute.NAME_IGNORING_CASE);
    }

    /**
     * Start filtering based on {@link Folder} {@link Folder#getName() names}. NOTE: matching is case sensitive.
     * 
     * @return the filter
     */
    public static AttributeFilter caseSensitiveFolderNames() {
        return getFor(Folder.class, ResourceAttribute.NAME);
    }

    /**
     * Start filtering based on {@link Folder} {@link Folder#toString() paths}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static AttributeFilter folderPaths() {
        return getFor(Folder.class, ResourceAttribute.PATH_IGNORING_CASE);
    }

    /**
     * Start filtering based on {@link Folder} {@link Folder#toString() paths}. NOTE: matching is case sensitive.
     * 
     * @return the filter
     */
    public static AttributeFilter caseSensitiveFolderPaths() {
        return getFor(Folder.class, ResourceAttribute.PATH);
    }

    /**
     * Start filtering based on {@link File} {@link Folder#getName() names}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static AttributeFilter fileNames() {
        return getFor(File.class, ResourceAttribute.NAME_IGNORING_CASE);
    }

    /**
     * Start filtering based on {@link File} {@link Folder#getName() names}. NOTE: matching is case sensitive.
     * 
     * @return the filter
     */
    public static AttributeFilter caseSensitiveFileNames() {
        return getFor(File.class, ResourceAttribute.NAME);
    }

    /**
     * Start filtering based on {@link File} {@link Folder#toString() paths}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static AttributeFilter filePaths() {
        return getFor(File.class, ResourceAttribute.PATH_IGNORING_CASE);
    }

    /**
     * Start filtering based on {@link File} {@link Folder#toString() paths}. NOTE: matching is case sensitive.
     * 
     * @return the filter
     */
    public static AttributeFilter caseSensitiveFilePaths() {
        return getFor(File.class, ResourceAttribute.PATH);
    }

    /**
     * Start filtering based on {@link Resource} {@link Folder#getName() names}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static AttributeFilter resourceNames() {
        return getFor(Resource.class, ResourceAttribute.NAME_IGNORING_CASE);
    }

    /**
     * Start filtering based on {@link Resource} {@link Folder#getName() names}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static AttributeFilter caseSensitiveResourceNames() {
        return getFor(Resource.class, ResourceAttribute.NAME);
    }

    /**
     * Start filtering based on {@link Resource} {@link Folder#toString() paths}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static AttributeFilter resourcePaths() {
        return getFor(Resource.class, ResourceAttribute.PATH_IGNORING_CASE);
    }

    /**
     * Start filtering based on {@link Resource} {@link Folder#toString() paths}. NOTE: matching is case insensitive.
     * 
     * @return the filter
     */
    public static AttributeFilter caseSensitiveResourcePaths() {
        return getFor(Resource.class, ResourceAttribute.PATH);
    }

    /**
     * Start filtering based on the specified resource type and attribute.
     * 
     * @param resourceType the resource type
     * @param attribute the attribute
     * @return the filter
     */
    public static AttributeFilter getFor(Class<? extends Resource> resourceType, ResourceAttribute attribute) {
        Assert.notNull(resourceType, "ResourceType must not be null");
        Assert.notNull(attribute, "Attribute must not be null");
        ResourceTypeFilter resourceTypeFilter = new ResourceTypeFilter(resourceType);
        if (File.class.equals(resourceType)) {
            return new FileAttributeFilter(attribute, null, resourceTypeFilter);
        }
        if (Folder.class.equals(resourceType)) {
            return new FolderAttributeFilter(attribute, null, resourceTypeFilter);
        }
        return new ResourceAttributeFilter(attribute, null, resourceTypeFilter);
    }

    /**
     * Filter all hidden resources (ie resource names starting '.')
     * 
     * @return the filter
     */
    public static ResourceFilter hiddenResources() {
        return resourceNames().starting(".");
    }

    /**
     * Filter all non-hidden resources (ie resource names not starting '.');
     * 
     * @return the filter
     */
    public static ResourceFilter nonHiddenResources() {
        return resourceNames().notStarting(".");
    }

    /**
     * Filter all hidden folders (ie folder names starting '.')
     * 
     * @return the filter
     */
    public static ResourceFilter hiddenFolders() {
        return folderNames().starting(".");
    }

    /**
     * Filter all non-hidden folders (ie folder names not starting '.');
     * 
     * @return the filter
     */
    public static ResourceFilter nonHiddenFolders() {
        return folderNames().notStarting(".");
    }

    /**
     * Filter all hidden files (ie file names starting '.')
     * 
     * @return the filter
     */
    public static ResourceFilter hiddenFiles() {
        return fileNames().starting(".");
    }

    /**
     * Filter all non-hidden files (ie file names not starting '.');
     * 
     * @return the filter
     */
    public static ResourceFilter nonHiddenFiles() {
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
    public static abstract class AttributeFilter implements ResourceFilter {

        private final ResourceAttribute attribute;

        private final AttributeFilter parent;

        private final ResourceFilter filter;

        public AttributeFilter(ResourceAttribute attribute, AttributeFilter parent, ResourceFilter filter) {
            this.attribute = attribute;
            this.parent = parent;
            this.filter = filter;
        }

        protected final ResourceAttribute getAttribute() {
            return this.attribute;
        }

        /**
         * Filter attributes starting with the specified string.
         * 
         * @param prefix the prefix to filter against. If multiple values are specified any may match
         * @return the filter
         */
        public AttributeFilter starting(CharSequence... prefix) {
            return newResourceAttributeFilter(stringFilter(StringOperation.STARTS, prefix));
        }

        /**
         * Filter attributes not starting with the specified string.
         * 
         * @param prefix the prefix to filter against. If multiple values are specified all must match
         * @return the filter
         */
        public AttributeFilter notStarting(CharSequence... prefix) {
            return newResourceAttributeFilter(not(stringFilter(StringOperation.STARTS, prefix)));
        }

        /**
         * Filter attributes ending with the specified string.
         * 
         * @param postfix the postfix to filter against. If multiple values are specified any may match
         * @return the filter
         */

        public AttributeFilter ending(CharSequence... postfix) {
            return newResourceAttributeFilter(stringFilter(StringOperation.ENDS, postfix));
        }

        /**
         * Filter attributes not ending with the specified string.
         * 
         * @param postfix the postfix to filter against. If multiple values are specified all must match
         * @return the filter
         */
        public AttributeFilter notEnding(CharSequence... postfix) {
            return newResourceAttributeFilter(not(stringFilter(StringOperation.ENDS, postfix)));
        }

        /**
         * Filter attributes containing with the specified string.
         * 
         * @param content the contents to filter against. If multiple values are specified any may match
         * @return the filter
         */
        public AttributeFilter containing(CharSequence... content) {
            return newResourceAttributeFilter(stringFilter(StringOperation.CONTAINS, content));
        }

        /**
         * Filter attributes not containing with the specified string.
         * 
         * @param content the contents to filter against. If multiple values are specified all must match
         * @return the filter
         */
        public AttributeFilter notContaining(CharSequence... content) {
            return newResourceAttributeFilter(not(stringFilter(StringOperation.CONTAINS, content)));
        }

        /**
         * Filter attributes matching the specified string
         * 
         * @param value the values to match
         * @return the filter
         */
        public AttributeFilter matching(CharSequence... value) {
            return newResourceAttributeFilter(stringFilter(StringOperation.MATCHES, value));
        }

        /**
         * Filter attributes not matching the specified string
         * 
         * @param value the value to match
         * @return the filter
         */
        public AttributeFilter notMatching(CharSequence... value) {
            return newResourceAttributeFilter(not(stringFilter(StringOperation.MATCHES, value)));
        }

        private ResourceFilter stringFilter(StringOperation operation, CharSequence... values) {
            CompoundFilter filter = new CompoundFilter();
            for (CharSequence value : values) {
                filter.add(new StringFilter(this.attribute, operation, value));
            }
            return filter;
        }

        private ResourceFilter not(ResourceFilter filter) {
            return new InvertFilter(filter);
        }

        protected abstract AttributeFilter newResourceAttributeFilter(ResourceFilter filter);

        @Override
        public boolean match(Resource resource) {
            if (this.parent != null && !this.parent.match(resource)) {
                return false;
            }
            return this.filter.match(resource);
        }
    }

    public static class FileAttributeFilter extends AttributeFilter implements ResourceFilter {

        public FileAttributeFilter(ResourceAttribute attribute, AttributeFilter parent, ResourceFilter filter) {
            super(attribute, parent, filter);
        }

        @Override
        protected AttributeFilter newResourceAttributeFilter(ResourceFilter filter) {
            return new FileAttributeFilter(getAttribute(), this, filter);
        }
    }

    public static class FolderAttributeFilter extends AttributeFilter implements ResourceFilter {

        public FolderAttributeFilter(ResourceAttribute attribute, AttributeFilter parent, ResourceFilter filter) {
            super(attribute, parent, filter);
        }

        @Override
        protected AttributeFilter newResourceAttributeFilter(ResourceFilter filter) {
            return new FolderAttributeFilter(getAttribute(), this, filter);
        }
    }

    public static class ResourceAttributeFilter extends AttributeFilter implements ResourceFilter {

        public ResourceAttributeFilter(ResourceAttribute attribute, AttributeFilter parent, ResourceFilter filter) {
            super(attribute, parent, filter);
        }

        @Override
        protected AttributeFilter newResourceAttributeFilter(ResourceFilter filter) {
            return new ResourceAttributeFilter(getAttribute(), this, filter);
        }
    }

    private static class ResourceTypeFilter implements ResourceFilter {

        private final Class<? extends Resource> resourceType;

        public ResourceTypeFilter(Class<? extends Resource> resourceType) {
            this.resourceType = resourceType;
        }

        @Override
        public boolean match(Resource resource) {
            return this.resourceType.isInstance(resource);
        }
    }

    private static class FileTypeFilter extends ResourceTypeFilter {

        public FileTypeFilter() {
            super(File.class);
        }
    }

    private static class FolderTypeFilter extends ResourceTypeFilter {

        public FolderTypeFilter() {
            super(Folder.class);
        }
    }

    private static class CompoundFilter implements ResourceFilter {

        private final List<ResourceFilter> filters = new ArrayList<ResourceFilter>();

        public void add(ResourceFilter filter) {
            this.filters.add(filter);
        }

        @Override
        public boolean match(Resource resource) {
            for (ResourceFilter filter : this.filters) {
                if (filter.match(resource)) {
                    return true;
                }
            }
            return false;
        }
    }

    private static class InvertFilter implements ResourceFilter {

        private final ResourceFilter filter;

        public InvertFilter(ResourceFilter filter) {
            this.filter = filter;
        }

        @Override
        public boolean match(Resource resource) {
            return !this.filter.match(resource);
        }
    }

    private enum StringOperation {
        STARTS, ENDS, CONTAINS, MATCHES
    }

    private static class StringFilter implements ResourceFilter {

        private final ResourceAttribute attribute;

        private final StringOperation operation;

        private final CharSequence value;

        public StringFilter(ResourceAttribute attribute, StringOperation operation, CharSequence value) {
            this.attribute = attribute;
            this.operation = operation;
            this.value = value;
        }

        @Override
        public boolean match(Resource resource) {
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
