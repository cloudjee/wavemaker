
package com.wavemaker.tools.filesystem;

/**
 * A filter used to restrict {@link Folder#list(ResourceFilter) listed} resources.
 * 
 * @author Phillip Webb
 */
public interface ResourceFilter<T extends Resource> {

    /**
     * No Filtering.
     */
    public static final ResourceFilter<Resource> NONE = new ResourceFilter<Resource>() {
    };

    /**
     * Return only files
     */
    public static final ResourceFilter<File> FILES = new ResourceFilter<File>() {
    };

    /**
     * Return only folders
     */
    public static final ResourceFilter<Folder> FOLDERS = new ResourceFilter<Folder>() {
    };

}
