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

import org.springframework.util.StringUtils;

import com.wavemaker.runtime.server.Downloadable;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.zip.ZippedFolderInputStream;

/**
 * Adapter class that presents a {@link Folder} as a {@link Downloadable}. The contents of the folder are zipped.
 * 
 * @author Phillip Webb
 */
public class DownloadableFolder implements Downloadable {

    private static final String ZIP_EXT = ".zip";

    private final Folder folder;

    private final String defaultName;

    public DownloadableFolder(Folder folder, String defaultName) {
        this.folder = folder;
        this.defaultName = defaultName;
    }

    @Override
    public InputStream getContents() {
        return new ZippedFolderInputStream(this.folder, getName());
    }

    @Override
    public Integer getContentLength() {
        return null;
    }

    @Override
    public String getContentType() {
        return "application/zip";
    }

    @Override
    public String getFileName() {
        return getName() + ZIP_EXT;
    }

    private String getName() {
        if (StringUtils.hasLength(this.folder.getName())) {
            return this.folder.getName();
        }
        return this.defaultName;
    }

}
