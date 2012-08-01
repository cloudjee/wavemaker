
package com.wavemaker.tools.io;

/**
 * {@link ResourceOperation} to get the latest last modified value.
 */
public class LatestLastModified implements ResourceOperation<File> {

    private long value;

    @Override
    public void perform(File resource) {
        long lastModified = resource.getLastModified();
        if (lastModified > this.value) {
            this.value = lastModified;
        }
    }

    public long getValue() {
        return this.value;
    }

}