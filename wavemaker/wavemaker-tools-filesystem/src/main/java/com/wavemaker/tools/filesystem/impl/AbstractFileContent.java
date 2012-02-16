
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
    public String asString() throws IOException {
        return FileCopyUtils.copyToString(asReader());
    }

    @Override
    public byte[] asBytes() throws IOException {
        return FileCopyUtils.copyToByteArray(asInputStream());
    }

    @Override
    public void copyTo(OutputStream outputStream) throws IOException {
        FileCopyUtils.copy(asInputStream(), outputStream);
    }

    @Override
    public void copyTo(Writer writer) throws IOException {
        FileCopyUtils.copy(asReader(), writer);
    }

    @Override
    public abstract OutputStream asOutputStream();

    @Override
    public Writer asWriter() {
        return new OutputStreamWriter(asOutputStream());
    }

    @Override
    public void write(InputStream inputStream) throws IOException {
        FileCopyUtils.copy(inputStream, asOutputStream());
    }

    @Override
    public void write(Reader reader) throws IOException {
        FileCopyUtils.copy(reader, asWriter());
    }

    @Override
    public void write(String string) throws IOException {
        FileCopyUtils.copy(string, asWriter());
    }
}
