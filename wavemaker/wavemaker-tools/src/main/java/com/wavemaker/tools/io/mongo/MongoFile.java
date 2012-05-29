
package com.wavemaker.tools.io.mongo;

import com.mongodb.gridfs.GridFS;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.mongo.MongoResourceStore.MongoFileStore;
import com.wavemaker.tools.io.store.FileStore;
import com.wavemaker.tools.io.store.StoredFile;

/**
 * A {@link File} implementation backed by a mongo {@link GridFS}.
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

}
