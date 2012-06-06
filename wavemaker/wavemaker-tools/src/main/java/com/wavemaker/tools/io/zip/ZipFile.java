
package com.wavemaker.tools.io.zip;

import com.wavemaker.tools.io.store.FileStore;
import com.wavemaker.tools.io.store.StoredFile;
import com.wavemaker.tools.io.zip.ZipResourceStore.ZipFileStore;

/**
 * Access to a specific file contained in a {@link ZipFolder}.
 * 
 * @see ZipFolder
 * @author Phillip Webb
 */
public class ZipFile extends StoredFile {

    private final ZipFileStore store;

    /**
     * Package scope constructor. Files should only be accessed via a {@link ZipFolder}.
     * 
     * @param store the zip store
     */
    ZipFile(ZipFileStore store) {
        this.store = store;
    }

    @Override
    protected FileStore getStore() {
        return this.store;
    }

}
