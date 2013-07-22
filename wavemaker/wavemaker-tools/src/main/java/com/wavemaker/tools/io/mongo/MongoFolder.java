/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.io.mongo;

import org.springframework.util.Assert;

import com.mongodb.DB;
import com.mongodb.gridfs.GridFS;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.mongo.MongoResourceStore.MongoFolderStore;
import com.wavemaker.tools.io.store.FolderStore;
import com.wavemaker.tools.io.store.StoredFolder;

/**
 * A {@link Folder} implementation backed by a mongo {@link GridFS}.
 * 
 * @see MongoFile
 * 
 * @author Phillip Webb
 */
public class MongoFolder extends StoredFolder {

    private final MongoFolderStore store;

    /**
     * Package level constructor used by {@link MongoResourceStore} when accessing nested folders.
     * 
     * @param store the store
     */
    MongoFolder(MongoFolderStore store) {
        this.store = store;
    }

    /**
     * Create a new {@link MongoFolder} using rhe specified mongo database. The data will be stored in
     * {@link GridFS#DEFAULT_BUCKET defaul bucket}.
     * 
     * @param db the mongo database
     */
    public MongoFolder(DB db) {
        this(db, GridFS.DEFAULT_BUCKET);
    }

    /**
     * Create a new {@link MongoFolder} using the specified mongo database and bucket.
     * 
     * @param db the mongo database
     * @param bucket the bucket
     */
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
}
