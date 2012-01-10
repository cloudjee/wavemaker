
package com.wavemaker.tools.filesystem;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.wavemaker.tools.filesystem.exception.ResourceDoesNotExistException;

/**
 * A {@link Resource} that represents a file that may be stored on a physical disk or using some other mechanism
 * 
 * @author Phillip Webb
 */
public interface File extends Resource {

    /**
     * Returns the size in bytes of the virtual file.
     * 
     * @return the size in bytes
     */
    long getSize() throws ResourceDoesNotExistException;

    /**
     * Gets the time this file object was last modified. The time is measured in milliseconds since the epoch (00:00:00
     * GMT, January 1, 1970).
     * 
     * @return the time this file object was last modified; or 0 if the file object does not exist, if an I/O error
     *         occurred, or if the operation is not supported
     */
    long getLastModified();

    /**
     * Return an {@link InputStream} that can be used to read file contents. This method can be called multiple times if
     * required. The stream should be closed by the caller.
     * 
     * @return The file contents {@link InputStream}
     */
    InputStream getInputStream() throws ResourceDoesNotExistException;

    /**
     * Return an {@link OutputStream} that can be used to write file contents. The output stream should be closed by the
     * caller. When possible, consider using the {@link #write(InputStream)} method instead to ensure that streams are
     * closed. This calling this method will cause the creation of any parent folders.
     * 
     * @return The output stream
     */
    OutputStream getOutputStream();

    /**
     * Write the contents of the specified output stream to this file, closing the stream when complete.This calling
     * this method will cause the creation of any parent folders.
     * 
     * @param inputStream the input stream to write
     */
    void write(InputStream inputStream) throws IOException;

}
