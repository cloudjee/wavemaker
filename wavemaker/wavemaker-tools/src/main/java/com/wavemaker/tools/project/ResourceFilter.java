
package com.wavemaker.tools.project;

import org.springframework.core.io.Resource;

public interface ResourceFilter {

    public static final ResourceFilter NO_FILTER = new ResourceFilter() {

        @Override
        public boolean accept(Resource resource) {
            return true;
        }
    };

    boolean accept(Resource resource);
}
