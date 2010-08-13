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
 * This class contains credentials for cloud server & storage management, such as access key id,
 * secret access key, user id and password.
 *
 * @author slee
 */
public class CloudAuth {

    private String username;
    private String password;
    private String accessKeyId;
    private String seceretAccessKey;
    private String ec2SignatureVersion; //1=eucalyptus, 2=amazon
    private String ec2ServiceURL;

    public CloudAuth() {}

    public CloudAuth(String username, String password, String accessKeyId, String seceretAccessKey) {
        this.username = username;
        this.password = password;
        this.accessKeyId = accessKeyId;
        this.seceretAccessKey = seceretAccessKey;
    }

    public CloudAuth(String username, String password, String accessKeyId, String seceretAccessKey,
                     String ec2SignatureVersion, String ec2ServiceURL) {
        this.username = username;
        this.password = password;
        this.accessKeyId = accessKeyId;
        this.seceretAccessKey = seceretAccessKey;
        this.ec2SignatureVersion = ec2SignatureVersion;
        this.ec2ServiceURL = ec2ServiceURL;
    }

    public void setUsername(String val) {
        this.username = val;
    }

    public String getUsername() {
        return this.username;
    }

    public void setPassword(String val) {
        this.password = val;
    }

    public String getPassword() {
        return this.password;
    }

    public void setAccessKeyId(String val) {
        this.accessKeyId = val;
    }

    public String getAccessKeyId() {
        return this.accessKeyId;
    }

    public void setSeceretAccessKey(String val) {
        this.seceretAccessKey = val;
    }

    public String getSeceretAccessKey() {
        return this.seceretAccessKey;
    }

    public void setEC2SignatureVersion(String val) {
        this.ec2SignatureVersion = val;
    }

    public String getEC2SignatureVersion() {
        return this.ec2SignatureVersion;
    }

    public void setEC2ServiceURL(String val) {
        this.ec2ServiceURL = val;
    }

    public String getEC2ServiceURL() {
        return this.ec2ServiceURL;
    }
}
