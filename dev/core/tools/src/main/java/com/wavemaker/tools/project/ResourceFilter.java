
package com.wavemaker.tools.project;

import org.springframework.core.io.Resource;

public interface ResourceFilter {

    public abstract boolean accept(Resource resource);
}
