
package com.wavemaker.runtime.server;

import java.io.InputStream;

/**
 * Interface that can be used to send a streamed download response.
 * 
 * @author Phillip Webb
 */
public interface Downloadable {

    /**
     * Returns the contents that should be downloaded. This method will be called once only, the stream is closed by the
     * caller.
     * 
     * @return the contents
     */
    InputStream getContents();

    /**
     * Returns the length of the content or <tt>null</tt> if the length cannot be determined.
     * 
     * @return the content length or <tt>null</tt>
     */
    Integer getContentLength();

    /**
     * Returns the content type, for example "<tt>application/octet-stream</tt>"
     * 
     * @return the content type
     */
    String getContentType();

    /**
     * Return the filename that should be used by the client when downloading the content or <tt>null</tt> if not known.
     * 
     * @return the filename or <tt>null</tt>
     */
    String getFileName();

}
