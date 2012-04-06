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

package com.wavemaker.tools.project;

import java.io.InputStream;

import com.wavemaker.runtime.server.Downloadable;
import com.wavemaker.tools.io.File;

/**
 * Adapter class that presents a {@link File} as a {@link Downloadable}.
 * 
 * @author Phillip Webb
 */
public class DownloadableFile implements Downloadable {

    private final File file;

    public DownloadableFile(File file) {
        this.file = file;
    }

    @Override
    public InputStream getContents() {
        return this.file.getContent().asInputStream();
    }

    @Override
    public Integer getContentLength() {
        return new Integer((int) this.file.getSize());
    }

    @Override
    public String getContentType() {
        return "application/unknown";
    }

    @Override
    public String getFileName() {
        return this.file.getName();
    }
}
