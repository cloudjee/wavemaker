
package com.wavemaker.spinup;

import org.cloudfoundry.client.lib.archive.ApplicationArchive;

/**
 * Factory interface used to create and close {@link ApplicationArchive}s.
 * 
 * @author Phillip Webb
 */
public interface ApplicationArchiveFactory {

    /**
     * Returns the archive.
     * 
     * @return The application archive
     * @throws Exception
     */
    ApplicationArchive getArchive() throws Exception;

    /**
     * Close the archive
     * 
     * @param archive the archive
     * @throws Exception
     */
    void closeArchive(ApplicationArchive archive) throws Exception;

}
