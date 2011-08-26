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

package com.wavemaker.tools.pws;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.wavemaker.common.Resource;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.common.ConfigurationException;

/**
 * @author slee
 *
 */
public class PwsServiceModifierBeanFactory {

    private Map<String, IPwsServiceModifier> pwsServiceModifiers = new HashMap<String, IPwsServiceModifier>();


    public Collection<String> getPwsServiceModifierNames() {
        return pwsServiceModifiers.keySet();
    }
    
    public IPwsServiceModifier getPwsServiceModifier(String partnerName) {
        
        if (pwsServiceModifiers == null) {
            SpringUtils.throwSpringNotInitializedError(this.getClass());
        }
        
        if (!pwsServiceModifiers.containsKey(partnerName)) {
            throw new ConfigurationException(
                Resource.UNKNOWN_PWS_TOOLS_MANAGER, partnerName);
        }
        
        return pwsServiceModifiers.get(partnerName);
    }

    public void setPwsServiceModifiers(Map<String, IPwsServiceModifier> pwsServiceModifiers) {
        this.pwsServiceModifiers = pwsServiceModifiers;

    }
    
}
