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

package com.wavemaker.runtime.pws;

import java.util.ArrayList;
import java.util.List;

/**
 * @author slee
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
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getMiscInfo() {
        return miscInfo;
    }

    public void setMiscInfo(String miscInfo) {
        this.miscInfo = miscInfo;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((host == null) ? 0 : host.hashCode());
		result = prime * result + ((port == null) ? 0 : port.hashCode());
		result = prime * result + ((userName == null) ? 0 : userName.hashCode());
		result = prime * result + ((miscInfo == null) ? 0 : miscInfo.hashCode());
        result = prime * result + ((url == null) ? 0 : url.hashCode());
        return result;
	}

    @Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PwsLoginInfo other = (PwsLoginInfo) obj;

        if (host == null) {
			if (other.host != null)
				return false;
		} else if (!host.equals(other.host))
			return false;

        if (port == null) {
			if (other.host != null)
				return false;
		} else if (!port.equals(other.port))
			return false;

        if (userName == null) {
			if (other.userName != null)
				return false;
		} else if (!userName.equals(other.userName))
			return false;

        if (miscInfo == null) {
			if (other.miscInfo != null)
				return false;
		} else if (!miscInfo.equals(other.miscInfo))
			return false;

        if (url == null) {
			if (other.url != null)
				return false;
		} else if (!url.equals(other.url))
			return false;

        return true;
	}
}