/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

package com.wavemaker.spinup.web;

import java.io.IOException;
import java.io.InputStream;
import java.util.jar.Manifest;

import javax.servlet.ServletContext;

import org.springframework.stereotype.Component;
import org.springframework.web.context.support.ServletContextResource;

@Component
public class VersionProvider {

    public String getVersion(ServletContext servletContext) throws IOException {
        ServletContextResource manifestResource = new ServletContextResource(servletContext, "/META-INF/MANIFEST.MF");
        InputStream manifestStream = manifestResource.getInputStream();
        try {
            Manifest manifest = new Manifest(manifestStream);
            return manifest.getMainAttributes().getValue("Implementation-Version");
        } finally {
            manifestStream.close();
        }
    }
}
