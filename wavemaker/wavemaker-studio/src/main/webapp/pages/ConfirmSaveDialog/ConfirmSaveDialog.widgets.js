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
 

ConfirmSaveDialog.widgets = {
    layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, "height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%", layoutKind: "top-to-bottom"}, {}, {
	html: ["wm.Html", {_classes: {domNode: ["wmGroupBox"]}, width: "100%", height: "100%", html: "You have unsaved changes; do you want to save before continuing?", padding: "10", autoSizeHeight: true, border: "10", borderColor: "#424A5A" }],
		     
	    buttonBar: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, height: "20px", "horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "2,0,2,0", border: "1,0,0,0", height: "34px", horizontalAlign: "left"}, {}, {
		dontSaveButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Don't Save","margin":"4","width":"100px"}, {onclick: "dontSaveClick"}],
		spacer1: ["wm.Spacer", {"height":"48px","width":"100%"}, {}],
	        cancelButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Cancel","margin":"4"}, {onclick: "cancelClick"}],
	        saveButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Save","margin":"4"}, {onclick: "saveClick"}]
	    }]
	}]
}