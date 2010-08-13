/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.runtime.server;

import java.io.InputStream;

/**
 * A class containing a download response. This should be used as the return
 * type for any operation which handles download requests.
 * 
 * @author Matt Small
 * @version $Rev$ - $Date$
 * 
 */
public class DownloadResponse {
    
    public DownloadResponse() {
        // empty constructor
    }
    
    public DownloadResponse(InputStream contents, String contentType,
            String fileName) {
        this.contents = contents;
        this.contentType = contentType;
        this.fileName = fileName;
    }

    private InputStream contents;
    private String contentType;
    private String fileName;
    public InputStream getContents() {
        return contents;
    }
    public void setContents(InputStream contents) {
        this.contents = contents;
    }
    public String getContentType() {
        return contentType;
    }
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    public String getFileName() {
        return fileName;
    }
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}