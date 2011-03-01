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
package com.wavemaker.tools.cloudmgr;

/**
 * This class represents a security group for cloud server access
 *
 * @author slee
 */
public class CloudSecurityGroup {

    private String name;
    private String description;
	private String owner;

    public CloudSecurityGroup() {}

    public CloudSecurityGroup(String owner, String name, String description) {
        this.owner = owner;
        this.name = name;
        this.description = description;
    }

    public void setOwner(String val) {
        this.owner = val;
    }

    public String getOwner() {
        return this.owner;
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
}