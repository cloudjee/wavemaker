
package com.wavemaker.tools.io.local;

import java.io.IOException;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.filesystem.FileSystem.ResourceOrigin;
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

    @Override
    public ResourceOrigin getResourceOrigin() {
        return ResourceOrigin.LOCAL_FILE_SYSTEM;
    }

    @Override
    public Object getOriginalResource() {
        return this.store.getFile();
    }

    @Override
    public String getCanonicalPath() {
        try {
            return ((java.io.File) getOriginalResource()).getCanonicalPath();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public String getAbsolutePath() {
        return ((java.io.File) getOriginalResource()).getAbsolutePath();
    }
}
