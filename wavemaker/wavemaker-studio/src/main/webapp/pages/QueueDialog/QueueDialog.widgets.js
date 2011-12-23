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
 
QueueDialog.widgets = {
	layoutBox: ["wm.Layout", {box: "v", flex: 1, height: "", width: "", _classes: ["wm-darksnazzy"]}, {}, {
		label: ["wm.Label", {caption: "Queue Services", height: "28px", width: "", _classes: ["wmDialogTitleBar"]}, {}, {}],
		panel1: ["wm.Panel", {border: 0, box: "h", flex: 1, height: "", width: "", _classes: ["wmDialogBody"]}, {}, {
			panel3: ["wm.Panel", {border: 0, box: "v", flex: 1, height: "", width: ""}, {}, {
				panel4: ["wm.Panel", {border: 0, box: "h", height: "26px", width: ""}, {}, {
					label1: ["wm.Label", {caption: "Select Service:", height: "", width: "86px"}, {}, {}],
					select: ["wm.Select", {flex: 1, height: "", width: ""}, {}, {}]
				}],
				list: ["wm.List", {flex: 1, height: "", width: ""}, {onselect: "listSelect"}, {}]
			}],
			panel2: ["wm.Panel", {border: 0, box: "v", height: "", width: "205px"}, {}, {
				addButton: ["wm.Button", {caption: "Add to Queue", height: "26px", width: ""}, {onclick: "addButtonClick"}, {}],
				spacer3: ["wm.Spacer", {height: "10px", width: ""}, {}, {}],
				deleteButton: ["wm.Button", {caption: "Delete Selected", height: "26px", width: ""}, {onclick: "deleteButtonClick"}, {}],
				spacer1: ["wm.Spacer", {height: "10px", width: ""}, {}, {}],
				upButton: ["wm.Button", {caption: "Move Selected Up", height: "26px", width: ""}, {onclick: "moveUpButtonClick"}, {}],
				spacer2: ["wm.Spacer", {height: "10px", width: ""}, {}, {}],
				downButton: ["wm.Button", {caption: "Move Selected Down", height: "26px", width: ""}, {onclick: "moveDownButtonClick"}, {}]
			}]
		}],
		panel: ["wm.Panel", {box: "h", height: "26px", width: "", _classes: ["wmDialogFooter"]}, {}, {
			spacer4: ["wm.Spacer", {flex: 1, height: "", width: ""}, {}, {}],
			applyButton: ["wm.Button", {caption: "OK", height: "", width: "80px"}, {onclick: "applyButtonClick"}, {}],
			spacer: ["wm.Spacer", {height: "", width: "10px"}, {}, {}],
			cancelButton: ["wm.Button", {caption: "Cancel", height: "", width: "80px"}, {onclick: "cancelButtonClick"}, {}]
		}]
	}]
}
