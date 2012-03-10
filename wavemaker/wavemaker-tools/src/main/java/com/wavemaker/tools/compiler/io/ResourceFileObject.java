
package com.wavemaker.tools.compiler.io;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;
import java.net.URI;
import java.net.URISyntaxException;

import javax.tools.FileObject;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.ResourceURL;

public class ResourceFileObject implements FileObject {

    private final File file;

    private URI uri;

    public ResourceFileObject(File file) {
        this.file = file;
        try {
            this.uri = new URI(ResourceURL.PROTOCOL + ":" + getName());
        } catch (URISyntaxException e) {
            throw new IllegalStateException(e);
        }
    }

    public final File getFile() {
        return this.file;
    }

    @Override
    public URI toUri() {
        return this.uri;
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

    @Override
    public String toString() {
        return this.file.toString();
    }

    // FIXME hashCode equals

}
