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
package com.wavemaker.tools.license;

import de.schlichtherle.license.LicenseContent;

/**
 * Extend LicenseContent to contain additional info
 *
 * @author slee
 */
public class LicenseContentExt extends LicenseContent {

    private String licensee;
    private String type; //Trial or Perpetual
    private String macAddr;
    private String version;

    public String getLicensee() {
        return this.licensee;
    }

    public void setLicensee(String val) {
        this.licensee = val;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String val) {
        this.type = val;
    }

    public String getMacAddr() {
        return this.macAddr;
    }

    public void setMacAddr(String val) {
        this.macAddr = val;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String val) {
        this.version = val;
    }
}
