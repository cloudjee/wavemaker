
package com.wavemaker.tools.project;

import java.io.InputStream;

import org.springframework.util.StringUtils;

import com.wavemaker.io.Folder;
import com.wavemaker.runtime.server.Downloadable;
import com.wavemaker.tools.filesystem.adapter.zip.ZippedFolderInputStream;

/**
 * Adapter class that presents a {@link Folder} as a {@link Downloadable}. The contents of the folder are zipped.
 * 
 * @author Phillip Webb
 */
public class DownloadableFolder implements Downloadable {

    private static final String ZIP_EXT = ".zip";

    private final Folder folder;

    private final String defaultName;

    public DownloadableFolder(Folder folder, String defaultName) {
        this.folder = folder;
        this.defaultName = defaultName;
    }

    @Override
    public InputStream getContents() {
        return new ZippedFolderInputStream(this.folder, getName());
    }

    @Override
    public Integer getContentLength() {
        return null;
    }

    @Override
    public String getContentType() {
        return "application/zip";
    }

    @Override
    public String getFileName() {
        return getName() + ZIP_EXT;
    }

    private String getName() {
        if (StringUtils.hasLength(this.folder.getName())) {
            return this.folder.getName();
        }
        return this.defaultName;
    }

}
