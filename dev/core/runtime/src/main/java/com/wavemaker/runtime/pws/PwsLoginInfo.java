/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.pws;

/**
 * This class is used to store a web service's login information. This onbject must be set in the front-end service
 * client when a web service is called. Requred fields that must be set vary per different partners and the type of
 * operation.
 * 
 * @author Seung Lee
 */
public class PwsLoginInfo {

    private String partnerName;

    private String host;

    private String port;

    private String userName;

    private String password;

    private String miscInfo;

    private String sessionId;

    private String url;

    public String getPartnerName() {
        return this.partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public String getUserName() {
        return this.userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getHost() {
        return this.host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getPort() {
        return this.port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getMiscInfo() {
        return this.miscInfo;
    }

    public void setMiscInfo(String miscInfo) {
        this.miscInfo = miscInfo;
    }

    public String getSessionId() {
        return this.sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + (this.host == null ? 0 : this.host.hashCode());
        result = prime * result + (this.port == null ? 0 : this.port.hashCode());
        result = prime * result + (this.userName == null ? 0 : this.userName.hashCode());
        result = prime * result + (this.miscInfo == null ? 0 : this.miscInfo.hashCode());
        result = prime * result + (this.url == null ? 0 : this.url.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        PwsLoginInfo other = (PwsLoginInfo) obj;

        if (this.host == null) {
            if (other.host != null) {
                return false;
            }
        } else if (!this.host.equals(other.host)) {
            return false;
        }

        if (this.port == null) {
            if (other.host != null) {
                return false;
            }
        } else if (!this.port.equals(other.port)) {
            return false;
        }

        if (this.userName == null) {
            if (other.userName != null) {
                return false;
            }
        } else if (!this.userName.equals(other.userName)) {
            return false;
        }

        if (this.miscInfo == null) {
            if (other.miscInfo != null) {
                return false;
            }
        } else if (!this.miscInfo.equals(other.miscInfo)) {
            return false;
        }

        if (this.url == null) {
            if (other.url != null) {
                return false;
            }
        } else if (!this.url.equals(other.url)) {
            return false;
        }

        return true;
    }
}