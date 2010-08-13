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
package com.wavemaker.tools.deployment;

/**
 * Describes a deployed webapp.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 *
 */
public class AppInfo implements Comparable<AppInfo> {

    // app display name
    private final String name;

    // optional html'ified url to app
    private final String href;

    // optional description
    private final String description;


    public AppInfo(String name) {
        this(name, "");
    }

    public AppInfo(String name, String href) {
        this(name, "", "");
    }

    public AppInfo(String name, String href, String description) {

        if (name == null) {
            throw new IllegalArgumentException("name cannot be null");
        }

        this.name = name;
        this.href = href;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getHref() {
        return href;
    }

    public String getDescription() {
        return description;
    }

    public int compareTo(AppInfo appInfo) {
        return name.compareTo(appInfo.name);
    }
}