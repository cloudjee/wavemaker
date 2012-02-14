
package com.wavemaker.tools.filesystem.impl;

import java.util.Collections;
import java.util.Iterator;

import com.wavemaker.tools.filesystem.MutableFolder;
import com.wavemaker.tools.filesystem.MutableResource;
import com.wavemaker.tools.filesystem.MutableResources;

public abstract class AbstractMutableResources<T extends MutableResource> implements MutableResources<T> {

    @SuppressWarnings("rawtypes")
    private static final MutableResources<?> EMPTY = new AbstractMutableResources() {

        @Override
        public Iterator iterator() {
            return Collections.EMPTY_SET.iterator();
        }
    };

    @SuppressWarnings("unchecked")
    public static final <T extends MutableResource> MutableResources<T> empty() {
        return (MutableResources<T>) EMPTY;
    }

    @Override
    public void delete() {
        for (T resource : this) {
            resource.delete();
        }
    }

    @Override
    public void moveTo(MutableFolder folder) {
        for (T resource : this) {
            resource.moveTo(folder);
        }
    }

    @Override
    public void copyTo(MutableFolder folder) {
        for (T resource : this) {
            resource.copyTo(folder);
        }
    }

}
