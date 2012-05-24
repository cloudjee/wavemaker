
package com.wavemaker.tools.io.zip;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.store.FolderStore;
import com.wavemaker.tools.io.store.StoredFolder;
import com.wavemaker.tools.io.zip.ZipResourceStore.ZipFolderStore;

public class ZipFolder extends StoredFolder {

    private final ZipFolderStore store;

    public ZipFolder(File zipFile) {
        this.store = new ZipFolderStore(zipFile);
    }

    ZipFolder(ZipFolderStore store) {
        this.store = store;
    }

    @Override
    protected FolderStore getStore() {
        return this.store;
    }

}
