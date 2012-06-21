
package com.wavemaker.tools.io.virtual;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.store.FolderStore;
import com.wavemaker.tools.io.store.StoredFolder;
import com.wavemaker.tools.io.virtual.VirtualResourceStore.VirtualFolderStore;

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
