
package com.wavemaker.tools.filesystem.impl;

import com.wavemaker.tools.filesystem.Resource;
import com.wavemaker.tools.filesystem.ResourceFilter;
import com.wavemaker.tools.filesystem.Resources;

public class FilteredResources {

    public static <T extends Resource> Resources<T> apply(Resources<?> resources, ResourceFilter<T> filter) {
        return (Resources<T>) resources;
    }

}
