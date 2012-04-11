/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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
