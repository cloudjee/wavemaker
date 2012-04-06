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

package com.wavemaker.tools.deployment.cloudfoundry;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.cloudfoundry.client.lib.archive.AbstractApplicationArchiveEntry;
import org.cloudfoundry.client.lib.archive.ApplicationArchive;
import org.cloudfoundry.client.lib.archive.ApplicationArchive.Entry;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.io.Resource;
import org.springframework.util.ObjectUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ResourceFilter;
import com.wavemaker.tools.project.StudioFileSystem;

public class WebAppAssembler implements InitializingBean {

    private StudioFileSystem fileSystem;

    private Future<Set<ApplicationArchiveEntry>> studioApplicationArchiveEnties;

    private final String[] IGNORED_LIB_PREFIXES = { "lib/wm/common/", "lib/dojo/util/", "lib/dojo/util/buildscripts/", "lib/wm/base/deprecated/" };

    private static final ApplicationArchiveEntry WEB_INF_ENTRY = new ApplicationArchiveEntry("WEB-INF");

    @Override
    public void afterPropertiesSet() throws Exception {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        this.studioApplicationArchiveEnties = executor.submit(new StudioApplicationArchiveEntriesCollector());
    }

    public ApplicationArchive assemble(Project project) {
        try {
            final String filename = project.getProjectName();
            final Set<ApplicationArchiveEntry> entries = new LinkedHashSet<ApplicationArchiveEntry>();
            String projectBasePath = this.fileSystem.getPath(project.getWebAppRoot());
            collectEntries(entries, projectBasePath, project.getWebAppRoot());
            entries.addAll(this.studioApplicationArchiveEnties.get());
            ensureAtLeastOneDirectoryEntry(entries);
            return new ApplicationArchive() {

                @Override
                public String getFilename() {
                    return filename;
                }

                @Override
                public Iterable<Entry> getEntries() {
                    return Collections.<ApplicationArchive.Entry> unmodifiableSet(entries);
                }
            };
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
    }

    /**
     * Ensure that the specified entries always contains at least one directory. This is required for a valid zip file.
     * 
     * @param entries entries to modify
     */
    private void ensureAtLeastOneDirectoryEntry(Set<ApplicationArchiveEntry> entries) {
        for (Entry entry : entries) {
            if (entry.isDirectory()) {
                return;
            }
        }
        entries.add(WEB_INF_ENTRY);
    }

    private void collectEntries(Set<ApplicationArchiveEntry> entries, String basePath, Resource root) throws IOException {
        collectEntries(entries, basePath, root, null);
    }

    private void collectEntries(Set<ApplicationArchiveEntry> entries, String basePath, Resource root, ResourceFilter filter) throws IOException {
        collectEntries(entries, basePath, root, filter, "");
    }

    private void collectEntries(Set<ApplicationArchiveEntry> entries, String basePath, Resource root, ResourceFilter filter, String newPath)
        throws IOException {
        filter = filter == null ? ResourceFilter.NO_FILTER : filter;
        List<Resource> children = this.fileSystem.listChildren(root, filter);
        for (Resource child : children) {
            String name = newPath + this.fileSystem.getPath(child).replace(basePath, "");
            if (this.fileSystem.isDirectory(child)) {
                addDirectoryEntries(entries, name);
                collectEntries(entries, basePath, child, filter);
            } else {
                addDirectoryEntries(entries, getParentDirectoryName(name));
                entries.add(new ApplicationArchiveEntry(name, child));
            }
        }
    }

    /**
     * Add directory entries, recursively ensuring that parent entries are also added (this is required for a valid zip
     * file).
     * 
     * @param entries the entries to add
     * @param name the name (can be null)
     */
    private void addDirectoryEntries(Set<ApplicationArchiveEntry> entries, String name) {
        if (name != null) {
            if (name.endsWith("/")) {
                name.substring(0, name.length() - 1);
            }
            String parent = getParentDirectoryName(name);
            addDirectoryEntries(entries, parent);
            entries.add(new ApplicationArchiveEntry(name + "/"));
        }
    }

    private String getParentDirectoryName(String name) {
        int lastSlash = name.lastIndexOf("/");
        if (lastSlash != -1) {
            return name.substring(0, lastSlash);
        }
        return null;
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    private final class StudioApplicationArchiveEntriesCollector implements Callable<Set<ApplicationArchiveEntry>> {

        @Override
        public Set<ApplicationArchiveEntry> call() throws Exception {
            try {
                Set<ApplicationArchiveEntry> entries = new LinkedHashSet<ApplicationArchiveEntry>();
                collectStudioEntries(entries);
                loadSha1Digests(entries);
                return entries;
            } catch (Throwable e) {
                throw new WMRuntimeException(e);
            }
        }

        private void collectStudioEntries(Set<ApplicationArchiveEntry> entries) throws IOException {

            Resource commonDir = WebAppAssembler.this.fileSystem.getCommonDir();
            String commonDirPath = WebAppAssembler.this.fileSystem.getPath(commonDir);
            Resource webAppRoot = WebAppAssembler.this.fileSystem.getStudioWebAppRoot();
            final String webAppRootPath = WebAppAssembler.this.fileSystem.getPath(webAppRoot);

            collectEntries(entries, webAppRootPath, webAppRoot.createRelative("images/"));
            collectEntries(entries, webAppRootPath, webAppRoot.createRelative("WEB-INF/lib/"));
            collectEntries(entries, webAppRootPath, webAppRoot.createRelative("lib/"), new ResourceFilter() {

                @Override
                public boolean accept(Resource resource) {
                    String path = WebAppAssembler.this.fileSystem.getPath(resource).replace(webAppRootPath, "");
                    if (path.startsWith("lib/dojo/") && path.contains("tests/")) {
                        return false;
                    }
                    for (String prefix : WebAppAssembler.this.IGNORED_LIB_PREFIXES) {
                        if (path.startsWith(prefix)) {
                            return false;
                        }
                    }
                    return true;
                }
            });
            collectEntries(entries, commonDirPath, commonDir, null, "lib/wm/common/");
        }

        private void loadSha1Digests(Set<ApplicationArchiveEntry> entries) {
            for (ApplicationArchiveEntry entry : entries) {
                entry.getSha1Digest();
            }
        }
    }

    private static class ApplicationArchiveEntry extends AbstractApplicationArchiveEntry {

        private final String name;

        private Resource resource;

        public ApplicationArchiveEntry(String name) {
            this.name = name;
        }

        public ApplicationArchiveEntry(String name, Resource resource) {
            this.name = name;
            this.resource = resource;
        }

        @Override
        public InputStream getInputStream() throws IOException {
            return this.resource == null ? null : this.resource.getInputStream();
        }

        @Override
        public String getName() {
            return this.name;
        }

        @Override
        public boolean isDirectory() {
            return this.resource == null;
        }

        @Override
        public long getSize() {
            if (isDirectory()) {
                return 0;
            }
            try {
                return this.resource.contentLength();
            } catch (IOException e) {
                return super.getSize();
            }
        }

        @Override
        public String toString() {
            return getName();
        }

        @Override
        public boolean equals(Object obj) {
            if (obj instanceof ApplicationArchiveEntry) {
                return ObjectUtils.nullSafeEquals(((ApplicationArchiveEntry) obj).getName(), getName());
            }
            return super.equals(obj);
        }

        @Override
        public int hashCode() {
            return ObjectUtils.nullSafeHashCode(getName());
        }
    }
}
