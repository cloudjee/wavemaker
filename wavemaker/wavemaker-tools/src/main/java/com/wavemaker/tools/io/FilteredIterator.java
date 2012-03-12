
package com.wavemaker.tools.io;

import java.util.Iterator;
import java.util.NoSuchElementException;

import org.springframework.util.Assert;

/**
 * Base for {@link Iterator}s that selectively {@link #isElementFiltered(Object) filters} items from an underlying
 * source.
 * 
 * @param <E> the element type
 * @author Phillip Webb
 */
abstract class FilteredIterator<E> implements Iterator<E> {

    private final Iterator<E> sourceIterator;

    private E next;

    /**
     * Create a new {@link FilteredIterator} instance.
     * 
     * @param sourceIterator the source iterator.
     */
    public FilteredIterator(Iterator<E> sourceIterator) {
        Assert.notNull(sourceIterator, "SourceIterator must not be null");
        this.sourceIterator = sourceIterator;
    }

    @Override
    public boolean hasNext() {
        ensureNextHasBeenFetched();
        return this.next != null;
    }

    @Override
    public E next() {
        try {
            ensureNextHasBeenFetched();
            if (this.next == null) {
                throw new NoSuchElementException();
            }
            return this.next;
        } finally {
            this.next = null;
        }
    }

    @Override
    public void remove() {
        this.sourceIterator.remove();
    }

    private void ensureNextHasBeenFetched() {
        while (this.next == null && this.sourceIterator.hasNext()) {
            E candidate = this.sourceIterator.next();
            if (!isElementFiltered(candidate)) {
                this.next = candidate;
            }
        }
    }

    /**
     * Determines if the element should be filtered.
     * 
     * @param element the element
     * @return <tt>true</tt> if the element is filtered
     */
    protected abstract boolean isElementFiltered(E element);
}
