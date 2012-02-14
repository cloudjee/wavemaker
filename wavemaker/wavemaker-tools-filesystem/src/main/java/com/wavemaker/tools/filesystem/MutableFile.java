
package com.wavemaker.tools.filesystem;

/**
 * A variant of {@link File} that supports mutable operations.
 * 
 * @author Phillip Webb
 */
public interface MutableFile extends File, MutableResource {

    @Override
    MutableFileContent getContent();

}
