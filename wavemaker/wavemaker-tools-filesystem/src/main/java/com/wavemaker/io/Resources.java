
package com.wavemaker.io;

/**
 * An {@link Iterable} collections of {@link Resource}s that also support various {@link ResourceOperations operations}.
 * 
 * @author Phillip Webb
 */
public interface Resources<T extends Resource> extends Iterable<T>, ResourceOperations {
}
