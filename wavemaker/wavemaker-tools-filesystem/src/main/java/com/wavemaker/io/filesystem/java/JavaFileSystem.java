
package com.wavemaker.io.filesystem.java;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.Collections;

import org.springframework.util.Assert;

import com.wavemaker.io.ResourceException;
import com.wavemaker.io.filesystem.FileSystem;
import com.wavemaker.io.filesystem.FileSystemPath;
import com.wavemaker.io.filesystem.ResourceType;

public class JavaFileSystem implements FileSystem<JavaFileSystemKey> {

    // FIXME assert file types?

    private final File root;

    public JavaFileSystem(File root) {
        Assert.notNull(root, "Root must not be null");
        if (!root.exists()) {
            if (!root.mkdirs()) {
                throw new IllegalStateException("Unable to create root folder " + root);
            }
        }
        Assert.state(root.isDirectory(), "The root '" + root + "' does not reference a directory");
        this.root = root;
    }

    @Override
    public JavaFileSystemKey getKey(FileSystemPath path) {
        return new JavaFileSystemKey(this.root, path);
    }

    @Override
    public FileSystemPath getPath(JavaFileSystemKey key) {
        return key.getPath();
    }

    @Override
    public ResourceType getResourceType(JavaFileSystemKey key) {
        File file = key.getFile();
        if (!file.exists()) {
            return ResourceType.DOES_NOT_EXIST;
        }
        return file.isDirectory() ? ResourceType.FOLDER : ResourceType.FILE;
    }

    @Override
    public void createFile(JavaFileSystemKey key) {
        File file = key.getFile();
        try {
            if (!file.createNewFile()) {
                throw new ResourceException("Unable to create file " + file);
            }
        } catch (IOException e) {
            throw new ResourceException(e);
        }
    }

    @Override
    public void createFolder(JavaFileSystemKey key) {
        File file = key.getFile();
        if (!file.mkdir()) {
            throw new ResourceException("Unable to create folder " + file);
        }
    }

    @Override
    public Iterable<String> list(JavaFileSystemKey key) {
        return Collections.unmodifiableList(Arrays.asList(key.getFile().list()));
    }

    @Override
    public long getSize(JavaFileSystemKey key) {
        return key.getFile().length();
    }

    @Override
    public long getLastModified(JavaFileSystemKey key) {
        return key.getFile().lastModified();
    }

    @Override
    public byte[] getSha1Digest(JavaFileSystemKey key) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public InputStream getInputStream(JavaFileSystemKey key) {
        try {
            return new FileInputStream(key.getFile());
        } catch (FileNotFoundException e) {
            throw new ResourceException(e);
        }
    }

    @Override
    public OutputStream getOutputStream(JavaFileSystemKey key) {
        try {
            return new FileOutputStream(key.getFile(), false);
        } catch (FileNotFoundException e) {
            throw new ResourceException(e);
        }
    }

    @Override
    public void delete(JavaFileSystemKey key) {
        File file = key.getFile();
        if (!file.delete()) {
            throw new ResourceException("Unable to delete " + file);
        }
    }
}
