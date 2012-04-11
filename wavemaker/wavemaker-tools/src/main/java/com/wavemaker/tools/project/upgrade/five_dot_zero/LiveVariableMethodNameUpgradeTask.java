/*
 *  Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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

import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONObject;
import com.wavemaker.tools.project.upgrade.AbstractWidgetsJSUpgradeTask;

/**
 * @author Matt Small
 */
public class LiveVariableMethodNameUpgradeTask extends AbstractWidgetsJSUpgradeTask {

    @Override
    public void upgradeWidgetsJS(JSON j) {
        recurseWidgets(j);
    }

    private void recurseWidgets(JSON j) {

        if (j instanceof JSONObject) {
            JSONObject jo = (JSONObject) j;

            for (Object o : jo.values()) {
                if (o instanceof JSON) {
                    recurseWidgets((JSON) o);
                }
            }
        } else if (j instanceof JSONArray) {
            JSONArray ja = (JSONArray) j;

            if (ja.size() >= 2 && ja.get(0) instanceof String && ja.get(1) instanceof JSONObject) {
                if (0 == "wm.LiveVariable".compareTo((String) ja.get(0))) {
                    JSONObject jo = (JSONObject) ja.get(1);
                    if (jo.containsKey("operation")) {
                        String op = (String) jo.get("operation");
                        if (op.endsWith("Data")) {
                            jo.put("operation", op.substring(0, op.length() - 4));
                        }
                    }
                }
            }

            for (Object o : ja) {
                if (o instanceof JSON) {
                    recurseWidgets((JSON) o);
                }
            }
        }
    }

    @Override
    public boolean doUpgradeAppJS() {
        return false;
    }
}