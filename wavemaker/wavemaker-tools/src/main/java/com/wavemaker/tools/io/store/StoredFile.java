
package com.wavemaker.tools.io.store;

import java.io.InputStream;
import java.io.OutputStream;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.AbstractFileContent;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.FileContent;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.exception.ResourceDoesNotExistException;
import com.wavemaker.tools.io.exception.ResourceExistsException;

public abstract class StoredFile extends StoredResource implements File {

    private final StoredFileContent content = new StoredFileContent();

    @Override
    protected abstract FileStore getStore();

    @Override
    public long getSize() {
        return getStore().getSize();
    }

    @Override
    public long getLastModified() {
        return getStore().getLastModified();
    }

    @Override
    public void touch() throws ResourceDoesNotExistException {
        ensureExists();
        getStore().touch();
    }

    @Override
    public FileContent getContent() {
        return this.content;
    }

    @Override
    public File rename(String name) throws ResourceExistsException {
        return (File) super.rename(name);
    }

    @Override
    public void delete() {
        if (exists()) {
            getStore().delete();
        }
    }

    @Override
    public File moveTo(Folder folder) {
        Assert.notNull(folder, "Folder must not be null");
        ensureExists();
        File destination = folder.getFile(getName().toString());
        destination.getContent().write(getContent().asInputStream());
        getStore().delete();
        return destination;
    }

    @Override
    public File copyTo(Folder folder) {
        Assert.notNull(folder, "Folder must not be null");
        ensureExists();
        File destination = folder.getFile(getName().toString());
        destination.getContent().write(getContent().asInputStream());
        return destination;
    }

    @Override
    public void createIfMissing() {
        if (!exists()) {
            createParentIfMissing();
            getStore().create();
        }
    }

    private class StoredFileContent extends AbstractFileContent {

        @Override
        public InputStream asInputStream() {
            createParentIfMissing();
            return getStore().getInputStream();
        }

        @Override
        public OutputStream asOutputStream() {
            createParentIfMissing();
            return getStore().getOutputStream();
        }
    };

}
