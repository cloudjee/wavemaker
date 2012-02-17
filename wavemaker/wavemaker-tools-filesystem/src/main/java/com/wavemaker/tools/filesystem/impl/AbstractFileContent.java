
package com.wavemaker.tools.filesystem.impl;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.Writer;

import org.springframework.util.FileCopyUtils;

import com.wavemaker.tools.filesystem.FileContent;
import com.wavemaker.tools.filesystem.ResourceIOException;

/**
 * Abstract base class for {@link FileContent}.
 * 
 * @author Phillip Webb
 */
public abstract class AbstractFileContent implements FileContent {

    @Override
    public abstract InputStream asInputStream();

    @Override
    public Reader asReader() {
        return new InputStreamReader(asInputStream());
    }

    @Override
    public String asString() throws ResourceIOException {
        try {
            return FileCopyUtils.copyToString(asReader());
        } catch (IOException e) {
            throw new ResourceIOException(e);
        }
    }

    @Override
    public byte[] asBytes() throws ResourceIOException {
        try {
            return FileCopyUtils.copyToByteArray(asInputStream());
        } catch (IOException e) {
            throw new ResourceIOException(e);
        }
    }

    @Override
    public void copyTo(OutputStream outputStream) throws ResourceIOException {
        try {
            FileCopyUtils.copy(asInputStream(), outputStream);
        } catch (IOException e) {
            throw new ResourceIOException(e);
        }
    }

    @Override
    public void copyTo(Writer writer) throws ResourceIOException {
        try {
            FileCopyUtils.copy(asReader(), writer);
        } catch (IOException e) {
            throw new ResourceIOException(e);
        }
    }

    @Override
    public abstract OutputStream asOutputStream();

    @Override
    public Writer asWriter() {
        return new OutputStreamWriter(asOutputStream());
    }

    @Override
    public void write(InputStream inputStream) throws ResourceIOException {
        try {
            FileCopyUtils.copy(inputStream, asOutputStream());
        } catch (IOException e) {
            throw new ResourceIOException(e);
        }
    }

    @Override
    public void write(Reader reader) throws ResourceIOException {
        try {
            FileCopyUtils.copy(reader, asWriter());
        } catch (IOException e) {
            throw new ResourceIOException(e);
        }
    }

    @Override
    public void write(String string) throws ResourceIOException {
        try {
            FileCopyUtils.copy(string, asWriter());
        } catch (IOException e) {
            throw new ResourceIOException(e);
        }
    }
}
