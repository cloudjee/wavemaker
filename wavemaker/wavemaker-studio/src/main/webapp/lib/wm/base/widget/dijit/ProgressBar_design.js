/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.dijit.ProgressBar_design");
dojo.require("wm.base.widget.dijit.ProgressBar");

wm.dijit.ProgressBar.description = "Display a meter.";

wm.dijit.ProgressBar.extend({
    scrim: true,
    themeableDemoProps: {height: "40px"}
});


wm.Object.extendSchema(wm.dijit.ProgressBar, {
    /* Editor group; value subgroup */
    progress: {group: "widgetName", subgroup: "data", order: 1, bindable:1},
    indeterminate:  {group: "widgetName", subgroup: "behavior", order: 2, bindable: 1},
    
    setProgress: {method:1},
    getProgress: {method:1},
	disabled: { ignore: 1 }
});
