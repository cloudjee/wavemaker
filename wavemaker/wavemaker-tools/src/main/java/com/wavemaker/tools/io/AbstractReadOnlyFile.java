
package com.wavemaker.tools.io;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.wavemaker.tools.io.exception.ReadOnlyResourceException;
import com.wavemaker.tools.io.exception.ResourceDoesNotExistException;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.io.exception.ResourceExistsException;

/**
 * Abstract base class for read-only {@link File} implementations that are not contained in any {@link #getParent()
 * parent} {@link Folder}.
 * 
 * @author Phillip Webb
 */
public abstract class AbstractReadOnlyFile implements File {

    private final FileContent content = new AbstractFileContent() {

        @Override
        public OutputStream asOutputStream() {
            throw newReadOnlyResourceException();
        }

        @Override
        public InputStream asInputStream() {
            InputStream inputStream = getInputStream();
            if (inputStream == null) {
                throw new ResourceDoesNotExistException(AbstractReadOnlyFile.this);
            }
            return inputStream;
        }
    };

    @Override
    public Folder getParent() {
        throw new UnsupportedOperationException();
    }

    @Override
    public void delete() {
        throw newReadOnlyResourceException();
    }

    @Override
    public boolean exists() {
        InputStream inputStream = getInputStream();
        try {
            return inputStream != null;
        } finally {
            try {
                if (inputStream != null) {
                    inputStream.close();
                }
            } catch (IOException e) {
                throw new ResourceException(e);
            }
        }
    }

    @Override
    public void createIfMissing() {
        throw newReadOnlyResourceException();
    }

    @Override
    public String toString() {
        return toString(ResourceStringFormat.FULL);
    }

    @Override
    public File moveTo(Folder folder) {
        throw newReadOnlyResourceException();
    }

    @Override
    public File copyTo(Folder folder) {
        File file = folder.getFile(getName());
        file.getContent().write(this);
        return file;
    }

    @Override
    public File rename(String name) throws ResourceExistsException {
        throw newReadOnlyResourceException();
    }

    @Override
    public long getSize() {
        return 0;
    }

    @Override
    public long getLastModified() {
        return 0;
    }

    @Override
    public FileContent getContent() {
        return this.content;
    }

    @Override
    public int hashCode() {
        return toString().hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        return toString().equals(obj.toString());
    }

    /**
     * Return the input stream for the contents of the File or <tt>null</tt> if the file does not exist.
     * 
     * @return the {@link InputStream} or <tt>null</tt>
     */
    protected abstract InputStream getInputStream();

    /**
     * Return the {@link ReadOnlyResourceException} that should be thrown on error.
     * 
     * @return the exception
     */
    protected ReadOnlyResourceException newReadOnlyResourceException() {
        return new ReadOnlyResourceException("The resource " + toString() + " is read-only");
    }
}
