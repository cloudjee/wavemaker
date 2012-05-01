/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.io;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.io.Writer;

import org.springframework.util.FileCopyUtils;

import com.wavemaker.tools.io.exception.ResourceException;

/**
 * Abstract base class for {@link FileContent}.
 * 
 * @author Phillip Webb
 */
public abstract class AbstractFileContent implements FileContent {

    public static final String DEFAULT_ENCODING = "UTF-8";

    @Override
    public abstract InputStream asInputStream();

    @Override
    public Reader asReader() {
        return new InputStreamReader(asInputStream());
    }

    @Override
    public String asString() throws ResourceException {
        try {
            return FileCopyUtils.copyToString(asReader());
        } catch (IOException e) {
            throw new ResourceException(e);
        }
    }

    @Override
    public byte[] asBytes() throws ResourceException {
        try {
            return FileCopyUtils.copyToByteArray(asInputStream());
        } catch (IOException e) {
            throw new ResourceException(e);
        }
    }

    @Override
    public void copyTo(OutputStream outputStream) throws ResourceException {
        try {
            FileCopyUtils.copy(asInputStream(), outputStream);
        } catch (IOException e) {
            throw new ResourceException(e);
        }
    }

    @Override
    public void copyTo(Writer writer) throws ResourceException {
        try {
            FileCopyUtils.copy(asReader(), writer);
        } catch (IOException e) {
            throw new ResourceException(e);
        }
    }

    @Override
    public abstract OutputStream asOutputStream();

    @Override
    public Writer asWriter() throws ResourceException {
        try {
            return new OutputStreamWriter(asOutputStream(), DEFAULT_ENCODING);
        } catch (UnsupportedEncodingException e) {
            throw new ResourceException(e);
        }
    }

    @Override
    public void write(File file) {
        write(file.getContent().asInputStream());
    }

    @Override
    public void write(InputStream inputStream) throws ResourceException {
        try {
            FileCopyUtils.copy(inputStream, asOutputStream());
        } catch (IOException e) {
            throw new ResourceException(e);
        }
    }

    @Override
    public void write(Reader reader) throws ResourceException {
        try {
            FileCopyUtils.copy(reader, asWriter());
        } catch (IOException e) {
            throw new ResourceException(e);
        }
    }

    @Override
    public void write(String string) throws ResourceException {
        try {
            FileCopyUtils.copy(string, asWriter());
        } catch (IOException e) {
            throw new ResourceException(e);
        }
    }
}
