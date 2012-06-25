
package com.wavemaker.tools.packager.jee;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.packager.PackagedApplication;

/**
 * A {@link PackagedApplication} representing a WAR file.
 * 
 * @author Phillip Webb
 */
public interface WarPackagedApplication extends PackagedApplication {

    /**
     * @return the package as a folder representation.
     */
    Folder asFolder();

}
