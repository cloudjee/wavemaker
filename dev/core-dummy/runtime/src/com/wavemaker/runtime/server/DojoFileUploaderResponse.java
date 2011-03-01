/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
 * @version $Rev: 29059 $ - $Date: 2010-04-29 17:19:33 -0700 (Thu, 29 Apr 2010) $
 * 
 */
public class DojoFileUploaderResponse {
    
    public DojoFileUploaderResponse() {
        // empty constructor
    }
    
    public DojoFileUploaderResponse(String path, String name, String type, String error, String width, String height) {
    }
    public String getPath() {
        return null;
    }
    public void setPath(String path) {
    }
    public String getType() {
        return null;
    }
    public void setType(String type) {
    }
    public String getName() {
        return null;
    }
    public void setName(String name) {
    }
    public String getError() {
        return null;
    }
    public void setError(String error) {
    }
    public String getWidth() {
        return null;
    }
    public void setWidth(String width) {
    }
    public String getHeight() {
        return null;
    }
    public void setHeight(String height) {
    }
}