
package com.wavemaker.io;

import java.util.ArrayList;
import java.util.List;

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
    @SuppressWarnings("unchecked")
    public Resources<T> moveTo(Folder folder) {
        Assert.notNull(folder, "Folder must not be null");
        List<T> movedResources = new ArrayList<T>();
        for (T resource : this) {
            movedResources.add((T) resource.moveTo(folder));
        }
        return new ResourcesCollection<T>(movedResources);
    }

    @Override
    @SuppressWarnings("unchecked")
    public Resources<T> copyTo(Folder folder) {
        Assert.notNull(folder, "Folder must not be null");
        List<T> copiedResources = new ArrayList<T>();
        for (T resource : this) {
            copiedResources.add((T) resource.copyTo(folder));
        }
        return new ResourcesCollection<T>(copiedResources);
    }
}
