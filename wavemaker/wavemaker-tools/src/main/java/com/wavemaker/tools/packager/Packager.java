
package com.wavemaker.tools.packager;

import com.wavemaker.tools.project.Project;

/**
 * Packages a {@link Project WaveMaker project} into a specific type of {@link PackagedApplication}.
 * 
 * @see Packagers
 * 
 * @author Phillip Webb
 */
public interface Packager {

    /**
     * Create an {@link PackagedApplication} of the specified type or returns <tt>null</tt> if the type is not handled.
     * 
     * @param project the project to package
     * @param packageType the package type to create
     * @param context the package context
     * @return a {@link PackagedApplication} or <tt>null</tt>
     */
    <P extends PackagedApplication> P createPackagedApplication(Project project, Class<P> packageType, PackagerContext context);

}
