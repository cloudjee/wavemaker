
package com.wavemaker.tools.deployment.cloudfoundry.archive;

import java.io.IOException;
import java.io.InputStream;

import org.cloudfoundry.client.lib.archive.ApplicationArchive;

/**
 * Strategy that allows the {@link ApplicationArchive} to be modified.
 * 
 * @author Phillip Webb
 * @see ModifiedContentApplicationArchive
 */
public interface ContentModifier {

    /**
     * Determine if the {@link #modify modify} method should be called for the given entry.
     * 
     * @param entry the application entry
     * @return <tt>true</tt> if the {@link #modify modify} method should be called
     */
    public boolean canModify(ApplicationArchive.Entry entry);

    /**
     * Modify {@link ApplicationArchive.Entry#getInputStream() content} of the given entry. Implementations should
     * return a new {@link InputStream} containing the modified content.
     * 
     * @param inputStream an {@link InputStream} containing the existing content. The stream will be closed by the
     *        caller
     * @return the modified input stream.
     * @throws IOException
     */
    public InputStream modify(InputStream inputStream) throws IOException;

}
