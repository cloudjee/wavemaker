
package com.wavemaker.tools.filesystem;

/**
 * Variant of {@link Folder} that supports mutable operations.
 * 
 * @author Phillip Webb
 */
public interface MutableFolder extends Folder, MutableResource {

    @Override
    MutableFolder getFolder(String name);

    @Override
    MutableFile getFile(String name);

    @Override
    MutableResources<Resource> list();

    @Override
    <T extends Resource> MutableResources<T> list(ResourceFilter<T> filter);

}
