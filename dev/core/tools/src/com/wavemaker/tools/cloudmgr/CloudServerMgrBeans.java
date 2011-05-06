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

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.wavemaker.common.Resource;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.tools.common.ConfigurationException;

/**
 * @author slee
 *
 */
public class CloudServerMgrBeans {

    private Map<String, CloudServerMgr>
        cloudServerMgrs = new HashMap<String, CloudServerMgr>();


    public Collection<String> getCloudNames() {
        return cloudServerMgrs.keySet();
    }
    
    public CloudServerMgr getCloudServerMgr(String serviceProvider) {
        
        if (cloudServerMgrs == null) {
            SpringUtils.throwSpringNotInitializedError(this.getClass());
        }
        
        if (!cloudServerMgrs.containsKey(serviceProvider)) {
            throw new ConfigurationException(
                Resource.UNKNOWN_CLOUDSTORAGE_MGR, serviceProvider);
        }
        
        return cloudServerMgrs.get(serviceProvider);
    }

    public void setCloudServerMgrs(Map<String, CloudServerMgr>
                                     cloudServerMgrs) {
        this.cloudServerMgrs = cloudServerMgrs;

    }
    
}
