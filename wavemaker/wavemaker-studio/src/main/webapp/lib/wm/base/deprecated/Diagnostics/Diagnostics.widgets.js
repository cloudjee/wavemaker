/*
 * Copyright (C) 2010-2011 VMware, Inc. All rights reserved.
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
 

Diagnostics.widgets = {
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%"}, {}, {
		bevel1: ["wm.Bevel", {width: "100%", height: "4px"}, {}],
		panel1: ["wm.Panel", {_classes: {domNode: ["wm_Padding_4px"]}, height: "30px", layoutKind: "left-to-right"}, {}, {
			button1: ["wm.Button", {caption: bundleStudio.M_Refresh, width: "80px"}, {onclick: "update"}]
		}],
		label1: ["wm.Label", {_classes: {domNode: ["wmToolbar", "wm_TextDecoration_Bold", "wm_FontSize_150percent", "wm_BackgroundChromeBar_LightGray"]}, padding: "10", height: "24px", caption: "Wires"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
		wiresPanel: ["wm.Label", {padding: "6", width: "100%", height: "100%", singleLine: false, scrollY: true}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}]
	}]
}