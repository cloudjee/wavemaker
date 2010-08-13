/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.project;

import com.wavemaker.json.AlternateJSONTransformer;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class ProjectConstants {

    public static final String LOG_DIR = "logs";

    public static final String WEB_DIR = "webapproot";

    public static final String PAGES_DIR = "pages";

    public static final String WEB_INF = "WEB-INF";

    public static final String LIB_DIR = "lib";
    
    public static final String CLASSES_DIR = "classes";

    public static final String WEB_XML = "web.xml";

    public static final String SECURITY_XML = "project-security.xml";

    public static final String USER_WEB_XML = "user-web.xml";

    public static final String INDEX_HTML = "index.html";

    public static final String PROP_SEP = ""
            + AlternateJSONTransformer.PROP_SEP;
}