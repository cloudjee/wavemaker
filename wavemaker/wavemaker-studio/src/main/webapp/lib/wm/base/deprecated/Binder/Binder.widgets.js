/*
 * Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
 
Binder.widgets = {
	layoutBox: ["wm.Layout", {box: "v", flex: 1, height: "", width: ""}, {}, {
		panel: ["wm.Panel", {box: "h", flex: 1, height: "", width: ""}, {}, {
			panel5: ["wm.Panel", {box: "v", height: "", width: "300px"}, {}, {
				targetLabel: ["wm.Label", {autoSize: true, caption: "Bind Targets", height: "", width: ""}, {}, {}],
				targetTree: ["wm.Tree", {flex: 1, height: "", width: ""}, {onselect: "targetTreeSelect", ondeselect: "targetTreeDeselect"}, {}],
				bevel4: ["wm.Bevel", {}, {}, {}],
				bindControlsPanel: ["wm.Panel", {box: "h", height: "27px", width: ""}, {}, {
					clearButton: ["wm.Button", {caption: '<img height="24" width="24" src="images/close_b_24.png"/> Clear', height: "", width: ""}, {onclick: "clearButtonClick"}, {}],
					spacer2: ["wm.Spacer", {height: "", width: "10px"}, {}, {}],
					clearAllButton: ["wm.Button", {caption: '<img height="24" width="24" src="images/close_b_24.png"/> Clear All', height: "", width: ""}, {onclick: "clearAllButtonClick"}, {}]
				}]
			}],
			splitter: ["wm.Splitter", {}, {}, {}],
			panel3: ["wm.Panel", {box: "v", flex: 1, height: "", width: ""}, {}, {
				sourceLabel: ["wm.Label", {autoSize: true, caption: "Bind Sources", height: "", width: ""}, {}, {}],
				sourceBinder: ["wm.BinderSource", {size: 1, sizeUnits: "flex"}, {onBindNodeSelected: "sourceBinderBindNodeSelected"}, {}],
				panel4: ["wm.Panel", {box: "h", height: "35px", boxPosition: "bottomRight"}, {}, {
					bindButton: ["wm.Button", {caption: 'Bind'}, {onclick: "bindButtonClick"}, {}]
				}]
			}]
		}]
	}]
}