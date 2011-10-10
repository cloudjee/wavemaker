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

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.wavemaker.common.ConfigurationException;
import com.wavemaker.common.MessageResource;
import com.wavemaker.common.util.SpringUtils;

/**
 * @author slee
 * 
 */
public class PwsLoginManagerBeanFactory {

    private Map<String, IPwsLoginManager> pwsLoginManagers = new HashMap<String, IPwsLoginManager>();

    public Collection<String> getPwsLoginManagerNames() {
        return this.pwsLoginManagers.keySet();
    }

    public IPwsLoginManager getPwsLoginManager(String partnerName) {

        if (this.pwsLoginManagers == null) {
            SpringUtils.throwSpringNotInitializedError(this.getClass());
        }

        if (!this.pwsLoginManagers.containsKey(partnerName)) {
            throw new ConfigurationException(MessageResource.UNKNOWN_PWS_LOGIN_MANAGER, partnerName);
        }

        return this.pwsLoginManagers.get(partnerName);
    }

    public void setPwsLoginManagers(Map<String, IPwsLoginManager> pwsLoginManagers) {
        this.pwsLoginManagers = pwsLoginManagers;

    }

}
