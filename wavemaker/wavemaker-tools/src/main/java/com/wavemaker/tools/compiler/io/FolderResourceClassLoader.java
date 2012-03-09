
package com.wavemaker.tools.compiler.io;

import java.io.IOException;
import java.net.URL;
import java.util.Collections;
import java.util.Enumeration;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.Folder;

public class FolderResourceClassLoader extends ClassLoader {

    private final Iterable<Folder> folders;

    public FolderResourceClassLoader(Folder folder, ClassLoader parent) {
        super(parent);
        Assert.notNull(folder, "Folder must not be null");
        this.folders = Collections.singleton(folder);
    }

    public FolderResourceClassLoader(Iterable<Folder> folders, ClassLoader parent) {
        super(parent);
        Assert.notNull(folders, "Folders must not be null");
        this.folders = folders;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        // TODO Auto-generated method stub
        return super.findClass(name);
    }

    @Override
    protected URL findResource(String name) {
        // TODO Auto-generated method stub
        return super.findResource(name);
    }

    @Override
    protected Enumeration<URL> findResources(String name) throws IOException {
        // TODO Auto-generated method stub
        return super.findResources(name);
    }
}
