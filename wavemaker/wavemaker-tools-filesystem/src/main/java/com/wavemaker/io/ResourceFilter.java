
package com.wavemaker.io;

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

    /**
     * Filter to remove hidden (ie starting with '.') resources
     */
    public static final ResourceFilter<Resource> HIDDEN_RESOURCES = new ResourceFilter<Resource>() {

        @Override
        public boolean include(Resource resource) {
            return !resource.getName().toString().startsWith(".");
        }

    };

    boolean include(R resource);
}
