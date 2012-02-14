
package com.wavemaker.tools.filesystem;

/**
 * Variant of {@link Resources} that supports mutable operations.
 * 
 * @author Phillip Webb
 */
public interface MutableResources<T extends MutableResource> extends Resources<T>, MutableResourceOperations {

}
