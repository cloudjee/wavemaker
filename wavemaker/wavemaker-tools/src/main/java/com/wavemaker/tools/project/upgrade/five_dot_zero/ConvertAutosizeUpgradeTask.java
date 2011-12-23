/*
 *  Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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
public class ConvertAutosizeUpgradeTask extends AbstractWidgetsJSUpgradeTask {

    public static final String DEFAULT_WIDTH = "70px";

    public static final String DEFAULT_HEIGHT = "30px";

    @Override
    public void upgradeWidgetsJS(JSON j) {

        recurseJSONReplaceAutoSize(j);
        recurseButtonLabel(j);
    }

    private void recurseJSONReplaceAutoSize(JSON j) {

        if (j instanceof JSONObject) {
            JSONObject jo = (JSONObject) j;

            replaceAutosize(jo);

            for (Object o : jo.values()) {
                if (o instanceof JSON) {
                    recurseJSONReplaceAutoSize((JSON) o);
                }
            }
        } else if (j instanceof JSONArray) {
            JSONArray ja = (JSONArray) j;
            for (Object o : ja) {
                if (o instanceof JSON) {
                    recurseJSONReplaceAutoSize((JSON) o);
                }
            }
        }
    }

    private void replaceAutosize(JSONObject jo) {

        if (jo.containsKey("autoSize")) {
            jo.remove("autoSize");

            if (!jo.containsKey("width")) {
                jo.put("width", DEFAULT_WIDTH);
            }
            if (!jo.containsKey("height")) {
                jo.put("height", DEFAULT_HEIGHT);
            }
        }
    }

    private void recurseButtonLabel(JSON j) {

        if (j instanceof JSONObject) {
            JSONObject jo = (JSONObject) j;

            for (Object o : jo.values()) {
                if (o instanceof JSON) {
                    recurseButtonLabel((JSON) o);
                }
            }
        } else if (j instanceof JSONArray) {
            JSONArray ja = (JSONArray) j;

            if (ja.size() >= 2 && ja.get(0) instanceof String) {
                String possibleType = (String) ja.get(0);

                if (0 == "wm.Label".compareTo(possibleType)) {
                    if (ja.get(1) instanceof JSONObject) {
                        JSONObject jo = (JSONObject) ja.get(1);
                        addMissingDimensions(jo);
                    }
                } else if (0 == "wm.Button".compareTo(possibleType)) {
                    if (ja.get(1) instanceof JSONObject) {
                        JSONObject jo = (JSONObject) ja.get(1);
                        addMissingDimensions(jo);
                    }
                }
            }

            for (Object o : ja) {
                if (o instanceof JSON) {
                    recurseButtonLabel((JSON) o);
                }
            }
        }
    }

    private void addMissingDimensions(JSONObject jo) {

        if (!jo.containsKey("width")) {
            jo.put("width", DEFAULT_WIDTH);
        }
        if (!jo.containsKey("height")) {
            jo.put("height", DEFAULT_HEIGHT);
        }
    }

    @Override
    public boolean doUpgradeAppJS() {
        return false;
    }
}