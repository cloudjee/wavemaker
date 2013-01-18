/*
 *  Copyright (C) 2012-2013 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.io.zip;

import java.io.FilterInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.LinkedHashSet;
import java.util.Set;

import org.cloudfoundry.client.lib.io.DynamicZipInputStream;
import org.cloudfoundry.client.lib.io.DynamicZipInputStream.Entry;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.Resources;

/**
 * Adapter class that can be used to convert a {@link Folder} into a zipped {@link InputStream}.
 * 
 * @author Phillip Webb
 */
class ZipResourcesStream extends FilterInputStream {

    private final Folder source;

    private final String prefix;

    /**
     * Create a new {@link ZipResourcesStream} instance.
     * 
     * @param resources Resources
     * @param prefix an optional entry prefix. This allows a entries to be nested within a folder if required
     */
    public ZipResourcesStream(Resources<?> resources, String prefix) {
        super(null);
        Assert.notNull(resources, "Resources must not be null");
        this.source = resources.getSource();
        this.prefix = fixupPrefix(prefix);
        Set<DynamicZipInputStream.Entry> entries = new LinkedHashSet<DynamicZipInputStream.Entry>();
        for (Resource resource : resources) {
            addToEntries(entries, resource);
        }
        this.in = new DynamicZipInputStream(entries);
    }

    private String fixupPrefix(String prefix) {
        if (!StringUtils.hasLength(prefix)) {
            return "";
        }
        if (!prefix.endsWith("/")) {
            return prefix + "/";
        }
        return prefix;
    }

    private void addToEntries(Set<Entry> entries, Resource resource) {
        Folder parent = resource.getParent();
        if (parent != null && !parent.equals(this.source)) {
            addToEntries(entries, resource.getParent());
        }
        entries.add(new ResourceEntry(resource));
    }

    private class ResourceEntry implements DynamicZipInputStream.Entry {

        private final Resource resource;

        public ResourceEntry(Resource resource) {
            this.resource = resource;
        }

        @Override
        public String getName() {
            return ZipResourcesStream.this.prefix + this.resource.toString().substring(ZipResourcesStream.this.source.toString().length());
        }

        @Override
        public InputStream getInputStream() throws IOException {
            if (this.resource instanceof File) {
                return ((File) this.resource).getContent().asInputStream();
            }
            return null;
        }

        @Override
        public boolean equals(Object obj) {
            if (obj == null) {
                return false;
            }
            if (obj == this) {
                return true;
            }
            if (obj instanceof ResourceEntry) {
                return ((ResourceEntry) obj).getName().equals(getName());
            }
            return false;
        }

        @Override
        public int hashCode() {
            return getName().hashCode();
        }
    }
}
