
package com.wavemaker.tools.filesystem.impl;

import java.util.Collections;
import java.util.Iterator;

import org.springframework.util.Assert;

import com.wavemaker.tools.filesystem.Folder;
import com.wavemaker.tools.filesystem.Resource;
import com.wavemaker.tools.filesystem.Resources;

/**
 * Abstract base for {@link Resources} implementations.
 * 
 * @author Phillip Webb
 */
public abstract class AbstractResources<T extends Resource> implements Resources<T> {

    /**
     * Empty implementation.
     */
    @SuppressWarnings("rawtypes")
    private static final Resources<?> EMPTY = new AbstractResources() {

        @Override
        public Iterator iterator() {
            return Collections.EMPTY_SET.iterator();
        }
    };

    /**
     * Returns an empty {@link Resources} instance.
     * 
     * @return empty {@link Resources}
     */
    @SuppressWarnings("unchecked")
    public static final <T extends Resource> Resources<T> empty() {
        return (Resources<T>) EMPTY;
    }

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
