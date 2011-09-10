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

/**
 * This class represents a cloud network.
 *
 * @author slee
 */
public class CloudKeyPair {

    private String keyname;
    private String fingerprint;
    private String material;

    public CloudKeyPair() {}

    public CloudKeyPair(String keyname, String fingerprint, String material) {
        this.keyname = keyname;
        this.fingerprint = fingerprint;
        this.material = material;
    }

    public void setKeyname(String val) {
        this.keyname = val;
    }

    public String getKeyname() {
        return this.keyname;
    }

    public void setFingerprint(String val) {
        this.fingerprint = val;
    }

    public String getFingerprint() {
        return this.fingerprint;
    }

    public void setMaterial(String val) {
        this.material = val;
    }

    public String getMaterial() {
        return this.material;
    }
}