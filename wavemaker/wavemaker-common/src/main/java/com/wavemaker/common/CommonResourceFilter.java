
package com.wavemaker.common;

import org.springframework.core.io.Resource;

public interface CommonResourceFilter {

    public static final CommonResourceFilter NO_FILTER = new CommonResourceFilter() {

        @Override
        public boolean accept(Resource resource) {
            return true;
        }
    };

    boolean accept(Resource resource);
}
