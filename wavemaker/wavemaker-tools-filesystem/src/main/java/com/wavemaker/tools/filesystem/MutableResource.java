
package com.wavemaker.tools.filesystem;

/**
 * Variant of {@link Resource} that support mutable operations.
 * 
 * @author Phillip Webb
 */
public interface MutableResource extends Resource, MutableResourceOperations {

    @Override
    MutableFolder getParent();

    /**
     * Recursively creates an empty representation of this resource and all {@link #getParent() parent}s.
     */
    void touch();
}
