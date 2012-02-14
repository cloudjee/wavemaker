
package com.wavemaker.tools.filesystem.tosort;

import java.util.zip.ZipInputStream;

public interface ToSort {

    // FIXME review below

    /**
     * Perform an operation with the resource accessed as a standard java file. NOTE: This method is designed to support
     * legacy operations ONLY and may cause performance problems. Some virtual file systems will copy content to a
     * temporary location in order to support this method.
     * 
     * @param callable the operation to run.
     * @return the result of the operation
     */
    <T> T performLegacyOperation(LegacyFileOperation<T> callable);

    /**
     * Unpack the specified {@link ZipInputStream} into the current folder.
     * 
     * @param zipInputStream the zip input stream to unpack
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    void unpack(ZipInputStream zipInputStream);
}
