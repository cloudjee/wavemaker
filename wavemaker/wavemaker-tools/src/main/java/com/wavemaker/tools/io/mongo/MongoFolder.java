
package com.wavemaker.tools.io.mongo;

import org.springframework.util.Assert;

import com.mongodb.DB;
import com.mongodb.gridfs.GridFS;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.filesystem.FileSystem.ResourceOrigin;
import com.wavemaker.tools.io.mongo.MongoResourceStore.MongoFolderStore;
import com.wavemaker.tools.io.store.FolderStore;
import com.wavemaker.tools.io.store.StoredFolder;

public class MongoFolder extends StoredFolder {

    private final MongoFolderStore store;

    MongoFolder(MongoFolderStore store) {
        this.store = store;
    }

    public MongoFolder(DB db, String bucket) {
        Assert.notNull(db, "DB must not be null");
        Assert.notNull(bucket, "Bucket must not be null");
        GridFS fs = new GridFS(db, bucket);
        this.store = new MongoFolderStore(fs, new JailedResourcePath());
    }

    @Override
    protected FolderStore getStore() {
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
