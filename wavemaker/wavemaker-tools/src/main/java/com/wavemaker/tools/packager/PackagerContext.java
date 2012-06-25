
package com.wavemaker.tools.packager;

import java.util.Map;

import com.wavemaker.tools.service.definitions.Service;

/**
 * Context used by {@link Packager}.
 * 
 * @author Phillip Webb
 */
public interface PackagerContext {

    /**
     * Returns relevant properties for the specified service or an empty map if no properties have been specified.
     * 
     * @param service the service
     * @return properties or an empty map
     */
    Map<String, String> getServiceProperties(Service service);

}
