
package com.wavemaker.io;

import org.springframework.util.Assert;


/**
 * Abstract base for {@link Resources} implementations.
 * 
 * @author Phillip Webb
 */
public abstract class AbstractResources<T extends Resource> implements Resources<T> {

    @Override
    public void delete() {
        for (T resource : this) {
            resource.delete();
        }
    }

    @Override
    public void moveTo(Folder folder) {
        Assert.notNull(folder, "Folder must not be null");
        for (T resource : this) {
            resource.moveTo(folder);
        }
    }

    @Override
    public void copyTo(Folder folder) {
        Assert.notNull(folder, "Folder must not be null");
        for (T resource : this) {
            resource.copyTo(folder);
        }
    }
}
