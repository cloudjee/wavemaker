/*
 * Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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
 
LogViewer.widgets = {
    loadingDialog: ["wm.LoadingDialog", {},{}, {
	binding: ["wm.Binding", {}, {}, {
	    wire: ["wm.Wire", {targetProperty: "widgetToCover", source: "panel1"}]
	}]
    }],
	layoutBox1: ["wm.Layout", {backgroundColor: "#424A5A", height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top"}, {}, {
	    logArea: ["wm.Html", {height: "100%", width: "100%", border: "0", padding: "4, 0, 0, 4", scrollY: true}, {}],
	    panel1: ["wm.Panel", {height: "34px", width: "100%", border: "2,0,0,0", borderColor: "white", margin: "2", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
		button1: ["wm.Button", {_classes: {domNode: ["StudioButton"]},height: "100%", width: "70px", caption: "Clear"}, {onclick: "clearLog"}],
		button2: ["wm.Button", {_classes: {domNode: ["StudioButton"]},height: "100%", width: "70px", caption: "Update"}, {onclick: "updateLog"}],
		updateCheckbox: ["wm.Checkbox", {caption: "Update every 10 seconds?", startChecked: true, width: "100%", showing: false, captionSize: "100%"}, {onchange: "updateCheckboxChanged"}]
	    }]
	}]
}
