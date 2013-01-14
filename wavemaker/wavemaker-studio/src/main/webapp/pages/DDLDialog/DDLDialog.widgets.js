/*
 * Copyright (C) 2009-2013 VMware, Inc. All rights reserved.
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
 
DDLDialog.widgets = {
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%"}, {}, {
		label1: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_Padding_4px"]}, height: "48px", border: "0"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
            mainPanel: ["wm.studio.DialogMainPanel", {padding: "0"},{}, {
		ddlEditor: ["wm.LargeTextArea", {caption: "", readonly: true, height: "100%", readOnly: true, border: "0", width: "100%", borderColor: "", padding: "0", formatter: "formatEditor", emptyValue: "emptyString"}, {}]
	    }],
		footer: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
		    okButton: ["wm.Button", {_classes: {domNode:["StudioButton"]}, caption: "OK", width: "100px"}, {onclick: "onOk"}],
			cancelButton: ["wm.Button", {_classes: {domNode:["StudioButton"]}, caption: "Cancel", width: "100px"}, {onclick: "onCancel"}]
		}]
	}]
}