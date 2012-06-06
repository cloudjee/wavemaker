
package com.wavemaker.tools.io.zip;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.store.FolderStore;
import com.wavemaker.tools.io.store.StoredFolder;
import com.wavemaker.tools.io.zip.ZipResourceStore.ZipFolderStore;

/**
 * Adapter class that can be used present a zip file as a {@link Folder}.
 * 
 * @author Phillip Webb
 */
public class ZipFolder extends StoredFolder {

    private final ZipFolderStore store;

    /**
     * Create a new {@link ZipFolder} instance from the specified zip file.
     * 
     * @param zipFile the zip file
     */
    public ZipFolder(File zipFile) {
        this.store = new ZipFolderStore(zipFile);
    }

    /**
     * Package scope constructor used when accessing nested folders.
     * 
     * @param store the zip store
     */
    ZipFolder(ZipFolderStore store) {
        this.store = store;
    }

    @Override
    protected FolderStore getStore() {
        return this.store;
    }
}
