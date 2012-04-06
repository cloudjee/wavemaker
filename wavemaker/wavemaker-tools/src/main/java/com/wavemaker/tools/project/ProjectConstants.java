/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.project;

import com.wavemaker.json.AlternateJSONTransformer;

/**
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class ProjectConstants {

    public static final String LOG_DIR = "logs/";

    public static final String WEB_DIR = "webapproot/";

    public static final String SRC_DIR = "src/";

    public static final String MAVEN_WEB_DIR = "src/main/webapp/";

    public static final String MAVEN_SRC_DIR = "src/main/java/";

    public static final String PAGES_DIR = "pages/";

    public static final String I18N_DIR = "language/nls/";

    public static final String WEB_INF = "WEB-INF/";

    public static final String LIB_DIR = "lib/";

    public static final String CLASSES_DIR = "classes/";

    public static final String WEB_XML = "web.xml";

    public static final String WS_BINDINGS_FILE = "ibm-web-bnd.xmi";

    public static final String SECURITY_XML = "project-security.xml";

    public static final String USER_WEB_XML = "user-web.xml";

    public static final String INDEX_HTML = "index.html";

    public static final String POM_XML = "pom.xml";

    public static final String PROP_SEP = "" + AlternateJSONTransformer.PROP_SEP;
}