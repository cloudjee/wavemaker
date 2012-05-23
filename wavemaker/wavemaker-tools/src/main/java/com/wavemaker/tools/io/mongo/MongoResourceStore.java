
package com.wavemaker.tools.io.mongo;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Date;
import java.util.Iterator;

import org.springframework.util.Assert;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourcePath;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.io.store.FileStore;
import com.wavemaker.tools.io.store.FolderStore;
import com.wavemaker.tools.io.store.ResourceStore;

abstract class MongoResourceStore implements ResourceStore {

    private static final String PARENT = "parent";

    private static final String RESOURCE_TYPE = "resourceType";

    private final GridFS fs;

    private final JailedResourcePath path;

    public MongoResourceStore(GridFS fs, JailedResourcePath path) {
        Assert.notNull(fs, "FS must not be null");
        Assert.notNull(path, "Path must not be null");
        this.fs = fs;
        this.path = path;
    }

    protected final GridFS getFs() {
        return this.fs;
    }

    protected final GridFSDBFile getGridFSDBFile(JailedResourcePath path, boolean required) {
        return getFs().findOne(getFilename(path));
    }

    protected GridFSInputFile create(Type type, boolean createEmptyFile) {
        Assert.notNull(type, "Type must not be null");
        GridFSInputFile file = this.fs.createFile(getFilename(getPath()));
        JailedResourcePath parent = this.path.getParent();
        if (parent != null) {
            file.put(PARENT, parent.getUnjailedPath().toString());
        }
        file.put(RESOURCE_TYPE, type.name());
        if (createEmptyFile) {
            try {
                file.getOutputStream().close();
            } catch (IOException e) {
                throw new ResourceException(e);
            }
        }
        return file;
    }

    private String getFilename(JailedResourcePath path) {
        return path.getUnjailedPath().toString();
    }

    @Override
    public JailedResourcePath getPath() {
        return this.path;
    }

    @Override
    public Folder getParent(JailedResourcePath path) {
        MongoFolderStore store = new MongoFolderStore(getFs(), path);
        return new MongoFolder(store);
    }

    @Override
    public Resource rename(String name) {
        throw new UnsupportedOperationException(); // FIXME
    }

    protected abstract Resource getRenamedResource(JailedResourcePath path);

    @Override
    public boolean exists() {
        return getGridFSDBFile(getPath(), false) != null;
    }

    @Override
    public void delete() {
        getFs().remove(getFilename(getPath()));
    }

    static class MongoFileStore extends MongoResourceStore implements FileStore {

        public MongoFileStore(GridFS fs, JailedResourcePath path) {
            super(fs, path);
        }

        @Override
        protected Resource getRenamedResource(JailedResourcePath path) {
            MongoFileStore store = new MongoFileStore(getFs(), path);
            return new MongoFile(store);
        }

        @Override
        public void create() {
            create(Type.FILE, true);
        }

        @Override
        public InputStream getInputStream() {
            return getGridFSDBFile(getPath(), true).getInputStream();
        }

        @Override
        public OutputStream getOutputStream() {
            delete();
            GridFSInputFile file = create(Type.FILE, false);
            return file.getOutputStream();
        }

        @Override
        public long getSize() {
            return getGridFSDBFile(getPath(), true).getLength();
        }

        @Override
        public long getLastModified() {
            return getGridFSDBFile(getPath(), true).getUploadDate().getTime();
        }

        @Override
        public void touch() {
            getGridFSDBFile(getPath(), true).put("uploadDate", new Date());
        }
    }

    static class MongoFolderStore extends MongoResourceStore implements FolderStore {

        public MongoFolderStore(GridFS fs, JailedResourcePath path) {
            super(fs, path);
        }

        @Override
        protected Resource getRenamedResource(JailedResourcePath path) {
            return getFolder(path);
        }

        @Override
        public void create() {
            create(Type.FOLDER, true);
        }

        @Override
        public Resource getExisting(JailedResourcePath path) {
            GridFSDBFile file = getGridFSDBFile(path, false);
            if (file == null) {
                return null;
            }
            Type type = Type.valueOf((String) file.get(RESOURCE_TYPE));
            return type == Type.FILE ? getFile(path) : getFolder(path);
        }

        @Override
        public Folder getFolder(JailedResourcePath path) {
            MongoFolderStore store = new MongoFolderStore(getFs(), path);
            return new MongoFolder(store);
        }

        @Override
        public File getFile(JailedResourcePath path) {
            MongoFileStore store = new MongoFileStore(getFs(), path);
            return new MongoFile(store);
        }

        @Override
        public Iterable<String> list() {
            BasicDBObject query = new BasicDBObject(PARENT, getPath().getUnjailedPath().toString());
            final DBCursor list = getFs().getFileList(query);
            return new FileListIterable(list);
        }
    }

    private static class FileListIterable implements Iterable<String> {

        private final DBCursor list;

        public FileListIterable(DBCursor list) {
            this.list = list;
        }

        @Override
        public Iterator<String> iterator() {
            return new FileListIterator(this.list.iterator());
        }
    }

    private static class FileListIterator implements Iterator<String> {

        private final Iterator<DBObject> iterator;

        public FileListIterator(Iterator<DBObject> iterator) {
            this.iterator = iterator;
        }

        @Override
        public boolean hasNext() {
            return this.iterator.hasNext();
        }

        @Override
        public String next() {
            DBObject next = this.iterator.next();
            String filename = (String) next.get("filename");
            ResourcePath path = new ResourcePath().get(filename);
            return path.getName();
        }

        @Override
        public void remove() {
            throw new UnsupportedOperationException();
        }
    }

    private static enum Type {
        FILE, FOLDER
    }
}
