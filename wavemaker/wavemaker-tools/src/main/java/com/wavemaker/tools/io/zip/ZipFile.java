
package com.wavemaker.tools.io.zip;

import com.wavemaker.tools.io.store.FileStore;
import com.wavemaker.tools.io.store.StoredFile;
import com.wavemaker.tools.io.zip.ZipResourceStore.ZipFileStore;

public class ZipFile extends StoredFile {

    private final ZipFileStore store;

    ZipFile(ZipFileStore store) {
        this.store = store;
    }

    @Override
    protected FileStore getStore() {
        return this.store;
    }

}
