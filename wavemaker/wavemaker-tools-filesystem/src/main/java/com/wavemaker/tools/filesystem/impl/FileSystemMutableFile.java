
package com.wavemaker.tools.filesystem.impl;

import com.wavemaker.tools.filesystem.MutableFile;
import com.wavemaker.tools.filesystem.MutableFileContent;
import com.wavemaker.tools.filesystem.MutableFolder;

public class FileSystemMutableFile<R> extends FileSystemMutableResource<R> implements MutableFile {

    public FileSystemMutableFile(FileSystem<R> fileSystem, R root, Path path) {
        super(fileSystem, root, path);
    }

    @Override
    public long getSize() {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public long getLastModified() {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public byte[] getSha1Digest() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MutableFileContent getContent() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void copyTo(MutableFolder folder) {
        // TODO Auto-generated method stub

    }

    @Override
    public void moveTo(MutableFolder folder) {
        // TODO Auto-generated method stub

    }

    @Override
    public void touch() {
        // TODO Auto-generated method stub

    }

    @Override
    public void delete() {
        // TODO Auto-generated method stub

    }

}
