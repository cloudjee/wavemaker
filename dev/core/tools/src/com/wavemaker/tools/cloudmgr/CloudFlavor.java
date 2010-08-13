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
package com.wavemaker.tools.cloudmgr;

/**
 * This class represents a cloud server flavor.
 *
 * @author slee
 */
public class CloudFlavor {

    private String id;
    private String name;
    private String description;
    private String memory;
    private String osStorage;
    private String extraStorage;

    public CloudFlavor (String id, String name, String description, String memory,
                       String osStorage, String extraStorage) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.memory = memory;
        this.osStorage = osStorage;
        this.extraStorage = extraStorage;
    }

    public void setId(String val) {
        this.id = val;
    }

    public String getId() {
        return this.id;
    }

    public void setName(String val) {
        this.name = val;
    }

    public String getName() {
        return this.name;
    }

    public void setDescription(String val) {
        this.description = val;
    }

    public String getDescription() {
        return this.description;
    }

    public void setMemory(String val) {
        this.memory = val;
    }

    public String getMemory() {
        return this.memory;
    }

    public void setOSStorage(String val) {
        this.osStorage = val;
    }

    public String getOSStorage() {
        return this.osStorage;
    }

    public void setExtraStorage(String val) {
        this.extraStorage = val;
    }

    public String getExtraStorage() {
        return this.extraStorage;
    }
}