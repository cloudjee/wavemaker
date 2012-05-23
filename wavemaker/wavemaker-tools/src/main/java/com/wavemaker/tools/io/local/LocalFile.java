
package com.wavemaker.tools.io.local;

import java.io.IOException;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.local.LocalResourceStore.LocalFileStore;
import com.wavemaker.tools.io.store.FileStore;
import com.wavemaker.tools.io.store.StoredFile;

/**
 * A {@link File} implementation backed by standard {@link File java.io.File}s.
 * 
 * @see LocalFolder
 * 
 * @author Phillip Webb
 */
public class LocalFile extends StoredFile {

    private final LocalFileStore store;

    /**
     * Package scope constructor, files should only be accessed via the {@link LocalFolder},
     * 
     * @param store the file store
     */
    LocalFile(LocalFileStore store) {
        this.store = store;
    }

    @Override
    protected FileStore getStore() {
        return this.store;
    }

    public java.io.File getOriginalResource() {
        return this.store.getFile();
    }

    public String getCanonicalPath() {
        try {
            return getOriginalResource().getCanonicalPath();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public String getAbsolutePath() {
        return getOriginalResource().getAbsolutePath();
    }
}
