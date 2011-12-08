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

dojo.provide("wm.base.widget.IFrame_design");
dojo.require("wm.base.widget.IFrame");
dojo.require("wm.base.Control_design");
// design only...
wm.Object.extendSchema(wm.IFrame, {
	disabled: { ignore: 1 },
    source: { group:"display",type: "String", bindable: 1 },
    setSource: {method:1},
    imageList: {ignore: true},
    hint:{ignore:1}
});

wm.IFrame.description = "A frame.";

dojo.extend(wm.IFrame, {
        themeable: false
});