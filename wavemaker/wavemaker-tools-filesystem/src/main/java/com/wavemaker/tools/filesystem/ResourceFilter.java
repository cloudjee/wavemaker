
package com.wavemaker.tools.filesystem;

/**
 * A filter used to restrict {@link Folder#list(ResourceFilter) listed} resources.
 * 
 * @author Phillip Webb
 */
public interface ResourceFilter<R extends Resource> {

    /**
     * No Filtering.
     */
    public static final ResourceFilter<Resource> NONE = new ResourceFilter<Resource>() {

        @Override
        public boolean include(Resource resource) {
            return true;
        }
    };

    /**
     * Return only files
     */
    public static final ResourceFilter<File> FILES = new ResourceFilter<File>() {

        @Override
        public boolean include(File resource) {
            return true;
        }
    };

    /**
     * Return only folders
     */
    public static final ResourceFilter<Folder> FOLDERS = new ResourceFilter<Folder>() {

        @Override
        public boolean include(Folder resource) {
            return true;
        }
    };

    boolean include(R resource);
}
