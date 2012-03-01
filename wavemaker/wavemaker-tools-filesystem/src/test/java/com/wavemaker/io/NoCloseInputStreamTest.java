
package com.wavemaker.io;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.io.InputStream;

import org.junit.Test;

/**
 * Tests for {@link NoCloseInputStream}.
 * 
 * @author Phillip Webb
 */
public class NoCloseInputStreamTest {

    @Test
    public void shouldNotClose() throws Exception {
        InputStream inputStream = mock(InputStream.class);
        NoCloseInputStream noCloseInputStream = new NoCloseInputStream(inputStream);
        noCloseInputStream.read();
        noCloseInputStream.close();
        verify(inputStream).read();
        verify(inputStream, never()).close();
    }

}
