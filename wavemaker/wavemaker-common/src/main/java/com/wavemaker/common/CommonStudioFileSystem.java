
package com.wavemaker.common;

import java.util.List;

import org.springframework.core.io.Resource;

/**
 * Provides a virtual files system for use with WaveMaker. Files are exposed using the Spring {@link Resource} interface
 * and as such do not actually need to be stored on Disk, for example an files system implementation may use a database
 * as the underlying storage mechanism.
 * 
 * @author Seung Lee
 */
public interface CommonStudioFileSystem {

    // FIXME PW filesystem refactor

    /**
     * Search all files recursively and return the result. Tis method returns only files, not directories.
     * 
     * @param resource the resource
     * @param filter a resource filter used to limit results
     * @return a list of child files
     * @see #listChildren(Resource)
     */
    @Deprecated
    List<Resource> listAllChildren(Resource resource, CommonResourceFilter filter);

}
