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
 * This class represents a cloud server.
 *
 * @author slee
 */
public class CloudServer {

    private String serverName;
    private String serverDesc;
    private String serverId;
    private String imageId;
    private String flavorId;
    private String networkId;
    private String dnsHost;
    private String publicIpAddress;
    private String privateIpAddress;
    private String created;

    private int status;

    public CloudServer(String serverName, String serverDesc,String serverId, String imageId, String flavorId,
                       String networkId, String dnsHost, String publicIpAddress, String privateIpAddress, String created) {
        this.serverName = serverName;
        this.serverDesc = serverDesc;
        this.serverId = serverId;
        this.imageId = imageId;
        this.flavorId = flavorId;
        this.networkId = networkId;
        this.dnsHost = dnsHost;
        this.publicIpAddress = publicIpAddress;
        this.privateIpAddress = privateIpAddress;
        this.created = created;
    }

    public void setServerName(String val) {
        this.serverName = val;
    }

    public String getServerName() {
        return this.serverName;
    }

    public void setServerDesc(String val) {
        this.serverDesc = val;
    }

    public String getServerDesc() {
        return this.serverDesc;
    }

    public void setServerId(String val) {
        this.serverId = val;
    }

    public String getServerId() {
        return this.serverId;
    }

    public void setImageId(String val) {
        this.imageId = val;
    }

    public String getImageId() {
        return this.imageId;
    }

    public void setFlavorId(String val) {
        this.flavorId = val;
    }

    public String getFlavorId() {
        return this.flavorId;
    }

    public void setNetworkId(String val) {
        this.networkId = val;
    }

    public String getNetworkId() {
        return this.networkId;
    }

    public void setDnsHost(String val) {
        this.dnsHost = val;
    }

    public String getDnsHost() {
        return this.dnsHost;    
    }

    public void setPublicIpAddress(String val) {
        this.publicIpAddress = val;
    }

    public String getPublicIpAddress() {
        return this.publicIpAddress;
    }

    public void setPrivateIpAddress(String val) {
            this.privateIpAddress = val;
    }

    public String getPrivateIpAddress() {
        return this.privateIpAddress;
    }
    
    public void setCreated(String val) {
        this.created = val;
    }

    public String getCreated() {
        return this.created;
    }

    public void setStatus(int val) {
        this.status = val;
    }

    public int getStatus() {
        return this.status;
    }
}