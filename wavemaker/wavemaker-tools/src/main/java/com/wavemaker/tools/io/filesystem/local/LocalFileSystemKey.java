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

package com.wavemaker.tools.io.filesystem.local;

import java.io.File;

import com.wavemaker.tools.io.filesystem.JailedResourcePath;

/**
 * Key used with {@link LocalFileSystem}.
 * 
 * @author Phillip Webb
 */
class LocalFileSystemKey {

    private final JailedResourcePath path;

    private final File file;

    public LocalFileSystemKey(File root, JailedResourcePath path) {
        this.path = path;
        this.file = new File(root, path.getUnjailedPath().toString());
    }

    public JailedResourcePath getPath() {
        return this.path;
    }

    public File getFile() {
        return this.file;
    }

    @Override
    public String toString() {
        return this.file.toString();
    }
}
