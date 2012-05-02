/*
 * Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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
 

CodeEditorDialog.widgets = {
    layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"},{}, {
        mainPanel: ["wm.studio.DialogMainPanel", {},{}, {
	    editor: ["wm.AceEditor", {width: "100%", height: "100%"}, {onChange: "onAceChange"}]
	}],
	buttonBar: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, height: "20px", "horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "2,0,2,0", border: "1,0,0,0", height: "34px", horizontalAlign: "right"}, {}, {
	    CancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel"}, {onclick: "cancelClick"}],
	    ApplyButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Apply"}, {onclick: "applyClick"}],
	    OKButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK"}, {onclick: "okClick"}]
	}]
    }]
}