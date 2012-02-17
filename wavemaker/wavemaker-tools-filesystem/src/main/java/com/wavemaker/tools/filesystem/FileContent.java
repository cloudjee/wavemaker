
package com.wavemaker.tools.filesystem;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;

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
     * @throws ResourceIOException
     */
    Reader asReader();

    /**
     * Return the contents of the file as a <tt>String</tt>. This method should be used with caution if working with
     * large files.
     * 
     * @return the contents as a <tt>String</tt>
     * @throws ResourceIOException
     */
    String asString() throws ResourceIOException;

    /**
     * Return the contents of the file as a new <tt>byte array</tt>. This method should be used with caution if working
     * with large files.
     * 
     * @return the contents as a new byte array.
     * @throws ResourceIOException
     */
    byte[] asBytes() throws ResourceIOException;

    /**
     * Copy the contents of the file to another stream, closing the stream when complete.
     * 
     * @param outputStream
     * @throws ResourceIOException
     */
    void copyTo(OutputStream outputStream) throws ResourceIOException;

    /**
     * Copy the contents of the file to another writer, closing the writer when complete.
     * 
     * @param outputStream
     * @throws ResourceIOException
     */
    void copyTo(Writer writer) throws ResourceIOException;

    /**
     * Return an {@link OutputStream} that can be used to write file contents. The output stream should be closed by the
     * caller. When possible, consider using the {@link #write(InputStream)} method instead to ensure that streams are
     * closed.
     * 
     * @return The output stream
     */
    OutputStream asOutputStream();

    /**
     * Return a {@link Writer} that can be used to write file contents. The writer should be closed by the caller. When
     * possible, consider using the {@link #write(Reader)} method instead to ensure that streams are closed.
     * 
     * @return The writer
     */
    Writer asWriter();

    /**
     * Write the contents of the specified output stream to this file, closing the stream when complete.
     * 
     * @param inputStream the input stream to write
     * @throws ResourceIOException
     */
    void write(InputStream inputStream) throws ResourceIOException;

    /**
     * Write the contents of the specified reader to this file, closing the reader when complete.
     * 
     * @param reader the reader to write
     * @throws ResourceIOException
     */
    void write(Reader reader) throws ResourceIOException;

    /**
     * Write the contents of the specified string to this file.
     * 
     * @param string the string contents
     * @throws ResourceIOException
     */
    void write(String string) throws ResourceIOException;
}
