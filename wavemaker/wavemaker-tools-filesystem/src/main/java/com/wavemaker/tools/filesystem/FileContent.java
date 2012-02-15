
package com.wavemaker.tools.filesystem;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Writer;

import com.sun.tools.hat.internal.parser.Reader;

/**
 * Provides access to {@link File} content in a variety of ways.
 * 
 * @see File
 * 
 * @author Phillip Webb
 */
public interface FileContent {

    /**
     * Return an {@link InputStream} that can be used to access file contents. This method can be called multiple times
     * if required. The stream should be closed by the caller.
     * 
     * @return The file contents {@link InputStream}
     */
    InputStream asInputStream();

    /**
     * Return a {@link Reader} that can be used to access file contents. This method can be called multiple times if
     * required. The reader should be closed by the caller.
     * 
     * @return the file contents {@link Reader}
     */
    Reader asReader();

    /**
     * Return the contents of the file as a <tt>String</tt>. This method should be used with caution if working with
     * large files.
     * 
     * @return the contents as a <tt>String</tt>
     */
    String asString();

    /**
     * Return the contents of the file as a new <tt>byte array</tt>. This method should be used with caution if working
     * with large files.
     * 
     * @return the contents as a new byte array.
     */
    byte[] asBytes();

    /**
     * Copy the contents of the file to another stream, closing the stream when complete.
     * 
     * @param outputStream
     */
    void copyTo(OutputStream outputStream);

    /**
     * Copy the contents of the file to another writer, closing the writer when complete.
     * 
     * @param outputStream
     */
    void copyTo(Writer writer);

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
