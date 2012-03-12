
package com.wavemaker.tools.io;

import java.io.FilterInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * {@link InputStream} that does not perform any operation when {@link #close()} is called.
 * 
 * @author Phillip Webb
 */
public class NoCloseInputStream extends FilterInputStream {

    public NoCloseInputStream(InputStream in) {
        super(in);
    }

    @Override
    public void close() throws IOException {
    }
}
