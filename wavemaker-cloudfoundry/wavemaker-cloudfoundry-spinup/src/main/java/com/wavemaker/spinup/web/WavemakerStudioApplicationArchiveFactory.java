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

package com.wavemaker.spinup.web;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipFile;

import javax.servlet.ServletContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.cloudfoundry.client.lib.archive.ApplicationArchive;
import org.cloudfoundry.client.lib.archive.ApplicationArchive.Entry;
import org.cloudfoundry.client.lib.archive.ZipApplicationArchive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.context.support.ServletContextResource;

import com.wavemaker.tools.cloudfoundry.spinup.ApplicationArchiveFactory;

/**
 * {@link ApplicationArchiveFactory} used to access the wavemaker studio WAR.
 */
@Component
public class WavemakerStudioApplicationArchiveFactory implements ApplicationArchiveFactory, ServletContextAware {

    private final Log logger = LogFactory.getLog(getClass());

    File studioWarFile;

    private VersionProvider versionProvider;

    private List<ApplicationArchive.Entry> entries;

    @Override
    public void setServletContext(ServletContext servletContext) {
        try {
            String version = this.versionProvider.getVersion(servletContext);
            String path = "/resources/wavemaker-studio-" + version + ".war";
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("Using studio resource " + path);
            }
            ServletContextResource studioResource = new ServletContextResource(servletContext, path);
            Assert.state(studioResource.exists(), "Studio resource '" + path + "' does not exist");
            Assert.state(studioResource.getFile() != null, "Studio resource '" + path + "' cannot be accessed as a File");
            this.studioWarFile = studioResource.getFile();
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
        preCacheEntries();
    }

    void preCacheEntries() {
        try {
            for (Entry entry : getArchive().getEntries()) {
                entry.getSha1Digest();
            }
        } catch (Exception e) {
        }
    }

    @Override
    public ApplicationArchive getArchive() throws Exception {
        return new WavemakerStudioApplicationArchive(new ZipFile(this.studioWarFile));
    }

    @Override
    public void closeArchive(ApplicationArchive archive) throws Exception {
        ((WavemakerStudioApplicationArchive) archive).close();
    }

    @Autowired
    public void setVersionProvider(VersionProvider versionProvider) {
        this.versionProvider = versionProvider;
    }

    private class WavemakerStudioApplicationArchive extends ZipApplicationArchive {

        private final ZipFile zipFile;

        public WavemakerStudioApplicationArchive(ZipFile zipFile) {
            super(zipFile);
            this.zipFile = zipFile;
        }

        public void close() throws IOException {
            this.zipFile.close();
        }

        @Override
        public Iterable<Entry> getEntries() {
            // Since we are a singleton and a read-only zip we can aggressively cache entries since they will not change
            if (WavemakerStudioApplicationArchiveFactory.this.entries == null) {
                WavemakerStudioApplicationArchiveFactory.this.entries = new ArrayList<ApplicationArchive.Entry>();
                for (Entry entry : super.getEntries()) {
                    WavemakerStudioApplicationArchiveFactory.this.entries.add(entry);
                }
            }
            return WavemakerStudioApplicationArchiveFactory.this.entries;
        }
    }

}
