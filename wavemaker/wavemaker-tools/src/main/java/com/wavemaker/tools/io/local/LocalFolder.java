/*
 *  Copyright (C) 2013 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.io.local;

import java.io.File;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.local.LocalResourceStore.LocalFolderStore;
import com.wavemaker.tools.io.store.FolderStore;
import com.wavemaker.tools.io.store.StoredFolder;

/**
 * A {@link Folder} implementation backed by standard {@link File java.io.File}s.
 * 
 * @see LocalFile
 * 
 * @author Phillip Webb
 */
public class LocalFolder extends StoredFolder {

    private final LocalFolderStore store;

    /**
     * Package level constructor used when accessing nested folders.
     * 
     * @param store the store
     */
    LocalFolder(LocalFolderStore store) {
        this.store = store;
    }

    /**
     * Create a new {@link LocalFolder} for the specified folder.
     * 
     * @param folder the underlying folder, eg '/home/username'
     */
    public LocalFolder(String folder) {
        this(new java.io.File(folder));
    }

    /**
     * Create a new {@link LocalFolder} for the specified folder.
     * 
     * @param folder the underlying folder
     */
    public LocalFolder(java.io.File folder) {
        this.store = new LocalFolderStore(folder, new JailedResourcePath());
    }

    @Override
    protected FolderStore getStore() {
        return this.store;
    }

    /**
     * Returns access to the underlying local {@link File}.
     * 
     * @return the underlying {@link File}
     */
    public File getLocalFile() {
        return this.store.getFile();
    }
}
