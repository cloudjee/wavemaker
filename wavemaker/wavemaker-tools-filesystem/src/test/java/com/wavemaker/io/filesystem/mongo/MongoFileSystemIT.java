
package com.wavemaker.io.filesystem.mongo;

import java.util.UUID;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.mongodb.DB;
import com.mongodb.Mongo;
import com.wavemaker.io.Folder;
import com.wavemaker.io.filesystem.RootFileSystemFolderFactory;

public class MongoFileSystemIT {

    private DB database;

    @Before
    public void setup() throws Exception {
        Mongo mongo = new Mongo();
        String uuid = UUID.randomUUID().toString();
        System.out.println(uuid);
        this.database = mongo.getDB(uuid);
    }

    @After
    public void teardown() {
        // FIXME this.database.dropDatabase();
    }

    // FIXME proper test
    @Test
    public void shouldWork() throws Exception {
        MongoFileSystem fileSystem = new MongoFileSystem(this.database, "fs");
        Folder folderRoot = RootFileSystemFolderFactory.getRoot(fileSystem);
        folderRoot.getFolder("a/b").getFile("c.txt").getContent().write("hello");
        folderRoot.getFolder("a/b").getFile("c.bak").touch();
        folderRoot.getFile("a/b/c.txt").moveTo(folderRoot);
        folderRoot.getFolder("a/b").list().delete();
    }

}
