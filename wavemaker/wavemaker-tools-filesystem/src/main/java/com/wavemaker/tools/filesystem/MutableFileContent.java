
package com.wavemaker.tools.filesystem;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;

/**
 * A variant of {@link FileContent} that supports mutable operations. Calling any of the write methods will cause the
 * creation of any parent folders.
 * 
 * @author Phillip Webb
 */
public interface MutableFileContent extends FileContent {

    /**
     * Return an {@link OutputStream} that can be used to write file contents. The output stream should be closed by the
     * caller. When possible, consider using the {@link #write(InputStream)} method instead to ensure that streams are
     * closed.
     * 
     * @return The output stream
     */
    OutputStream getOutputStream();

    /**
     * Return a {@link Writer} that can be used to write file contents. The writer should be closed by the caller. When
     * possible, consider using the {@link #write(Reader)} method instead to ensure that streams are closed.
     * 
     * @return The writer
     */
    Writer getWriter();

    /**
     * Write the contents of the specified output stream to this file, closing the stream when complete.
     * 
     * @param inputStream the input stream to write
     */
    void write(InputStream inputStream) throws IOException;

    /**
     * Write the contents of the specified reader to this file, closing the reader when complete.
     * 
     * @param reader the reader to write
     */
    void write(Reader reader);

    /**
     * Write the contents of the specified string to this file.
     * 
     * @param string the string contents
     */
    void write(String string);
}
