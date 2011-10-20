
package com.wavemaker.tools.util;

import java.io.FilterInputStream;
import java.io.IOException;
import java.io.InputStream;

public class NoCloseInputStream extends FilterInputStream {

    public NoCloseInputStream(InputStream in) {
        super(in);
    }

    @Override
    public void close() throws IOException {
        // no-op
    }

}
