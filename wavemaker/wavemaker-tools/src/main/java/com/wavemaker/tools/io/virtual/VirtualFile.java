
package com.wavemaker.tools.io.virtual;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.store.FileStore;
import com.wavemaker.tools.io.store.StoredFile;
import com.wavemaker.tools.io.virtual.VirtualResourceStore.VirtualFileStore;

public class VirtualFile extends StoredFile {

    private final VirtualFileStore store;

    VirtualFile(VirtualFileStore store) {
        Assert.notNull(store, "Store must not be null");
        this.store = store;
    }

    @Override
    protected boolean write(File file) {
        this.store.setSource(file);
        return true;
    }

    @Override
    protected FileStore getStore() {
        return this.store;
    }

}
