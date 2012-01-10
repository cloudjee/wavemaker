
package com.wavemaker.tools.filesystem.adapter.compiler;

import java.io.IOException;
import java.util.Iterator;
import java.util.Set;

import javax.tools.FileObject;
import javax.tools.JavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;

public class FolderJavaFileManagerAdapter implements JavaFileManager {

    @Override
    public ClassLoader getClassLoader(Location location) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Iterable<JavaFileObject> list(Location location, String packageName, Set<Kind> kinds, boolean recurse) throws IOException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String inferBinaryName(Location location, JavaFileObject file) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public boolean isSameFile(FileObject a, FileObject b) {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean handleOption(String current, Iterator<String> remaining) {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public JavaFileObject getJavaFileForInput(Location location, String className, Kind kind) throws IOException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public JavaFileObject getJavaFileForOutput(Location location, String className, Kind kind, FileObject sibling) throws IOException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public boolean hasLocation(Location location) {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public FileObject getFileForInput(Location location, String packageName, String relativeName) throws IOException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public FileObject getFileForOutput(Location location, String packageName, String relativeName, FileObject sibling) throws IOException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void flush() throws IOException {
        // TODO Auto-generated method stub

    }

    @Override
    public void close() throws IOException {
        // TODO Auto-generated method stub

    }

    @Override
    public int isSupportedOption(String option) {
        // TODO Auto-generated method stub
        return 0;
    }
}
