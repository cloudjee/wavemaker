
package com.wavemaker.tools.io.zip;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.filesystem.JailedResourcePath;

class ZipFileSystemKey {

    private final JailedResourcePath path;

    public ZipFileSystemKey(JailedResourcePath path) {
        Assert.notNull(path, "Path must not be null");
        this.path = path;
    }

    public JailedResourcePath getPath() {
        return this.path;
    }

    @Override
    public String toString() {
        return this.path.toString();
    }

}
