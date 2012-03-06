
package com.wavemaker.tools.io.exception;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;

/**
 * {@link ResourceException} thrown when a requested resource does not exist.
 * 
 * @author Phillip Webb
 */
public class ResourceDoesNotExistException extends ResourceException {

    private static final long serialVersionUID = 1L;

    public ResourceDoesNotExistException(Folder folder, String missingResourceName) {
        super("The resource '" + missingResourceName + "' does not exist in the folder '" + folder + "'");
    }

    public ResourceDoesNotExistException(Resource resource) {
        super("The resource '" + resource.toString() + "' does not exist");
    }
}
