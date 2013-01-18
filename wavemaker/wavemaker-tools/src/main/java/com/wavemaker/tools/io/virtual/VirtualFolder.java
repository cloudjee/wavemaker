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

package com.wavemaker.tools.io.virtual;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.store.FolderStore;
import com.wavemaker.tools.io.store.StoredFolder;
import com.wavemaker.tools.io.virtual.VirtualResourceStore.VirtualFolderStore;

/**
 * A virtual {@link Folder} that exists only in memory. Virtual folders provide a convenient method for manipulating
 * existing {@link File}s and {@link Folder}s without needing to create physical copies. Memory consumption for
 * {@link VirtualFile}s is kept to a minimum by only storing data when it is changed.
 * 
 * @author Phillip Webb
 */
public class VirtualFolder extends StoredFolder {

    private final VirtualFolderStore store;

    public VirtualFolder() {
        this.store = new VirtualFolderStore();
    }

    VirtualFolder(VirtualFolderStore store) {
        Assert.notNull(store, "Store must not be null");
        this.store = store;
    }

    @Override
    protected FolderStore getStore() {
        return this.store;
    }

}
