/*
 * Copyright (C) 2011 VMware, Inc. All rights reserved.
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
	html: ["wm.Html", {width: "100%", height: "120px", margin: "10,50,5,50", html: "<p>Click the <b>Load Patches</b> button to automatically retrieve and load the latest <i>recommended</i> patches.  If you are behind a firewall, or the patches do not load automatically, click <b>Get matches manually</b> to open a page from which you can copy the patches into the editor below.</p><p>Click Apply to apply the patches to your installation of Studio</p>"}],
	editor: ["wm.AceEditor", {syntax: "javascript", width: "100%", height: "100%", border: "1,0,0,0", borderColor: "#cccccc", margin: "0"}],
	buttonBar: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, width: "100%", height: "34px", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left"}, {}, {
	    loadPatchesButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, width: "120px", caption: "Load Patches", hint: "Don't use if behind firewall"}, {onclick: "loadPatchesClick"}],
	    findCodeLabel: ["wm.Label", {caption: "Get patches manually", align: "right",singleLine: true,height: "100%", width: "160px", margin: "0,0,0,20", link:"#"},{onclick: "findCodeButtonClick"}],
	    spacer1: ["wm.Spacer", {width: "100%"}],
	    saveButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Apply"}, {onclick: "saveButtonClick"}],
	    cancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Cancel"}, {onclick: "cancelButtonClick"}]
	}]
    }]
}