/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.io.filesystem;

/**
 * Resource Types.
 * 
 * @author Phillip Webb
 */
public enum ResourceType {

    /**
     * A file.
     */
    FILE("file"),

    /**
     * A Folder.
     */
    FOLDER("folder"),

    /**
     * A resource that does not exist.
     */
    DOES_NOT_EXIST("missing");

    private String name;

    private ResourceType(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return this.name;
    }
}
