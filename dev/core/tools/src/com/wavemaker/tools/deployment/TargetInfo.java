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

import com.wavemaker.tools.deployment.xmlhandlers.Targets;

/**
 * Describes a deployment target.
 * 
 * @author slee
 *
 */
public class TargetInfo implements Comparable<TargetInfo> {

    // display name of a target
    private String name;

    // description
    private String description;

    // destination type (server / storage)
    private String destType;

    // cloud service provider (amazon / opsource / rackspace)
    private String serviceProvider;

    // web server name (tomcat / websphere
    private String server;

    // file container name
    private String container;

     // DNS host name
    private String dnsHost;

    // public IP address
    private String publicIp;

    // private IP address
    private String privateIp;

    // port number of the web server
    private String port;

    // user name to log on to the web server
    private String user;

    // password
    private String password;

    public TargetInfo(String name) {
        this(name, "", "", "", "", "", "", "", "", "", "", "");
    }

    public TargetInfo(String name, String description, String destType, String serviceProvider, String server,
                    String container, String dnsHost, String publicIp, String privateIp, String port,
                    String user, String password) {

        if (name == null) {
            throw new IllegalArgumentException("name cannot be null");
        }

        this.name = name;
        this.description = description;
        this.destType = destType;
        this.serviceProvider = serviceProvider;
        this.server = server;
        this.container = container;
        this.dnsHost = dnsHost;
        this.publicIp = publicIp;
        this.privateIp = privateIp;
        this.port = port;
        this.user = user;
        this.password = password;
    }

    public TargetInfo(Targets.Target target) {

        if (target == null) return;

        this.name = target.getName();
        this.description = target.getDescription();
        this.destType = target.getDestType();
        this.serviceProvider = target.getServiceProvider();
        this.server = target.getServer();
        this.container = target.getContainer();
        this.dnsHost = target.getDnsHost();
        this.publicIp = target.getPublicIp();
        this.privateIp = target.getPrivateIp();
        this.port = target.getPort();
        this.user = target.getUser();
        this.password = target.getPassword();
    }

    public String getName() {
        return name;
    }

    public void setName(String val) {
        this.name = val;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String val) {
        this.description = val;
    }

    public String getDestType() {
            return destType;
    }

    public void setDestType(String val) {
        this.destType = val;
    }

    public String getServiceProvider() {
        return serviceProvider;
    }

    public void setServiceProvider(String val) {
        this.serviceProvider = val;
    }
     
    public String getServer() {
        return server;
    }

    public void setServer(String val) {
        this.server = val;
    }

    public String getContainer() {
         return container;
    }

    public void setContainer(String val) {
        this.container = val;
    }

    public String getPort() {
            return port;
    }

    public void setPort(String val) {
        this.port = val;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String val) {
        this.user = val;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String val) {
        this.password = val;
    }

    public String getDnsHost() {
            return dnsHost;
    }

    public void setDnsHost(String val) {
        this.dnsHost = val;
    }

    public String getPublicIp() {
        return publicIp;
    }

    public void setPublicIp(String val) {
        this.publicIp = val;
    }

    public String getPrivateIp() {
        return privateIp;
    }

    public void setPrivateIp(String val) {
        this.privateIp = val;
    }

    public int compareTo(TargetInfo targetInfo) {
        return name.compareTo(targetInfo.name);
    }
}