
package com.wavemaker.tools.filesystem;

import java.util.List;

/**
 * A {@link List} of {@link Resource}s.
 * 
 * @author Phillip Webb
 */
public interface ResourceList<T extends Resource> extends List<T>, ResourceOperations {

}
