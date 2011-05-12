/*
 * The contents of this file are subject to the terms
 * of the Common Development and Distribution License
 * (the "License").  You may not use this file except
 * in compliance with the License.
 * 
 * You can obtain a copy of the license at
 * http://www.opensource.org/licenses/cddl1.php
 * See the License for the specific language governing
 * permissions and limitations under the License.
 */

/*
 * StreamDataSource.java
 *
 * Created on April 18, 2007, 3:28 PM
 *
 */

package org.jvnet.ws.wadl.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import javax.activation.DataSource;

/**
 *
 * @author mh124079
 */
public class StreamDataSource implements DataSource {
    
    String mediaType;
    InputStream in;
    
    /** Creates a new instance of StreamDataSource */
    public StreamDataSource(String mediaType, InputStream in) {
        this.mediaType = mediaType;
        this.in = in;
    }

    public String getContentType() {
        return mediaType;
    }

    public InputStream getInputStream() throws IOException {
        return in;
    }

    public String getName() {
        return "stream";
    }

    public OutputStream getOutputStream() throws IOException {
        return null;
    }
    
}
