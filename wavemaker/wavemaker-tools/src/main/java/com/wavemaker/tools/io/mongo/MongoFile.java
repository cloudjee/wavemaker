
package com.wavemaker.tools.io.mongo;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.filesystem.FileSystem.ResourceOrigin;
import com.wavemaker.tools.io.mongo.MongoResourceStore.MongoFileStore;
import com.wavemaker.tools.io.store.FileStore;
import com.wavemaker.tools.io.store.StoredFile;

/**
 * A {@link File} implementation backed by standard {@link File java.io.File}s.
 * 
 * @see MongoFolder
 * 
 * @author Phillip Webb
 */
public class MongoFile extends StoredFile {

    private final MongoFileStore store;

    /**
     * Package scope constructor, files should only be accessed via the {@link MongoFolder},
     * 
     * @param store the file store
     */
    MongoFile(MongoFileStore store) {
        this.store = store;
    }

    @Override
    protected FileStore getStore() {
        return this.store;
    }

    @Override
    public ResourceOrigin getResourceOrigin() {
        return ResourceOrigin.MONGO_DB;
    }

    @Override
    public Object getOriginalResource() {
        throw new UnsupportedOperationException();
    }

    @Override
    public String getCanonicalPath() {
        throw new UnsupportedOperationException();
    }

    @Override
    public String getAbsolutePath() {
        throw new UnsupportedOperationException();
    }
}
