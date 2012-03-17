
package com.wavemaker.tools.io;

import java.util.ArrayList;
import java.util.Collections;
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

    @Override
    public void performOperation(ResourceOperation<T> operation) {
        for (T resource : this) {
            operation.perform(resource);
        }
    }

    @Override
    public List<T> fetchAll() {
        List<T> all = new ArrayList<T>();
        for (T resource : this) {
            all.add(resource);
        }
        return Collections.unmodifiableList(all);
    }
}
