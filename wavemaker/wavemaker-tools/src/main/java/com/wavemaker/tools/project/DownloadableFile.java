
package com.wavemaker.tools.project;

import java.io.InputStream;

import com.wavemaker.io.File;
import com.wavemaker.runtime.server.Downloadable;

/**
 * Adapter class that presents a {@link File} as a {@link Downloadable}.
 * 
 * @author Phillip Webb
 */
public class DownloadableFile implements Downloadable {

    private final File file;

    public DownloadableFile(File file) {
        this.file = file;
    }

    @Override
    public InputStream getContents() {
        return this.file.getContent().asInputStream();
    }

    @Override
    public Integer getContentLength() {
        return new Integer((int) this.file.getSize());
    }

    @Override
    public String getContentType() {
        return "application/unknown";
    }

    @Override
    public String getFileName() {
        return this.file.getName();
    }
}
