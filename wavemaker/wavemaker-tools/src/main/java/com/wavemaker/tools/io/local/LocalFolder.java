
package com.wavemaker.tools.io.local;

import java.io.File;
import java.io.IOException;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.local.LocalResourceStore.LocalFolderStore;
import com.wavemaker.tools.io.store.FolderStore;
import com.wavemaker.tools.io.store.StoredFolder;

public class LocalFolder extends StoredFolder {

    private final LocalFolderStore store;

    LocalFolder(LocalFolderStore store) {
        this.store = store;
    }

    public LocalFolder(String folder) {
        this(new java.io.File(folder));
    }

    public LocalFolder(java.io.File folder) {
        this.store = new LocalFolderStore(folder, new JailedResourcePath());
    }

    @Override
    protected FolderStore getStore() {
        return this.store;
    }

    public File getOriginalResource() {
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
