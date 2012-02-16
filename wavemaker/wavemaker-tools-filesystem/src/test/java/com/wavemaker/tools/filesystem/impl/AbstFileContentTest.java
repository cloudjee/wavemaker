
package com.wavemaker.tools.filesystem.impl;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;

import org.junit.Before;
import org.junit.Test;

/**
 * Tests for {@link AbstractFileContent}.
 * 
 * @author Phillip Webb
 */
public class AbstFileContentTest {

    private final String CONTENT = "Test";

    private ByteArrayOutputStream outputStream;

    private ByteArrayInputStream inputStream;

    private AbstractFileContent content;

    @Before
    public void setup() {
        this.outputStream = spy(new ByteArrayOutputStream());
        this.inputStream = spy(new ByteArrayInputStream(this.CONTENT.getBytes()));
        this.content = new AbstractFileContent() {

            @Override
            public OutputStream asOutputStream() {
                return AbstFileContentTest.this.outputStream;
            }

            @Override
            public InputStream asInputStream() {
                return AbstFileContentTest.this.inputStream;
            }
        };
    }

    @Test
    public void shouldGetAsReader() throws Exception {
        char[] cbuf = new char[4];
        Reader reader = this.content.asReader();
        reader.read(cbuf);
        assertThat(cbuf, is(equalTo(this.CONTENT.toCharArray())));
        reader.close();
        verify(this.inputStream).close();
    }

    @Test
    public void shouldGetAsString() throws Exception {
        String string = this.content.asString();
        assertThat(string, is(equalTo(this.CONTENT)));
        verify(this.inputStream).close();
    }

    @Test
    public void shouldGetAsBytes() throws Exception {
        byte[] bytes = this.content.asBytes();
        assertThat(bytes, is(equalTo(this.CONTENT.getBytes())));
        verify(this.inputStream).close();
    }

    @Test
    public void shouldCopyToOutputStream() throws Exception {
        ByteArrayOutputStream copyStream = spy(new ByteArrayOutputStream());
        this.content.copyTo(copyStream);
        assertThat(copyStream.toByteArray(), is(equalTo(this.CONTENT.getBytes())));
        verify(this.inputStream).close();
        verify(copyStream).close();
    }

    @Test
    public void shouldCopyToWriter() throws Exception {
        StringWriter writer = spy(new StringWriter());
        this.content.copyTo(writer);
        assertThat(writer.toString(), is(equalTo(this.CONTENT)));
        verify(this.inputStream).close();
        verify(writer).close();
    }

    @Test
    public void shouldGetAsWriter() throws Exception {
        Writer writer = this.content.asWriter();
        writer.write(this.CONTENT.toCharArray());
        writer.close();
        assertThat(this.outputStream.toByteArray(), is(this.CONTENT.getBytes()));
        verify(this.outputStream).close();
    }

    @Test
    public void shouldWriteOutputStream() throws Exception {
        OutputStream outputStream = this.content.asOutputStream();
        outputStream.write(this.CONTENT.getBytes());
        outputStream.close();
        assertThat(this.outputStream.toByteArray(), is(equalTo(this.CONTENT.getBytes())));
        verify(this.outputStream).close();
    }

    @Test
    public void shouldWriteReader() throws Exception {
        StringReader reader = spy(new StringReader(this.CONTENT));
        this.content.write(reader);
        assertThat(this.outputStream.toByteArray(), is(equalTo(this.CONTENT.getBytes())));
        verify(reader).close();
        verify(this.outputStream).close();
    }

    @Test
    public void shouldWriteString() throws Exception {
        this.content.write(this.CONTENT);
        assertThat(this.outputStream.toByteArray(), is(equalTo(this.CONTENT.getBytes())));
        verify(this.outputStream).close();
    }
}
