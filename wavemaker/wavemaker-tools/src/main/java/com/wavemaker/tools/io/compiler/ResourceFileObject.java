
package com.wavemaker.tools.io.compiler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;
import java.net.URI;
import java.net.URISyntaxException;

import javax.tools.FileObject;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.ResourceURL;

/**
 * Adapts {@link com.wavemaker.toos.io.File}s to {@link javax.toosl.FileObject}s.
 * 
 * @author Phillip Webb
 */
public class ResourceFileObject implements FileObject {

    private final File file;

    private URI uri;

    public ResourceFileObject(File file) {
        Assert.notNull(file, "File must not be null");
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

    @Override
    public int hashCode() {
        return this.file.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        ResourceFileObject other = (ResourceFileObject) obj;
        return other.file.equals(other.file);
    }
}
