
package com.wavemaker.tools.io;

/**
 * Context for {@link ResourceFilter}s.
 * 
 * @author Phillip Webb
 */
public interface ResourceFilterContext {

    /**
     * Returns the source folder that triggered the filter. Useful when matching paths.
     * 
     * @return the source folder
     * @see Resources#getSource()
     */
    Folder getSource();
}
