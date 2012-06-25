
package com.wavemaker.tools.io.virtual;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.store.FileStore;
import com.wavemaker.tools.io.store.StoredFile;
import com.wavemaker.tools.io.virtual.VirtualResourceStore.VirtualFileStore;

/**
 * A virtual {@link File} implementation that exists only in memory.
 * 
 * @see VirtualFolder
 * 
 * @author Phillip Webb
 */
public class VirtualFile extends StoredFile {

    private final VirtualFileStore store;

    /**
     * Package scope constructor, files should only be accessed via the {@link VirtualFolder},
     * 
     * @param store the file store
     */
    VirtualFile(VirtualFileStore store) {
        Assert.notNull(store, "Store must not be null");
        this.store = store;
    }

    @Override
    protected boolean write(File file) {
        this.store.write(file);
        return true;
    }

    @Override
    protected FileStore getStore() {
        return this.store;
    }

}
