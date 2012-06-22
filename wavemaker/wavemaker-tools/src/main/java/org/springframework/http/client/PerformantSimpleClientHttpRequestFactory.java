
package org.springframework.http.client;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.Proxy;
import java.net.URI;

import org.springframework.http.HttpMethod;

/**
 * Version of {@link SimpleClientHttpRequestFactory} to work around SPR-9530.
 * 
 * @author Phillip Webb
 */
public class PerformantSimpleClientHttpRequestFactory extends SimpleClientHttpRequestFactory {

    private static final int DEFAULT_CHUNK_SIZE = 4096;

    private Proxy proxy;

    private boolean bufferRequestBody = true;

    private int chunkSize = DEFAULT_CHUNK_SIZE;

    @Override
    public ClientHttpRequest createRequest(URI uri, HttpMethod httpMethod) throws IOException {
        HttpURLConnection connection = openConnection(uri.toURL(), this.proxy);
        prepareConnection(connection, httpMethod.name());
        if (this.bufferRequestBody) {
            return new SimpleBufferingClientHttpRequest(connection);
        } else {
            return new PerformantSimpleStreamingClientHttpRequest(connection, this.chunkSize);
        }
    }

    @Override
    public void setProxy(Proxy proxy) {
        super.setProxy(proxy);
        this.proxy = proxy;
    }

    @Override
    public void setChunkSize(int chunkSize) {
        super.setChunkSize(chunkSize);
        this.chunkSize = chunkSize;
    }

    @Override
    public void setBufferRequestBody(boolean bufferRequestBody) {
        super.setBufferRequestBody(bufferRequestBody);
        this.bufferRequestBody = bufferRequestBody;
    }
}
