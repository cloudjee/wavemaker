
package com.wavemaker.tools.packager.jee;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.packager.PackagedApplication;

/**
 * A {@link PackagedApplication} representing a EAR file.
 * 
 * @author Phillip Webb
 */
public interface EarPackagedApplication extends PackagedApplication {

    Folder asFolder();

}
