/*
 * Copyright (C) 2008-2013 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.util;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.project.StudioFileSystem;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

/**
 * Extracted from Main.java in Launcher app
 *
 * @author Seung Lee
 */
public class TomcatUtils {

    public static final String STUDIO_DIR = "studio";

    /**
     * Return the path for the default Tomcat server.xml file
     *
     */
    public static File getTomcatServerXML(StudioFileSystem fileSystem) throws URISyntaxException {
        if (embeddedTomcat()) {
            File wmHomeConf = getWaveMakerHomeFolder(fileSystem).getFile("server.xml");
            if (wmHomeConf.exists()) {
                return wmHomeConf;
            }
        }

        Folder catalinaHome = getCatalinaHome();
        if (catalinaHome == null) {
            return null;
        } else {
            return catalinaHome.getFile("conf/server.xml");
        }
    }

    //TODO: Need to modify it to support Cloud Foundry also.
    public static Folder getCatalinaHome() throws URISyntaxException {
        //In case Studio is installed from a downloaded package
        URL resource = TomcatUtils.class.getClassLoader().getResource("catalina.home.marker");
        URI uri;
        java.io.File home;
        if (resource != null) {
            uri = new URI(resource.toString());
            home = new java.io.File(uri).getParentFile();
            return new LocalFolder(home);
        }

        //in case Studio is locally built
        String tomcatHomeDir = System.getProperty("catalina.base");
        if (tomcatHomeDir == null) {
            return null;
        } else {
            home = new java.io.File(tomcatHomeDir);
            return new LocalFolder(home);
        }
    }

    private static Folder getWaveMakerHomeFolder(StudioFileSystem fileSystem) {
        return fileSystem.getWaveMakerHomeFolder();
    }

    //Indicates if Studio is installed from a downloaded package and tomcat is embedded in the installation package
    private static boolean embeddedTomcat() {
        URL resource = TomcatUtils.class.getClassLoader().getResource("catalina.home.marker");
        if (resource != null) {
            return true;
        } else {
            return false;
        }
    }
}
