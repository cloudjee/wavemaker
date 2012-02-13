
package com.wavemaker.common;
import java.util.List;

import org.springframework.core.io.Resource;

/**
 * Provides a virtual files system for use with WaveMaker. Files are exposed using the Spring {@link Resource} interface
 * and as such do not actually need to be stored on Disk, for example an files system implementation may use a database
 * as the underlying storage mechanism.
 * 
 * @author slee
 */
public interface CommonStudioFileSystem {


    List<Resource> listAllChildren(Resource resource, CommonResourceFilter filter);      

    /**
     * Create and return a resource for the specified path as applied to the given resource.
     * 
     * @param resource the resource
     * @param path the child path (relative to the resource)
     * @return A newly created path
     */
}
