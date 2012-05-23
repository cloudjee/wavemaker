
package com.wavemaker.tools.io.store;

import java.io.InputStream;
import java.io.OutputStream;

import com.wavemaker.tools.io.File;

/**
 * Store for a single {@link File}.
 * 
 * @see StoredFile
 * 
 * @author Phillip Webb
 */
public interface FileStore extends ResourceStore {

    /**
     * Access the file content as an input stream.
     * 
     * @return an input stream to read content
     */
    InputStream getInputStream();

    /**
     * Access the file content as an output stream.
     * 
     * @return an output stream to write content
     */
    OutputStream getOutputStream();

    /**
     * Return the size of the file.
     * 
     * @return the file size
     */
    long getSize();

    /**
     * Return the date/time that the file was last modified.
     * 
     * @return the last modified timestamp
     */
    long getLastModified();

    /**
     * Touch the file to update the {@link #getLastModified()} date.
     */
    void touch();
}