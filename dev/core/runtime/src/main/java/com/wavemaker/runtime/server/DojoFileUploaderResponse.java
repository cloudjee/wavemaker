/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
 * A class containing a download response. This should be used as the return
 * type for any operation which handles download requests.
 * 
 * @author Matt Small
 * @version $Rev: 29059 $ - $Date: 2010-04-29 17:19:33 -0700 (Thu, 29 Apr 2010) $
 * 
 */
public class DojoFileUploaderResponse {
    
    public DojoFileUploaderResponse() {
        // empty constructor
    }
    
    public DojoFileUploaderResponse(String path, String name, String type, String error, String width, String height) {
        this.path = path;
        this.name = name;
        this.type = type;
        this.error= error;
        this.width= width;
        this.height=height;
    }

    private String path;
    private String name;
    private String type;
    private String error;
    private String width;
    private String height;
    public String getPath() {
        return path;
    }
    public void setPath(String path) {
        this.path = path;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getError() {
        return error;
    }
    public void setError(String error) {
        this.error = error;
    }
    public String getWidth() {
        return width;
    }
    public void setWidth(String width) {
        this.width = width;
    }
    public String getHeight() {
        return height;
    }
    public void setHeight(String height) {
        this.height = height;
    }
}