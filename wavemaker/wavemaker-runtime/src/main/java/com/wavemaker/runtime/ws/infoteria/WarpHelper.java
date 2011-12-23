/*
 * Copyright (C) 2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.ws.infoteria;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

/**
 * Web service support for Asteria Flow Designer Server
 */
public class WarpHelper {

    public static final String WARP_HOST = ".host";

    public static final String WARP_PORT = ".port";

    public static final String WARP_USERNAME = ".username";

    public static final String WARP_PASS = ".password";

    public static final String WARP_DOMAIN = ".domain";

    public static final String WARP_ERROR_AUTH = "Auth";

    public static final String WARP_ERROR_ROLE = "Role";

    public static final String WARP_ERROR_NOT_FOUND = "NotFound";

    public static final String WARP_ERROR_ERROR = "Error";

    public static final String WARP_ERROR_SERVER_ERROR = "ServerError";

    public static boolean authenticationError(byte[] bytes) throws IOException, ParserConfigurationException, SAXException {
        ByteArrayInputStream is = new ByteArrayInputStream(bytes);
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        DocumentBuilder docBuilder = dbf.newDocumentBuilder();
        Document doc = docBuilder.parse(is);
        Node errorNode = doc.getFirstChild();
        if (!errorNode.getNodeName().equals("error")) {
            return false;
        }

        Node codeNode = errorNode.getFirstChild();
        if (codeNode.getFirstChild().getNodeValue().equals(WARP_ERROR_AUTH)) {
            return true;
        } else {
            return false;
        }
    }
}
