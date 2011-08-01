/*
 * Copyright (C) 2011 VMWare, Inc. All rights reserved.
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
 

AddPatch.widgets = {  
    layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top", layoutKind: "top-to-bottom"}, {}, {
	editor: ["wm.AceEditor", {syntax: "javascript", width: "100%", height: "100%"}],
	buttonBar: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, width: "100%", height: "34px", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
	    loadPatchesLabel: ["wm.Label", {caption: "If you are NOT behind a firewall:", align: "right", singleLine: false,height: "100%", width: "120px"}],
	    loadPatchesButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, width: "120px", caption: "Load Patches", hint: "Don't use if behind firewall"}, {onclick: "loadPatchesClick"}],
	    findCodeLabel: ["wm.Label", {caption: "If you ARE behind a firewall:", align: "right",singleLine: false,height: "100%", width: "160px", margin: "0,0,0,40"}],
	    findCodeButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, width: "120px", caption: "Find Patches", hint: "Use this if behind a firewall"}, {onclick: "findCodeButtonClick"}],
	    saveButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Save"}, {onclick: "saveButtonClick"}],
	    cancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Cancel"}, {onclick: "cancelButtonClick"}]
	}]
    }]
}