
package com.wavemaker.common.io;

import org.springframework.core.io.Resource;

/**
 * Interface that can be implemented by {@link Resource}s capable of caching the SHA1 of the content. The
 * {@link Resource} must remove the cache if the contents is changed.
 * 
 * @author Phillip Webb
 * @deprecated Use the new File API if possible
 */
@Deprecated
public interface Sha1DigestCacheable {

    public static final Sha1DigestCacheable NONE = new Sha1DigestCacheable() {

        @Override
        public byte[] getSha1Digest() {
            return null;
        }

        @Override
        public void setSha1Digest(byte[] digest) {
        }
    };

    /**
     * Get the SHA1 digest.
     * 
     * @return The SHA1 digest or <tt>null</tt>
     */
    byte[] getSha1Digest();

    /**
     * Set the SHA1 digest.
     * 
     * @param digest the digest
     */
    void setSha1Digest(byte[] digest);

}
