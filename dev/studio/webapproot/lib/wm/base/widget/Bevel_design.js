/*
 *  Copyright (C) 2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Bevel_design");
dojo.require("wm.base.widget.Bevel");

// design-time
wm.Object.extendSchema(wm.Bevel, {
	vertical: { ignore: 1 },
	disabled: { ignore: 1 },
	border: {ignore: 1},
	borderColor: {ignore: 1},
	margin: {ignore: 1},
	padding: {ignore: 1},
	scrollX: {ignore: 1},
        scrollY: {ignore: 1},
        minWidth:  {ignore: 1},
    minHeight: {ignore: 1},
    bevelSize: {group: "layout", doc: 1}/*,
    updateSize: {group: "method", params: "()", doc: 1}*/
});

wm.Bevel.extend({
    themeableProps: ["bevelSize", "border", "borderColor"],
	scrim: true,
	sizeable: false
});
