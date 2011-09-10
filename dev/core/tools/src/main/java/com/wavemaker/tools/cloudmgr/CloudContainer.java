/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.cloudmgr;

import java.util.Collection;

/**
 * This class represents a cloud container.
 *
 * @author slee
 */
public class CloudContainer {

    private String containerName;
    private String created;
    private Collection<CloudFile> files = null;

    public CloudContainer() {}

    public CloudContainer(String containerName, String created, Collection<CloudFile> files) {
        this.containerName = containerName;
        this.created = created;
        this.files = files;
    }

    public void setContainerName(String val) {
        this.containerName = val;
    }

    public String getContainerName() {
        return this.containerName;
    }

    public void setCreated(String val) {
        this.created = val;
    }

    public String getCreated() {
        return this.created;
    }

    public void setFiles(Collection<CloudFile> val) {
        this.files = val;
    }

    public Collection<CloudFile> getFiles() {
        return this.files;
    }
}