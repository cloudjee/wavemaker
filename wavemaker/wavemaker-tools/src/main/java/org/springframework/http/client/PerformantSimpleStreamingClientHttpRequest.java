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

import java.io.FilterOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

/**
 * Copy of {@link SimpleStreamingClientHttpRequest} to work around SPR-9530.
 * 
 * @author Phillip Webb
 */
public class PerformantSimpleStreamingClientHttpRequest extends AbstractClientHttpRequest {

    private final HttpURLConnection connection;

    private final int chunkSize;

    private OutputStream body;

    public PerformantSimpleStreamingClientHttpRequest(HttpURLConnection connection, int chunkSize) {
        this.connection = connection;
        this.chunkSize = chunkSize;
    }

    @Override
    public HttpMethod getMethod() {
        return HttpMethod.valueOf(this.connection.getRequestMethod());
    }

    @Override
    public URI getURI() {
        try {
            return this.connection.getURL().toURI();
        } catch (URISyntaxException ex) {
            throw new IllegalStateException("Could not get HttpURLConnection URI: " + ex.getMessage(), ex);
        }
    }

    @Override
    protected OutputStream getBodyInternal(HttpHeaders headers) throws IOException {
        if (this.body == null) {
            int contentLength = (int) headers.getContentLength();
            if (contentLength >= 0) {
                this.connection.setFixedLengthStreamingMode(contentLength);
            } else {
                this.connection.setChunkedStreamingMode(this.chunkSize);
            }
            writeHeaders(headers);
            this.connection.connect();
            this.body = this.connection.getOutputStream();
        }
        return new NonClosingOutputStream(this.body);
    }

    private void writeHeaders(HttpHeaders headers) {
        for (Map.Entry<String, List<String>> entry : headers.entrySet()) {
            String headerName = entry.getKey();
            for (String headerValue : entry.getValue()) {
                this.connection.addRequestProperty(headerName, headerValue);
            }
        }
    }

    @Override
    protected ClientHttpResponse executeInternal(HttpHeaders headers) throws IOException {
        try {
            if (this.body != null) {
                this.body.close();
            } else {
                writeHeaders(headers);
                this.connection.connect();
            }
        } catch (IOException ex) {
            // ignore
        }
        return new SimpleClientHttpResponse(this.connection);
    }

    private static class NonClosingOutputStream extends FilterOutputStream {

        private NonClosingOutputStream(OutputStream out) {
            super(out);
        }

        @Override
        public void close() throws IOException {
        }

        @Override
        public void write(byte[] b, int off, int len) throws IOException {
            this.out.write(b, off, len);
        }
    }

}
