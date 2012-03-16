
package com.wavemaker.tools.io;

/**
 * Formats that can be used to display a {@link Resource} name. See {@link Resource#toString(ResourceStringFormat)}.
 * 
 * @author Phillip Webb
 */
public enum ResourceStringFormat {

    /**
     * The full name of the resource, for example <tt>"/folder/file.txt"</tt> or <tt>"/folder/"</tt>. Note: any jailed
     * elements of the path are excluded.
     */
    FULL,

    /**
     * The full unjailed path of the resource, for example <tt>"/jail/folder/file.txt"</tt> or <tt>"/jail/folder/"</tt>.
     * Note: any jailed elements of the path are excluded.
     */
    UNJAILED,
}
