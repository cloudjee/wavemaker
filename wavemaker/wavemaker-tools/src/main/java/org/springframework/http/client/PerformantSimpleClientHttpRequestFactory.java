/*
 *  Copyright (C) 2013 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
