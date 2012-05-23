package com.wavemaker.tools.io.store;

import java.io.InputStream;
import java.io.OutputStream;

public interface FileStore extends ResourceStore {

    InputStream getInputStream();

    OutputStream getOutputStream();

    long getSize();

    long getLastModified();

    void touch();
}