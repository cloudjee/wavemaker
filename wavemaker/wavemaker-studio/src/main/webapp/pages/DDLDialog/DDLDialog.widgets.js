/*
 * Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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
		panel4: ["wm.Panel", {width: "100%", height: "100%", borderColor: ""}, {}, {
		    ddlEditor: ["wm.LargeTextArea", {caption: "", readonly: true, height: "100%", readOnly: true, border: "0", width: "100%", borderColor: "", scrollY: true, formatter: "formatEditor"}, {}]
		}],
		footer: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, height: "26px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
			okButton: ["wm.Button", {caption: "OK", width: "96px", border: "0"}, {onclick: "onOk"}],
			spacer4: ["wm.Spacer", {width: "10px"}, {}],
			cancelButton: ["wm.Button", {caption: "Cancel", width: "96px", border: "0"}, {onclick: "onCancel"}]
		}]
	}]
}