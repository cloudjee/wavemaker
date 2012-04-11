/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
