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
 * This class represents a cloud file.
 *
 * @author slee
 */
public class CloudFile {

    private String fileName;
    private String containerName;
    private String lastModified;
    private long size;
    private String sizeString;
    private String owner;

    public CloudFile(){}

    public CloudFile(String containerName, String fileName, String sizeString,
                      String owner, String  lastModified) {
        this.containerName = containerName;
        this.fileName = fileName;
        this.sizeString = sizeString;
        this.owner = owner;
        this.lastModified = lastModified;    
    }

    public void setFileName(String val) {
        this.fileName = val;
    }

    public String getFileName() {
        return this.fileName;
    }

    public void setContainerName(String val) {
        this.containerName = val;
    }

    public String getContainerName() {
        return this.containerName;
    }

    public void setLastModified(String val) {
        this.lastModified = val;
    }

    public String getLastModified() {
        return this.lastModified;
    }

    public void setSize(long val) {
        this.size = val;
    }

    public long getSize() {
        return this.size;
    }

    public void setSizeString(String val) {
        this.sizeString = val;
    }

    public String getSizeString() {
        return this.sizeString;
    }

    public void setOwner(String val) {
        this.owner = val;
    }

    public String getOwner() {
        return this.owner;
    }
}