/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade.five_dot_zero;

import java.util.Map;

import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONObject;
import com.wavemaker.tools.project.upgrade.AbstractWidgetsJSUpgradeTask;

/**
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public class ConvertVariableToServiceInputUpgradeTask extends
        AbstractWidgetsJSUpgradeTask {
    
    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.AbstractWidgetsJSUpgradeTask#upgradeWidgetsJS(com.wavemaker.json.JSON)
     */
    @Override
    public void upgradeWidgetsJS(JSON j) {
        
        recurseJSON(j, false, false);
    }
    
    public void recurseJSON(JSON j, boolean insideServiceOrNavigation,
            boolean insideInput) {
        
        if (j instanceof JSONObject) {
            JSONObject jo = (JSONObject) j;
            
            for (Map.Entry<String, Object> entry: jo.entrySet()) {
                boolean inp = false;
                if (entry.getValue() instanceof JSON) {
                    if (0=="input".compareTo(entry.getKey())) {
                        inp = true;
                    }
                    
                    recurseJSON((JSON) entry.getValue(),
                            insideServiceOrNavigation, inp);
                }
            }
        } else if (j instanceof JSONArray) {
            JSONArray ja = (JSONArray) j;
            
            boolean navi = false;
            if (ja.size()>1 && ja.get(0) instanceof String) {
                if ((0=="wm.ServiceVariable".compareTo((String)ja.get(0)) ||
                            (0=="wm.NavigationCall".compareTo((String)ja.get(0))))) {
                    navi = true;
                }
                
                if (insideServiceOrNavigation && insideInput &&
                        0=="wm.Variable".compareTo((String)ja.get(0))) {
                    ja.set(0, "wm.ServiceInput");
                }
            }
            
            for (Object o: ja) {
                if (o instanceof JSON) {
                    recurseJSON((JSON) o, navi, insideInput);
                }
            }
        }
    }

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.AbstractWidgetsJSUpgradeTask#doUpgradeAppJS()
     */
    @Override
    public boolean doUpgradeAppJS() {
        return true;
    }
}