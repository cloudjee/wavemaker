
package com.wavemaker.tools.compiler.io;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;
import java.net.URI;

import javax.tools.FileObject;

import com.wavemaker.tools.io.File;

public class ResourceFileObject implements FileObject {

    private final File file;

    public ResourceFileObject(File file) {
        this.file = file;
    }

    protected final File getFile() {
        return this.file;
    }

    @Override
    public URI toUri() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getName() {
        return this.file.toString();
    }

    @Override
    public InputStream openInputStream() throws IOException {
        return this.file.getContent().asInputStream();
    }

    @Override
    public OutputStream openOutputStream() throws IOException {
        return this.file.getContent().asOutputStream();
    }

    @Override
    public Reader openReader(boolean ignoreEncodingErrors) throws IOException {
        return this.file.getContent().asReader();
    }

    @Override
    public CharSequence getCharContent(boolean ignoreEncodingErrors) throws IOException {
        return this.file.getContent().asString();
    }

    @Override
    public Writer openWriter() throws IOException {
        return this.file.getContent().asWriter();
    }

    @Override
    public long getLastModified() {
        return this.file.getLastModified();
    }

    @Override
    public boolean delete() {
        try {
            this.file.delete();
            return true;
        } catch (Exception e) {
            return false;
        }

    }

    // FIXME hashCode equals

}
