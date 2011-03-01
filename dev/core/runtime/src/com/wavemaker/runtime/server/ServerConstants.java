/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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

/**
 * Constants in the server package.
 * 
 * @author Matt Small
 * @version $Rev$ - $Date$
 */
public /*static*/ class ServerConstants {

    public static final String SERVICE_JSON_RPC = "JSON-RPC";
    public static final String JSON_CONTENT_TYPE = "application/json";

    /**
     * The name of the root result in the results set returned to the client.
     * See constants.js for the corresponding client-side constant.
     */
    public static final String RESULTS_PART = "result";
    
    /**
     * The name of the root error in the results set returned to the client.
     */
    public static final String ERROR_PART = "error";
    
    public static final String METHOD = "method";
    public static final String PARAMETERS = "params";
    public static final String ID = "id";
    
    public static final String JSON_EXTENSION = "json";
    public static final String UPLOAD_EXTENSION = "upload";
    public static final String FLASH_UPLOAD_EXTENSION = "flashUploader";
    public static final String DOWNLOAD_EXTENSION = "download";
    
    public static final String DEFAULT_ENCODING = "UTF-8";
    
    public static final String ROOT_MODEL_OBJECT_KEY = "WM_ROOT_MODEL_OBJECT_KEY";
}
