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
 
CreateLiveView.widgets = {
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%"}, {}, {
		dialogPanel: ["wm.Panel", {border: "0", height: "100%", layoutKind: "left-to-right", width: "100%"}, {}, {
			dialogInner: ["wm.Panel", {border: "0", height: "100%", width: "100%"}, {}, {
				mainPanel: ["wm.Panel", {border: "0", padding: "5", horizontalAlign: "center", height: "100%", width: "100%"}, {}, {
					serviceSelectEditor: ["wm.Editor", {_classes: {captionNode: ["wm_FontColor_White"]}, captionSize: "40%", caption: "Service", height: "24px", width: "100%", display: "Select"}, {onchange: "updateDataTypeList"}, {
						editor: ["wm._SelectEditor", {}, {}]
					}],
					panel1: ["wm.Panel", {border: "0", padding: "4", height: "100%", layoutKind: "left-to-right", width: "100%"}, {}, {
						dataTypeLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Right", "wm_FontColor_White"]}, height: "100%", width: "40%", caption: "Data Type", border: "", padding: "0,8,8,8", singleLine: false}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
					    dataTypeList: ["wm.List", {_classes: {domNode: ["wm_TextDecoration_Bold"]}, headerVisible: false, dataFields: "caption", width: "100%", height: "100%"}, {onselect: "dataTypeListSelect", onformat: "dataTypeListFormat", ondblclick: "onListDblClick"}]
					}]
				}],
				footer: ["wm.Panel", {border: "0", horizontalAlign: "right", height: "32px", layoutKind: "left-to-right", border: "1,0,0,0", borderColor: "#363b44"}, {}, {
				    okButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK", disabled: true, width: "64px", height: "100%"}, {onclick: "okButtonClick"}],
				    cancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel", width: "64px", height: "100%"}, {onclick: "cancelButtonClick"}]
				}]
			}]
		}]
	}]
}