
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
    <T extends MutableResource> MutableResources<T> list();

    @Override
    <T extends MutableResource> MutableResources<T> list(ResourceFilter<T> filter);

}
