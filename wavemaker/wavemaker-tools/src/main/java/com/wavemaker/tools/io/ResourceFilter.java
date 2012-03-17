
package com.wavemaker.tools.io;

/**
 * A filter used to restrict {@link Folder#list(ResourceFilter) listed} resources.
 * 
 * @see ResourceFiltering
 * 
 * @author Phillip Webb
 */
public interface ResourceFilter<R extends Resource> {

    boolean include(R resource);
}
