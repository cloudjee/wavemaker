/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.pws;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.wavemaker.common.ConfigurationException;
import com.wavemaker.common.MessageResource;
import com.wavemaker.common.util.SpringUtils;

/**
 * @author Seung Lee
 * 
 */
public class PwsRestImporterBeanFactory {

    private Map<String, IPwsRestImporter> pwsRestImporters = new HashMap<String, IPwsRestImporter>();

    public Collection<String> getPwsRestImporterNames() {
        return this.pwsRestImporters.keySet();
    }

    public IPwsRestImporter getPwsRestImporter(String partnerName) {

        if (this.pwsRestImporters == null) {
            SpringUtils.throwSpringNotInitializedError(this.getClass());
        }

        if (!this.pwsRestImporters.containsKey(partnerName)) {
            throw new ConfigurationException(MessageResource.UNKNOWN_PWS_TOOLS_MANAGER, partnerName);
        }

        return this.pwsRestImporters.get(partnerName);
    }

    public void setPwsRestImporters(Map<String, IPwsRestImporter> pwsRestImporters) {
        this.pwsRestImporters = pwsRestImporters;

    }

}
