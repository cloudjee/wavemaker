
package com.wavemaker.tools.io;

import org.springframework.util.Assert;

/**
 * Common {@link ResourceOperation}s that may be performed.
 * 
 * @author Phillip Webb
 */
public abstract class ResourceOperations {

    /**
     * Copy all files, keeping the same folder structure relative to the source. See
     * {@link #copyFilesKeepingSameFolderStructure(Folder, ResourceFilter)} for details.
     * 
     * @param source the source folder
     * @param destination the destination folder
     * @return the operation
     */
    public static ResourceOperation<File> copyFilesKeepingSameFolderStructure(Folder source, Folder destination) {
        return copyFilesKeepingSameFolderStructure(source, destination, ResourceFiltering.<File> none());
    }

    /**
     * Copy all files matching the filter, keeping the same folder structure relative to the source. For example a
     * source folder or "/a/b/" containing "/a/b/c/d.txt" would be copied to "c/d.txt" relative to the destination.
     * 
     * @param source the source folder
     * @param destination the destination folder
     * @return the operation
     */
    public static ResourceOperation<File> copyFilesKeepingSameFolderStructure(final Folder source, final Folder destination,
        final ResourceFilter<File> filter) {
        Assert.notNull(source, "Source must not be null");
        Assert.notNull(destination, "Destination must not be null");
        Assert.notNull(filter, "Filter must not be null");
        final String sourcePath = source.toString();
        return new ResourceOperation<File>() {

            @Override
            public void perform(File resource) {
                if (filter.include(resource)) {
                    Assert.state(resource.toString().startsWith(sourcePath), "The file " + resource + " is not contained in the source folder "
                        + sourcePath);
                    String relativeLocation = resource.toString().substring(sourcePath.length());
                    destination.getFile(relativeLocation).getContent().write(resource);
                }
            }
        };
    }
}
